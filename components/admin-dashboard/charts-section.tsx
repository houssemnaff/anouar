'use client';

import { useMemo } from 'react';
import { Product, Order } from '@/lib/types';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  RadialBarChart, RadialBar, PolarAngleAxis,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { ChartPie, Gauge, TrendingUp } from 'lucide-react';

interface ChartsSectionProps {
  products: Product[];
  orders?: Order[];
}

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#f43f5e'];

function ChartCard({
  title,
  subtitle,
  icon: Icon,
  children,
  accent,
  className = '',
}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  children: React.ReactNode;
  accent: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-card border border-border/60 p-5 shadow-sm hover:shadow-lg transition-shadow ${className}`}
    >
      <div className={`pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full ${accent} opacity-10 blur-3xl`} />
      <div className="relative flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl ${accent} bg-opacity-10 flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {children}
    </div>
  );
}

export function ChartsSection({ products, orders = [] }: ChartsSectionProps) {
  // Donut : produits par catégorie
  const categoryData = useMemo(() => {
    const counts = products.reduce((acc, p) => {
      const cat = p.category || 'Sans catégorie';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);

  // Jauge radiale : santé du magasin
  const inStockProducts = products.filter((p) => p.inStock).length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  const gaugeData = useMemo(
    () => [
      { name: 'Produits en stock', value: products.length > 0 ? Math.round((inStockProducts / products.length) * 100) : 0, fill: '#3b82f6' },
      { name: 'Commandes livrées', value: orders.length > 0 ? Math.round((deliveredOrders / orders.length) * 100) : 0, fill: '#10b981' },
      { name: 'Commandes en attente', value: orders.length > 0 ? Math.round((pendingOrders / orders.length) * 100) : 0, fill: '#f59e0b' },
    ],
    [products.length, inStockProducts, orders.length, deliveredOrders, pendingOrders]
  );

  // Aire : commandes des 7 derniers jours
  const ordersTrend = useMemo(() => {
    const days: { date: string; commandes: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = orders.filter((o) => o.createdAt?.slice(0, 10) === key).length;
      days.push({
        date: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
        commandes: count,
      });
    }
    return days;
  }, [orders]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Donut catégories */}
      <ChartCard
        title="Produits par catégorie"
        subtitle={`${categoryData.length} catégorie${categoryData.length !== 1 ? 's' : ''}`}
        icon={ChartPie}
        accent="bg-blue-500"
      >
        <div className="h-[240px] w-full">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="85%"
                  paddingAngle={4}
                  cornerRadius={6}
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgb(0 0 0 / 0.12)' }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center pt-24">Aucun produit</p>
          )}
        </div>
      </ChartCard>

      {/* Jauge radiale */}
      <ChartCard
        title="Santé du magasin"
        subtitle="Taux de disponibilité & livraisons"
        icon={Gauge}
        accent="bg-emerald-500"
      >
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={gaugeData}
              innerRadius="30%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              barSize={12}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background={{ fill: 'rgba(0,0,0,0.05)' }} dataKey="value" cornerRadius={6} />
              <Tooltip
                formatter={(value: number) => [`${value}%`, '']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgb(0 0 0 / 0.12)' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Tendance des commandes */}
      <ChartCard
        title="Commandes — 7 derniers jours"
        subtitle={`${pendingOrders} en attente • ${deliveredOrders} livrées`}
        icon={TrendingUp}
        accent="bg-violet-500"
      >
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ordersTrend}>
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.08} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} opacity={0.6} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} opacity={0.6} width={24} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgb(0 0 0 / 0.12)' }}
              />
              <Area
                type="monotone"
                dataKey="commandes"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                fill="url(#ordersGradient)"
                dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                name="Commandes"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
