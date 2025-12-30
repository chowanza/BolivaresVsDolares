"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DolarApiRate, RatesData } from '@/lib/types';

const RatesContext = createContext<RatesData>({
  BCV: 0,
  EUR_BCV: 0,
  USDT: 0,
  CASH: 0,
  lastUpdated: '',
  isLoading: true,
  error: null,
});

export const useRates = () => useContext(RatesContext);

export const RatesProvider = ({ children }: { children: React.ReactNode }) => {
  const [rates, setRates] = useState<RatesData>({
    BCV: 0,
    EUR_BCV: 0,
    USDT: 0,
    CASH: 0,
    lastUpdated: '',
    isLoading: true,
    error: null,
  });

  const fetchRates = async () => {
    try {
      // Fetch USD rates (Critical)
      const responseUSD = await fetch('https://ve.dolarapi.com/v1/dolares');
      if (!responseUSD.ok) throw new Error('Error al obtener las tasas USD');
      const dataUSD: DolarApiRate[] = await responseUSD.json();
      
      const oficialUSD = dataUSD.find(r => r.fuente === 'oficial');
      const paraleloUSD = dataUSD.find(r => r.fuente === 'paralelo');

      if (!oficialUSD || !paraleloUSD) throw new Error('Datos incompletos');

      // Fetch Euro rates (Optional - Don't break if fails)
      let euroRate = 0;
      try {
        const responseEUR = await fetch('https://ve.dolarapi.com/v1/euros');
        if (responseEUR.ok) {
          const dataEUR: DolarApiRate[] = await responseEUR.json();
          const oficialEUR = dataEUR.find(r => r.fuente === 'oficial');
          if (oficialEUR) euroRate = oficialEUR.promedio;
        }
      } catch (e) {
        console.warn('Error fetching Euro rates', e);
      }

      setRates({
        BCV: oficialUSD.promedio,
        EUR_BCV: euroRate,
        USDT: paraleloUSD.promedio, 
        // Regla de negocio: Redondear hacia abajo al múltiplo de 10 más cercano (ej: 547 -> 540)
        CASH: Math.floor(paraleloUSD.promedio / 10) * 10, 
        lastUpdated: new Date().toLocaleString('es-VE'),
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error(err);
      setRates(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al conectar con la API. No se pueden mostrar tasas reales.',
        BCV: 0,
        EUR_BCV: 0,
        USDT: 0,
        CASH: 0,
      }));
    }
  };

  useEffect(() => {
    fetchRates();
    // Refresh every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <RatesContext.Provider value={rates}>
      {children}
    </RatesContext.Provider>
  );
};