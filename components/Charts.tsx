import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { DrinkRecord, DrinkType, TypeStats } from '../types';
import { DRINK_CONFIG } from '../constants';

interface ChartsProps {
  data: DrinkRecord[];
}

export const ConsumptionCharts: React.FC<ChartsProps> = ({ data }) => {
  // Aggregate data for Pie Chart
  const typeData: TypeStats[] = [
    { name: 'Chupitos', value: 0, fill: DRINK_CONFIG[DrinkType.CHUPITO].chartColor },
    { name: 'Cervezas', value: 0, fill: DRINK_CONFIG[DrinkType.CERVEZA].chartColor },
    { name: 'Cubatas', value: 0, fill: DRINK_CONFIG[DrinkType.CUBATA].chartColor },
  ];

  data.forEach(d => {
    if (d.type === DrinkType.CHUPITO) typeData[0].value++;
    if (d.type === DrinkType.CERVEZA) typeData[1].value++;
    if (d.type === DrinkType.CUBATA) typeData[2].value++;
  });

  // Aggregate data for Bar Chart (Last 7 days approx, simplified grouping)
  // Grouping by Month for the yearly view requested
  const monthData = Array.from({ length: 12 }, (_, i) => {
    return {
      name: new Date(0, i).toLocaleDateString('es-ES', { month: 'short' }),
      monthIndex: i,
      total: 0
    };
  });

  data.forEach(d => {
    const month = new Date(d.timestamp).getMonth();
    if (monthData[month]) {
      monthData[month].total++;
    }
  });

  // Helper for custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg shadow-xl">
          <p className="font-bold text-zinc-200">{label}</p>
          <p className="text-zinc-400">Cantidad: <span className="text-white font-bold">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      
      {/* Distribution Pie Chart */}
      <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-300 mb-6">Distribución por Tipo</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          {typeData.map((type, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.fill }} />
              <span className="text-sm text-zinc-400">{type.name} ({type.value})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Yearly Trend Bar Chart */}
      <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800">
        <h3 className="text-lg font-bold text-zinc-300 mb-6">Tendencia Anual</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthData}>
              <XAxis 
                dataKey="name" 
                stroke="#71717a" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                content={<CustomTooltip />}
              />
              <Bar dataKey="total" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};