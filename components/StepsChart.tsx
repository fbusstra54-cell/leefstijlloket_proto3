
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { DailyCheckIn } from '../types';

interface StepsChartProps {
  data: DailyCheckIn[];
  isDark?: boolean;
}

export const StepsChart: React.FC<StepsChartProps> = ({ data, isDark = false }) => {
  // Sort data by date
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Theme colors
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipText = isDark ? '#f1f5f9' : '#1e293b';
  const tooltipBorder = isDark ? '#334155' : '#f1f5f9';

  if (data.length < 2) {
    return null; // Don't show if not enough data, or render empty state
  }

  // Filter out entries with 0 steps to make chart look better if steps aren't logged every day
  const stepsData = sortedData.filter(d => d.steps !== undefined && d.steps > 0);

  if (stepsData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 mb-8">
            <p className="text-slate-400">Nog geen stappen geregistreerd.</p>
        </div>
      )
  }

  return (
    <div className="w-full bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Stappen Activiteit</h3>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={stepsData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
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
            />
            <Tooltip
              cursor={{fill: isDark ? '#334155' : '#f1f5f9', opacity: 0.4}}
              contentStyle={{ 
                backgroundColor: tooltipBg, 
                color: tooltipText,
                borderRadius: '12px', 
                border: `1px solid ${tooltipBorder}`, 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                outline: 'none'
              }}
              labelFormatter={(label) => new Date(label).toLocaleDateString('nl-NL')}
              formatter={(value: number) => [`${value} stappen`, 'Stappen']}
              itemStyle={{ fontSize: '12px', color: '#14b8a6' }}
            />
            <Bar 
                dataKey="steps" 
                fill="#14b8a6" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
