
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { WeightEntry } from '../types';

interface WeightChartProps {
  data: WeightEntry[];
  goalWeight: number;
  startWeight: number;
  isDark?: boolean;
  minimal?: boolean; // New prop for dashboard widget
}

export const WeightChart: React.FC<WeightChartProps> = ({ data, goalWeight, startWeight, isDark = false, minimal = false }) => {
  // Sort data by date
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Colors based on theme
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipText = isDark ? '#f1f5f9' : '#1e293b';
  const tooltipBorder = isDark ? '#334155' : '#f1f5f9';

  // Custom Dot Component to highlight the last entry
  const CustomDot = (props: any) => {
    const { cx, cy, index } = props;
    const isLast = index === sortedData.length - 1;

    if (minimal && !isLast) return null; // Only show last dot in minimal mode

    if (isLast) {
      return (
        <svg x={cx - 12} y={cy - 12} width={24} height={24} className="overflow-visible">
          {/* Pulsing outer ring */}
          <circle cx="12" cy="12" r="12" className="fill-teal-500/30 animate-ping origin-center" />
          {/* Solid outer ring */}
          <circle cx="12" cy="12" r="8" className="fill-teal-600" />
          {/* White center */}
          <circle cx="12" cy="12" r="3" className="fill-white" />
        </svg>
      );
    }

    // Standard dot for previous entries
    return (
      <circle cx={cx} cy={cy} r={3} className="fill-white stroke-teal-500 stroke-[1.5]" />
    );
  };

  if (data.length === 0) {
    return (
      <div className={`${minimal ? 'h-32' : 'h-64'} flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 border-dashed transition-colors duration-300`}>
        <p className="text-slate-400 text-sm">Geen data</p>
      </div>
    );
  }

  // Calculate domain for Y axis
  const weights = data.map(d => d.weight);
  const minWeight = Math.min(...weights, goalWeight, startWeight) - 2;
  const maxWeight = Math.max(...weights, goalWeight, startWeight) + 2;

  // Minimal mode classes
  const containerClasses = minimal 
    ? "w-full h-40 select-none cursor-pointer" 
    : "w-full h-[400px] bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300 select-none";

  return (
    <div className={containerClasses}>
      {!minimal && <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Gewichtsverloop</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={sortedData}
          margin={{
            top: minimal ? 5 : 20,
            right: minimal ? 5 : 30,
            left: minimal ? -20 : 0, // Pull chart to left in minimal
            bottom: minimal ? 0 : 10,
          }}
        >
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          {!minimal && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />}
          
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            stroke={axisColor}
            fontSize={10}
            tickMargin={10}
            tickLine={false}
            axisLine={false}
            hide={minimal}
          />
          <YAxis 
            domain={[Math.floor(minWeight), Math.ceil(maxWeight)]} 
            stroke={axisColor}
            fontSize={10}
            unit={minimal ? "" : " kg"}
            tickLine={false}
            axisLine={false}
            hide={minimal}
          />
          
          {!minimal && (
            <Tooltip 
              contentStyle={{ 
                backgroundColor: tooltipBg, 
                color: tooltipText,
                borderRadius: '12px', 
                border: `1px solid ${tooltipBorder}`, 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                outline: 'none'
              }}
              cursor={{ stroke: axisColor, strokeWidth: 1 }}
              formatter={(value: number) => [`${value} kg`, 'Gewicht']}
              labelFormatter={(label: string) => new Date(label).toLocaleDateString('nl-NL')}
              itemStyle={{ color: isDark ? '#fff' : '#1e293b' }}
            />
          )}
          
          {!minimal && <Legend iconType="circle" wrapperStyle={{ color: axisColor }} />}
          
          <ReferenceLine 
            y={goalWeight} 
            stroke="#10b981" 
            strokeDasharray="3 3" 
            strokeWidth={1}
          />
          
          <Area
            type="monotone"
            dataKey="weight"
            name="Mijn gewicht"
            stroke="#0d9488"
            strokeWidth={minimal ? 2 : 3}
            fillOpacity={1}
            fill="url(#colorWeight)"
            dot={CustomDot}
            activeDot={{ r: 6, fill: "#0f766e", stroke: "#fff", strokeWidth: 2 }}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
