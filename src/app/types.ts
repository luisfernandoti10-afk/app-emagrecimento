// Types para o app de emagrecimento

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  timestamp: number;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  targetWeight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  dailyCalorieGoal: number;
}

export interface DailyProgress {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  entries: FoodEntry[];
}

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}
