"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRates } from '@/context/RatesContext';
// Banner de fallback de histórico
function HistoryFallbackBanner() {
  const { historyAvailable } = useRates();
  if (historyAvailable) return null;
  return (
    <div className="mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 text-sm">
      Datos históricos no disponibles — mostrando últimas 24h como fallback.
    </div>
  );
}
import { ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react';
import { RatesChart } from '@/components/RatesChart';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function HistoricoPage() {
  const { USDT } = useRates();
  const [yesterdayRate, setYesterdayRate] = useState<number>(0);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetch('/rates_history.json')
      .then(res => res.json())
      .then((data: any[]) => {
        // Find yesterday's rate roughly (last entry or specific date)
        if (data && data.length > 0) {
            // Assuming data is sorted, or finding exactly yesterday
            // For improved accuracy we can look for date match, but last entry is "yesterday" in our logic usually
            // Actually our generated JSON goes up to 2025.
            // But we want the "Latest known history point" to compare with "Live".
            // Since we interpolate, the JSON contains daily points.
            
            // Let's grab the rate from 1 day ago relative to NOW.
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            const dateStr = format(oneDayAgo, 'yyyy-MM-dd');
            const found = data.find(d => d.date === dateStr);
            
            if (found) {
                setYesterdayRate(found.parallel);
            } else {
                // Fallback to last entry if exact date not found
                setYesterdayRate(data[data.length - 1].parallel);
            }
        }
        setLoadingHistory(false);
      })
      .catch((e) => {
        console.error(e);
        setLoadingHistory(false);
      });
  }, []);

  const now = new Date();
  const dateString = format(now, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
  const timeString = format(now, "h:mm a", { locale: es }) + " VET";
  
  // Calculate Diff
  const diff = USDT - yesterdayRate;
  const percentChange = yesterdayRate > 0 ? (diff / yesterdayRate) * 100 : 0;
  const isNegative = diff < 0;

  return (
    <main className="max-w-md mx-auto min-h-screen p-4 pb-20">
      <HistoryFallbackBanner />
      
      {/* Header Back Button */}
      <div className="mb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
      </div>

      {/* Top Summary Card */}
      <div className="bg-[#1b4332] text-white rounded-3xl p-6 shadow-xl mb-6 relative overflow-hidden">
        {/* Background Decorative Gradient/Blur */}
        <div className="absolute top-[-50%] right-[-10%] w-[200px] h-[200px] bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-4 opacity-80">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="font-bold text-lg">$</span>
            </div>
            <div>
                <h2 className="text-[10px] uppercase tracking-widest font-semibold">DÓLAR PARALELO (USDT)</h2>
                <p className="text-[10px] opacity-75">Hoy, {dateString} a las {timeString}</p>
            </div>
        </div>

        <div className="mb-6">
            <h1 className="text-5xl font-bold tracking-tight">
                <span className="text-xl mr-1">Bs.</span>
                {USDT > 0 ? USDT.toFixed(2) : '--'}
            </h1>
        </div>

        {/* Change Box */}
        {yesterdayRate > 0 && (
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-6 ${
                isNegative ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
                 {isNegative ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                 <span>
                    {diff > 0 ? '+' : ''}{diff.toFixed(2)} Bs. 
                    ({percentChange.toFixed(2)}%)
                 </span>
            </div>
        )}

        <div className="text-xs opacity-70 leading-relaxed border-t border-white/10 pt-4">
            <p>
                Hoy, {dateString}, el dólar USDT hoy en Venezuela se cotiza en {USDT.toFixed(2)} Bs. 
                {yesterdayRate > 0 && (
                    <>
                    {' '}En las últimas 24 horas, el precio ha experimentado 
                    {isNegative ? ' una caída ' : ' un aumento '}
                    del {Math.abs(percentChange).toFixed(2)}%, lo que representa {isNegative ? 'una disminución' : 'un incremento'} de {Math.abs(diff).toFixed(2)} Bs.
                    </>
                )}
            </p>
        </div>
      </div>

      {/* Chart Component containing Filters and Stats */}
      <RatesChart />

    </main>
  );
}
