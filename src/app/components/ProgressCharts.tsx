'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingDown, Target, Flame, Activity } from 'lucide-react';
import { FoodEntry } from '../types';

interface ProgressChartsProps {
  entries: FoodEntry[];
  dailyGoal: number;
}

export default function ProgressCharts({ entries, dailyGoal }: ProgressChartsProps) {
  // Agrupa entradas por dia dos últimos 7 dias
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();
  
  const dailyData = last7Days.map(date => {
    const dayEntries = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
      return entryDate === date;
    });

    const totalCalories = dayEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const totalProtein = dayEntries.reduce((sum, entry) => sum + entry.protein, 0);
    const totalCarbs = dayEntries.reduce((sum, entry) => sum + entry.carbs, 0);
    const totalFat = dayEntries.reduce((sum, entry) => sum + entry.fat, 0);

    return {
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      calories: totalCalories,
      goal: dailyGoal,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
    };
  });

  const todayCalories = dailyData[dailyData.length - 1]?.calories || 0;
  const caloriesRemaining = Math.max(0, dailyGoal - todayCalories);
  const progressPercentage = Math.min(100, (todayCalories / dailyGoal) * 100);

  return (
    <div className="space-y-4">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Consumidas Hoje</p>
                <p className="text-2xl font-bold text-emerald-600">{todayCalories}</p>
                <p className="text-xs text-muted-foreground">kcal</p>
              </div>
              <Flame className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Meta Diária</p>
                <p className="text-2xl font-bold text-blue-600">{dailyGoal}</p>
                <p className="text-xs text-muted-foreground">kcal</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Restantes</p>
                <p className="text-2xl font-bold text-purple-600">{caloriesRemaining}</p>
                <p className="text-xs text-muted-foreground">kcal</p>
              </div>
              <TrendingDown className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Progresso</p>
                <p className="text-2xl font-bold text-orange-600">{progressPercentage.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">da meta</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Calorias - Últimos 7 Dias */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Calorias - Últimos 7 Dias</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={2} name="Consumidas" />
              <Line type="monotone" dataKey="goal" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Meta" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Macronutrientes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Macronutrientes - Últimos 7 Dias</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="protein" fill="#8b5cf6" name="Proteína (g)" />
              <Bar dataKey="carbs" fill="#f59e0b" name="Carboidratos (g)" />
              <Bar dataKey="fat" fill="#ef4444" name="Gordura (g)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
