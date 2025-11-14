'use client';

import { useState } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FoodEntry } from '../types';

interface FoodUploadProps {
  onFoodDetected: (food: FoodEntry) => void;
}

// Simulação de IA - dados mockados para demonstração
const mockFoodDatabase = [
  { name: 'Arroz com Feijão', calories: 350, protein: 12, carbs: 65, fat: 5 },
  { name: 'Frango Grelhado', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Salada Verde', calories: 50, protein: 2, carbs: 10, fat: 0.5 },
  { name: 'Macarrão à Bolonhesa', calories: 450, protein: 20, carbs: 60, fat: 15 },
  { name: 'Pizza Margherita', calories: 550, protein: 18, carbs: 70, fat: 20 },
  { name: 'Hambúrguer', calories: 600, protein: 25, carbs: 45, fat: 30 },
  { name: 'Sushi', calories: 300, protein: 15, carbs: 50, fat: 5 },
  { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: 'Ovo Cozido', calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  { name: 'Iogurte Natural', calories: 120, protein: 10, carbs: 12, fat: 4 },
];

export default function FoodUpload({ onFoodDetected }: FoodUploadProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const simulateAIRecognition = async (file: File): Promise<FoodEntry> => {
    // Simula delay de processamento da IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Seleciona aleatoriamente um alimento do banco de dados mockado
    const randomFood = mockFoodDatabase[Math.floor(Math.random() * mockFoodDatabase.length)];
    
    return {
      id: Date.now().toString(),
      ...randomFood,
      imageUrl: URL.createObjectURL(file),
      timestamp: Date.now(),
      meal: getCurrentMealType(),
    };
  };

  const getCurrentMealType = (): 'breakfast' | 'lunch' | 'dinner' | 'snack' => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 15) return 'lunch';
    if (hour >= 18 && hour < 22) return 'dinner';
    return 'snack';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mostra preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsAnalyzing(true);

    try {
      const detectedFood = await simulateAIRecognition(file);
      onFoodDetected(detectedFood);
      setPreview(null);
    } catch (error) {
      console.error('Erro ao analisar imagem:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-500" />
          Adicionar Refeição
        </CardTitle>
        <CardDescription>
          Tire uma foto do seu alimento e nossa IA calculará as calorias automaticamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {preview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm">Analisando imagem...</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <label htmlFor="food-upload">
            <input
              id="food-upload"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              disabled={isAnalyzing}
              className="hidden"
            />
            <Button
              type="button"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              disabled={isAnalyzing}
              onClick={() => document.getElementById('food-upload')?.click()}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Tirar Foto ou Escolher Imagem
                </>
              )}
            </Button>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
