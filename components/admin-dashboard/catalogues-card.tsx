import { Megaphone, CheckCircle2, Eye } from 'lucide-react';

interface CataloguesCardProps {
  activeCatalogues: number;
}

export function CataloguesCard({ activeCatalogues }: CataloguesCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-5 md:p-6 bg-card border border-border/60 shadow-sm">
      <div className="pointer-events-none absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative flex items-start justify-between mb-6">
        <div className="w-11 h-11 rounded-2xl bg-violet-500/10 flex items-center justify-center">
          <Megaphone className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
        <span className="h-1.5 w-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
      </div>

      <p className="relative text-sm text-muted-foreground mb-1">Catalogues actifs</p>
      <p className="relative text-3xl md:text-4xl font-bold text-foreground tracking-tight">
        {activeCatalogues}
      </p>
      <p className="relative text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5 text-emerald-500" />
        Visible côté client
      </p>
    </div>
  );
}
