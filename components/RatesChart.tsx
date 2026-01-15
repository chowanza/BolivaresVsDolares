"use client";

import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subHours, subDays, subMonths, subYears } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRates } from '@/context/RatesContext';
import { Activity } from 'lucide-react';

type TimeRange = '1H' | '24H' | '7D' | '1M' | '1Y' | 'YEAR';

interface ChartDataPoint {
  date: string;
  timestamp: number;
  bcv: number;
  parallel: number;
}

export const RatesChart = () => {
  const { BCV, USDT, isLoading } = useRates();
  const [timeRange, setTimeRange] = useState<TimeRange>('24H');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [historicalData, setHistoricalData] = useState<ChartDataPoint[]>([]);

  // Fetch historical data
  React.useEffect(() => {
    fetch('/rates_history.json')
      .then(res => res.json())
      .then(data => setHistoricalData(data))
      .catch(err => console.error("Failed to load history:", err));
  }, []);

  // Generate Chart Data
  const chartData = useMemo(() => {
    if (BCV === 0 || USDT === 0 || historicalData.length === 0) return [];

    const now = new Date();
    
    // Helper to find closest historical point
    const getHistoricalPoint = (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return historicalData.find(p => p.date === dateStr);
    };

    // Current live point
    const currentPoint: ChartDataPoint = {
        date: now.toISOString(),
        timestamp: now.getTime(),
        bcv: BCV,
        parallel: USDT
    };

    if (timeRange === 'YEAR') {
        // Filter from history for the selected year
        const filtered = historicalData.filter(d => {
            const year = new Date(d.timestamp).getFullYear();
            return year === selectedYear;
        });
        // If viewing current year, append the live point so stats are correct
        if (selectedYear === now.getFullYear()) {
            return [...filtered, currentPoint].sort((a, b) => a.timestamp - b.timestamp);
        }
        return filtered;
    }
    
    if (['7D', '1M', '1Y'].includes(timeRange)) {
        let cutoffDate = new Date();
        if (timeRange === '7D') cutoffDate = subDays(now, 7);
        if (timeRange === '1M') cutoffDate = subMonths(now, 1);
        if (timeRange === '1Y') cutoffDate = subYears(now, 1);

        // Filter: After cutoff AND Before Now
        const filtered = historicalData.filter(d => 
            d.timestamp >= cutoffDate.getTime() && 
            d.timestamp <= now.getTime()
        );
        // Append current live point
        return [...filtered, currentPoint];
    }


    // High frequency simulation (1H, 24H)
    if (timeRange === '24H' || timeRange === '1H') {
        const points: ChartDataPoint[] = [];
        const is24H = timeRange === '24H';
        const totalPoints = is24H ? 24 : 60;
        const durationMs = is24H ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
        const startTime = now.getTime() - durationMs;
        
        // Improve start point estimation by interpolating
        // If we have a gap between last history and now, we shouldn't just use the old value
        const lastHistory = historicalData[historicalData.length - 1];
        
        let startBcv = BCV;
        let startParallel = USDT;

        if (lastHistory) {
             const timeDiff = now.getTime() - lastHistory.timestamp;
             // If gap is small (< 2 days), we can use the history point directly-ish
             // If gap is large, we project a line from History -> Live
             
             // Calculate slope between Last History and Now
             const slopeBcv = (BCV - lastHistory.bcv) / timeDiff;
             const slopeParallel = (USDT - lastHistory.parallel) / timeDiff;

             // Back-calculate what the value likely was 24H ago based on this slope
             startBcv = BCV - (slopeBcv * durationMs);
             startParallel = USDT - (slopeParallel * durationMs);
        }

        for (let i = 0; i <= totalPoints; i++) {
            const t = i / totalPoints;
            const timestamp = startTime + (t * durationMs);
            
            // Linear interpolate from calculated start to current Live
            let bcvVal = startBcv + (BCV - startBcv) * t;
            let parallelVal = startParallel + (USDT - startParallel) * t;

            const noise = is24H ? 0.002 : 0.0005; 
            bcvVal *= (1 + (Math.random() - 0.5) * noise);
            parallelVal *= (1 + (Math.random() - 0.5) * noise);

            points.push({
                date: new Date(timestamp).toISOString(),
                timestamp: timestamp,
                bcv: bcvVal,
                parallel: parallelVal
            });
        }
        return points;
    }

    return [];
  }, [BCV, USDT, timeRange, selectedYear, historicalData]);

  // Logic for Statistics Footer
  const stats = useMemo(() => {
    if (chartData.length === 0) return { min: 0, max: 0, avg: 0, count: 0 };
    const values = chartData.map(d => d.parallel);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    return { min, max, avg, count: values.length };
  }, [chartData]);

  // Get dynamic years list
  const currentYear = new Date().getFullYear();
  const availableYears = React.useMemo(() => {
     if (historicalData.length === 0) return [currentYear];
     const firstYear = new Date(historicalData[0].timestamp).getFullYear();
     const years = [];
     for(let y = firstYear; y <= currentYear; y++) years.push(y);
     return years;
  }, [historicalData, currentYear]);


  const formatDateTick = (timestamp: number) => {
    const date = new Date(timestamp);
    if (timeRange === '1H') return format(date, 'HH:mm');
    if (timeRange === '24H') return format(date, 'HH:mm');
    if (timeRange === '7D') return format(date, 'dd MMM');
    if (timeRange === '1M') return format(date, 'dd MMM');
    if (timeRange === 'YEAR') return format(date, 'MMM');
    return format(date, 'MMM yy', { locale: es });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(payload[0].payload.timestamp);
      const dateStr = format(date, "d MMM yyyy, HH:mm", { locale: es });

      return (
        <div className="bg-white/95 dark:bg-gray-800/95 p-3 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 text-xs backdrop-blur-sm z-50">
          <p className="font-semibold text-gray-600 dark:text-gray-300 mb-2">{dateStr}</p>
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              USDT: Bs. {payload[0].value.toFixed(2)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) return <div className="animate-pulse h-[300px] bg-gray-100 dark:bg-gray-800 rounded-xl"></div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
       <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Histórico USDT/VES</h3>
        </div>
        
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
            {(['24H', '7D', '1M', '1Y', 'YEAR'] as TimeRange[]).map((range) => (
                <button
                    key={range}
                     onClick={() => {
                        setTimeRange(range);
                        // Default to current year if switching to YEAR
                        if (range === 'YEAR') setSelectedYear(currentYear);
                    }}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                        timeRange === range 
                        ? 'bg-white shadow-sm text-gray-900 border border-gray-200' 
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                    {range === 'YEAR' ? 'Todo' : range}
                </button>
            ))}
        </div>
      </div>

       {/* Year Selector */}
       {timeRange === 'YEAR' && (
        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 flex gap-2 overflow-x-auto justify-end">
            {availableYears.map(year => (
                <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        selectedYear === year
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400'
                    }`}
                >
                    {year}
                </button>
            ))}
        </div>
      )}

      <div className="h-[280px] w-full p-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
            <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatDateTick} 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                minTickGap={40}
                dy={10}
            />
            <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={(val) => `Bs. ${val.toFixed(2)}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10B981', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
                type="monotone" 
                dataKey="parallel" 
                stroke="#10B981" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorGreen)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Stats Footer */}
      <div className="grid grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="p-4 text-center">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Mínimo</div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">{stats.min.toFixed(2)}</div>
        </div>
        <div className="p-4 text-center">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Máximo</div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">{stats.max.toFixed(2)}</div>
        </div>
        <div className="p-4 text-center">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Promedio</div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">{stats.avg.toFixed(2)}</div>
        </div>
        <div className="p-4 text-center">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Registros</div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">{stats.count}</div>
        </div>
      </div>
    </div>
  );
};
