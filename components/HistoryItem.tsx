import React from 'react';
import { GeneratedAsset, AssetFormat } from '../types';
import { Download, Trash2, Maximize2 } from 'lucide-react';

interface HistoryItemProps {
  asset: GeneratedAsset;
  onSelect: (asset: GeneratedAsset) => void;
  onDelete: (id: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ asset, onSelect, onDelete }) => {
  const isSvg = asset.format === AssetFormat.SVG;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    
    if (isSvg) {
      const blob = new Blob([asset.url], { type: 'image/svg+xml' });
      link.href = URL.createObjectURL(blob);
      link.download = `pixelvector-${asset.id}.svg`;
    } else {
      link.href = asset.url;
      link.download = `pixelvector-${asset.id}.png`;
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(asset.id);
  };

  return (
    <div 
      onClick={() => onSelect(asset)}
      className="group relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700 cursor-pointer hover:border-indigo-500 transition-all shadow-md hover:shadow-indigo-500/10 aspect-square flex items-center justify-center"
    >
      {/* Background/Content */}
      <div className="w-full h-full flex items-center justify-center p-2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        {isSvg ? (
          <div 
            className="w-full h-full flex items-center justify-center text-slate-200 svg-preview-small"
            dangerouslySetInnerHTML={{ __html: asset.url }}
          />
        ) : (
          <img 
            src={asset.url} 
            alt={asset.prompt} 
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
        <div className="flex justify-between items-start">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isSvg ? 'bg-orange-500/20 text-orange-300' : 'bg-blue-500/20 text-blue-300'}`}>
            {asset.format}
          </span>
          <button onClick={handleDelete} className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-slate-300 line-clamp-2">{asset.prompt}</p>
          <div className="flex gap-2">
             <button 
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs py-1.5 rounded transition-colors"
            >
              <Download size={12} />
              Save
            </button>
            <button 
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
              title="View"
            >
              <Maximize2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};