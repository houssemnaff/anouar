export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  inStock: boolean;
  quantity?: number; // Quantité en stock
  featured?: boolean;
  discount?: number; // Pourcentage de réduction (0-100)
  discountEndDate?: string; // Date de fin de la promotion (optionnel)
}

export interface Catalogue {
  id: string;
  title: string;
  description: string;
  image: string; // Image du catalogue (requis)
  visible: boolean;
  pdfUrl?: string; // URL vers le PDF (optionnel)
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
  status: 'pending' | 'delivered';
  createdAt: string;
}

export interface AdminUser {
  isAdmin: boolean;
}
