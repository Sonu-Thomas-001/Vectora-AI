import React from 'react';
import { AssetFormat, AspectRatio, ArtStyle, GeneratorSettings } from '../types';
import { ASPECT_RATIO_LABELS } from '../constants';
import { Settings2, Palette, Box, Layers } from 'lucide-react';

interface ControlsProps {
  settings: GeneratorSettings;
  onSettingsChange: (newSettings: GeneratorSettings) => void;
}

export const Controls: React.FC<ControlsProps> = ({ settings, onSettingsChange }) => {
  
  const update = (key: keyof GeneratorSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4 text-indigo-400">
        <Settings2 size={20} />
        <h3 className="font-semibold tracking-wide uppercase text-xs">Configuration</h3>
      </div>

      {/* Format Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Layers size={16} /> Output Format
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-lg border border-slate-700">
          {(Object.keys(AssetFormat) as Array<keyof typeof AssetFormat>).map((key) => {
            const format = AssetFormat[key];
            const isActive = settings.format === format;
            return (
              <button
                key={format}
                onClick={() => update('format', format)}
                className={`py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {format}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 px-1">
          {settings.format === AssetFormat.SVG 
            ? 'Best for icons, logos, and simple illustrations (Vector code).' 
            : 'Best for detailed art, textures, and complex scenes (Raster image).'}
        </p>
      </div>

      {/* Style Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Palette size={16} /> Art Style
        </label>
        <select
          value={settings.style}
          onChange={(e) => update('style', e.target.value as ArtStyle)}
          className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 transition-colors"
        >
          {Object.values(ArtStyle).map((style) => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
      </div>

      {/* Aspect Ratio - Only for PNG */}
      {settings.format === AssetFormat.PNG && (
        <div className="space-y-3 animate-fadeIn">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Box size={16} /> Dimensions
          </label>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(AspectRatio).map((ratio) => (
              <button
                key={ratio}
                onClick={() => update('aspectRatio', ratio)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all ${
                  settings.aspectRatio === ratio
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                    : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600'
                }`}
              >
                <span>{ASPECT_RATIO_LABELS[ratio]}</span>
                <span className="text-xs opacity-50 font-mono">{ratio}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};