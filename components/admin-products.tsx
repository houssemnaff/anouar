'use client';

import React from 'react';
import { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '@/lib/upload';
import { ProductHeader } from './admin-products/product-header';
import { ProductForm } from './admin-products/product-form';
import { ProductsTable } from './admin-products/products-table';
import { ProductSummary } from './admin-products/product-summary';

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

export function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<NewProduct>({
    name: '',
    price: '',
    category: 'Dairy',
    description: '',
    inStock: true,
    quantity: '0',
    discount: '0',
    image: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image || '/products/placeholder.jpg';

      // Upload image to Supabase Storage if new image is selected
      if (imageFile) {
        toast({
          title: "Uploading image...",
          description: "Please wait while we upload the image.",
        });
        imageUrl = await uploadImage(imageFile, 'products');
      }

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        inStock: formData.inStock,
        quantity: parseInt(formData.quantity) || 0,
        discount: parseInt(formData.discount) || 0,
        image: imageUrl,
      };

      if (editingProductId) {
        await updateProduct(editingProductId, productData);
        toast({
          title: "Product updated",
          description: "The product has been updated successfully.",
        });
      } else {
        await addProduct(productData);
        toast({
          title: "Product added",
          description: "The new product has been added successfully.",
        });
      }
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      
      let errorMessage = "Failed to upload image or save product. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('row-level security') || error.message.includes('Permission denied')) {
          errorMessage = "Permission denied. Please configure Storage policies in Supabase Dashboard (see SUPABASE_STORAGE_SETUP.md)";
        } else if (error.message.includes('not found')) {
          errorMessage = 'Bucket "uploads" not found. Please create it in Supabase Dashboard.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        description: product.description,
        inStock: product.inStock,
        quantity: product.quantity?.toString() || '0',
        discount: product.discount?.toString() || '0',        image: product.image || '',      });
      setEditingProductId(productId);
      setShowForm(true);
    }
  };

  const handleDelete = (productId: string) => {
    toast({
      title: "Confirm deletion",
      description: "Are you sure you want to delete this product?",
      action: (
        <button
          onClick={async () => {
            try {
              await deleteProduct(productId);
              toast({
                title: "Product deleted",
                description: "The product has been deleted successfully.",
                variant: "destructive",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to delete product. Please try again.",
                variant: "destructive",
              });
            }
          }}
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md bg-destructive px-3 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
        >
          Delete
        </button>
      ),
    });
  };

  const handleAddProduct = () => {
    if (showForm && !editingProductId) {
      setShowForm(false);
    } else {
      resetForm();
      setShowForm(true);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: 'Dairy',
      description: '',
      inStock: true,
      quantity: '0',
      discount: '0',
      image: '',
    });
    setImageFile(null);
    setShowForm(false);
    setEditingProductId(null);
  };

  return (
    <div className="space-y-8">
      <ProductHeader onAddProduct={handleAddProduct} />

      {showForm && (
        <ProductForm
          formData={formData}
          isEditing={!!editingProductId}
          onInputChange={handleInputChange}
          onImageFileChange={setImageFile}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      <ProductsTable products={products} onEdit={handleEdit} onDelete={handleDelete} />

      <ProductSummary products={products} />
    </div>
  );
}
