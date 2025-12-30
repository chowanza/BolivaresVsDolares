"use client";

import React, { useState, useEffect } from 'react';
import { useRates } from '@/context/RatesContext';
import { IGTF_RATE } from '@/lib/constants';
import { Calculator, RefreshCw, Settings2, Wallet, Banknote, ArrowRight, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SmartCalculator = () => {
  const { BCV, USDT, CASH, isLoading, error } = useRates();
  const [price, setPrice] = useState<string>('');
  
  // Manual Rate State
  const [isManualRate, setIsManualRate] = useState(false);
  const [manualUsdtRate, setManualUsdtRate] = useState<string>('');
  const [manualBcvRate, setManualBcvRate] = useState<string>('');
  const [promoPrice, setPromoPrice] = useState<string>('');
  const [showPromoInput, setShowPromoInput] = useState(false);

  // Update manual rate when API rate loads initially
  useEffect(() => {
    if (USDT > 0 && !manualUsdtRate) {
      setManualUsdtRate(USDT.toString());
    }
    if (BCV > 0 && !manualBcvRate) {
      setManualBcvRate(BCV.toString());
    }
  }, [USDT, BCV]);

  const activeUsdtRate = isManualRate && parseFloat(manualUsdtRate) > 0 
    ? parseFloat(manualUsdtRate) 
    : USDT;
  
  const activeCashRate = isManualRate && parseFloat(manualUsdtRate) > 0 
    ? parseFloat(manualUsdtRate) // Assuming manual rate applies to both for simplicity or add separate input
    : CASH;

  const activeBCV = isManualRate && parseFloat(manualBcvRate) > 0
    ? parseFloat(manualBcvRate)
    : BCV;
    
  const priceValue = parseFloat(price) || 0;
  const promoPriceValue = parseFloat(promoPrice) || 0;
  
  // Calculations
  // 1. Cost in Bs (Official Price)
  const costInBs = priceValue * activeBCV;

  // 2. Cost if paying with Cash (Exchange Cash -> Bs -> Pay)
  // I need 'costInBs'. I sell my Cash at 'activeCashRate'.
  // Dollars needed = costInBs / activeCashRate
  const costIfExchangingCash = activeCashRate > 0 ? costInBs / activeCashRate : 0;

  // 3. Cost if paying with USDT (Exchange USDT -> Bs -> Pay)
  // I need 'costInBs'. I sell my USDT at 'activeUsdtRate'.
  // USDT needed = costInBs / activeUsdtRate
  const costIfExchangingUsdt = activeUsdtRate > 0 ? costInBs / activeUsdtRate : 0;

  // 4. Direct Pay (Promo Divisa / No IGTF)
  // If promoPrice is set, that is the cost.
  const costDirectNoIgtf = promoPriceValue > 0 
    ? promoPriceValue 
    : priceValue;

  // 5. Direct Pay (With IGTF)
  const costDirectWithIgtf = priceValue * (1 + IGTF_RATE);

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
          <p className="text-blue-100 text-sm">Compara tus opciones de pago</p>
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
        
        {/* Manual Rate Input */}
        {isManualRate && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in slide-in-from-top-2">
            {/* Manual BCV */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
              <label className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1 block">
                Tasa BCV (Manual)
              </label>
              <div className="flex items-center bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <span className="text-sm font-bold text-gray-500 mr-2">Bs.</span>
                <input
                  type="number"
                  value={manualBcvRate}
                  onChange={(e) => setManualBcvRate(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm w-full"
                />
              </div>
            </div>

            {/* Manual Street Rate */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
              <label className="text-xs font-medium text-green-700 dark:text-green-300 mb-1 block">
                Tasa Paralela (Manual)
              </label>
              <div className="flex items-center bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
                <span className="text-sm font-bold text-gray-500 mr-2">Bs.</span>
                <input
                  type="number"
                  value={manualUsdtRate}
                  onChange={(e) => setManualUsdtRate(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              ¿Cuánto te están cobrando? ($)
            </label>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
              $
            </span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ej: 200"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg"
            />
          </div>
          {priceValue > 0 && (
            <div className="mt-2 text-right text-xs text-gray-500">
              Son Bs. {costInBs.toLocaleString('es-VE', { maximumFractionDigits: 2 })} a tasa BCV
            </div>
          )}
        </div>

        {/* Promo Price Input (Optional Toggle) */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowPromoInput(!showPromoInput)}
            className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 hover:underline"
          >
            <DollarSign className="w-3 h-3" />
            {showPromoInput ? "Ocultar Promo Divisa" : "Agregar Promo Divisa (Oferta)"}
          </button>
        </div>

        {showPromoInput && (
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2">
                Precio Oferta en Divisas
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-bold text-xs">
                $
              </span>
              <input
                type="number"
                value={promoPrice}
                onChange={(e) => setPromoPrice(e.target.value)}
                placeholder="Ej: 80 (Precio final si pagas en $)"
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              />
            </div>
            <p className="text-[10px] text-blue-600/70 mt-1 ml-1">
              Ingresa el monto total que te cobrarían si pagas directamente en dólares.
            </p>
          </div>
        )}

        {/* Results Scenarios */}
        {priceValue > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="grid grid-cols-1 gap-3">
              
              {/* Option 1: Exchange Cash */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Wallet className="w-3 h-3" />
                    Si cambias los dólares (Efectivo)
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-sm text-emerald-800 dark:text-emerald-200">
                      Te sale en:
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                        ${costIfExchangingCash.toFixed(2)}
                      </div>
                      <div className="text-[10px] font-medium text-emerald-600/80 flex flex-col items-end">
                        <span>Bs. {costInBs.toLocaleString('es-VE', { maximumFractionDigits: 2 })} (Factura)</span>
                        <span className="opacity-75">÷ {activeCashRate.toLocaleString('es-VE', { maximumFractionDigits: 2 })} (Tasa)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-emerald-600/70 mt-1 text-right">
                    Ahorras ${(priceValue - costIfExchangingCash).toFixed(2)} vs pagar {priceValue}
                  </div>
                </div>
              </div>

              {/* Option 2: Exchange USDT */}
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Si cambias el USDT
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-sm text-green-800 dark:text-green-200">
                      Te sale en:
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                        ${costIfExchangingUsdt.toFixed(2)}
                      </div>
                      <div className="text-[10px] font-medium text-green-600/80 flex flex-col items-end">
                        <span>Bs. {costInBs.toLocaleString('es-VE', { maximumFractionDigits: 2 })} (Factura)</span>
                        <span className="opacity-75">÷ {activeUsdtRate.toLocaleString('es-VE', { maximumFractionDigits: 2 })} (Tasa)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-green-600/70 mt-1 text-right">
                    Ahorras ${(priceValue - costIfExchangingUsdt).toFixed(2)} vs pagar {priceValue}
                  </div>
                </div>
              </div>

              {/* Option 3: Promo Divisa (Active) */}
              {promoPriceValue > 0 && (
                <div className="p-4 rounded-xl border relative overflow-hidden transition-all bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800">
                  <div className="relative z-10">
                    <div className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                      <DollarSign className="w-3 h-3" />
                      Promo Divisa (Oferta Especial)
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div className="text-sm text-indigo-800 dark:text-indigo-200">
                        Te sale en:
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                          ${costDirectNoIgtf.toFixed(2)}
                        </div>
                        <div className="text-[10px] font-medium text-indigo-600/80 flex flex-col items-end">
                          <span>Bs. {(costDirectNoIgtf * activeCashRate).toLocaleString('es-VE', { maximumFractionDigits: 2 })} (Equiv.)</span>
                          <span className="opacity-75">Precio fijo ofertado</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs mt-1 text-right font-medium text-indigo-600/70">
                      Ahorras ${(priceValue - costDirectNoIgtf).toFixed(2)} vs precio lista
                    </div>
                  </div>
                </div>
              )}

              {/* Option 4: Direct Pay with IGTF */}
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 relative overflow-hidden opacity-75">
                <div className="relative z-10">
                  <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Pago directo común (+3% IGTF)
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-sm text-red-800 dark:text-red-200">
                      Te sale en:
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                        ${costDirectWithIgtf.toFixed(2)}
                      </div>
                      <div className="text-[10px] font-medium text-red-600/80 flex flex-col items-end">
                        <span>Bs. {(costDirectWithIgtf * activeCashRate).toLocaleString('es-VE', { maximumFractionDigits: 2 })} (Equiv.)</span>
                        <span className="opacity-75">${priceValue} + 3% IGTF</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-red-600/70 mt-1 text-right">
                    La opción más costosa
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};