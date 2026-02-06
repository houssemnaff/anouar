import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-4xl font-bold text-primary">{value}</p>
    </div>
  );
}
