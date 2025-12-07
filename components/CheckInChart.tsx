
import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { DailyCheckIn } from '../types';

interface CheckInChartProps {
  data: DailyCheckIn[];
  isDark?: boolean;
}

export const CheckInChart: React.FC<CheckInChartProps> = ({ data, isDark = false }) => {
  // Config for available metrics (Removed Steps)
  const metrics = [
    { key: 'energy', label: 'Energie', color: '#f59e0b' }, // Amber
    { key: 'mood', label: 'Stemming', color: '#10b981' },   // Emerald
    { key: 'sleep', label: 'Slaap', color: '#6366f1' },     // Indigo
    { key: 'stress', label: 'Stress', color: '#ef4444' },   // Red
    { key: 'strength', label: 'Kracht', color: '#3b82f6' }, // Blue
    { key: 'hunger', label: 'Honger', color: '#8b5cf6' },   // Violet
  ];

  // State to toggle lines (Default: Energy & Mood)
  const [activeMetrics, setActiveMetrics] = useState<string[]>(['energy', 'mood']);

  const toggleMetric = (key: string) => {
    setActiveMetrics(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // Sort data by date
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Theme colors - darker grid for dark mode to prevent "white lines" effect
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9'; // Much darker grid in dark mode
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipText = isDark ? '#f1f5f9' : '#1e293b';
  const tooltipBorder = isDark ? '#334155' : '#f1f5f9';

  if (data.length < 2) {
    return (
      <div className="h-96 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 border-dashed transition-colors duration-300">
        <p className="text-slate-400">Vul minimaal 2 dagen in om trends te zien.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Gezondheidstrends</h3>
      </div>
      
      {/* Filters Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics.map(m => (
          <button
            key={m.key}
            onClick={() => toggleMetric(m.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
              activeMetrics.includes(m.key)
                ? `bg-slate-800 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm`
                : `bg-transparent text-slate-500 border-slate-200 dark:border-slate-700 dark:text-slate-400 hover:border-slate-300`
            }`}
            style={activeMetrics.includes(m.key) ? { backgroundColor: m.color, color: 'white', borderColor: m.color } : {}}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={sortedData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              {metrics.map(m => (
                <linearGradient key={m.key} id={`color-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={m.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={m.color} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate} 
              stroke={axisColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis 
              stroke={axisColor} 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 10]}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: tooltipBg, 
                color: tooltipText,
                borderRadius: '12px', 
                border: `1px solid ${tooltipBorder}`, 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                outline: 'none'
              }}
              labelFormatter={(label) => new Date(label).toLocaleDateString('nl-NL')}
              itemStyle={{ fontSize: '12px' }}
            />
            {metrics.map(m => (
              activeMetrics.includes(m.key) && (
                <Area
                  key={m.key}
                  type="monotone"
                  dataKey={m.key}
                  name={m.label}
                  stroke={m.color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#color-${m.key})`}
                  isAnimationActive={false} // Disable animation on update to prevent blinking
                />
              )
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
