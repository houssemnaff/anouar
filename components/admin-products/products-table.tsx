'use client';

import { Product } from '@/lib/types';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Edit, Trash2, Search, Package, ArrowUpDown, ArrowUp, ArrowDown, Inbox, ChevronLeft, ChevronRight,
} from 'lucide-react';

const CATEGORY_COLORS = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-violet-100 text-violet-700 border-violet-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-cyan-100 text-cyan-700 border-cyan-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-rose-100 text-rose-700 border-rose-200',
];

function getCategoryColor(category: string): string {
  if (!category) return 'bg-gray-100 text-gray-700 border-gray-200';
  let hash = 0;
  for (let i = 0; i < category.length; i++) hash = category.charCodeAt(i) + ((hash << 5) - hash);
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
}

type SortKey = 'name' | 'price' | 'quantity' | 'category' | 'inStock';

interface ProductsTableProps {
  products: Product[];
  onEdit: (productId: string) => void;
  onDelete?: (productId: string) => void;
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [stockFilter, setStockFilter] = useState<'all' | 'in' | 'out'>('all');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = products;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    if (stockFilter === 'in') list = list.filter((p) => p.inStock);
    if (stockFilter === 'out') list = list.filter((p) => !p.inStock);

    const sorted = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'price': cmp = a.price - b.price; break;
        case 'quantity': cmp = (a.quantity ?? 0) - (b.quantity ?? 0); break;
        case 'inStock': cmp = Number(a.inStock) - Number(b.inStock); break;
        case 'category': cmp = (a.category || '').localeCompare(b.category || '', 'fr'); break;
        default: cmp = a.name.localeCompare(b.name, 'fr');
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [products, search, sortKey, sortDir, stockFilter]);

  // Pagination
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

  const PriceCell = ({ p }: { p: Product }) => {
    const hasDiscount = (p.discount ?? 0) > 0;
    const finalPrice = hasDiscount ? p.price * (1 - p.discount! / 100) : p.price;
    return (
      <div className="flex flex-col leading-tight">
        {hasDiscount && (
          <span className="text-xs text-muted-foreground line-through">{p.price.toFixed(3)} DT</span>
        )}
        <span className={`font-semibold ${hasDiscount ? 'text-red-500' : 'text-foreground'}`}>
          {finalPrice.toFixed(3)} DT
        </span>
      </div>
    );
  };

  const StockBadge = ({ inStock }: { inStock: boolean }) => (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
        inStock
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-rose-500'} ${inStock ? 'animate-pulse' : ''}`} />
      {inStock ? 'En stock' : 'En rupture'}
    </span>
  );

  return (
    <div className="w-full rounded-3xl border border-border/60 bg-card shadow-sm overflow-hidden">
      {/* Barre d'outils */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 px-5 py-4 border-b border-border/60">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Package className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground leading-tight">Liste des produits</p>
            <p className="text-xs text-muted-foreground">
              {filtered.length} sur {products.length} produit{products.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 lg:w-auto lg:ml-auto">
          {/* Filtre stock */}
          <div className="flex rounded-full bg-secondary p-0.5 gap-0.5">
            {[
              { v: 'all', label: 'Tous' },
              { v: 'in', label: 'En stock' },
              { v: 'out', label: 'Rupture' },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => { setStockFilter(opt.v as 'all' | 'in' | 'out'); resetPage(); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  stockFilter === opt.v
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              placeholder="Rechercher un produit..."
              className="w-full sm:w-60 pl-9 pr-3 py-2 rounded-full border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
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
                <button onClick={() => toggleSort('name')} className="flex items-center gap-1.5 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Produit <SortIcon col="name" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button onClick={() => toggleSort('category')} className="flex items-center gap-1.5 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Catégorie <SortIcon col="category" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button onClick={() => toggleSort('price')} className="flex items-center gap-1.5 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Prix <SortIcon col="price" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button onClick={() => toggleSort('quantity')} className="flex items-center gap-1.5 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Quantité <SortIcon col="quantity" />
                </button>
              </th>
              <th className="text-left px-4 py-3">
                <button onClick={() => toggleSort('inStock')} className="flex items-center gap-1.5 font-semibold text-foreground text-xs uppercase tracking-wide">
                  Statut <SortIcon col="inStock" />
                </button>
              </th>
              <th className="text-right px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paged.map((p) => (
              <tr key={p.id} className="border-b border-border/40 hover:bg-secondary/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image || '/products/placeholder.jpg'}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover border border-border/50 flex-shrink-0"
                    />
                    <div className="min-w-0 max-w-[260px]">
                      <p className="font-semibold text-foreground text-sm truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(p.category)}`}>
                    {p.category}
                  </span>
                </td>
                <td className="px-4 py-3"><PriceCell p={p} /></td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-foreground">{p.quantity ?? 0}</span>
                  <span className="text-xs text-muted-foreground ml-1">unité{(p.quantity ?? 0) !== 1 ? 's' : ''}</span>
                </td>
                <td className="px-4 py-3"><StockBadge inStock={p.inStock} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      onClick={() => onEdit(p.id)}
                      size="sm"
                      className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Modifier
                    </Button>
                    {onDelete && (
                      <Button
                        onClick={() => onDelete(p.id)}
                        size="sm"
                        variant="outline"
                        className="h-9 px-3 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 font-medium text-xs gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Supprimer
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
            <p className="font-medium text-foreground">Aucun produit trouvé</p>
            <p className="text-sm text-muted-foreground">Modifiez la recherche ou les filtres.</p>
          </div>
        )}
      </div>

      {/* Cartes Mobile */}
      <div className="md:hidden divide-y divide-border/40">
        {paged.map((p) => (
          <div key={p.id} className="p-4 flex gap-3">
            <img
              src={p.image || '/products/placeholder.jpg'}
              alt={p.name}
              className="w-14 h-14 rounded-xl object-cover border border-border/50 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-foreground text-sm truncate">{p.name}</p>
                <StockBadge inStock={p.inStock} />
              </div>
              <span className={`inline-flex mt-1.5 items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${getCategoryColor(p.category)}`}>
                {p.category}
              </span>
              <div className="flex items-end justify-between mt-2">
                <PriceCell p={p} />
                <span className="text-xs text-muted-foreground">Qty : {p.quantity ?? 0}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={() => onEdit(p.id)}
                  size="sm"
                  className="flex-1 h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Modifier
                </Button>
                {onDelete && (
                  <Button
                    onClick={() => onDelete(p.id)}
                    size="sm"
                    variant="outline"
                    className="flex-1 h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-600 text-xs gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Supprimer
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <Inbox className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="font-medium text-foreground text-sm">Aucun produit trouvé</p>
          </div>
        )}
      </div>

      {/* Pied de page : pagination */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-border/60">
          {/* Par page + résultat */}
          <div className="flex items-center gap-3 order-2 sm:order-1">
            <label className="text-xs text-muted-foreground whitespace-nowrap">
              Afficher
            </label>
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

          {/* Pages */}
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
