import { DrinkType } from './types';
import React from 'react';

export const APP_STORAGE_KEY = 'bebida_tracker_data_v1';

export const DRINK_CONFIG: Record<DrinkType, { 
  label: string; 
  emoji: string;
  gradient: string;
  shadow: string;
  chartColor: string;
  textColor: string;
}> = {
  [DrinkType.CHUPITO]: {
    label: 'Chupito',
    emoji: '🥃',
    gradient: 'from-orange-500 to-red-500',
    shadow: 'shadow-orange-500/20',
    chartColor: '#f97316',
    textColor: 'text-orange-400'
  },
  [DrinkType.CERVEZA]: {
    label: 'Cerveza',
    emoji: '🍺',
    gradient: 'from-yellow-400 to-amber-500',
    shadow: 'shadow-yellow-500/20',
    chartColor: '#facc15',
    textColor: 'text-yellow-400'
  },
  [DrinkType.CUBATA]: {
    label: 'Cubata',
    emoji: '🍹',
    gradient: 'from-purple-500 to-pink-500',
    shadow: 'shadow-purple-500/20',
    chartColor: '#a855f7',
    textColor: 'text-purple-400'
  }
};