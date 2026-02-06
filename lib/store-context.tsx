'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Order, Product } from './types';
import { supabase } from './supabase';
import { initializeStorage } from './init-storage';

interface StoreContextType {
  // Cart
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  getCartTotal: () => number;
  clearCart: () => void;

  // Products
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: 'pending' | 'delivered') => Promise<void>;

  // Catalogues
  catalogues: Catalogue[];
  toggleCatalogueVisibility: (catalogueId: string) => Promise<void>;
  addCatalogue: (catalogue: Omit<Catalogue, 'id' | 'visible'>) => Promise<Catalogue>;
  updateCatalogue: (id: string, catalogue: Omit<Catalogue, 'id' | 'visible'>) => Promise<void>;
  deleteCatalogue: (id: string) => Promise<void>;

  // Loading state
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface Catalogue {
  id: string;
  title: string;
  description: string;
  image: string;
  visible: boolean;
  pdfUrl?: string;
}

export const StoreProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize storage bucket
        await initializeStorage();

        // Load products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        if (productsData) {
          // Map database fields to Product interface
          const mappedProducts: Product[] = productsData.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            category: p.category,
            description: p.description,
            inStock: p.in_stock,
            featured: p.featured,
            discount: p.discount,
            discountEndDate: p.discount_end_date,
          }));
          setProducts(mappedProducts);
        }

        // Load catalogues
        const { data: cataloguesData, error: cataloguesError } = await supabase
          .from('catalogues')
          .select('*')
          .order('created_at', { ascending: false });

        if (cataloguesError) throw cataloguesError;

        if (cataloguesData) {
          // Map database fields to Catalogue interface
          const mappedCatalogues: Catalogue[] = cataloguesData.map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            image: c.image,
            visible: c.visible,
            pdfUrl: c.pdf_url,
          }));
          setCatalogues(mappedCatalogues);
        }

        // Load orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        if (ordersData) {
          const mappedOrders: Order[] = ordersData.map((o: any) => ({
            id: o.id,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            deliveryAddress: o.delivery_address,
            items: o.order_items.map((item: any) => ({
              productId: item.product_id,
              productName: item.product_name,
              price: item.price,
              quantity: item.quantity,
            })),
            totalPrice: o.total_price,
            status: o.status,
            createdAt: o.created_at,
          }));
          setOrders(mappedOrders);
        }
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addToCart = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === productId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { productId, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const addOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      // Insert order into Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          delivery_address: order.deliveryAddress,
          total_price: order.totalPrice,
          status: order.status,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = order.items.map((item) => ({
        order_id: orderData.id,
        product_id: item.productId,
        product_name: item.productName,
        price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Add to local state
      const newOrder: Order = {
        ...order,
        id: orderData.id,
        createdAt: orderData.created_at,
      };
      setOrders((prevOrders) => [newOrder, ...prevOrders]);

      return newOrder;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'pending' | 'delivered') => {
    try {
      // Update order status in Supabase
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const toggleCatalogueVisibility = async (catalogueId: string) => {
    try {
      console.log('Toggling visibility for catalogue:', catalogueId);
      
      const catalogue = catalogues.find((c) => c.id === catalogueId);
      if (!catalogue) {
        throw new Error('Catalogue not found');
      }

      const newVisibility = !catalogue.visible;
      console.log('Current visibility:', catalogue.visible, '-> New visibility:', newVisibility);
      
      const { data, error } = await supabase
        .from('catalogues')
        .update({ visible: newVisibility })
        .eq('id', catalogueId)
        .select();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error details:', JSON.stringify(error, null, 2));
        throw new Error(`Failed to update catalogue: ${error.message || 'Unknown error'}`);
      }

      // Update local state
      setCatalogues((prevCatalogues) =>
        prevCatalogues.map((c) =>
          c.id === catalogueId
            ? { ...c, visible: newVisibility }
            : c
        )
      );
      
      console.log('Catalogue visibility updated successfully');
    } catch (error) {
      console.error('Error toggling catalogue visibility:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  };

  const addCatalogue = async (catalogue: Omit<Catalogue, 'id' | 'visible'>) => {
    try {
      const { data, error } = await supabase
        .from('catalogues')
        .insert({
          title: catalogue.title,
          description: catalogue.description,
          image: catalogue.image,
          visible: true,
          pdf_url: catalogue.pdfUrl,
        })
        .select()
        .single();

      if (error) throw error;

      const newCatalogue: Catalogue = {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image,
        visible: data.visible,
        pdfUrl: data.pdf_url,
      };
      setCatalogues((prevCatalogues) => [newCatalogue, ...prevCatalogues]);

      return newCatalogue;
    } catch (error) {
      console.error('Error adding catalogue:', error);
      throw error;
    }
  };

  const updateCatalogue = async (id: string, catalogue: Omit<Catalogue, 'id' | 'visible'>) => {
    try {
      const { error } = await supabase
        .from('catalogues')
        .update({
          title: catalogue.title,
          description: catalogue.description,
          image: catalogue.image,
          pdf_url: catalogue.pdfUrl,
        })
        .eq('id', id);

      if (error) throw error;

      setCatalogues((prevCatalogues) =>
        prevCatalogues.map((c) =>
          c.id === id ? { ...catalogue, id, visible: c.visible, pdfUrl: catalogue.pdfUrl } : c
        )
      );
    } catch (error) {
      console.error('Error updating catalogue:', error);
      throw error;
    }
  };

  const deleteCatalogue = async (id: string) => {
    try {
      const { error } = await supabase
        .from('catalogues')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCatalogues((prevCatalogues) =>
        prevCatalogues.filter((c) => c.id !== id)
      );
    } catch (error) {
      console.error('Error deleting catalogue:', error);
      throw error;
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          description: product.description,
          in_stock: product.inStock,
          featured: product.featured,
          discount: product.discount,
          discount_end_date: product.discountEndDate,
        })
        .select()
        .single();

      if (error) throw error;

      const newProduct: Product = {
        id: data.id,
        name: data.name,
        price: data.price,
        image: data.image,
        category: data.category,
        description: data.description,
        inStock: data.in_stock,
        featured: data.featured,
        discount: data.discount,
        discountEndDate: data.discount_end_date,
      };
      setProducts((prevProducts) => [newProduct, ...prevProducts]);

      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, product: Omit<Product, 'id'>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          description: product.description,
          in_stock: product.inStock,
          featured: product.featured,
          discount: product.discount,
          discount_end_date: product.discountEndDate,
        })
        .eq('id', id);

      if (error) throw error;

      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === id ? { ...product, id } : p
        )
      );
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== id)
      );
      // Also remove from cart if present
      setCart((prevCart) =>
        prevCart.filter((item) => item.productId !== id)
      );
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        getCartTotal,
        clearCart,
        products,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        addOrder,
        updateOrderStatus,
        catalogues,
        toggleCatalogueVisibility,
        addCatalogue,
        updateCatalogue,
        deleteCatalogue,
        loading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
