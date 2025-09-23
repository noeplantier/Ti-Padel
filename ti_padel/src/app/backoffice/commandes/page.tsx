'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Trash2 } from 'lucide-react';
import { getOrders, removeOrder, clearOrders, type Order } from '@/lib/orders';

type UIOrder = Order & { __total?: number };

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_FAKE_TIPADEL_1234567890';
const isFakeStripe = /FAKE_TIPADEL/i.test(STRIPE_PK) || !STRIPE_PK;
const stripePromise: Promise<Stripe | null> = isFakeStripe ? Promise.resolve(null) : loadStripe(STRIPE_PK);

export default function BackOfficeCommandesPage() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyClear, setBusyClear] = useState(false);

  useEffect(() => setMounted(true), []);

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
    if (!confirm('Supprimer toutes les commandes ?')) return;
    try {
      setBusyClear(true);
      clearOrders();
      setOrders([]);
    } finally {
      setBusyClear(false);
    }
  }, []);

  const handlePay = useCallback(async (o: UIOrder) => {
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
        metadata: { orderId: (o as any).id, kind: (o as any).kind },
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
        success_url: `${window.location.origin}/success?orderId=${encodeURIComponent((o as any).id)}`,
        cancel_url: `${window.location.origin}/cancel?orderId=${encodeURIComponent((o as any).id)}`,
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
  }, [canPay]);

  if (!mounted) return <main className="min-h-screen bg-gray-50 py-8" suppressHydrationWarning />;

  return (
    <main className="min-h-screen py-8" suppressHydrationWarning>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between mt-10">
          <Link href="/" className="sm:pt-1">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à l'accueil</span>
            </Button>
          </Link>
          <div className="text-left sm:text-right">
            <h1 className="text-2xl md:text-3xl font-bold">Back Office — Commandes</h1>
            <p className="text-sm md:text-base text-gray-600">
              Gérez vos commandes et encaissez les paiements en toute sécurité via Stripe.
            </p>
          </div>
        </div>

        {/* Stats + Actions */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Nombre de commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.count}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Montant total (EUR)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{formatEUR(stats.total)}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button
                variant="destructive"
                onClick={handleClear}
                disabled={orders.length === 0 || busyClear}
                className="inline-flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Tout effacer
              </Button>
              {!canPay && (
                <span className="text-xs text-amber-600">
                  Paiement désactivé (clé publique Stripe manquante ou factice).
                </span>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alerte */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" aria-live="polite">
            {error}
          </div>
        )}

        {/* Liste des commandes */}
        <div className="mt-8">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Liste des commandes ({orders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-gray-600">Aucune commande enregistrée pour le moment.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {orders.map((o) => (
                    <div key={(o as any).id} className="rounded-xl border border-gray-200 p-4 sm:p-5 lg:p-6 bg-white/70">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="font-semibold">
                          {getOrderLabel(o)} — <span className="text-black">{formatEUR(o.__total || 0)}</span>
                        </div>
                        <div className="text-xs text-gray-500">{formatDateTime((o as any).createdAt)}</div>
                      </div>

                      <div className="mt-2 text-sm text-gray-700">{renderOrderDetails(o)}</div>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <Button
                          variant="default"
                          onClick={() => handlePay(o)}
                          disabled={payingId === (o as any).id || !canPay || Number(o.__total || 0) <= 0}
                          className="inline-flex items-center gap-2"
                        >
                          <CreditCard className="h-4 w-4" />
                          {payingId === (o as any).id ? 'Redirection vers Stripe…' : 'Effectuer le paiement'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleRemove((o as any).id)}
                          className="inline-flex items-center gap-2"
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <p className="mt-4 text-xs text-gray-500">
            Les paiements sont traités par Stripe. Configurez vos clés API et l’endpoint /api/create-checkout-session.
          </p>
        </div>
      </div>
    </main>
  );
}

/* Utils */

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
  switch ((o as any).kind) {
    case 'court':
      return `Terrain ${(((o as any).courtName || '') as string).toString().trim()}`.trim() || 'Terrain';
    case 'menu':
      return 'Boissons / Snacks';
    case 'racket':
      return `Location raquette${(o as any).label ? ` - ${(o as any).label}` : ''}`;
    case 'booking':
      return `Réservation ${(((o as any).serviceName || '') as string).toString().trim()}`.trim() || 'Réservation';
    default:
      return 'Commande';
  }
}

function getOrderDescription(o: Order) {
  if ((o as any).kind === 'menu') {
    const items = (o as any).items as { name: string; quantity: number }[] | undefined;
    return items?.length ? items.map((it) => `${it.name} x${it.quantity}`).join(', ') : 'Commande snack';
  }
  if ((o as any).kind === 'booking') {
    const date = (o as any).date ? new Date((o as any).date).toLocaleDateString('fr-FR') : '';
    const time = (o as any).time || '';
    const name = (o as any).name || '';
    return [date && `${date} ${time}`, name].filter(Boolean).join(' — ');
  }
  if ((o as any).kind === 'court') return (o as any).courtName || 'Court';
  if ((o as any).kind === 'racket') return (o as any).label || 'Raquette';
  return 'Commande Ti Padel';
}

function getOrderTotal(o: Order) {
  if ((o as any).kind === 'menu') return Number((o as any).total || 0);
  if ((o as any).kind === 'racket') return Number((o as any).price || 0);
  if ((o as any).kind === 'court') return Number((o as any).price || 0);
  if ((o as any).kind === 'booking') return Number((o as any).price || 0);
  return 0;
}

function enrichTotals(list: Order[]): UIOrder[] {
  return (list || []).map((o) => ({ ...(o as any), __total: getOrderTotal(o) }));
}

function renderOrderDetails(o: Order) {
  if ((o as any).kind === 'court') {
    const price = (o as any).price;
    return <div>Terrain: {(o as any).courtName} {price ? `- ${formatEUR(Number(price))}` : ''}</div>;
    }
  if ((o as any).kind === 'menu') {
    const total = (o as any).total;
    const items = (o as any).items as { name: string; quantity: number }[] | undefined;
    return (
      <div>
        <div>Total {formatEUR(Number(total || 0))}</div>
        <div className="text-gray-600">{items?.map((it) => `${it.name} x${it.quantity}`).join(', ')}</div>
      </div>
    );
  }
  if ((o as any).kind === 'racket') {
    return <div>Location raquette: {(o as any).label} - {formatEUR(Number((o as any).price || 0))}</div>;
  }
  if ((o as any).kind === 'booking') {
    const price = (o as any).price;
    const date = (o as any).date ? new Date((o as any).date) : null;
    return (
      <div>
        <div>Réservation: {(o as any).serviceName} {price ? `- ${formatEUR(Number(price))}` : ''}</div>
        <div className="text-gray-600">
          {date ? date.toLocaleDateString('fr-FR') : ''} à {(o as any).time} — {(o as any).name} ({(o as any).email})
        </div>
      </div>
    );
  }
  return null;
}