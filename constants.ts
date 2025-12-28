import { AspectRatio, ArtStyle } from './types';

export const STYLE_PROMPTS: Record<ArtStyle, string> = {
  [ArtStyle.NONE]: '',
  [ArtStyle.PHOTOREALISTIC]: 'highly detailed, photorealistic, 4k, cinematic lighting',
  [ArtStyle.VECTOR_ART]: 'clean vector art style, flat colors, sharp lines, adobe illustrator style',
  [ArtStyle.PIXEL_ART]: 'pixel art style, 8-bit, retro game asset',
  [ArtStyle.MINIMALIST]: 'minimalist design, clean lines, ample whitespace, modern',
  [ArtStyle.CYBERPUNK]: 'cyberpunk aesthetics, neon glow, futuristic, high contrast, dark background',
  [ArtStyle.WATERCOLOR]: 'watercolor painting style, soft edges, artistic, blended colors',
  [ArtStyle.LINE_ART]: 'black and white line art, outline only, technical drawing style',
  [ArtStyle.ISOMETRIC]: '3d isometric view, low poly, clean render, blender style',
  [ArtStyle.FLAT_ICON]: 'flat icon design, simple shapes, ui element, app icon style'
};

export const ASPECT_RATIO_LABELS: Record<AspectRatio, string> = {
  [AspectRatio.SQUARE]: 'Square (1:1)',
  [AspectRatio.PORTRAIT]: 'Portrait (3:4)',
  [AspectRatio.LANDSCAPE]: 'Landscape (4:3)',
  [AspectRatio.WIDE]: 'Widescreen (16:9)',
  [AspectRatio.TALL]: 'Mobile (9:16)'
};
