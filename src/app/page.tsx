'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Home as HomeIcon, BarChart3, Sparkles, Settings, Crown, Trash2, Zap, TrendingUp, Award, Check, Globe, Clock, Users, Shield, Trophy, Flame, Target, Star, Gift } from 'lucide-react';
import { useFoodEntries, useUserProfile, useDailyProgress } from './hooks/useLocalStorage';
import { FoodEntry, UserProfile } from './types';
import FoodUpload from './components/FoodUpload';
import ProgressCharts from './components/ProgressCharts';
import AISuggestions from './components/AISuggestions';
import PaymentModal from './components/PaymentModal';
import { translations, Language } from '@/lib/i18n';
import Logo from '@/components/Logo';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  target: number;
}

interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalMealsLogged: number;
  totalDaysActive: number;
  achievements: Achievement[];
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export default function FitAIApp() {
  const [entries, setEntries] = useFoodEntries();
  const [profile, setProfile] = useUserProfile();
  const dailyProgress = useDailyProgress();
  const [activeTab, setActiveTab] = useState('home');
  const [showPayment, setShowPayment] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [language, setLanguage] = useState<Language>('pt');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly'>('quarterly');
  const [userStats, setUserStats] = useState<UserStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalMealsLogged: 0,
    totalDaysActive: 0,
    achievements: [],
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
  });
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Form states para configuração de perfil
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<UserProfile['activityLevel']>('moderate');

  const t = translations[language];

  const MONTHLY_PRICE = 39.90;
  const QUARTERLY_PRICE = 89.70;
  const QUARTERLY_MONTHLY = 29.90;

  // Carregar stats do localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('fitgenius_stats');
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    } else {
      initializeAchievements();
    }
  }, []);

  // Salvar stats no localStorage
  useEffect(() => {
    if (userStats.achievements.length > 0) {
      localStorage.setItem('fitgenius_stats', JSON.stringify(userStats));
    }
  }, [userStats]);

  const initializeAchievements = () => {
    const achievements: Achievement[] = [
      {
        id: 'first_meal',
        title: t.firstMealTitle,
        description: t.firstMealDesc,
        icon: <Target className="w-6 h-6" />,
        unlocked: false,
        progress: 0,
        target: 1,
      },
      {
        id: 'streak_3',
        title: t.streak3Title,
        description: t.streak3Desc,
        icon: <Flame className="w-6 h-6" />,
        unlocked: false,
        progress: 0,
        target: 3,
      },
      {
        id: 'streak_7',
        title: t.streak7Title,
        description: t.streak7Desc,
        icon: <Flame className="w-6 h-6" />,
        unlocked: false,
        progress: 0,
        target: 7,
      },
      {
        id: 'streak_30',
        title: t.streak30Title,
        description: t.streak30Desc,
        icon: <Flame className="w-6 h-6" />,
        unlocked: false,
        progress: 0,
        target: 30,
      },
      {
        id: 'meals_10',
        title: t.meals10Title,
        description: t.meals10Desc,
        icon: <Trophy className="w-6 h-6" />,
        unlocked: false,
        progress: 0,
        target: 10,
      },
      {
        id: 'meals_50',
        title: t.meals50Title,
        description: t.meals50Desc,
        icon: <Trophy className="w-6 h-6" />,
        unlocked: false,
        progress: 0,
        target: 50,
      },
      {
        id: 'meals_100',
        title: t.meals100Title,
        description: t.meals100Desc,
        icon: <Trophy className="w-6 h-6" />,
        unlocked: false,
        progress: 0,
        target: 100,
      },
      {
        id: 'level_5',
        title: t.level5Title,
        description: t.level5Desc,
        icon: <Star className="w-6 h-6" />,
        unlocked: false,
        progress: 0,
        target: 5,
      },
    ];

    setUserStats(prev => ({ ...prev, achievements }));
  };

  const addXP = (amount: number) => {
    setUserStats(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newXPToNext = prev.xpToNextLevel;

      // Level up
      while (newXP >= newXPToNext) {
        newXP -= newXPToNext;
        newLevel += 1;
        newXPToNext = newLevel * 100; // Cada nível precisa de mais XP
        
        // Verificar achievement de nível
        checkLevelAchievement(newLevel);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newXPToNext,
      };
    });
  };

  const checkLevelAchievement = (level: number) => {
    if (level >= 5) {
      unlockAchievement('level_5');
    }
  };

  const unlockAchievement = (achievementId: string) => {
    setUserStats(prev => {
      const achievements = prev.achievements.map(ach => {
        if (ach.id === achievementId && !ach.unlocked) {
          setNewAchievement(ach);
          setShowAchievementPopup(true);
          setTimeout(() => setShowAchievementPopup(false), 5000);
          return { ...ach, unlocked: true, progress: ach.target };
        }
        return ach;
      });
      return { ...prev, achievements };
    });
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActive = localStorage.getItem('fitgenius_last_active');
    
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      setUserStats(prev => {
        let newStreak = prev.currentStreak;
        
        if (lastActive === yesterday.toDateString()) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }

        const newLongest = Math.max(newStreak, prev.longestStreak);
        
        // Verificar achievements de streak
        if (newStreak >= 3) unlockAchievement('streak_3');
        if (newStreak >= 7) unlockAchievement('streak_7');
        if (newStreak >= 30) unlockAchievement('streak_30');

        return {
          ...prev,
          currentStreak: newStreak,
          longestStreak: newLongest,
          totalDaysActive: prev.totalDaysActive + 1,
        };
      });

      localStorage.setItem('fitgenius_last_active', today);
    }
  };

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setAge(profile.age.toString());
      setWeight(profile.weight.toString());
      setHeight(profile.height.toString());
      setTargetWeight(profile.targetWeight.toString());
      setActivityLevel(profile.activityLevel);
    }
  }, [profile]);

  const calculateDailyCalories = (
    weight: number,
    height: number,
    age: number,
    activityLevel: UserProfile['activityLevel']
  ) => {
    const bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    
    const activityMultiplier = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9,
    };

    const tdee = bmr * activityMultiplier[activityLevel];
    return Math.round(tdee - 500);
  };

  const handleSaveProfile = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);
    const targetWeightNum = parseFloat(targetWeight);

    const dailyCalories = calculateDailyCalories(weightNum, heightNum, ageNum, activityLevel);

    const newProfile: UserProfile = {
      name,
      age: ageNum,
      weight: weightNum,
      height: heightNum,
      targetWeight: targetWeightNum,
      activityLevel,
      dailyCalorieGoal: dailyCalories,
    };

    setProfile(newProfile);
  };

  const handleFoodDetected = (food: FoodEntry) => {
    setEntries([...entries, food]);
    
    // Adicionar XP
    addXP(10);
    
    // Atualizar streak
    updateStreak();
    
    // Atualizar total de refeições
    setUserStats(prev => {
      const newTotal = prev.totalMealsLogged + 1;
      
      // Verificar achievements de refeições
      if (newTotal >= 1) unlockAchievement('first_meal');
      if (newTotal >= 10) unlockAchievement('meals_10');
      if (newTotal >= 50) unlockAchievement('meals_50');
      if (newTotal >= 100) unlockAchievement('meals_100');

      // Atualizar progresso dos achievements
      const achievements = prev.achievements.map(ach => {
        if (ach.id.startsWith('meals_')) {
          return { ...ach, progress: Math.min(newTotal, ach.target) };
        }
        if (ach.id.startsWith('streak_')) {
          return { ...ach, progress: Math.min(prev.currentStreak, ach.target) };
        }
        return ach;
      });

      return {
        ...prev,
        totalMealsLogged: newTotal,
        achievements,
      };
    });
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const getMealLabel = (meal: string) => {
    const labels: Record<string, string> = {
      breakfast: t.breakfast,
      lunch: t.lunch,
      dinner: t.dinner,
      snack: t.snack,
    };
    return labels[meal] || meal;
  };

  // Tela de boas-vindas se não tiver perfil
  if (!profile) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
        {/* Language Selector */}
        <div className="fixed top-4 right-4 z-50">
          <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
            <SelectTrigger className="w-32 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">🇧🇷 PT</SelectItem>
              <SelectItem value="en">🇺🇸 EN</SelectItem>
              <SelectItem value="es">🇪🇸 ES</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="w-full max-w-2xl shadow-2xl border-gray-200 dark:border-gray-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo className="w-20 h-20 text-black dark:text-white" />
            </div>
            <CardTitle className="text-4xl font-extrabold text-black dark:text-white">
              {t.welcomeTitle}
            </CardTitle>
            <CardDescription className="text-lg mt-2 text-gray-600 dark:text-gray-400">
              {t.welcomeSubtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.name}</Label>
                <Input
                  id="name"
                  placeholder={t.yourName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">{t.age}</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">{t.currentWeight}</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">{t.height}</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetWeight">{t.targetWeight}</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  placeholder="65"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">{t.activityLevel}</Label>
              <Select value={activityLevel} onValueChange={(v) => setActivityLevel(v as UserProfile['activityLevel'])}>
                <SelectTrigger className="border-gray-300 dark:border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">{t.sedentary}</SelectItem>
                  <SelectItem value="light">{t.light}</SelectItem>
                  <SelectItem value="moderate">{t.moderate}</SelectItem>
                  <SelectItem value="active">{t.active}</SelectItem>
                  <SelectItem value="very-active">{t.veryActive}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSaveProfile}
              className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={!name || !age || !weight || !height || !targetWeight}
            >
              <Zap className="w-5 h-5 mr-2" />
              {t.continueToPayment}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tela de Planos - Exibida diretamente se não for premium
  if (!isPremium) {
    return (
      <>
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
          {/* Language Selector */}
          <div className="fixed top-4 right-4 z-50">
            <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
              <SelectTrigger className="w-32 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">🇧🇷 PT</SelectItem>
                <SelectItem value="en">🇺🇸 EN</SelectItem>
                <SelectItem value="es">🇪🇸 ES</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="w-full max-w-6xl shadow-2xl my-8 max-h-[90vh] overflow-y-auto border-gray-200 dark:border-gray-800">
            <CardHeader className="text-center bg-black dark:bg-white text-white dark:text-black">
              <div className="mx-auto mb-4">
                <Logo className="w-24 h-24 text-white dark:text-black" />
              </div>
              <CardTitle className="text-5xl font-extrabold mb-4">
                {t.unlockFitGenius}
              </CardTitle>
              <CardDescription className="text-xl text-gray-200 dark:text-gray-800">
                {t.hello}, {profile.name}! {t.joinThousands}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              {/* Urgência */}
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-700 animate-pulse">
                <div className="flex items-center gap-2 text-black dark:text-white font-bold mb-1">
                  <Clock className="w-5 h-5" />
                  {t.limitedOffer}
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t.onlySevenSpots}
                </p>
              </div>

              {/* Transformações */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-2xl mb-4 text-center flex items-center justify-center gap-2">
                  <Award className="w-6 h-6 text-black dark:text-white" />
                  {t.realTransformations}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                    <img 
                      src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=250&fit=crop" 
                      alt="Transformation"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-sm">Maria Silva</p>
                        <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 rounded-full text-xs font-bold">-18kg</span>
                      </div>
                      <p className="text-xs text-muted-foreground">"Perdi 18kg em 3 meses! Incrível!"</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                    <img 
                      src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=250&fit=crop" 
                      alt="Transformation"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-sm">João Santos</p>
                        <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 rounded-full text-xs font-bold">-22kg</span>
                      </div>
                      <p className="text-xs text-muted-foreground">"Resultado surpreendente em 4 meses!"</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                    <img 
                      src="https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=250&fit=crop" 
                      alt="Transformation"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-sm">Ana Costa</p>
                        <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 rounded-full text-xs font-bold">-15kg</span>
                      </div>
                      <p className="text-xs text-muted-foreground">"Método revolucionário! Recomendo!"</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-2xl font-bold text-black dark:text-white">94%</p>
                    <p className="text-xs text-muted-foreground">{t.successRate}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-2xl font-bold text-black dark:text-white">50k+</p>
                    <p className="text-xs text-muted-foreground">{t.activeUsers}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-2xl font-bold text-black dark:text-white">4.9★</p>
                    <p className="text-xs text-muted-foreground">{t.rating}</p>
                  </div>
                </div>
              </div>

              {/* Benefícios */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-2xl mb-4 text-center">{t.whatYouGet}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white dark:text-black" />
                    </div>
                    <span className="text-sm font-medium">{t.unlimitedAnalysis}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-4 h-4 text-white dark:text-black" />
                    </div>
                    <span className="text-sm font-medium">{t.advancedReports}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-white dark:text-black" />
                    </div>
                    <span className="text-sm font-medium">{t.personalizedPlans}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Crown className="w-4 h-4 text-white dark:text-black" />
                    </div>
                    <span className="text-sm font-medium">{t.prioritySupport}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-white dark:text-black" />
                    </div>
                    <span className="text-sm font-medium">{t.exclusiveRecipes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-4 h-4 text-white dark:text-black" />
                    </div>
                    <span className="text-sm font-medium">{t.gamificationSystem}</span>
                  </div>
                </div>
              </div>

              {/* Seleção de Planos */}
              <div className="space-y-4">
                <h3 className="font-bold text-xl text-center">{t.chooseYourPlan}</h3>
                <RadioGroup value={selectedPlan} onValueChange={(v) => setSelectedPlan(v as 'monthly' | 'quarterly')}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Plano Mensal */}
                    <Card className={`cursor-pointer transition-all border-2 ${selectedPlan === 'monthly' ? 'border-black dark:border-white shadow-xl' : 'border-gray-300 dark:border-gray-700'}`}>
                      <CardContent className="p-6" onClick={() => setSelectedPlan('monthly')}>
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value="monthly" id="monthly" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="monthly" className="cursor-pointer">
                              <div className="font-bold text-lg mb-2">{t.monthlyPlan}</div>
                              <div className="mb-3">
                                <span className="text-3xl font-extrabold text-black dark:text-white">
                                  {language === 'en' ? '$' : 'R$'} {MONTHLY_PRICE.toFixed(2)}
                                </span>
                                <span className="text-muted-foreground">{t.perMonth}</span>
                              </div>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-black dark:text-white" />
                                  {t.fullAccessDays.replace('{days}', '30')}
                                </li>
                                <li className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-black dark:text-white" />
                                  {t.cancelAnytime}
                                </li>
                              </ul>
                            </Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Plano Trimestral */}
                    <Card className={`cursor-pointer transition-all relative border-2 ${selectedPlan === 'quarterly' ? 'border-black dark:border-white shadow-xl' : 'border-gray-300 dark:border-gray-700'}`}>
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                        {t.mostPopular}
                      </div>
                      <CardContent className="p-6 pt-8" onClick={() => setSelectedPlan('quarterly')}>
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value="quarterly" id="quarterly" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="quarterly" className="cursor-pointer">
                              <div className="font-bold text-lg mb-2 flex items-center gap-2">
                                {t.quarterlyPlan}
                                <Crown className="w-5 h-5 text-black dark:text-white" />
                              </div>
                              <div className="mb-1">
                                <span className="text-sm line-through text-muted-foreground">
                                  {language === 'en' ? '$' : 'R$'} {(MONTHLY_PRICE * 3).toFixed(2)}
                                </span>
                              </div>
                              <div className="mb-3">
                                <span className="text-3xl font-extrabold text-black dark:text-white">
                                  {language === 'en' ? '$' : 'R$'} {QUARTERLY_PRICE.toFixed(2)}
                                </span>
                                <span className="text-muted-foreground text-sm">
                                  {' '}(3x {language === 'en' ? '$' : 'R$'} {QUARTERLY_MONTHLY.toFixed(2)})
                                </span>
                              </div>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-black dark:text-white" />
                                  <span className="font-semibold">
                                    {t.save.replace('{amount}', ((MONTHLY_PRICE * 3) - QUARTERLY_PRICE).toFixed(2))}
                                  </span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-black dark:text-white" />
                                  {t.fullAccessDays.replace('{days}', '90')}
                                </li>
                                <li className="flex items-center gap-2">
                                  <Check className="w-4 h-4 text-black dark:text-white" />
                                  {t.bestValue}
                                </li>
                                <li className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-black dark:text-white" />
                                  <span className="font-semibold text-black dark:text-white">{t.bonusEbook}</span>
                                </li>
                              </ul>
                            </Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </RadioGroup>
              </div>

              {/* Benefícios Rápidos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white dark:text-black" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.resultsIn30Days}</p>
                    <p className="text-xs text-muted-foreground">{t.moneyBackGuarantee}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white dark:text-black" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.securePayment}</p>
                    <p className="text-xs text-muted-foreground">{t.sslEncryption}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white dark:text-black" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.exclusiveCommunity}</p>
                    <p className="text-xs text-muted-foreground">{t.prioritySupport}</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setShowPayment(true)}
                className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-bold py-8 text-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
              >
                <Crown className="w-6 h-6 mr-3" />
                {t.guaranteeMySpot}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                ✓ {t.guarantee30Days} • ✓ {t.cancelAnytime} • ✓ {t.securePayment}
              </p>
            </CardContent>
          </Card>
        </div>

        {showPayment && (
          <PaymentModal
            onClose={() => setShowPayment(false)}
            onSuccess={() => setIsPremium(true)}
            language={language}
            selectedPlan={selectedPlan}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Achievement Popup */}
      {showAchievementPopup && newAchievement && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right">
          <Card className="w-80 border-2 border-black dark:border-white shadow-2xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  {newAchievement.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-black dark:text-white">{t.achievementUnlocked}</p>
                  <p className="text-xs font-semibold">{newAchievement.title}</p>
                  <p className="text-xs text-muted-foreground">{newAchievement.description}</p>
                </div>
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-12 h-12 text-black dark:text-white" />
            <div>
              <h1 className="text-2xl font-extrabold text-black dark:text-white">
                FitGenius
              </h1>
              <p className="text-xs text-muted-foreground">{t.hello}, {profile.name}!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
              <SelectTrigger className="w-32 border-gray-300 dark:border-gray-700">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">🇧🇷 PT</SelectItem>
                <SelectItem value="en">🇺🇸 EN</SelectItem>
                <SelectItem value="es">🇪🇸 ES</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Stats Badge */}
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold">{userStats.currentStreak}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-bold">{userStats.level}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-gray-100 dark:bg-gray-900">
            <TabsTrigger value="home">
              <HomeIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t.home}</span>
            </TabsTrigger>
            <TabsTrigger value="progress">
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t.progress}</span>
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Trophy className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t.achievements}</span>
            </TabsTrigger>
            <TabsTrigger value="suggestions">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t.suggestions}</span>
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t.profile}</span>
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            {/* Gamification Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-gray-200 dark:border-gray-800 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{t.currentStreak}</p>
                      <p className="text-3xl font-bold">{userStats.currentStreak}</p>
                      <p className="text-xs text-muted-foreground">{t.days}</p>
                    </div>
                    <Flame className="w-12 h-12 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-800 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{t.level}</p>
                      <p className="text-3xl font-bold">{userStats.level}</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                          className="bg-black dark:bg-white h-2 rounded-full transition-all"
                          style={{ width: `${(userStats.xp / userStats.xpToNextLevel) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Star className="w-12 h-12 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{t.totalMeals}</p>
                      <p className="text-3xl font-bold">{userStats.totalMealsLogged}</p>
                      <p className="text-xs text-muted-foreground">{t.logged}</p>
                    </div>
                    <Target className="w-12 h-12 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{t.achievementsUnlocked}</p>
                      <p className="text-3xl font-bold">
                        {userStats.achievements.filter(a => a.unlocked).length}/{userStats.achievements.length}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.completed}</p>
                    </div>
                    <Trophy className="w-12 h-12 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <FoodUpload onFoodDetected={handleFoodDetected} />

            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>{t.todayMeals}</CardTitle>
                <CardDescription>
                  {dailyProgress.totalCalories} / {profile.dailyCalorieGoal} kcal
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dailyProgress.entries.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {t.noMealsToday}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {dailyProgress.entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                      >
                        {entry.imageUrl && (
                          <img
                            src={entry.imageUrl}
                            alt={entry.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{entry.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {getMealLabel(entry.meal)} • {entry.calories} kcal
                          </p>
                          <p className="text-xs text-muted-foreground">
                            P: {entry.protein}g • C: {entry.carbs}g • G: {entry.fat}g
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                            <span className="text-xs font-bold text-green-700 dark:text-green-300">+10 XP</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEntry(entry.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <ProgressCharts entries={entries} dailyGoal={profile.dailyCalorieGoal} />
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  {t.yourAchievements}
                </CardTitle>
                <CardDescription>
                  {t.achievementsProgress}: {userStats.achievements.filter(a => a.unlocked).length} / {userStats.achievements.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userStats.achievements.map((achievement) => (
                    <Card 
                      key={achievement.id}
                      className={`border-2 ${achievement.unlocked ? 'border-black dark:border-white bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900' : 'border-gray-300 dark:border-gray-700 opacity-60'}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.unlocked ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'}`}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-bold">{achievement.title}</p>
                              {achievement.unlocked && <Check className="w-5 h-5 text-green-500" />}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all ${achievement.unlocked ? 'bg-green-500' : 'bg-black dark:bg-white'}`}
                                style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {achievement.progress} / {achievement.target}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats Summary */}
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>{t.yourStats}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                    <p className="text-2xl font-bold">{userStats.longestStreak}</p>
                    <p className="text-xs text-muted-foreground">{t.longestStreak}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">{userStats.totalMealsLogged}</p>
                    <p className="text-xs text-muted-foreground">{t.totalMealsLogged}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-2xl font-bold">{userStats.level}</p>
                    <p className="text-xs text-muted-foreground">{t.currentLevel}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold">{userStats.totalDaysActive}</p>
                    <p className="text-xs text-muted-foreground">{t.daysActive}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions">
            <AISuggestions profile={profile} todayCalories={dailyProgress.totalCalories} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>{t.profileSettings}</CardTitle>
                <CardDescription>{t.updateInfo}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">{t.name}</Label>
                    <Input
                      id="edit-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-age">{t.age}</Label>
                    <Input
                      id="edit-age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-weight">{t.currentWeight}</Label>
                    <Input
                      id="edit-weight"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-height">{t.height}</Label>
                    <Input
                      id="edit-height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-target">{t.targetWeight}</Label>
                    <Input
                      id="edit-target"
                      type="number"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-activity">{t.activityLevel}</Label>
                  <Select value={activityLevel} onValueChange={(v) => setActivityLevel(v as UserProfile['activityLevel'])}>
                    <SelectTrigger className="border-gray-300 dark:border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">{t.sedentary}</SelectItem>
                      <SelectItem value="light">{t.light}</SelectItem>
                      <SelectItem value="moderate">{t.moderate}</SelectItem>
                      <SelectItem value="active">{t.active}</SelectItem>
                      <SelectItem value="very-active">{t.veryActive}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800">
                  <p className="text-sm">
                    <strong>{t.dailyCalorieGoal}:</strong> {profile.dailyCalorieGoal} kcal
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.calculatedForWeightLoss}
                  </p>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
                >
                  {t.saveChanges}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
