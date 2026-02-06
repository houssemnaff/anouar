'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AdminHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminHeader({ activeTab, onTabChange }: AdminHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('Admin');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };

    getUserEmail();
  }, []);

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
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'products', label: 'Products' },
    { id: 'promotions', label: 'Promotions' },
    { id: 'orders', label: 'Orders' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-b border-blue-500">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity min-w-0 max-w-[60%]">
            <div className="relative w-10 h-10 md:w-12 md:h-12 bg-white rounded-full p-1 shadow-md flex-shrink-0">
              <Image 
                src="/anouar1-removebg-preview.png" 
                alt="Anouar Market Logo" 
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <h1 className="text-sm md:text-lg font-bold truncate leading-tight">
                {userEmail}
              </h1>
              <p className="text-[10px] md:text-xs text-blue-100 hidden sm:block truncate">
                Anouar Market
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'hover:bg-blue-500 text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 ml-2">
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-500 rounded-lg transition-all duration-300 px-2 md:px-3"
            >
              <LogOut className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Déconnexion</span>
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-blue-500 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 space-y-2 border-t border-blue-500">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'hover:bg-blue-500 text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}