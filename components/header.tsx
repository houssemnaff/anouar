'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { ShoppingCart, Menu, X, Package, ShoppingBag, Percent } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AdminLoginModal } from '@/components/admin-login-modal';

export function Header() {
  const { cart } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <AdminLoginModal />
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
    <img 
      src="/anouar1-removebg-preview.png" 
      alt="Anouar Market Logo" 
      className="w-10 h-10 object-contain"
    />
  </div>
  <div>
    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
      Anouar Market
    </h1>
    <p className="text-xs text-blue-600/70 font-medium">
      Fresh Groceries Delivered
    </p>
  </div>
</Link>

            {/* Desktop Navigation - Removed from center */}

            {/* Right Side Icons */}
            <div className="flex items-center gap-2">
              {/* Shop Link with Icon */}
              <Link href="/products">
  <Button variant="ghost" className="hidden md:flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">
    <ShoppingBag className="w-5 h-5" />
    <span className="font-medium">Produits</span>
  </Button>
</Link>

              {/* Sales Link with Icon */}
              <Link href="/sales">
                <Button variant="ghost" className="hidden md:flex items-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors">
                  <Percent className="w-5 h-5" />
                  <span className="font-medium">Soldes</span>
                </Button>
              </Link>

              {/* Cart Icon */}
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden"
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
            <nav className="md:hidden mt-4 pb-4 space-y-2 border-t border-border pt-4">
              <Link
                href="/products"
                className="block text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Produits
              </Link>
              <Link
                href="/sales"
                className="block text-foreground hover:text-red-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Soldes
              </Link>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
