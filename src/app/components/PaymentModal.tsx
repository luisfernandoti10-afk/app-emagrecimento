'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, QrCode, Check, Crown, Zap, Shield, Star, Sparkles, Clock, Users, Award } from 'lucide-react';
import { translations, Language } from '@/lib/i18n';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
  language: Language;
  selectedPlan: 'monthly' | 'quarterly';
}

export default function PaymentModal({ onClose, onSuccess, language, selectedPlan }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('card');
  const [cardType, setCardType] = useState<'credit' | 'debit'>('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const t = translations[language];

  const MONTHLY_PRICE = 39.90;
  const QUARTERLY_PRICE = 89.70;
  const QUARTERLY_MONTHLY = 29.90;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsProcessing(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2500);
  };

  const getCurrentPrice = () => {
    const basePrice = selectedPlan === 'quarterly' ? QUARTERLY_PRICE : MONTHLY_PRICE;
    if (paymentMethod === 'pix') {
      return (basePrice * 0.95).toFixed(2);
    }
    return basePrice.toFixed(2);
  };

  const currencySymbol = language === 'en' ? '$' : 'R$';

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t.paymentConfirmed}
            </h3>
            <p className="text-muted-foreground text-lg mb-4">
              {t.subscriptionActivated}
            </p>
            <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold">
              <Crown className="w-5 h-5" />
              <span>{t.welcomeToFitGenius}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-6xl my-8 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-3xl">
            <Crown className="w-8 h-8" />
            {t.unlockFitGenius}
          </CardTitle>
          <CardDescription className="text-white/90 text-lg">
            {t.joinThousands}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Urgência */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 p-4 rounded-lg border-2 border-red-300 animate-pulse">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold mb-1">
              <Clock className="w-5 h-5" />
              {t.limitedOffer}
            </div>
            <p className="text-sm font-semibold">
              {t.onlySevenSpots}
            </p>
          </div>

          {/* Transformações */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-6 rounded-xl border-2 border-purple-200">
            <h3 className="font-bold text-2xl mb-4 text-center flex items-center justify-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              {t.realTransformations}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop" 
                    alt="Transformation"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    -18kg
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bold mb-1">Maria Silva, 32</p>
                  <p className="text-sm text-muted-foreground">"Perdi 18kg e ganhei autoestima!"</p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop" 
                    alt="Transformation"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    -22kg
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bold mb-1">João Santos, 28</p>
                  <p className="text-sm text-muted-foreground">"Resultado incrível!"</p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400&h=300&fit=crop" 
                    alt="Transformation"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    -15kg
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bold mb-1">Ana Costa, 35</p>
                  <p className="text-sm text-muted-foreground">"Método revolucionário!"</p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">94%</p>
                <p className="text-xs text-muted-foreground">{t.successRate}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-3xl font-bold text-pink-600">50k+</p>
                <p className="text-xs text-muted-foreground">{t.activeUsers}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-3xl font-bold text-orange-600">4.9★</p>
                <p className="text-xs text-muted-foreground">{t.rating}</p>
              </div>
            </div>
          </div>

          {/* Benefícios Rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">{t.resultsIn30Days}</p>
                <p className="text-xs text-muted-foreground">{t.moneyBackGuarantee}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-950 rounded-lg">
              <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">{t.securePayment}</p>
                <p className="text-xs text-muted-foreground">{t.sslEncryption}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">{t.exclusiveCommunity}</p>
                <p className="text-xs text-muted-foreground">{t.prioritySupport}</p>
              </div>
            </div>
          </div>

          {/* Método de Pagamento */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              {t.choosePaymentMethod}
            </h3>
            <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'pix' | 'card')}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="card" className="font-semibold">
                  <CreditCard className="w-4 h-4 mr-2" />
                  {t.card}
                </TabsTrigger>
                <TabsTrigger value="pix" className="font-semibold">
                  <QrCode className="w-4 h-4 mr-2" />
                  {t.pixDiscount}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="space-y-4">
                {/* Tipo de Cartão */}
                <div className="space-y-3 mb-4">
                  <Label className="font-semibold">{t.cardType}</Label>
                  <RadioGroup value={cardType} onValueChange={(v) => setCardType(v as 'credit' | 'debit')} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="cursor-pointer font-normal">{t.credit}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="debit" id="debit" />
                      <Label htmlFor="debit" className="cursor-pointer font-normal">{t.debit}</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl text-white shadow-lg mb-4">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-xs opacity-80 mb-1">{t.cardNumber}</p>
                      <p className="text-xl font-mono tracking-wider">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </p>
                    </div>
                    <div className="text-right">
                      <CreditCard className="w-10 h-10 opacity-80" />
                      <p className="text-xs mt-1">{cardType === 'credit' ? t.credit.toUpperCase() : t.debit.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-80 mb-1">{t.nameOnCard}</p>
                      <p className="font-semibold">{cardName || 'SEU NOME'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-80 mb-1">{t.validity}</p>
                      <p className="font-semibold">{cardExpiry || 'MM/AA'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="font-semibold">{t.cardNumber}</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName" className="font-semibold">{t.nameOnCard}</Label>
                    <Input
                      id="cardName"
                      placeholder="NOME COMPLETO"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="text-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry" className="font-semibold">{t.validity}</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        className="text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvv" className="font-semibold">CVV</Label>
                      <Input
                        id="cardCvv"
                        placeholder="123"
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        className="text-lg"
                      />
                    </div>
                  </div>
                </div>

                {selectedPlan === 'quarterly' && cardType === 'credit' && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {t.installmentInfo}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pix" className="space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-950 p-4 rounded-lg border-2 border-emerald-200 mb-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold mb-1">
                    <Zap className="w-5 h-5" />
                    {t.pixSpecialDiscount}
                  </div>
                  <p className="text-sm">
                    {t.pixInfo}{' '}
                    <span className="font-bold">
                      {selectedPlan === 'quarterly' 
                        ? `${currencySymbol} ${QUARTERLY_PRICE.toFixed(2)} → ${currencySymbol} ${(QUARTERLY_PRICE * 0.95).toFixed(2)}`
                        : `${currencySymbol} ${MONTHLY_PRICE.toFixed(2)} → ${currencySymbol} ${(MONTHLY_PRICE * 0.95).toFixed(2)}`
                      }
                    </span>
                  </p>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="w-64 h-64 bg-white border-4 border-gray-200 mx-auto rounded-lg flex items-center justify-center shadow-inner">
                        <QrCode className="w-48 h-48 text-gray-800" />
                      </div>
                      <p className="text-sm text-muted-foreground font-semibold">
                        {t.scanQRCode}
                      </p>
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <p className="text-xs font-mono break-all text-gray-600 dark:text-gray-400">
                          00020126580014br.gov.bcb.pix0136fitgenius-{Date.now()}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t.paymentConfirmedIn}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Garantia */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 p-4 rounded-lg border-2 border-emerald-200">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-emerald-600" />
              <div>
                <p className="font-bold text-emerald-900 dark:text-emerald-100">{t.guarantee30DaysFull}</p>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  {t.guaranteeDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Botão de Ação */}
          <div className="pt-4">
            <Button
              onClick={handlePayment}
              disabled={isProcessing || (paymentMethod === 'card' && (!cardNumber || !cardName || !cardExpiry || !cardCvv))}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xl py-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t.processing}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  {t.secureMySpot} - {currencySymbol} {getCurrentPrice()}
                </span>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-2">
              {t.agreeTerms}
            </p>
          </div>

          {/* Selo de Segurança */}
          <div className="text-center text-xs text-muted-foreground pt-2 border-t">
            <p className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-4 h-4" />
              {t.securePaymentSSL}
            </p>
            <p className="text-xs">
              {t.encryptedData}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
