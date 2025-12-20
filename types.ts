export enum DrinkType {
  CHUPITO = 'CHUPITO',
  CERVEZA = 'CERVEZA',
  CUBATA = 'CUBATA'
}

export interface DrinkRecord {
  id: string;
  type: DrinkType;
  timestamp: number; // Unix timestamp
  notes?: string;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface TypeStats {
  name: string;
  value: number;
  fill: string;
}

export interface GemniAnalysisResult {
  message: string;
  tone: 'fun' | 'serious' | 'warning';
}