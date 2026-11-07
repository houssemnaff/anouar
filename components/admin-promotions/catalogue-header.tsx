import { Plus, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Catalogue } from '@/lib/types';

interface CatalogueHeaderProps {
  onAddCatalogue: () => void;
  catalogues?: Catalogue[];
}

export function CatalogueHeader({ onAddCatalogue, catalogues = [] }: CatalogueHeaderProps) {
  const visible = catalogues.filter((c) => c.visible).length;
  const withPdf = catalogues.filter((c) => c.pdfUrl).length;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-background to-card p-6 md:p-7 shadow-sm">
      <div className="pointer-events-none absolute -top-20 -right-10 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-lg shadow-violet-600/25 flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              <span className="text-foreground">Catalogues & </span>
              <span className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
                Promotions
              </span>
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                {catalogues.length} catalogue{catalogues.length !== 1 ? 's' : ''}
              </span>
              <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-semibold">
                {visible} visible{visible !== 1 ? 's' : ''}
              </span>
              {withPdf > 0 && (
                <span className="rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 text-xs font-semibold">
                  {withPdf} en PDF
                </span>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={onAddCatalogue}
          className="group bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 text-white shadow-lg shadow-violet-600/25 hover:shadow-xl transition-all duration-300 rounded-full gap-2 px-6 h-11 w-full md:w-auto"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          Ajouter un catalogue
        </Button>
      </div>
    </div>
  );
}
