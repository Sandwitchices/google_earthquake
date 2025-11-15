
import React, { useMemo } from 'react';
import { Earthquake } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MagnitudeChartProps {
  data: Earthquake[];
}

const MagnitudeChart: React.FC<MagnitudeChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const bins = {
      '3.0-3.9': 0,
      '4.0-4.9': 0,
      '5.0-5.9': 0,
      '6.0+': 0,
    };

    data.forEach(eq => {
      if (eq.magnitude < 4) bins['3.0-3.9']++;
      else if (eq.magnitude < 5) bins['4.0-4.9']++;
      else if (eq.magnitude < 6) bins['5.0-5.9']++;
      else bins['6.0+']++;
    });

    return Object.entries(bins).map(([name, count]) => ({ name, count }));
  }, [data]);

  const colors = ['#22c55e', '#facc15', '#f97316', '#ef4444'];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
          <YAxis allowDecimals={false} tick={{ fill: '#9ca3af' }} />
          <Tooltip 
            cursor={{fill: 'rgba(255, 255, 255, 0.1)'}}
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#d1d5db' }}
          />
          <Bar dataKey="count" fill="#8884d8" barSize={30}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MagnitudeChart;
