import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          image: string;
          category: string;
          description: string;
          in_stock: boolean;
          featured: boolean;
          discount: number | null;
          discount_end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          image: string;
          category: string;
          description: string;
          in_stock?: boolean;
          featured?: boolean;
          discount?: number | null;
          discount_end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          image?: string;
          category?: string;
          description?: string;
          in_stock?: boolean;
          featured?: boolean;
          discount?: number | null;
          discount_end_date?: string | null;
          updated_at?: string;
        };
      };
      catalogues: {
        Row: {
          id: string;
          title: string;
          description: string;
          image: string;
          visible: boolean;
          pdf_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image: string;
          visible?: boolean;
          pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image?: string;
          visible?: boolean;
          pdf_url?: string | null;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_phone: string;
          delivery_address: string;
          total_price: number;
          status: 'pending' | 'delivered';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_phone: string;
          delivery_address: string;
          total_price: number;
          status?: 'pending' | 'delivered';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_phone?: string;
          delivery_address?: string;
          total_price?: number;
          status?: 'pending' | 'delivered';
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          price: number;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          price: number;
          quantity: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          price?: number;
          quantity?: number;
        };
      };
    };
  };
};
