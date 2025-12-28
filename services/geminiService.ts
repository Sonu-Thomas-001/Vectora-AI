import { GoogleGenAI } from "@google/genai";
import { AssetFormat, AspectRatio } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GenerateImageParams {
  prompt: string;
  aspectRatio: AspectRatio;
}

export const generatePngAsset = async ({ prompt, aspectRatio }: GenerateImageParams): Promise<string> => {
  try {
    // Using gemini-2.5-flash-image for standard high-quality generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          // count: 1 (default)
        }
      },
    });

    // Extract image
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("PNG Generation Error:", error);
    throw error;
  }
};

export const generateSvgAsset = async (prompt: string): Promise<string> => {
  try {
    // Using a strong text model for code generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are an expert SVG artist and coder. 
        Create a high-quality, scalable SVG code for the following request: "${prompt}".
        
        Rules:
        1. Return ONLY the raw SVG code. 
        2. Do not use markdown code blocks (no \`\`\`xml or \`\`\`).
        3. Ensure the SVG has a 'viewBox' attribute.
        4. Make the code concise but visually appealing.
        5. Do not add any conversational text before or after the code.
        6. Use standard SVG elements (path, rect, circle, etc.).
        7. Default to a 512x512 viewbox if not specified strictly.
      `,
    });

    const text = response.text;
    if (!text) throw new Error("No SVG code generated");
    
    // Simple cleanup in case the model ignored the "no markdown" rule
    const cleanedText = text.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();
    return cleanedText;

  } catch (error) {
    console.error("SVG Generation Error:", error);
    throw error;
  }
};
