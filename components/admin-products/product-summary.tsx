'use client';

import { Product } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PackageCheck, PackageX, Tag, Wallet } from 'lucide-react';

interface ProductSummaryProps {
  products: Product[];
}

export function ProductSummary({ products }: ProductSummaryProps) {
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = products.length - inStockCount;
  const onSaleCount = products.filter((p) => (p.discount ?? 0) > 0).length;
  const stockValue = products.reduce((sum, p) => sum + p.price * (p.quantity ?? 0), 0);

  const donutData = [
    { name: 'En stock', value: inStockCount, color: '#10b981' },
    { name: 'En rupture', value: outOfStockCount, color: '#f43f5e' },
  ].filter((d) => d.value > 0);

  const stats = [
    { label: 'En stock', value: inStockCount, icon: PackageCheck, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' },
    { label: 'En rupture', value: outOfStockCount, icon: PackageX, color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10' },
    { label: 'En promotion', value: onSaleCount, icon: Tag, color: 'text-orange-600 dark:text-orange-400 bg-orange-500/10' },
    { label: 'Valeur du stock', value: `${stockValue.toFixed(3)} DT`, icon: Wallet, color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/60 bg-card p-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 ${stat.color}`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-foreground leading-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        );
      })}

      {/* Mini donut disponibilité */}
      <div className="col-span-2 lg:col-span-1 rounded-2xl border border-border/60 bg-card p-4 flex items-center gap-3">
        <div className="w-20 h-20 flex-shrink-0 relative">
          {donutData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  innerRadius="68%"
                  outerRadius="100%"
                  paddingAngle={3}
                  cornerRadius={4}
                  stroke="none"
                >
                  {donutData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full rounded-full bg-secondary" />
          )}
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
            {products.length > 0 ? Math.round((inStockCount / products.length) * 100) : 0}%
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground">Disponibilité</p>
          <div className="flex items-center gap-2 mt-1.5 text-[11px]">
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {inStockCount}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              {outOfStockCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
