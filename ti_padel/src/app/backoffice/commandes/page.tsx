"use client";

import { useEffect, useState } from 'react';
import { getOrders, removeOrder, clearOrders, Order } from '@/lib/orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function BackOfficeCommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getOrders());
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'ti-padel-orders') {
        setOrders(getOrders());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleRemove = (id: string) => {
    const updated = removeOrder(id);
    setOrders(updated);
  };

  const handleClear = () => {
    if (confirm('Supprimer toutes les commandes ?')) {
      clearOrders();
      setOrders([]);
    }
  };

  return (
    <main className="min-h-screen bg-white py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Back Office - Commandes</h1>
          {orders.length > 0 && (
            <Button variant="destructive" onClick={handleClear}>Tout effacer</Button>
          )}
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Liste des commandes ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-gray-600">Aucune commande enregistrée pour le moment.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="flex items-start justify-between border-b pb-3">
                    <div>
                      <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                      {o.kind === 'court' && (
                        <div className="font-medium">Terrain: {(o as any).courtName} {(o as any).price ? `- ${(o as any).price.toFixed?.(2) || (o as any).price}€` : ''}</div>
                      )}
                      {o.kind === 'menu' && (
                        <div>
                          <div className="font-medium">Boissons/Snacks - Total {(o as any).total.toFixed(2)}€</div>
                          <div className="text-sm text-gray-600">{(o as any).items.map((it: any) => `${it.name} x${it.quantity}`).join(', ')}</div>
                        </div>
                      )}
                      {o.kind === 'racket' && (
                        <div className="font-medium">Location raquette: {(o as any).label} - {(o as any).price.toFixed(2)}€</div>
                      )}
                      {o.kind === 'booking' && (
                        <div>
                          <div className="font-medium">Réservation: {(o as any).serviceName} {(o as any).price ? `- ${(o as any).price}€` : ''}</div>
                          <div className="text-sm text-gray-600">{new Date((o as any).date).toLocaleDateString()} à {(o as any).time} — {(o as any).name} ({(o as any).email})</div>
                        </div>
                      )}
                    </div>
                    <div>
                      <Button variant="outline" size="sm" onClick={() => handleRemove(o.id)}>Supprimer</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
