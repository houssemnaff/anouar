import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

const gradients: Record<string, string> = {
  'bg-blue-100 text-blue-600': 'from-blue-500 to-cyan-500 shadow-blue-500/25',
  'bg-green-100 text-green-600': 'from-emerald-500 to-teal-500 shadow-emerald-500/25',
  'bg-purple-100 text-purple-600': 'from-violet-500 to-purple-500 shadow-violet-500/25',
  'bg-orange-100 text-orange-600': 'from-orange-500 to-amber-500 shadow-orange-500/25',
};

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const gradient = gradients[color] || 'from-primary to-cyan-500 shadow-primary/25';

  return (
    <div className="group relative overflow-hidden bg-card border border-border/60 rounded-3xl p-5 md:p-6 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300">
      {/* Glow */}
      <div className={`pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${gradient} opacity-15 blur-2xl`} />

      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {/* Barre décorative */}
        <span className={`h-1.5 w-10 rounded-full bg-gradient-to-r ${gradient}`} />
      </div>

      <div className="flex items-end justify-between">
        <p className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
          {value}
        </p>
        <div
          className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
