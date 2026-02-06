'use client';

import { Product } from '@/lib/types';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ChartsSectionProps {
  products: Product[];
}

export function ChartsSection({ products }: ChartsSectionProps) {
  // Group products by category
  const categoryData = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Répartition par Catégorie</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }} 
              interval={0} 
              angle={-45} 
              textAnchor="end"
              height={70}
            />
            <YAxis allowDecimals={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              cursor={{ fill: '#f3f4f6' }}
            />
            <Bar 
              dataKey="value" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]} 
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
