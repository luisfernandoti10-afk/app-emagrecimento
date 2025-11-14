// Hooks para gerenciar Local Storage

import { useState, useEffect } from 'react';
import { FoodEntry, UserProfile, DailyProgress } from '../types';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useFoodEntries() {
  return useLocalStorage<FoodEntry[]>('foodEntries', []);
}

export function useUserProfile() {
  return useLocalStorage<UserProfile | null>('userProfile', null);
}

export function useDailyProgress() {
  const [entries] = useFoodEntries();
  const today = new Date().toISOString().split('T')[0];
  
  const todayEntries = entries.filter(entry => {
    const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
    return entryDate === today;
  });

  const progress: DailyProgress = {
    date: today,
    totalCalories: todayEntries.reduce((sum, entry) => sum + entry.calories, 0),
    totalProtein: todayEntries.reduce((sum, entry) => sum + entry.protein, 0),
    totalCarbs: todayEntries.reduce((sum, entry) => sum + entry.carbs, 0),
    totalFat: todayEntries.reduce((sum, entry) => sum + entry.fat, 0),
    entries: todayEntries,
  };

  return progress;
}
