'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Menu, X, LogOut, LayoutDashboard, Package, Percent, ShoppingBag,
  ChevronRight, ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AdminHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminHeader({ activeTab, onTabChange }: AdminHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de se déconnecter",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!",
      });

      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', short: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produits', short: 'Produits', icon: Package },
    { id: 'promotions', label: 'Promotions', short: 'Promos', icon: Percent },
    { id: 'orders', label: 'Commandes', short: 'Commandes', icon: ShoppingBag },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Profil Admin */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo — même rendu que le header public */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                <img
                  src="/anouar1-removebg-preview.png"
                  alt="Logo Anouar Market"
                  className="w-10 h-10 object-contain"
                />
              </div>
            </Link>

            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-bold leading-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent truncate">
                Anouar Market
              </h1>
              <p className="text-[10px] md:text-xs font-medium text-blue-600/70 truncate">
                Espace Admin
              </p>
            </div>

            {/* Lien vers le site */}
            <Link
              href="/"
              className="hidden lg:inline-flex items-center gap-1.5 ml-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Voir le site
            </Link>
          </div>

          {/* Navigation Desktop : pilule */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-border bg-secondary/70 p-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-600/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all duration-300 px-2 md:px-3 gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Déconnexion</span>
            </Button>

            {/* Menu mobile */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-secondary transition-colors text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation Mobile */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-3 pt-3 space-y-1.5 border-t border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-600/25'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span className="flex-1">{tab.label}</span>
                  <ChevronRight className={`w-4 h-4 transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`} />
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
