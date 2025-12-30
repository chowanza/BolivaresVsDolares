"use client";

import { RateDashboard } from "@/components/RateDashboard";
import { SmartCalculator } from "@/components/SmartCalculator";
import { Wallet } from "lucide-react";
import { useRates } from "@/context/RatesContext";

export default function Home() {
  const { lastUpdated } = useRates();

  return (
    <main className="max-w-md mx-auto min-h-screen p-4 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 pt-2">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-900 dark:text-white">
              VZLA SMART PAY
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              CUIDA TU DINERO
            </p>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <RateDashboard />

      {/* Calculator */}
      <SmartCalculator />

      {/* Footer Info */}
      <div className="mt-8 space-y-6">
        {/* Disclaimer & Donation */}
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl text-xs text-gray-500 dark:text-gray-400 space-y-3">
          <p className="italic">
            "Estos cálculos son netamente referenciales a discreción del usuario de VzlaSmartPay."
          </p>
          
          <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
            <p className="font-semibold mb-1 text-gray-700 dark:text-gray-300">Apoya el proyecto (Donaciones USDT TRC20):</p>
            <div className="bg-white dark:bg-black p-2 rounded border border-gray-200 dark:border-gray-800 font-mono break-all select-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                 onClick={() => navigator.clipboard.writeText("TGwvm3BjiuiYiNaKNFyZL6q4N9fkXfHs5x")}>
              TGwvm3BjiuiYiNaKNFyZL6q4N9fkXfHs5x
            </div>
            <p className="text-[10px] mt-1 text-center opacity-70">Toca para copiar</p>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 dark:text-gray-600">
          <p>Tasas actualizadas automáticamente.</p>
          {lastUpdated && <p>Última actualización: {lastUpdated}</p>}
          <p className="mt-1">© 2025 VzlaSmartPay</p>
        </div>
      </div>
    </main>
  );
}