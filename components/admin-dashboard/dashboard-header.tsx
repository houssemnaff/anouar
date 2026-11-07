'use client';

import Link from 'next/link';
import { Package, Percent, ShoppingBag, ArrowRight, Store } from 'lucide-react';

interface DashboardHeaderProps {
  onNavigate?: (tab: string) => void;
}

export function DashboardHeader({ onNavigate }: DashboardHeaderProps) {
  const date = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const actions = [
    { label: 'Produits', icon: Package, tab: 'products' },
    { label: 'Promotions', icon: Percent, tab: 'promotions' },
    { label: 'Commandes', icon: ShoppingBag, tab: 'orders' },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-background to-card p-6 md:p-8 shadow-sm">
      {/* Décor lumineux */}
      <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 mb-3">
            <Store className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground capitalize">
              {date}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold leading-tight">
            <span className="text-foreground">Tableau de bord</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Anouar Market
            </span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos produits, promotions et commandes en un coup d'œil.
          </p>
        </div>

        {/* Accès rapide */}
        {onNavigate && (
          <div className="grid grid-cols-3 gap-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.tab}
                  onClick={() => onNavigate(action.tab)}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card/80 hover:border-primary/40 hover:shadow-md transition-all px-3 py-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground flex items-center gap-1">
                    {action.label}
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
