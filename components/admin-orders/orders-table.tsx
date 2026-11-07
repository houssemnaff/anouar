'use client';

import { Order } from '@/lib/types';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Eye, CheckCircle, Search, ShoppingBag, ArrowUpDown, ArrowUp, ArrowDown,
  Inbox, ChevronLeft, ChevronRight, MapPin,
} from 'lucide-react';

type SortKey = 'id' | 'customerName' | 'totalPrice' | 'createdAt' | 'status';

interface OrdersTableProps {
  orders: Order[];
  onMarkAsDelivered: (orderId: string) => void;
  onViewDetails: (orderId: string) => void;
}

const STATUS_BADGES: Record<Order['status'], string> = {
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25',
  delivered: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
};

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'En attente',
  delivered: 'Livrée',
};

export function OrdersTable({ orders, onMarkAsDelivered, onViewDetails }: OrdersTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'delivered'>('all');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = orders;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.customerPhone?.includes(q) ||
          o.deliveryAddress?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') list = list.filter((o) => o.status === statusFilter);

    return [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'totalPrice': cmp = a.totalPrice - b.totalPrice; break;
        case 'status': cmp = a.status.localeCompare(b.status); break;
        case 'customerName': cmp = a.customerName.localeCompare(b.customerName, 'fr'); break;
        case 'createdAt': cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); break;
        default: cmp = a.id.localeCompare(b.id);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [orders, search, sortKey, sortDir, statusFilter]);

  const pageCount = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const resetPage = () => setPage(1);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    resetPage();
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-primary" /> : <ArrowDown className="w-3.5 h-3.5 text-primary" />;
  };

  const StatusBadge = ({ status }: { status: Order['status'] }) => (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_BADGES[status]}`}
    >
      <span className={`w-2 h-2 rounded-full ${status === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
      {STATUS_LABELS[status]}
    </span>
  );

  return (
    <div className="w-full rounded-3xl border border-border/60 bg-card shadow-sm overflow-hidden">
      {/* Barre d'outils */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 px-5 py-4 border-b border-border/60">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground leading-tight">Liste des commandes</p>
            <p className="text-xs text-muted-foreground">
              {filtered.length} sur {orders.length} commande{orders.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 lg:ml-auto">
          <div className="flex rounded-full bg-secondary p-0.5 gap-0.5">
            {[
              { v: 'all', label: 'Toutes' },
              { v: 'pending', label: 'En attente' },
              { v: 'delivered', label: 'Livrées' },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => { setStatusFilter(opt.v as 'all' | 'pending' | 'delivered'); resetPage(); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === opt.v
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              placeholder="Rechercher un client, ID..."
              className="w-full sm:w-60 pl-9 pr-9 py-2 rounded-full border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-lg leading-none"
                aria-label="Effacer"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tableau Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-secondary/50">
              <th className="text-left px-4 py-3">
                <button onClick={() => toggleSort('id')} className="flex items-center gap-1.5 font-semibold text-foreground text-xs uppercase tracking-wide">
                  N° Commande <SortIcon col="id" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button onClick={() => toggleSort('customerName')} className="flex items-center gap-1.5 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Client <SortIcon col="customerName" />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                Adresse
              </th>
              <th className="text-left px-4 py-3">
                <button onClick={() => toggleSort('totalPrice')} className="flex items-center gap-1.5 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Total <SortIcon col="totalPrice" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button onClick={() => toggleSort('createdAt')} className="flex items-center gap-1.5 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Date <SortIcon col="createdAt" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button onClick={() => toggleSort('status')} className="flex items-center gap-1.5 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Statut <SortIcon col="status" />
                </button>
              </th>
              <th className="text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paged.map((order) => (
              <tr key={order.id} className="border-b border-border/40 hover:bg-secondary/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {order.items.length} article{order.items.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="min-w-0 max-w-[180px]">
                    <p className="font-semibold text-foreground text-sm truncate">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-start gap-1.5 text-muted-foreground max-w-[220px]">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <p className="text-xs line-clamp-2">{order.deliveryAddress}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-bold text-foreground">{order.totalPrice.toFixed(3)} DT</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      onClick={() => onViewDetails(order.id)}
                      size="sm"
                      className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Détails
                    </Button>
                    {order.status === 'pending' && (
                      <Button
                        onClick={() => onMarkAsDelivered(order.id)}
                        size="sm"
                        className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Livrer
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-3">
              <Inbox className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground">Aucune commande trouvée</p>
            <p className="text-sm text-muted-foreground">Modifiez la recherche ou les filtres.</p>
          </div>
        )}
      </div>

      {/* Cartes Mobile */}
      <div className="md:hidden divide-y divide-border/40">
        {paged.map((order) => (
          <div key={order.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                  #{order.id.slice(0, 8).toUpperCase()}
                </span>
                <p className="font-semibold text-foreground text-sm mt-0.5">{order.customerName}</p>
                <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex items-start gap-1.5 mt-2 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <p className="text-xs line-clamp-2">{order.deliveryAddress}</p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="font-bold text-foreground">{order.totalPrice.toFixed(3)} DT</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {order.items.length} article{order.items.length !== 1 ? 's' : ''}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={() => onViewDetails(order.id)}
                size="sm"
                className="flex-1 h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1"
              >
                <Eye className="w-3 h-3" />
                Détails
              </Button>
              {order.status === 'pending' && (
                <Button
                  onClick={() => onMarkAsDelivered(order.id)}
                  size="sm"
                  className="flex-1 h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  Livrer
                </Button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <Inbox className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="font-medium text-foreground text-sm">Aucune commande trouvée</p>
          </div>
        )}
      </div>

      {/* Pied de page : pagination */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-border/60">
          <div className="flex items-center gap-3 order-2 sm:order-1">
            <label className="text-xs text-muted-foreground whitespace-nowrap">Afficher</label>
            <div className="flex rounded-full bg-secondary p-0.5 gap-0.5">
              {[10, 20, 50].map((n) => (
                <button
                  key={n}
                  onClick={() => { setPageSize(n); resetPage(); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    pageSize === n
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} sur {filtered.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={safePage === 1}
              className="p-2 rounded-full border border-border text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Page précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1.5 rounded-full bg-primary/10 text-sm font-semibold text-primary min-w-[96px] text-center">
              Page {safePage} / {pageCount}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
              disabled={safePage === pageCount}
              className="p-2 rounded-full border border-border text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Page suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
