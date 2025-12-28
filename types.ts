export enum AssetFormat {
  PNG = 'PNG',
  SVG = 'SVG'
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE = '4:3',
  WIDE = '16:9',
  TALL = '9:16'
}

export enum ArtStyle {
  NONE = 'None',
  PHOTOREALISTIC = 'Photorealistic',
  VECTOR_ART = 'Vector Art',
  PIXEL_ART = 'Pixel Art',
  MINIMALIST = 'Minimalist',
  CYBERPUNK = 'Cyberpunk',
  WATERCOLOR = 'Watercolor',
  LINE_ART = 'Line Art',
  ISOMETRIC = '3D Isometric',
  FLAT_ICON = 'Flat Icon'
}

export interface GeneratedAsset {
  id: string;
  prompt: string;
  format: AssetFormat;
  url: string; // Base64 data URI for PNG, or SVG code string for SVG
  timestamp: number;
  style: ArtStyle;
  aspectRatio?: AspectRatio;
}

export interface GeneratorSettings {
  format: AssetFormat;
  aspectRatio: AspectRatio;
  style: ArtStyle;
}