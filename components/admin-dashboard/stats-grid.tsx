import { Package, ShoppingCart, Tag, TrendingUp } from 'lucide-react';
import { StatCard } from './stat-card';

interface StatsGridProps {
  totalProducts: number;
  inStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
}

export function StatsGrid({
  totalProducts,
  inStockProducts,
  totalOrders,
  pendingOrders,
}: StatsGridProps) {
  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'In Stock',
      value: inStockProducts,
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: Tag,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}
