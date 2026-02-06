'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function AdminLoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const router = useRouter();

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Login error:', error);
        setError('Email ou mot de passe incorrect');
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Login successful
        setIsOpen(false);
        setPassword('');
        setEmail('');
        setError('');
        router.push('/admin');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard shortcut: Ctrl+Shift+A
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsOpen(true);
      }
      // ESC pour fermer
      if (e.key === 'Escape') {
        setIsOpen(false);
        setPassword('');
        setError('');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Swipe detection for mobile
  const onTouchStart = useCallback((e: TouchEvent) => {
    // Seulement si le touch commence en bas de l'écran (80% en bas)
    const screenHeight = window.innerHeight;
    const touchY = e.targetTouches[0].clientY;
    
    if (touchY > screenHeight * 0.8) {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    }
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (touchStart !== null) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
  }, [touchStart]);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;

    if (isLeftSwipe) {
      setIsOpen(true);
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd]);

  useEffect(() => {
    // Only add touch listeners on mobile devices
    if (window.innerWidth <= 768) {
      document.addEventListener('touchstart', onTouchStart);
      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchend', onTouchEnd);

      return () => {
        document.removeEventListener('touchstart', onTouchStart);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
      };
    }
  }, [onTouchStart, onTouchMove, onTouchEnd]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={() => {
          setIsOpen(false);
          setPassword('');
          setError('');
        }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-card border border-border rounded-2xl p-8 w-full max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary">Admin Login</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Desktop: Ctrl+Shift+A | Mobile: Swipe left from bottom
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setPassword('');
                setError('');
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Entrez votre email"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Entrez votre mot de passe"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
                autoFocus
              />
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full rounded-lg">
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
