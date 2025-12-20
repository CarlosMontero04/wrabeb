import { DrinkRecord, DrinkType } from '../types';
import { APP_STORAGE_KEY } from '../constants';

export const getStoredDrinks = (): DrinkRecord[] => {
  try {
    const data = localStorage.getItem(APP_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading drinks", error);
    return [];
  }
};

export const saveDrink = (type: DrinkType): DrinkRecord => {
  const drinks = getStoredDrinks();
  const newDrink: DrinkRecord = {
    id: crypto.randomUUID(),
    type,
    timestamp: Date.now(),
  };
  
  const updatedDrinks = [newDrink, ...drinks];
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(updatedDrinks));
  return newDrink;
};

export const deleteDrink = (id: string): DrinkRecord[] => {
  const drinks = getStoredDrinks();
  const updatedDrinks = drinks.filter(d => d.id !== id);
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(updatedDrinks));
  return updatedDrinks;
};

export const clearHistory = (): void => {
  localStorage.removeItem(APP_STORAGE_KEY);
};