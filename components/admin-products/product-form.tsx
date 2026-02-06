import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

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

const categories = [
  'Dairy',
  'Fruits',
  'Vegetables',
  'Bakery',
  'Beverages',
  'Oils & Condiments',
];

export function ProductForm({
  formData,
  isEditing,
  onInputChange,
  onImageFileChange,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [imagePreview, setImagePreview] = useState<string>(formData.image || '/products/placeholder.jpg');

  // Update preview when formData.image changes (for edit mode)
  React.useEffect(() => {
    setImagePreview(formData.image || '/products/placeholder.jpg');
  }, [formData.image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Store file for upload
      onImageFileChange(file);

      // Create preview for display only
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    
    // Create a synthetic event for the category field
    const syntheticEvent = {
      target: {
        name: 'category',
        value: value,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    onInputChange(syntheticEvent as any);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-xl font-bold text-primary mb-6">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Product Image - at the top */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Product Image
          </label>
          <div className="flex gap-3 items-start">
            {/* Image preview on the left */}
            <div className="flex-shrink-0">
              <img
                src={imagePreview}
                alt="Product preview"
                className="w-24 h-24 object-cover rounded-lg border-2 border-border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src ='/placeholder.jpg';
                }}
              />
            </div>
            
            {/* Input field on the right */}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">Choose an image from your computer (JPG, PNG, etc.)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              placeholder="E.g., Fresh Tomatoes"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={onInputChange}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Category
            </label>
            {!isAddingNewCategory ? (
              <select
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__add_new__" className="text-primary font-semibold">
                  + Add New Category
                </option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={handleNewCategoryInput}
                  placeholder="Enter new category name"
                  className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNewCategory(false);
                    setNewCategoryName('');
                  }}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Stock Status
            </label>
            <div className="flex items-center gap-4 p-2 border border-border rounded-lg bg-background">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={onInputChange}
                  className="w-4 h-4"
                />
                <span className="text-foreground">In Stock</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="0"
              name="quantity"
              value={formData.quantity}
              onChange={onInputChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              name="discount"
              value={formData.discount}
              onChange={onInputChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Product description..."
            rows={3}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            required
          />
        </div>

        <div className="flex gap-3">
            
          <Button type="submit"     className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg gap-2"
>
            {isEditing ? 'Update Product' : 'Add Product'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
               className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg gap-2"

          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
