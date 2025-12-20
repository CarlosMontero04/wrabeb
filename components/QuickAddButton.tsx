import React from 'react';
import { DrinkType } from '../types';
import { DRINK_CONFIG } from '../constants';
import { Plus } from 'lucide-react';

interface QuickAddButtonProps {
  type: DrinkType;
  onClick: (type: DrinkType) => void;
  isLoading?: boolean;
}

export const QuickAddButton: React.FC<QuickAddButtonProps> = ({ type, onClick, isLoading }) => {
  const config = DRINK_CONFIG[type];

  return (
    <button
      onClick={() => onClick(type)}
      disabled={isLoading}
      className={`
        relative group overflow-hidden w-full p-6 rounded-3xl transition-all duration-300
        bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700
        hover:scale-[1.02] active:scale-95
        flex flex-col items-center justify-center gap-3
      `}
    >
      {/* Background Glow Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${config.gradient} transition-opacity duration-500`} />
      
      {/* Icon Container */}
      <div className={`
        relative z-10 w-16 h-16 flex items-center justify-center text-4xl
        rounded-2xl bg-gradient-to-br ${config.gradient} ${config.shadow} shadow-lg
        group-hover:rotate-12 transition-transform duration-300
      `}>
        {config.emoji}
      </div>

      {/* Label */}
      <div className="relative z-10 flex items-center gap-2">
        <span className="font-bold text-lg text-zinc-200">{config.label}</span>
        <div className={`p-1 rounded-full bg-zinc-800 ${config.textColor}`}>
          <Plus size={14} strokeWidth={3} />
        </div>
      </div>
    </button>
  );
};