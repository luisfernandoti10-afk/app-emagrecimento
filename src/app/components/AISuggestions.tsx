'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Dumbbell, Apple } from 'lucide-react';
import { UserProfile } from '../types';

interface AISuggestionsProps {
  profile: UserProfile | null;
  todayCalories: number;
}

export default function AISuggestions({ profile, todayCalories }: AISuggestionsProps) {
  if (!profile) return null;

  const caloriesRemaining = profile.dailyCalorieGoal - todayCalories;
  const isOverGoal = caloriesRemaining < 0;

  // Sugestões baseadas no perfil e progresso
  const getDietSuggestions = () => {
    if (isOverGoal) {
      return [
        'Considere pular o lanche da tarde ou optar por frutas',
        'Aumente a ingestão de água para reduzir a fome',
        'Faça uma caminhada leve de 20 minutos após o jantar',
      ];
    }
    
    if (caloriesRemaining > 500) {
      return [
        'Você ainda pode consumir uma refeição completa',
        'Adicione proteínas magras como frango ou peixe',
        'Inclua vegetais variados para mais nutrientes',
      ];
    }

    return [
      'Opte por um lanche leve como iogurte natural',
      'Frutas são uma ótima opção para o restante do dia',
      'Mantenha-se hidratado com água e chás sem açúcar',
    ];
  };

  const getExerciseSuggestions = () => {
    const activityMap = {
      'sedentary': ['Comece com caminhadas de 15 minutos', 'Alongamentos matinais', 'Subir escadas em vez de elevador'],
      'light': ['Caminhada rápida de 30 minutos', 'Yoga ou pilates', 'Ciclismo leve'],
      'moderate': ['Corrida leve de 30 minutos', 'Natação', 'Treino funcional'],
      'active': ['HIIT de 20 minutos', 'Corrida intensa', 'Crossfit'],
      'very-active': ['Treino de força avançado', 'Corrida de longa distância', 'Esportes competitivos'],
    };

    return activityMap[profile.activityLevel] || activityMap.moderate;
  };

  const dietSuggestions = getDietSuggestions();
  const exerciseSuggestions = getExerciseSuggestions();

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <Lightbulb className="w-5 h-5" />
            Sugestões Personalizadas
          </CardTitle>
          <CardDescription>
            Baseado no seu perfil e progresso de hoje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Sugestões de Dieta */}
            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <Apple className="w-4 h-4 text-emerald-600" />
                Alimentação
              </h4>
              <ul className="space-y-2">
                {dietSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sugestões de Exercícios */}
            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <Dumbbell className="w-4 h-4 text-emerald-600" />
                Exercícios Recomendados
              </h4>
              <ul className="space-y-2">
                {exerciseSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Motivação */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mt-4">
              <p className="text-sm font-medium text-center">
                {isOverGoal 
                  ? '💪 Não desanime! Amanhã é um novo dia para recomeçar.'
                  : `🎯 Você está indo muito bem! Faltam ${caloriesRemaining} kcal para sua meta.`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
