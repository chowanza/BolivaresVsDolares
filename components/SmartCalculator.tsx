"use client";

import React, { useState, useEffect } from 'react';
import { useRates } from '@/context/RatesContext';
import { IGTF_RATE } from '@/lib/constants';
import { Calculator, RefreshCw, Settings2, Wallet, Banknote, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type PaymentMethod = 'BS' | 'USD_CASH' | 'USDT';

export const SmartCalculator = () => {
  const { BCV, USDT, CASH, isLoading, error } = useRates();
  const [price, setPrice] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('USDT');
  
  // Manual Rate State
  const [isManualRate, setIsManualRate] = useState(false);
  const [manualUsdtRate, setManualUsdtRate] = useState<string>('');
  const [manualBcvRate, setManualBcvRate] = useState<string>('');

  // Update manual rate when API rate loads initially
  useEffect(() => {
    if (USDT > 0 && !manualUsdtRate) {
      setManualUsdtRate(USDT.toString());
    }
    if (BCV > 0 && !manualBcvRate) {
      setManualBcvRate(BCV.toString());
    }
  }, [USDT, BCV]);

  const activeStreetRate = isManualRate && parseFloat(manualUsdtRate) > 0 
    ? parseFloat(manualUsdtRate) 
    : (paymentMethod === 'USD_CASH' ? CASH : USDT);
  
  const activeBCV = isManualRate && parseFloat(manualBcvRate) > 0
    ? parseFloat(manualBcvRate)
    : BCV;
    
  const priceValue = parseFloat(price) || 0;
  
  // Logic
  // Scenario: User sees a price on the shelf (usually in USD).
  // We assume the input 'price' is the Shelf Price in USD.
  
  // 1. Pay with what I have (Direct)
  const calculateDirectPay = () => {
    if (paymentMethod === 'BS') {
      // If I have Bs, I pay Price * BCV. No IGTF.
      // Cost in USD terms? It's just the price.
      return priceValue; 
    }
    
    // If I have USD/USDT
    // I pay Price + 3% IGTF
    return priceValue * (1 + IGTF_RATE);
  };

  // 2. Smart Pay (Change USD to Bs, then pay in Bs)
  const calculateSmartPay = () => {
    // I need to pay Price (in USD) * BCV (in Bs/USD) = Total Bs needed
    const priceInBs = priceValue * activeBCV;
    
    // USD needed to get those Bs = PriceInBs / StreetRate
    return activeStreetRate > 0 ? priceInBs / activeStreetRate : 0;
  };

  const directCost = calculateDirectPay();
  const smartCost = calculateSmartPay();
  const savings = directCost - smartCost;
  const savingsPercent = directCost > 0 ? (savings / directCost) * 100 : 0;

  // Recommendation Text
  const getRecommendation = () => {
    if (priceValue === 0) return null;

    if (paymentMethod === 'BS') {
      return {
        type: 'neutral',
        title: 'Conversión de Bolívares',
        text: 'Aquí puedes ver cuánto representan tus Bolívares en diferentes tasas de cambio.'
      };
    }

    if (savings > 0) {
      return {
        type: 'warning',
        title: '¡No pagues directo!',
        text: `Si pagas directo pierdes dinero (IGTF + Tasa BCV). Mejor cambia tus $ a Bs (a tasa ${activeStreetRate.toFixed(2)}) y paga en Bolívares. Ahorrarás un ${savingsPercent.toFixed(1)}%.`
      };
    } else {
      return {
        type: 'neutral',
        title: 'Da igual cómo pagues',
        text: 'La brecha cambiaria es pequeña hoy. Puedes pagar directo si es más cómodo.'
      };
    }
  };

  const recommendation = getRecommendation();

  if (isLoading) return null;
  
  if (error || BCV === 0 || USDT === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 text-center">
        <div className="text-red-500 mb-2">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="font-medium">Calculadora no disponible</p>
        </div>
        <p className="text-sm text-gray-500">
          Necesitamos las tasas actualizadas para realizar los cálculos.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-5 h-5" />
            <h2 className="font-semibold text-lg">Calculadora Inteligente</h2>
          </div>
          <p className="text-blue-100 text-sm">¿Qué moneda tienes?</p>
        </div>
        <button 
          onClick={() => setIsManualRate(!isManualRate)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            isManualRate ? "bg-white/20 text-white" : "text-blue-100 hover:bg-white/10"
          )}
          title="Ajustar Tasa"
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Payment Method Selection */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setPaymentMethod('BS')}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
              paymentMethod === 'BS'
                ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            <Banknote className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Bolívares</span>
          </button>
          <button
            onClick={() => setPaymentMethod('USD_CASH')}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
              paymentMethod === 'USD_CASH'
                ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                : "border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            <Wallet className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Efectivo $</span>
          </button>
          <button
            onClick={() => setPaymentMethod('USDT')}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
              paymentMethod === 'USDT'
                ? "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : "border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            <RefreshCw className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">USDT</span>
          </button>
        </div>

        {/* Manual Rate Input */}
        {isManualRate && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in slide-in-from-top-2">
            {/* Manual BCV */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
              <label className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1 block">
                Tasa BCV (Manual)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-500">Bs.</span>
                <input
                  type="number"
                  value={manualBcvRate}
                  onChange={(e) => setManualBcvRate(e.target.value)}
                  className="flex-1 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Manual Street Rate */}
            {paymentMethod !== 'BS' && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                <label className="text-xs font-medium text-green-700 dark:text-green-300 mb-1 block">
                  Tasa {paymentMethod === 'USDT' ? 'USDT' : 'Efectivo'} (Manual)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-500">Bs.</span>
                  <input
                    type="number"
                    value={manualUsdtRate}
                    onChange={(e) => setManualUsdtRate(e.target.value)}
                    className="flex-1 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Monto a Pagar
            </label>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
              {paymentMethod === 'BS' ? 'Bs' : '$'}
            </span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg"
            />
          </div>
        </div>

        {/* Results & Recommendation */}
        {priceValue > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Recommendation Box */}
            {recommendation && (
              <div className={cn(
                "p-4 rounded-xl border flex gap-3",
                recommendation.type === 'success' ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200" :
                recommendation.type === 'warning' ? "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200" :
                "bg-gray-50 border-gray-200 text-gray-800"
              )}>
                {recommendation.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <div>
                  <h3 className="font-bold text-sm mb-1">{recommendation.title}</h3>
                  <p className="text-xs opacity-90 leading-relaxed">{recommendation.text}</p>
                </div>
              </div>
            )}

            {/* Comparison */}
            {paymentMethod === 'BS' ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                    Equivalente en Dólares (BCV)
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        ${(priceValue / activeBCV).toFixed(2)}
                      </div>
                      <div className="text-xs text-blue-600/70">Tasa BCV: {activeBCV.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      USDT
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      ${(priceValue / USDT).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Tasa: {USDT.toFixed(2)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Efectivo
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      ${(priceValue / CASH).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Tasa: {CASH.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {/* Direct Pay */}
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex justify-between items-center opacity-75">
                  <div>
                    <div className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
                      Pago Directo
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-xl font-bold text-red-700 dark:text-red-300">
                        ${directCost.toFixed(2)}
                      </div>
                      <div className="text-xs text-red-600/70">
                        Bs. {(directCost * activeBCV).toLocaleString('es-VE', { maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Pay */}
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 flex justify-between items-center relative overflow-hidden ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-gray-900">
                  <div className="relative z-10">
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Smart Pay (Cambia a Bs)
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        ${smartCost.toFixed(2)}
                      </div>
                      <div className="text-sm font-medium text-emerald-600/70">
                        Bs. {(smartCost * activeStreetRate).toLocaleString('es-VE', { maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="text-xs text-emerald-600 mt-1 font-medium">
                      Ahorras ${savings.toFixed(2)} ({savingsPercent.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};