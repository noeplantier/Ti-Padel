'use client';

import React, { useCallback, useEffect, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { getOrders, removeOrder, clearOrders, type Order } from '@/lib/orders';

type UIOrder = Order & { __total?: number };

const STRIPE_PK =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_FAKE_TIPADEL_1234567890';
const isFakeStripe = /FAKE_TIPADEL/i.test(STRIPE_PK) || !STRIPE_PK;
const stripePromise: Promise<Stripe | null> = isFakeStripe ? Promise.resolve(null) : loadStripe(STRIPE_PK);

export interface CartSidebarRef {
  open: () => void;
  close: () => void;
}

export const CartSidebar = forwardRef<CartSidebarRef>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyClear, setBusyClear] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setOrders(enrichTotals(getOrders()));
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === 'ti-padel-orders') setOrders(enrichTotals(getOrders()));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [mounted]);

  const canPay = !isFakeStripe;

  const stats = useMemo(() => {
    const count = orders.length;
    const total = orders.reduce((acc, o) => acc + Number(o.__total || 0), 0);
    return { count, total };
  }, [orders]);

  const handleRemove = useCallback((id: string) => {
    setError(null);
    const updated = removeOrder(id) as UIOrder[];
    setOrders(enrichTotals(updated));
  }, []);

  const handleClear = useCallback(async () => {
    setError(null);
    if (!confirm('Voulez-vous vraiment supprimer toutes les commandes ?')) return;
    try {
      setBusyClear(true);
      clearOrders();
      setOrders([]);
    } finally {
      setBusyClear(false);
    }
  }, []);

  const handlePay = useCallback(
    async (o: UIOrder) => {
      setError(null);
      if (!canPay) {
        setError('Paiement indisponible: configuration Stripe factice ou absente.');
        return;
      }
      const stripe = await stripePromise;
      if (!stripe) {
        setError('Échec d\'initialisation de Stripe.');
        return;
      }
      try {
        setPayingId(o.id);
        const amount = Math.round(Number(o.__total || 0) * 100);
        if (!Number.isFinite(amount) || amount <= 0) throw new Error('Montant invalide ou à 0.');
        const payload = {
          mode: 'payment',
          currency: 'eur',
          metadata: { orderId: o.id, kind: o.kind },
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: 'eur',
                unit_amount: amount,
                product_data: {
                  name: getOrderLabel(o),
                  description: getOrderDescription(o),
                },
              },
            },
          ],
          success_url: `${window.location.origin}/success?orderId=${encodeURIComponent(o.id)}`,
          cancel_url: `${window.location.origin}/cancel?orderId=${encodeURIComponent(o.id)}`,
        };
        const res = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.text()) || 'Création de session Stripe échouée.');
        const data = await res.json();
        if (data?.id) {
          const { error: stripeErr } = await stripe.redirectToCheckout({ sessionId: data.id });
          if (stripeErr) throw stripeErr;
        } else if (data?.url) {
          window.location.href = data.url as string;
        } else {
          throw new Error('Réponse Stripe invalide (ni sessionId ni url).');
        }
      } catch (e: any) {
        setError(e?.message || 'Une erreur est survenue pendant le paiement.');
      } finally {
        setPayingId(null);
      }
    },
    [canPay]
  );

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[320px] lg:w-[420px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold text-black">Panier</h2>
              <p className="text-sm text-gray-600">{stats.count} commande{stats.count > 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Fermer le panier"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-2xl font-bold text-black">{formatEUR(stats.total)}</div>
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={handleClear}
                  disabled={orders.length === 0 || busyClear}
                  className={`w-full rounded-lg px-4 py-2 text-sm font-medium text-white ${
                    orders.length === 0 || busyClear
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {busyClear ? 'Nettoyage…' : 'Tout effacer'}
                </button>
              </div>
            </div>
            {!canPay && (
              <div className="mt-3 rounded-lg bg-red-100 px-3 py-2 text-xs font-medium text-red-700">
                ⚠️ Paiement désactivé
              </div>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          {/* Orders List - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {orders.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-600">Votre panier est vide</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-base font-semibold text-black">{getOrderLabel(o)}</div>
                        <div className="mt-1 text-sm text-gray-600">{getOrderDescription(o)}</div>
                        {o.createdAt && (
                          <div className="mt-1 text-xs text-gray-500">{formatDateTime(o.createdAt)}</div>
                        )}
                        <div className="mt-2 text-sm text-gray-700">{renderOrderDetails(o)}</div>
                        <div className="mt-3 text-lg font-bold text-emerald-600">
                          {formatEUR(Number(o.__total || 0))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      {canPay && (
                        <button
                          onClick={() => handlePay(o)}
                          disabled={payingId === o.id}
                          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white ${
                            payingId === o.id ? 'bg-gray-400 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-700'
                          }`}
                        >
                          {payingId === o.id ? 'Paiement…' : 'Payer'}
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(o.id)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Checkout Button */}
          {orders.length > 0 && canPay && (
            <div className="border-t border-gray-200 px-6 py-4">
              <button
                className="w-full rounded-lg bg-emerald-600 px-6 py-4 text-lg font-semibold text-white hover:bg-emerald-700 transition-colors"
                onClick={() => {
                  if (orders.length === 1) {
                    handlePay(orders[0]);
                  } else {
                    alert('Paiement groupé à venir - payez individuellement pour le moment');
                  }
                }}
              >
                Payer {formatEUR(stats.total)}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

CartSidebar.displayName = 'CartSidebar';

// --- Utils ---
function formatEUR(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(n || 0));
}

function formatDateTime(v: any) {
  try {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('fr-FR');
  } catch {
    return '';
  }
}

function getOrderLabel(o: Order) {
  switch (o.kind) {
    case 'court':
      return `Terrain ${(o.courtName || '').toString().trim() || 'Inconnu'}`;
    case 'menu':
      return 'Snacks/Boissons';
    case 'racket':
      return `Location raquette${o.label ? ` - ${o.label}` : ''}`;
    case 'booking':
      return `Réservation ${(o.serviceName || '').toString().trim() || 'Inconnue'}`;
    default:
      return 'Commande';
  }
}

function getOrderDescription(o: Order) {
  if (o.kind === 'menu') {
    const items = (o.items as { name: string; quantity: number }[] | undefined) || [];
    return items.length ? items.map((it) => `${it.name} x${it.quantity}`).join(', ') : 'Commande snack';
  }
  if (o.kind === 'booking') {
    const date = o.date ? new Date(o.date).toLocaleDateString('fr-FR') : '';
    const time = (o as any).time || '';
    const name = (o as any).name || '';
    return [date && `${date} ${time}`, name].filter(Boolean).join(' — ');
  }
  if (o.kind === 'court') return (o as any).courtName || 'Court';
  if (o.kind === 'racket') return (o as any).label || 'Raquette';
  return 'Commande Ti Padel';
}

function getOrderTotal(o: Order) {
  if (o.kind === 'menu') return Number((o as any).total || 0);
  if (o.kind === 'racket') return Number((o as any).price || 0);
  if (o.kind === 'court') return Number((o as any).price || 0);
  if (o.kind === 'booking') return Number((o as any).price || 0);
  return 0;
}

function enrichTotals(list: Order[]): UIOrder[] {
  return (list || []).map((o) => ({ ...o, __total: getOrderTotal(o) }));
}

function renderOrderDetails(o: Order) {
  if (o.kind === 'court') {
    const price = (o as any).price;
    const courtName = (o as any).courtName;
    return <div>Terrain: {courtName} {price ? `- ${formatEUR(Number(price))}` : ''}</div>;
  }
  if (o.kind === 'menu') {
    const items = (o.items as { name: string; quantity: number }[] | undefined) || [];
    return (
      <div>
        <div>Articles:</div>
        <div className="text-gray-600">{items.map((it) => `${it.name} x${it.quantity}`).join(', ') || '—'}</div>
      </div>
    );
  }
  if (o.kind === 'racket') {
    const label = (o as any).label;
    const price = (o as any).price;
    return <div>Location raquette: {label} - {formatEUR(Number(price || 0))}</div>;
  }
  if (o.kind === 'booking') {
    const date = (o as any).date ? new Date((o as any).date) : null;
    const time = (o as any).time || '';
    const name = (o as any).name || '';
    return (
      <div>
        <div>Réservation:</div>
        <div className="text-gray-600">
          {date ? date.toLocaleDateString('fr-FR') : ''} {time ? `à ${time}` : ''} {name ? `— (${name})` : ''}
        </div>
      </div>
    );
  }
  return null;
}