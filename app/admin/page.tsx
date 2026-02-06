'use client';

import { useState } from 'react';
import { AdminHeader } from '@/components/admin-header';
import { AdminDashboard } from '@/components/admin-dashboard';
import { AdminProducts } from '@/components/admin-products';
import { AdminPromotions } from '@/components/admin-promotions';
import { AdminOrders } from '@/components/admin-orders';
import { AuthGuard } from '@/components/auth-guard';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AuthGuard>
      <main className="min-h-screen bg-background">
        <AdminHeader activeTab={activeTab} onTabChange={setActiveTab} />

        <section className="container mx-auto px-4 py-8">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'promotions' && <AdminPromotions />}
          {activeTab === 'orders' && <AdminOrders />}
        </section>
      </main>
    </AuthGuard>
  );
}
