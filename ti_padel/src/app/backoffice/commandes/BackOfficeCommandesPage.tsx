'use client';

import { useEffect, useMemo, useState } from 'react';
import { getOrders, removeOrder, clearOrders, type Order } from '@/lib/orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

type UIOrder = Order & { __total?: number };

export default function BackOfficeCommandesPage() {
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyClear, setBusyClear] = useState(false);

  useEffect(() => {
    // Charge initiale
    setOrders(enrichTotals(getOrders()));
    // Sync multi-onglets
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'ti-padel-orders') {
        setOrders(enrichTotals(getOrders()));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const canPay = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  const stats = useMemo(() => {
    const count = orders.length;
    const total = orders.reduce((acc, o) => acc + (o.__total || 0), 0);
    return { count, total };
  }, [orders]);

  const handleRemove = (id: string) => {
    setError(null);
    const updated = removeOrder(id) as UIOrder[];
    setOrders(enrichTotals(updated));
  };

  const handleClear = async () => {
    setError(null);
    if (!confirm('Supprimer toutes les commandes ?')) return;
    try {
      setBusyClear(true);
      clearOrders();
      setOrders([]);
    } finally {
      setBusyClear(false);
    }
  };

  const handlePay = async (o: UIOrder) => {
    setError(null);
    if (!canPay) {
      setError('Paiement indisponible: clé publique Stripe manquante (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).');
      return;
    }
    const stripe = await stripePromise;
    if (!stripe) {
      setError('Échec d’initialisation de Stripe.');
      return;
    }

    try {
      setPayingId(o.id);
      // Préparation des données de paiement (montant en centimes)
      const amount = Math.round(((o.__total ?? 0) || 0) * 100);
      if (amount <= 0) {
        throw new Error('Montant invalide ou à 0.');
      }

      const payload = {
        mode: 'payment',
        currency: 'eur',
        metadata: {
          orderId: o.id,
          kind: o.kind,
        },
        // Exemple de ligne (le backend doit créer la session Stripe)
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
        // URLs de redirection (adapter les routes si besoin)
        success_url: `${window.location.origin}/success?orderId=${encodeURIComponent(o.id)}`,
        cancel_url: `${window.location.origin}/cancel?orderId=${encodeURIComponent(o.id)}`,
      };

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Création de session Stripe échouée.');
      }

      const data = await res.json();
      // Supporte {id} ou {url} renvoyé par l’API
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
  };



  function formatDateTime(createdAt: any): import("react").ReactNode {
    throw new Error('Function not implemented.');
  }

  function renderOrderDetails(o: UIOrder): import("react").ReactNode {
    throw new Error('Function not implemented.');
  }

  return (
    <main className="min-h-screen bg-white py-6">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* En-tête / Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à l'accueil</span>
            </Button>
          </Link>
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-bold">Back Office — Commandes</h1>
            <p className="text-sm md:text-base text-gray-600">
              Gérez vos commandes et encaissez les paiements en toute sécurité via Stripe.
            </p>
          </div>
        </div>

        {/* Stats + Actions globales */}
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
            <CardContent className="flex items-center gap-3">
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
                  Paiement désactivé (env NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY manquante).
                </span>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Zone d’alerte */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Liste des commandes */}
        <div className="mt-8 space-y-4">
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
                    <div
                      key={o.id}
                      className="rounded-xl border border-gray-200 p-4 sm:p-5 lg:p-6 bg-white/60"
                    >
                      {/* En-tête item */}
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="font-semibold">
                          {getOrderLabel(o)} — <span className="text-black">{formatEUR(o.__total || 0)}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDateTime((o as any).createdAt)}
                        </div>
                      </div>

                      {/* Détails */}
                      <div className="mt-2 text-sm text-gray-700">
                        {renderOrderDetails(o)}
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <Button
                          variant="default"
                          onClick={() => handlePay(o)}
                          disabled={payingId === o.id || !canPay || (o.__total || 0) <= 0}
                          className="inline-flex items-center gap-2"
                        >
                          <CreditCard className="h-4 w-4" />
                          {payingId === o.id ? 'Redirection vers Stripe…' : 'Effectuer le paiement'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleRemove(o.id)}
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
        </div>
      </div>
    </main>
  );
}


/* ---------- Utils ---------- */

function formatEUR(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n || 0);
}

function formatDateTime(v: any) {
  try {
    const d = new Date(v);
    return d.toLocaleString('fr-FR');
  } catch {
    return '';
  }
}

function getOrderLabel(o: Order) {
  switch (o.kind) {
    case 'court':
      return `Terrain ${((o as any).courtName || '').toString().trim() || ''}`.trim() || 'Terrain';
    case 'menu':
      return 'Boissons / Snacks';
    case 'racket':
      return `Location raquette${(o as any).label ? ` - ${(o as any).label}` : ''}`;
    case 'booking':
      return `Réservation ${((o as any).serviceName || '').toString().trim() || ''}`.trim() || 'Réservation';
    default:
      return 'Commande';
  }
}

function getOrderDescription(o: Order) {
  if (o.kind === 'menu') {
    const items = (o as any).items as { name: string; quantity: number }[] | undefined;
    return items && items.length
      ? items.map((it) => `${it.name} x${it.quantity}`).join(', ')
      : 'Commande snack';
  }
  if (o.kind === 'booking') {
    const date = (o as any).date ? new Date((o as any).date).toLocaleDateString('fr-FR') : '';
    const time = (o as any).time || '';
    const name = (o as any).name || '';
    return [date && `${date} ${time}`, name].filter(Boolean).join(' — ');
  }
  if (o.kind === 'court') {
    return (o as any).courtName || 'Court';
  }
  if (o.kind === 'racket') {
    return (o as any).label || 'Raquette';
  }
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
  return list.map((o) => ({ ...(o as any), __total: getOrderTotal(o) }));
}

function renderOrderDetails(o: Order) {
  if (o.kind === 'court') {
    const price = (o as any).price;
    return (
      <div>
        Terrain: {(o as any).courtName}{' '}
        {price ? `- ${formatEUR(Number(price))}` : ''}
      </div>
    );
  }
  if (o.kind === 'menu') {
    const total = (o as any).total;
    const items = (o as any).items as { name: string; quantity: number }[] | undefined;
    return (
      <div>
        <div>Total {formatEUR(Number(total || 0))}</div>
        <div className="text-gray-600">{items?.map((it) => `${it.name} x${it.quantity}`).join(', ')}</div>
      </div>
    );
  }
  if (o.kind === 'racket') {
    return (
      <div>
        Location raquette: {(o as any).label} - {formatEUR(Number((o as any).price || 0))}
      </div>
    );
  }
  if (o.kind === 'booking') {
    const price = (o as any).price;
    return (
      <div>
        <div>Réservation: {(o as any).serviceName} {price ? `- ${formatEUR(Number(price))}` : ''}</div>
        <div className="text-gray-600">
          {new Date((o as any).date).toLocaleDateString('fr-FR')} à {(o as any).time} — {(o as any).name} ({(o as any).email})
        </div>
      </div>
    );
  }
  return null;
}