interface CataloguesCardProps {
  activeCatalogues: number;
}

export function CataloguesCard({ activeCatalogues }: CataloguesCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-lg font-bold text-primary mb-4">Catalogues</h2>
      <div className="text-5xl font-bold text-accent mb-2">
        {activeCatalogues}
      </div>
      <p className="text-muted-foreground">
        {activeCatalogues} visible catalogue{activeCatalogues !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
