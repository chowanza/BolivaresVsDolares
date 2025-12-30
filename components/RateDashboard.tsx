"use client";

import React from 'react';
import { useRates } from '@/context/RatesContext';
import { TrendingUp, DollarSign, Banknote } from 'lucide-react';

export const RateDashboard = () => {
  const { BCV, USDT, CASH, isLoading, error } = useRates();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        ))}
      </div>
    );
  }

  const spread = BCV > 0 ? ((USDT - BCV) / BCV) * 100 : 0;

  return (
    <div className="grid grid-cols-2 gap-3 mb-8">
      {error && (
        <div className="col-span-full p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {/* BCV USD */}
      <div className="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Tasa BCV</span>
          <Banknote className="w-4 h-4 text-blue-500" />
        </div>
        <div className="text-xl font-bold text-gray-900 dark:text-white">
          {BCV > 0 ? `Bs. ${BCV.toFixed(2)}` : '--'}
        </div>
        <div className="text-[10px] text-gray-500 mt-1">Dólar Oficial</div>
      </div>

      {/* USDT */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">USDT</span>
          <TrendingUp className="w-4 h-4 text-green-500" />
        </div>
        <div className="text-xl font-bold text-gray-900 dark:text-white">
          {USDT > 0 ? `Bs. ${USDT.toFixed(2)}` : '--'}
        </div>
        <div className="text-[10px] text-green-600 mt-1">
          {BCV > 0 ? `+${spread.toFixed(1)}% Brecha` : '--'}
        </div>
      </div>

      {/* CASH */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Efectivo</span>
          <DollarSign className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-xl font-bold text-gray-900 dark:text-white">
          {CASH > 0 ? `Bs. ${CASH.toFixed(2)}` : '--'}
        </div>
        <div className="text-[10px] text-gray-500 mt-1">Estimado (Redondeo)</div>
      </div>
    </div>
  );
};