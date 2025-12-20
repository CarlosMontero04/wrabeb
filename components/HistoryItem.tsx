import React from 'react';
import { DrinkRecord } from '../types';
import { DRINK_CONFIG } from '../constants';
import { X } from 'lucide-react';

interface HistoryItemProps {
  item: DrinkRecord;
  onDelete: (id: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onDelete }) => {
  const config = DRINK_CONFIG[item.type];
  const date = new Date(item.timestamp);
  
  return (
    <div className="group relative flex items-center justify-between p-3 pl-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl mb-2 hover:bg-zinc-900 hover:border-zinc-700 transition-all">
      <div className="flex items-center gap-4">
        <div className="text-2xl filter drop-shadow-md">
          {config.emoji}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-zinc-200 text-sm">{config.label}</span>
          <span className="text-xs text-zinc-500 font-medium">
            {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
      
      <button 
        onClick={() => onDelete(item.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
        aria-label="Eliminar"
      >
        <X size={16} />
      </button>
    </div>
  );
};