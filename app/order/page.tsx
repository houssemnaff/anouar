'use client';

import React from "react"

import { useState } from 'react';
import { Header } from '@/components/header';
import { useStore } from '@/lib/store-context';
import { OrderForm } from '@/components/order-form';
import { OrderSummary } from '@/components/order-summary';
import { OrderConfirmation } from '@/components/order-confirmation';
import { EmptyCartMessage } from '@/components/empty-cart-message';

export default function OrderPage() {
  const { cart, getProductById, getCartTotal, clearCart, addOrder } = useStore();
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
  });
  const [orderId, setOrderId] = useState('');
  const [confirmedTotal, setConfirmedTotal] = useState(0);

  const cartTotal = getCartTotal();
  const totalWithTax = cartTotal * 1.1;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerPhone || !formData.deliveryAddress) {
      alert('Please fill in all fields');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Prepare order items
    const orderItems = cart.map((item) => {
      const product = getProductById(item.productId);
      return {
        productId: item.productId,
        productName: product?.name || 'Unknown Product',
        price: product?.price || 0,
        quantity: item.quantity,
      };
    });

    // Create order
    const newOrder = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      deliveryAddress: formData.deliveryAddress,
      items: orderItems,
      totalPrice: cartTotal,
      status: 'pending' as const,
    };

    try {
      const createdOrder = await addOrder(newOrder);
      setOrderId(createdOrder.id);

      // Save the total before clearing cart
      setConfirmedTotal(totalWithTax);

      // Clear cart and show confirmation
      clearCart();
      setStep('confirmation');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && step === 'form') {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <EmptyCartMessage />
      </main>
    );
  }

  if (step === 'confirmation') {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="py-16">
          <div className="container mx-auto px-4">
            <OrderConfirmation
              orderId={orderId}
              customerName={formData.customerName}
              customerPhone={formData.customerPhone}
              deliveryAddress={formData.deliveryAddress}
              totalWithTax={confirmedTotal}
            />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

     
      {/* Checkout Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <OrderForm
                formData={formData}
                isSubmitting={isSubmitting}
                onInputChange={handleInputChange}
                onSubmit={handleSubmitOrder}
              />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                cart={cart}
                getProductById={getProductById}
                cartTotal={cartTotal}
                totalWithTax={totalWithTax}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
