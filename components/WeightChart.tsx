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
}

export const WeightChart: React.FC<WeightChartProps> = ({ data, goalWeight, startWeight }) => {
  // Sort data by date
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Custom Dot Component to highlight the last entry
  const CustomDot = (props: any) => {
    const { cx, cy, index } = props;
    const isLast = index === sortedData.length - 1;

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
      <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 border-dashed">
        <p className="text-slate-400">Nog geen data beschikbaar om te tonen</p>
      </div>
    );
  }

  // Calculate domain for Y axis
  const weights = data.map(d => d.weight);
  const minWeight = Math.min(...weights, goalWeight, startWeight) - 2;
  const maxWeight = Math.max(...weights, goalWeight, startWeight) + 2;

  return (
    <div className="w-full h-[400px] bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Gewichtsverloop</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={sortedData}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 10,
          }}
        >
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            stroke="#94a3b8"
            fontSize={12}
            tickMargin={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={[Math.floor(minWeight), Math.ceil(maxWeight)]} 
            stroke="#94a3b8"
            fontSize={12}
            unit=" kg"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--tooltip-bg, #fff)', 
              color: 'var(--tooltip-text, #1e293b)',
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
            }}
            formatter={(value: number) => [`${value} kg`, 'Gewicht']}
            labelFormatter={(label: string) => new Date(label).toLocaleDateString('nl-NL')}
          />
          <Legend iconType="circle" />
          <ReferenceLine y={startWeight} label={{ position: 'insideBottomRight', value: 'Start', fill: '#94a3b8', fontSize: 12 }} stroke="#94a3b8" strokeDasharray="3 3" />
          <ReferenceLine y={goalWeight} label={{ position: 'insideBottomRight', value: 'Doel', fill: '#10b981', fontSize: 12 }} stroke="#10b981" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="weight"
            name="Mijn gewicht"
            stroke="#0d9488"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorWeight)"
            dot={CustomDot}
            activeDot={{ r: 6, fill: "#0f766e", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};