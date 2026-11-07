'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store-context';
import {
  PackagePlus, X, Upload, ImageIcon, DollarSign, Hash, Percent, Save, RotateCcw,
} from 'lucide-react';

interface NewProduct {
  name: string;
  price: string;
  category: string;
  description: string;
  inStock: boolean;
  quantity: string;
  discount: string;
  image: string;
}

interface ProductFormProps {
  formData: NewProduct;
  isEditing: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onImageFileChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const FALLBACK_CATEGORIES = ['Cosmétiques', 'Soins', 'Parfums', 'Maquillage', 'Accessoires'];

export function ProductForm({
  formData,
  isEditing,
  onInputChange,
  onImageFileChange,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const { products } = useStore();
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [imagePreview, setImagePreview] = useState<string>(formData.image || '/products/placeholder.jpg');
  const [isDragging, setIsDragging] = useState(false);

  // Update preview when formData.image changes (for edit mode)
  React.useEffect(() => {
    setImagePreview(formData.image || '/products/placeholder.jpg');
  }, [formData.image]);

  const categories = React.useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    const all = Array.from(new Set([...FALLBACK_CATEGORIES, ...unique]));
    all.sort((a, b) => a.localeCompare(b, 'fr'));
    if (formData.category && !all.includes(formData.category)) all.push(formData.category);
    return all;
  }, [products, formData.category]);

  const acceptImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image');
      return;
    }
    onImageFileChange(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) acceptImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) acceptImage(file);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '__add_new__') {
      setIsAddingNewCategory(true);
      setNewCategoryName('');
    } else {
      setIsAddingNewCategory(false);
      onInputChange(e);
    }
  };

  const handleNewCategoryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewCategoryName(value);
    const syntheticEvent = {
      target: { name: 'category', value },
    } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(syntheticEvent as any);
  };

  const labelCls = 'block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2';
  const inputCls =
    'w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-muted-foreground/60';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
      <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />

      {/* En-tête */}
      <div className="relative flex items-center justify-between px-5 md:px-6 py-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-md shadow-blue-600/25 flex items-center justify-center">
            <PackagePlus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-foreground leading-tight">
              {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isEditing ? 'Mettez à jour les informations du produit' : 'Remplissez les champs ci-dessous pour l\u2019ajouter'}
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="relative p-5 md:p-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Colonne image */}
          <div className="lg:col-span-1">
            <label className={labelCls}>Image du produit</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative rounded-2xl border-2 border-dashed transition-colors overflow-hidden ${
                isDragging ? 'border-primary bg-primary/5' : 'border-border bg-secondary/40'
              }`}
            >
              <img
                src={imagePreview}
                alt="Aperçu du produit"
                className="w-full aspect-square object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex items-center justify-center gap-2 text-white text-xs font-medium pointer-events-none">
                <Upload className="w-3.5 h-3.5" />
                Glissez ou cliquez pour téléverser
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              JPG, PNG, WEBP — recommandé : carré
            </p>
          </div>

          {/* Colonne champs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <div>
                <label className={labelCls}>Nom du produit</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                  placeholder="Ex. : Rouje à lèvres mat"
                  className={inputCls}
                  required
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className={labelCls}>Catégorie</label>
                {!isAddingNewCategory ? (
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className={inputCls}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__add_new__" className="text-primary font-semibold">
                      + Nouvelle catégorie
                    </option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={handleNewCategoryInput}
                      placeholder="Nom de la nouvelle catégorie"
                      className={`flex-1 ${inputCls}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewCategory(false);
                        setNewCategoryName('');
                      }}
                      className="px-3 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Prix / Quantité / Réduction sur une ligne */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Prix (DT)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={onInputChange}
                    placeholder="0.000"
                    className={`${inputCls} pl-9`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Quantité</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    min="0"
                    name="quantity"
                    value={formData.quantity}
                    onChange={onInputChange}
                    placeholder="0"
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Réduction (%)</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    name="discount"
                    value={formData.discount}
                    onChange={onInputChange}
                    placeholder="0"
                    className={`${inputCls} pl-9 pr-8`}
                  />
                </div>
                {/* Aperçu du nouveau prix */}
                {Number(formData.price) > 0 && Number(formData.discount) > 0 && (
                  <div className="flex items-center gap-2 mt-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2">
                    <span className="text-xs text-red-600 dark:text-red-400 line-through flex-shrink-0">
                      {Number(formData.price).toFixed(3)} DT
                    </span>
                    <span className="text-xs text-red-500">→</span>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                      {(Number(formData.price) * (1 - Math.min(Number(formData.discount), 100) / 100)).toFixed(3)} DT
                    </span>
                    <span className="ml-auto text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
                      -{Math.min(Number(formData.discount), 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Disponibilité : choix radio */}
            <div>
              <label className={labelCls}>Disponibilité du produit</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.inStock) {
                      const syntheticEvent = {
                        target: { name: 'inStock', type: 'checkbox', checked: true },
                      } as unknown as React.ChangeEvent<HTMLInputElement>;
                      onInputChange(syntheticEvent as any);
                    }
                  }}
                  className={`flex items-start gap-2.5 rounded-2xl border p-3.5 text-left transition-all ${
                    formData.inStock
                      ? 'border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/40'
                      : 'border-border bg-secondary/40 hover:border-emerald-500/30'
                  }`}
                >
                  <span
                    className={`mt-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      formData.inStock ? 'border-emerald-500' : 'border-muted-foreground/40'
                    }`}
                  >
                    {formData.inStock && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground leading-tight">
                      En stock
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      Visible et achetable côté client
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (formData.inStock) {
                      const syntheticEvent = {
                        target: { name: 'inStock', type: 'checkbox', checked: false },
                      } as unknown as React.ChangeEvent<HTMLInputElement>;
                      onInputChange(syntheticEvent as any);
                    }
                  }}
                  className={`flex items-start gap-2.5 rounded-2xl border p-3.5 text-left transition-all ${
                    !formData.inStock
                      ? 'border-rose-500/60 bg-rose-500/10 ring-1 ring-rose-500/40'
                      : 'border-border bg-secondary/40 hover:border-rose-500/30'
                  }`}
                >
                  <span
                    className={`mt-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      !formData.inStock ? 'border-rose-500' : 'border-muted-foreground/40'
                    }`}
                  >
                    {!formData.inStock && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground leading-tight">
                      En rupture
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      Marqué "indisponible" côté client
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                placeholder="Décrivez le produit, ses caractéristiques, sa taille..."
                rows={3}
                className={`${inputCls} resize-none`}
                required
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border/60">
          <Button
            type="submit"
            size="lg"
            className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-600/25 rounded-full gap-2 px-6 font-semibold"
          >
            <Save className="w-4 h-4" />
            {isEditing ? 'Enregistrer les modifications' : 'Ajouter le produit'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            className="rounded-full gap-2 px-6 text-muted-foreground hover:text-foreground w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
