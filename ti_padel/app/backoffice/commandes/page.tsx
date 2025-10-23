'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Navigation } from '@/components/Navigation';
import { getOrders, removeOrder, clearOrders, type Order } from '@/lib/orders';

type UIOrder = Order & { __total?: number };

const STRIPE_PK =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_FAKE_TIPADEL_1234567890';
const isFakeStripe = /FAKE_TIPADEL/i.test(STRIPE_PK) || !STRIPE_PK;
const stripePromise: Promise<Stripe | null> = isFakeStripe ? Promise.resolve(null) : loadStripe(STRIPE_PK);

export default function BackOfficeCommandesPage() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyClear, setBusyClear] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    setLoading(false);
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
        setError('Échec d’initialisation de Stripe.');
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

  if (!mounted) return <main className="min-h-screen bg-gray-50 py-8" suppressHydrationWarning />;

  return (
    <main className="relative min-h-screen overflow-hidden bg-white mt-20 py-6">
      {/* Arrière-plan cadrillé façon Conditions.tsx */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 75%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/75 to-white" />
      </div>

      {/* Barre de navigation */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Navigation />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header aligné Conditions.tsx */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between mt-10">
          <Link href="/" className="sm:pt-1">
            <span className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              ← Retour
            </span>
          </Link>

          <div className="text-center sm:text-right">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black">
              Gestion des commandes
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Consultez, payez et gérez vos commandes en toute simplicité.
            </p>
          </div>
        </div>

        {/* Stats & Actions (style cartes Conditions.tsx) */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="group p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl bg-white border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-1">Commandes</h3>
            <p className="text-sm text-gray-600">Nombre total de commandes enregistrées.</p>
            <div className="mt-4 text-3xl font-bold text-black">{stats.count}</div>
          </div>

          <div className="group p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl bg-white border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-1">Total</h3>
            <p className="text-sm text-gray-600">Montant cumulé de toutes les commandes.</p>
            <div className="mt-4 text-3xl font-bold text-black">{formatEUR(stats.total)}</div>
          </div>

          <div className="group p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl bg-white border border-gray-200">
            <h3 className="text-lg font-semibold text-black mb-1">Actions</h3>
            <p className="text-sm text-gray-600">Gérer votre liste de commandes.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleClear}
                disabled={orders.length === 0 || busyClear}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                  orders.length === 0 || busyClear
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {busyClear ? 'Nettoyage…' : 'Tout effacer'}
              </button>
              {!canPay && (
                <span className="inline-flex items-center rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-medium text-red-700">
                  Paiement désactivé
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Alerte erreur */}
        {error && (
          <div
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        {/* Liste des commandes */}
        <div className="mt-8">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-black">
                Commandes ({orders.length})
              </h2>
              <p className="text-sm text-gray-600">Détails et actions par commande.</p>
            </div>

            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-6 text-sm text-gray-600">Chargement…</div>
              ) : orders.length === 0 ? (
                <div className="p-6 text-sm text-gray-600">Aucune commande.</div>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="text-base font-semibold text-black truncate">
                        {getOrderLabel(o)}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {getOrderDescription(o)}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {o.createdAt ? `Créée le ${formatDateTime(o.createdAt)}` : ''}
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        {renderOrderDetails(o)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:shrink-0">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="text-lg font-semibold text-black">
                          {formatEUR(Number(o.__total || 0))}
                        </div>
                      </div>

                      {canPay && (
                        <button
                          onClick={() => handlePay(o)}
                          disabled={payingId === o.id}
                          className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                            payingId === o.id ? 'bg-gray-400 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-700'
                          }`}
                          title={payingId === o.id ? 'Paiement en cours…' : 'Payer cette commande'}
                        >
                          {payingId === o.id ? 'Paiement…' : 'Payer'}
                        </button>
                      )}

                      <button
                        onClick={() => handleRemove(o.id)}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
                        title="Supprimer cette commande"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

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
    return (
      <div>
        Terrain: {courtName} {price ? `- ${formatEUR(Number(price))}` : ''}
      </div>
    );
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
    return (
      <div>
        Location raquette: {label} - {formatEUR(Number(price || 0))}
      </div>
    );
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