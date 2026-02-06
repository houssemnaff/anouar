'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, User, Phone, MapPin, Wallet, ShoppingBag, Home } from 'lucide-react';

interface OrderConfirmationProps {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  totalWithTax: number;
}

export function OrderConfirmation({
  orderId,
  customerName,
  customerPhone,
  deliveryAddress,
  totalWithTax,
}: OrderConfirmationProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 text-center shadow-xl">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
            <CheckCircle className="relative w-20 h-20 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
          Commande confirmée !
        </h1>
        <p className="text-lg text-blue-900 mb-2">
          Merci pour votre commande.
        </p>
        <p className="text-blue-700/70 mb-8">
          Votre commande <span className="font-semibold text-blue-800">#{orderId}</span> a été passée avec succès.
        </p>

        {/* Order Details */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 text-left mb-8 shadow-md">
          <div className="space-y-4">
            {/* Customer Name */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700/80 mb-1">Nom du client</p>
                <p className="text-lg font-semibold text-blue-900">
                  {customerName}
                </p>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700/80 mb-1">Numéro de téléphone</p>
                <p className="text-lg font-semibold text-blue-900">
                  {customerPhone}
                </p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700/80 mb-1">Adresse de livraison</p>
                <p className="text-lg font-semibold text-blue-900">
                  {deliveryAddress}
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t-2 border-blue-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700/80 mb-1">Total de la commande</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    ${totalWithTax.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-8 text-left shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📋</span>
            </div>
            <h3 className="font-bold text-blue-900 text-lg">Prochaines étapes</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </span>
              <span className="text-blue-900 pt-0.5">
                Vous recevrez un message de confirmation sous peu
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </span>
              <span className="text-blue-900 pt-0.5">
                Notre équipe préparera votre commande
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                3
              </span>
              <span className="text-blue-900 pt-0.5">
                Nous livrerons vos produits à votre adresse
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                4
              </span>
              <span className="text-blue-900 pt-0.5">
                Payez le livreur en espèces
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold h-12 flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Continuer mes achats
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button 
              variant="outline" 
              className="w-full rounded-xl border-2 border-blue-600 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-700 transition-all duration-300 font-semibold h-12 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}