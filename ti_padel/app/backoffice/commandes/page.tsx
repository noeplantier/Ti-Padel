'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Trash2, AlertCircle, CheckCircle, Clock, ShoppingCart, Euro, FileText } from 'lucide-react';
import { getOrders, removeOrder, clearOrders, type Order } from '@/lib/orders';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

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
  }, [canPay]);

  if (!mounted) return <main className="min-h-screen bg-gray-50 py-8" suppressHydrationWarning />;

  return (

    
    <main className="min-h-screen bg-gray-50 py-8">

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}

                {/* Body */}

        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between mt-10">
          <Link href="/" className="sm:pt-1">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <div className="text-center sm:text-right">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestion des commandes</h1>
            <p className="text-sm md:text-base text-gray-600">
              Gestion des commandes et paiements sécurisés
            </p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" /> Commandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{stats.count}</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <Euro className="h-4 w-4" /> Total (EUR)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{formatEUR(stats.total)}</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button
                variant="destructive"
                onClick={handleClear}
                disabled={orders.length === 0 || busyClear}
                className="inline-flex items-center gap-2 w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4" />
                Tout effacer
              </Button>
              {!canPay && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Paiement désactivé
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2" aria-live="polite">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Orders List */}
        <div className="mt-8">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Commandes ({orders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Aucune commande enregistrée.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {orders.map((o) => (
                    <div key={o.id} className="rounded-xl border border-gray-200 p-4 sm:p-5 lg:p-6 bg-white hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {o.kind === 'court' ? 'Terrain' :
                             o.kind === 'menu' ? 'Snack' :
                             o.kind === 'racket' ? 'Raquette' : 'Réservation'}
                          </Badge>
                          <div className="font-semibold text-gray-900">
                            {getOrderLabel(o)} — <span className="text-gray-700">{formatEUR(o.__total || 0)}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(o.createdAt)}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">{renderOrderDetails(o)}</div>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <Button
                          variant="default"
                          onClick={() => handlePay(o)}
                          disabled={payingId === o.id || !canPay || Number(o.__total || 0) <= 0}
                          className="inline-flex items-center gap-2 w-full sm:w-auto"
                        >
                          <CreditCard className="h-4 w-4" />
                          {payingId === o.id ? 'Redirection...' : 'Payer'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleRemove(o.id)}
                          className="inline-flex items-center gap-2 w-full sm:w-auto"
                        >
                          <Trash2 className="h-4 w-4" />
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
    case 'court': return `Terrain ${(o.courtName || '').toString().trim() || 'Inconnu'}`;
    case 'menu': return 'Snacks/Boissons';
    case 'racket': return `Location raquette${o.label ? ` - ${o.label}` : ''}`;
    case 'booking': return `Réservation ${(o.serviceName || '').toString().trim() || 'Inconnue'}`;
    default: return 'Commande';
  }
}

function getOrderDescription(o: Order) {
  if (o.kind === 'menu') {
    const items = o.items as { name: string; quantity: number }[] | undefined;
    return items?.length ? items.map((it) => `${it.name} x${it.quantity}`).join(', ') : 'Commande snack';
  }
  if (o.kind === 'booking') {
    const date = o.date ? new Date(o.date).toLocaleDateString('fr-FR') : '';
    const time = o.time || '';
    const name = o.name || '';
    return [date && `${date} ${time}`, name].filter(Boolean).join(' — ');
  }
  if (o.kind === 'court') return o.courtName || 'Court';
  if (o.kind === 'racket') return o.label || 'Raquette';
  return 'Commande Ti Padel';
}

function getOrderTotal(o: Order) {
  if (o.kind === 'menu') return Number(o.total || 0);
  if (o.kind === 'racket') return Number(o.price || 0);
  if (o.kind === 'court') return Number(o.price || 0);
  if (o.kind === 'booking') return Number(o.price || 0);
  return 0;
}

function enrichTotals(list: Order[]): UIOrder[] {
  return (list || []).map((o) => ({ ...o, __total: getOrderTotal(o) }));
}

function renderOrderDetails(o: Order) {
  if (o.kind === 'court') {
    return <div>Terrain: {o.courtName} {o.price ? `- ${formatEUR(Number(o.price))}` : ''}</div>;
  }
  if (o.kind === 'menu') {
    const items = o.items as { name: string; quantity: number }[] | undefined;
    return (
      <div>
        <div>Total {formatEUR(Number(o.total || 0))}</div>
        <div className="text-gray-600">{items?.map((it) => `${it.name} x${it.quantity}`).join(', ')}</div>
      </div>
    );
  }
  if (o.kind === 'racket') {
    return <div>Location raquette: {o.label} - {formatEUR(Number(o.price || 0))}</div>;
  }
  if (o.kind === 'booking') {
    const date = o.date ? new Date(o.date) : null;
    return (
      <div>
        <div>Réservation: {o.serviceName} {o.price ? `- ${formatEUR(Number(o.price))}` : ''}</div>
        <div className="text-gray-600">
          {date ? date.toLocaleDateString('fr-FR') : ''} à {o.time} — {o.name} ({o.email})
        </div>
      </div>
    );
  }
  return null;
}
