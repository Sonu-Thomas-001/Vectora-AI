import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  AssetFormat, 
  AspectRatio, 
  ArtStyle, 
  GeneratorSettings, 
  GeneratedAsset 
} from './types';
import { generatePngAsset, generateSvgAsset } from './services/geminiService';
import { Controls } from './components/Controls';
import { HistoryItem } from './components/HistoryItem';
import { Button } from './components/Button';
import { STYLE_PROMPTS } from './constants';
import { Wand2, Image as ImageIcon, Sparkles, Download, Copy, Check } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAsset, setCurrentAsset] = useState<GeneratedAsset | null>(null);
  const [history, setHistory] = useState<GeneratedAsset[]>([]);
  const [settings, setSettings] = useState<GeneratorSettings>({
    format: AssetFormat.PNG,
    aspectRatio: AspectRatio.SQUARE,
    style: ArtStyle.NONE
  });
  const [copied, setCopied] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pixelvector_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to local storage when it changes
  useEffect(() => {
    localStorage.setItem('pixelvector_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setCurrentAsset(null);

    try {
      // Enhance prompt with style
      const stylePrompt = STYLE_PROMPTS[settings.style];
      const fullPrompt = stylePrompt 
        ? `${prompt}. Style: ${stylePrompt}` 
        : prompt;

      let resultUrl = '';

      if (settings.format === AssetFormat.PNG) {
        resultUrl = await generatePngAsset({
          prompt: fullPrompt,
          aspectRatio: settings.aspectRatio
        });
      } else {
        resultUrl = await generateSvgAsset(fullPrompt);
      }

      const newAsset: GeneratedAsset = {
        id: crypto.randomUUID(),
        prompt: prompt,
        format: settings.format,
        url: resultUrl,
        timestamp: Date.now(),
        style: settings.style,
        aspectRatio: settings.format === AssetFormat.PNG ? settings.aspectRatio : undefined
      };

      setCurrentAsset(newAsset);
      setHistory(prev => [newAsset, ...prev]);

    } catch (err: any) {
      setError(err.message || "Failed to generate asset. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySvg = () => {
    if (currentAsset?.format === AssetFormat.SVG) {
      navigator.clipboard.writeText(currentAsset.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadMain = () => {
    if (!currentAsset) return;
    const link = document.createElement('a');
    if (currentAsset.format === AssetFormat.SVG) {
      const blob = new Blob([currentAsset.url], { type: 'image/svg+xml' });
      link.href = URL.createObjectURL(blob);
      link.download = `pixelvector-${currentAsset.id}.svg`;
    } else {
      link.href = currentAsset.url;
      link.download = `pixelvector-${currentAsset.id}.png`;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    if (currentAsset?.id === id) {
      setCurrentAsset(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-[1920px] mx-auto">
      
      {/* Sidebar Controls */}
      <aside className="w-full md:w-80 lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col h-auto md:h-screen sticky top-0 z-20 overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-indigo-500 mb-2">
            <Sparkles size={28} />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              PixelVector
            </h1>
          </div>
          <p className="text-slate-400 text-sm">AI-Powered Asset Generator</p>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-8">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium text-slate-300">
                Describe your asset
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={settings.format === AssetFormat.SVG 
                  ? "e.g., Simple flat icon of a rocket ship, blue and white" 
                  : "e.g., A futuristic cyberpunk city street at night, neon lights"}
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all text-sm leading-relaxed"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              isLoading={isGenerating} 
              icon={<Wand2 size={18} />}
              size="lg"
            >
              {isGenerating ? 'Dreaming...' : 'Generate Asset'}
            </Button>
          </form>

          <Controls settings={settings} onSettingsChange={setSettings} />
        </div>

        <div className="p-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-600">Powered by Google Gemini 2.5 & 3.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 bg-slate-950 overflow-hidden">
        
        {/* Workspace / Canvas */}
        <div className="flex-1 p-6 lg:p-10 flex flex-col items-center justify-center relative overflow-y-auto min-h-[500px]">
          
          {error && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl max-w-lg text-center z-10 backdrop-blur-md">
              <p>{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!currentAsset && !isGenerating && (
            <div className="text-center space-y-4 max-w-md opacity-50">
              <div className="w-24 h-24 bg-slate-900 rounded-3xl mx-auto flex items-center justify-center border-2 border-slate-800 border-dashed">
                <ImageIcon size={40} className="text-slate-600" />
              </div>
              <h2 className="text-xl font-medium text-slate-400">Ready to Create</h2>
              <p className="text-slate-500">
                Enter a prompt and choose your settings to generate professional icons, logos, and illustrations.
              </p>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="flex flex-col items-center gap-4 animate-pulse">
              <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-indigo-400 font-medium tracking-wide">
                AI is crafting your {settings.format}...
              </p>
            </div>
          )}

          {/* Asset Display */}
          {currentAsset && !isGenerating && (
            <div className="relative w-full max-w-3xl animate-fadeIn fade-in-up">
              <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                {/* Canvas Header */}
                <div className="h-12 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-4">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                    {currentAsset.format} PREVIEW
                  </span>
                  <div className="flex gap-2">
                    {currentAsset.format === AssetFormat.SVG && (
                      <button 
                        onClick={handleCopySvg}
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-slate-800"
                      >
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy Code'}
                      </button>
                    )}
                    <button 
                      onClick={handleDownloadMain}
                      className="flex items-center gap-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors px-3 py-1.5 rounded-md shadow-lg shadow-indigo-500/20"
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                </div>

                {/* Canvas Body */}
                <div className="p-8 flex items-center justify-center min-h-[400px] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-800/50">
                   {currentAsset.format === AssetFormat.SVG ? (
                     <div 
                      className="w-full max-w-[500px] max-h-[500px] text-slate-200 svg-preview-container drop-shadow-2xl"
                      dangerouslySetInnerHTML={{ __html: currentAsset.url }}
                     />
                   ) : (
                     <img 
                      src={currentAsset.url} 
                      alt="Generated Asset" 
                      className="max-w-full max-h-[60vh] rounded-lg shadow-2xl object-contain"
                     />
                   )}
                </div>
              </div>
              
              <div className="mt-4 text-center">
                 <p className="text-slate-500 text-sm italic">"{currentAsset.prompt}"</p>
              </div>
            </div>
          )}
        </div>

        {/* History Strip */}
        <div className="h-48 bg-slate-900 border-t border-slate-800 p-4 flex flex-col">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Recent Generations</h3>
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex gap-4 min-w-min pb-2">
              {history.length === 0 ? (
                <div className="w-full text-center text-slate-600 text-sm py-8">
                  Your generated assets will appear here.
                </div>
              ) : (
                history.map((asset) => (
                  <div key={asset.id} className="w-32 h-32 flex-shrink-0">
                    <HistoryItem 
                      asset={asset} 
                      onSelect={setCurrentAsset}
                      onDelete={deleteFromHistory}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      
      <style>{`
        .svg-preview-container svg {
          width: 100%;
          height: 100%;
          max-height: 500px;
        }
        .svg-preview-small svg {
          width: 100%;
          height: 100%;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;