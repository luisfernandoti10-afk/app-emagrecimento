'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Zap, 
  TrendingUp, 
  Award, 
  Users, 
  CheckCircle, 
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Trophy,
  Clock,
  Shield
} from 'lucide-react';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Logo className="w-24 h-24 sm:w-32 sm:h-32 text-black dark:text-white animate-pulse" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-7xl font-extrabold text-black dark:text-white mb-6 leading-tight">
              Transforme Seu Corpo<br />
              <span className="bg-gradient-to-r from-gray-600 to-black dark:from-gray-400 dark:to-white bg-clip-text text-transparent">
                Com Inteligência Artificial
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Análise nutricional instantânea por IA, planos personalizados e resultados comprovados. 
              Junte-se a mais de 50.000 pessoas que já transformaram suas vidas.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/">
                <Button 
                  size="lg"
                  className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black text-lg px-8 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Começar Agora Grátis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-black dark:border-white text-black dark:text-white text-lg px-8 py-6 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
              >
                Ver Como Funciona
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">4.9/5</span> (12.000+ avaliações)
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="font-bold">50.000+</span> usuários ativos
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="font-bold">94%</span> taxa de sucesso
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformations Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-black dark:text-white mb-4">
              Resultados Reais, Pessoas Reais
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Veja as transformações incríveis de nossos usuários
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Silva",
                result: "-18kg em 3 meses",
                image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop",
                quote: "Nunca imaginei que seria tão fácil! O app mudou minha vida completamente."
              },
              {
                name: "João Santos",
                result: "-22kg em 4 meses",
                image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=500&fit=crop",
                quote: "A análise por IA é incrível. Saber exatamente o que estou comendo fez toda diferença."
              },
              {
                name: "Ana Costa",
                result: "-15kg em 3 meses",
                image: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=500&fit=crop",
                quote: "Perdi peso de forma saudável e sustentável. Recomendo para todos!"
              }
            ].map((person, index) => (
              <Card key={index} className="overflow-hidden border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all duration-300 hover:shadow-2xl">
                <img 
                  src={person.image} 
                  alt={person.name}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">{person.name}</h3>
                    <span className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-sm font-bold">
                      {person.result}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic">"{person.quote}"</p>
                  <div className="flex gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-black dark:text-white mb-4">
              Tecnologia de Ponta Para Seus Resultados
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Recursos exclusivos que vão acelerar sua transformação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "Análise por IA",
                description: "Tire uma foto da sua refeição e receba análise nutricional completa em segundos"
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Planos Personalizados",
                description: "Metas e recomendações adaptadas ao seu perfil, objetivos e estilo de vida"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Acompanhamento em Tempo Real",
                description: "Visualize seu progresso com gráficos detalhados e insights inteligentes"
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Sistema de Conquistas",
                description: "Gamificação completa com níveis, XP e conquistas para manter você motivado"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Resultados em 30 Dias",
                description: "Veja mudanças reais no primeiro mês ou seu dinheiro de volta"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "100% Seguro",
                description: "Seus dados protegidos com criptografia de nível bancário"
              }
            ].map((feature, index) => (
              <Card 
                key={index}
                className={`border-2 transition-all duration-300 cursor-pointer ${
                  hoveredFeature === index 
                    ? 'border-black dark:border-white shadow-2xl scale-105' 
                    : 'border-gray-200 dark:border-gray-800'
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4 text-white dark:text-black">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-black dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-black dark:text-white mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              3 passos simples para começar sua transformação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Crie Seu Perfil",
                description: "Insira suas informações básicas e objetivos. Leva menos de 2 minutos."
              },
              {
                step: "2",
                title: "Tire Fotos das Refeições",
                description: "Nossa IA analisa instantaneamente e calcula calorias, proteínas, carboidratos e gorduras."
              },
              {
                step: "3",
                title: "Acompanhe Seu Progresso",
                description: "Veja gráficos detalhados, conquiste objetivos e transforme seu corpo."
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-black dark:text-white mb-4">
              Por Que Escolher FitGenius?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Análise nutricional por IA em segundos",
              "Planos personalizados para seu objetivo",
              "Acompanhamento detalhado do progresso",
              "Sistema de gamificação motivador",
              "Suporte prioritário 24/7",
              "Receitas exclusivas e saudáveis",
              "Comunidade exclusiva de apoio",
              "Garantia de 30 dias ou dinheiro de volta"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-800">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-lg font-medium text-black dark:text-white">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black dark:from-white dark:to-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-6xl font-extrabold text-white dark:text-black mb-6">
            Pronto Para Transformar Seu Corpo?
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-700 mb-8">
            Junte-se a milhares de pessoas que já alcançaram seus objetivos com FitGenius
          </p>
          
          <Link href="/">
            <Button 
              size="lg"
              className="bg-white hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-900 text-black dark:text-white text-xl px-12 py-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            >
              <Zap className="w-6 h-6 mr-2" />
              Começar Minha Transformação Agora
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>

          <p className="text-sm text-gray-400 dark:text-gray-600 mt-6">
            ✓ Sem cartão de crédito necessário para começar • ✓ Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Logo className="w-12 h-12 text-black dark:text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 FitGenius. Todos os direitos reservados.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Transforme seu corpo com inteligência artificial
          </p>
        </div>
      </footer>
    </div>
  );
}
