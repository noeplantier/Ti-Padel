'use client';

import React, { useCallback, useEffect, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { getOrders, removeOrder, clearOrders, type Order, subscribeToOrders } from '@/lib/orders';

type UIOrder = Order & { __total?: number };

const STRIPE_PK =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_FAKE_TIPADEL_1234567890';
const isFakeStripe = /FAKE_TIPADEL/i.test(STRIPE_PK) || !STRIPE_PK;
const stripePromise: Promise<Stripe | null> = isFakeStripe ? Promise.resolve(null) : loadStripe(STRIPE_PK);

export interface CartSidebarRef {
  open: () => void;
  close: () => void;
}

const formatEUR = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

// Icônes SVG
const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RacketIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CourtIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

function renderOrderLine(o: UIOrder) {
  if (o.kind === 'racket') {
    const label = (o as any).label || 'Raquette';
    const price = (o as any).price || 0;
    const quantity = (o as any).quantity || 1;
    
    return (
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
          <RacketIcon />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 mb-1">
            Location de raquette
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <span className="font-medium">{label}</span>
            {quantity > 1 && (
              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                x{quantity}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  if (o.kind === 'booking') {
    const date = (o as any).date ? new Date((o as any).date) : null;
    const time = (o as any).time || '';
    const name = (o as any).name || '';
    const courtId = (o as any).courtId || '';
    const duration = (o as any).duration || 60;
    
    return (
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
          <CalendarIcon />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 mb-2">
            Réservation de terrain
          </div>
          <div className="space-y-1.5 text-sm text-gray-600">
            {date && (
              <div className="flex items-center gap-2">
                <CalendarIcon />
                <span>{date.toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</span>
              </div>
            )}
            {time && (
              <div className="flex items-center gap-2">
                <ClockIcon />
                <span>{time} ({duration} min)</span>
              </div>
            )}
            {courtId && (
              <div className="flex items-center gap-2">
                <CourtIcon />
                <span className="font-medium">Terrain {courtId}</span>
              </div>
            )}
            {name && (
              <div className="flex items-center gap-2">
                <UserIcon />
                <span className="italic">{name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return null;
}

const CartSidebar = forwardRef<CartSidebarRef>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronisation en temps réel avec le localStorage
  useEffect(() => {
    // Chargement initial
    const loadOrders = () => {
      const currentOrders = getOrders();
      setOrders(currentOrders);
    };
    
    loadOrders();

    // Abonnement aux changements du panier
    const unsubscribe = subscribeToOrders((updatedOrders) => {
      setOrders(updatedOrders);
    });

    // Écoute des événements de storage pour la synchronisation entre onglets
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tipadel-orders' || e.key === null) {
        loadOrders();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Calcul du total en temps réel
  const total = useMemo(() => {
    return orders.reduce((sum, order) => {
      const price = (order as any).price || 0;
      return sum + Number(price);
    }, 0);
  }, [orders]);

  const itemCount = orders.length;

  const open = useCallback(() => {
    setIsOpen(true);
    setError(null);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setError(null);
  }, []);

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  const handleRemoveOrder = useCallback((orderId: string) => {
    removeOrder(orderId);
    // La mise à jour se fera automatiquement via subscribeToOrders
  }, []);

  const handleClearOrders = useCallback(() => {
    clearOrders();
    // La mise à jour se fera automatiquement via subscribeToOrders
  }, []);

  const handleCheckout = useCallback(async () => {
    if (orders.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      if (isFakeStripe) {
        // Mode démo
        alert('Mode démo : Paiement simulé avec succès !');
        handleClearOrders();
        close();
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe n\'a pas pu être chargé');
      }

      // Créer une session de paiement
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la session');
      }

      const { sessionId } = await response.json();

      // Rediriger vers Stripe Checkout
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err) {
      console.error('Erreur de paiement:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [orders, close, handleClearOrders]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={close}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-50 to-blue-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Mon Panier
            {itemCount > 0 && (
              <span className="text-sm font-normal text-gray-600">
                ({itemCount} {itemCount === 1 ? 'article' : 'articles'})
              </span>
            )}
          </h2>
          <button
            onClick={close}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Fermer le panier"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {orders.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-lg font-medium">Votre panier est vide</p>
              <p className="text-sm mt-2">Ajoutez des réservations ou des locations</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-all duration-200 animate-fadeIn"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      {renderOrderLine(order)}
                    </div>
                    <button
                      onClick={() => handleRemoveOrder(order.id)}
                      className="ml-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center transition-colors flex-shrink-0"
                      aria-label="Supprimer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Prix</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatEUR((order as any).price || 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {orders.length > 0 && (
          <div className="border-t p-4 bg-gray-50">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-semibold">{formatEUR(total)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>TVA incluse</span>
                <span>{formatEUR(total * 0.2)}</span>
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatEUR(total)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Procéder au paiement
                  </>
                )}
              </button>
              
              <button
                onClick={handleClearOrders}
                disabled={isLoading}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Vider le panier
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
});

CartSidebar.displayName = 'CartSidebar';

// Export par défaut ET nommé pour éviter les erreurs d'import
export { CartSidebar };
export default CartSidebar;