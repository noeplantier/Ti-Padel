'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import  Courts  from '@/components/Courts';
import { MenuPage } from '@/components/Menu';
import { RacketRental } from '@/components/RacketRental';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getOrders, Order } from '@/lib/orders';

export default function ReservationPage() {
    const [activeTab, setActiveTab] = useState('courts');
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

    return (
        <main className="min-h-screen bg-white">
            <Navigation />

            <div className="pt-24 pb-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Réservation complète</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Réservez votre terrain, commandez des boissons/snacks et louez du matériel
                        </p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                            <TabsTrigger value="courts">Terrains</TabsTrigger>
                            <TabsTrigger value="menu">Boissons & Snacks</TabsTrigger>
                            <TabsTrigger value="rackets">Raquettes</TabsTrigger>
                        </TabsList>

                        <TabsContent value="courts">
                            <Courts />
                        </TabsContent>

                        <TabsContent value="menu">
                            <MenuPage />
                        </TabsContent>

                        <TabsContent value="rackets">
                            <RacketRental />
                        </TabsContent>
                    </Tabs>

                    <Card className="mt-12">
                        <CardHeader>
                            <CardTitle>Résumé de votre réservation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {orders.length === 0 ? (
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <p className="text-gray-600">
                                        Vous n'avez pas encore ajouté d'éléments à votre réservation
                                    </p>
                                    <Button className="bg-black text-white hover:bg-gray-800">
                                        Finaliser la réservation
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((o) => (
                                        <div key={o.id} className="flex items-center justify-between border-b pb-3">
                                            <div>
                                                <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                                                {o.kind === 'product' && (
                                                    <div className="font-medium">Terrain réservé: {(o as any).courtName} {(o as any).price ? `- ${(o as any).price.toFixed?.(2) || (o as any).price}€` : ''}</div>
                                                )}
                                                {o.kind === 'product' && (
                                                    <div>
                                                        <div className="font-medium">Commande snack/boissons - Total {(o as any).total.toFixed(2)}€</div>
                                                        <div className="text-sm text-gray-600">{(o as any).items.map((it: any) => `${it.name} x${it.quantity}`).join(', ')}</div>
                                                    </div>
                                                )}
                                                {o.kind === 'racket' && (
                                                    <div className="font-medium">Location raquette: {(o as any).label} - {(o as any).price.toFixed(2)}€</div>
                                                )}
                                                {o.kind === 'booking' && (
                                                    <div>
                                                        <div className="font-medium">Réservation: {(o as any).serviceName} {(o as any).price ? `- ${(o as any).price}€` : ''}</div>
                                                        <div className="text-sm text-gray-600">{new Date((o as any).date).toLocaleDateString()} à {(o as any).time}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="text-right">
                                        <Button className="bg-black text-white hover:bg-gray-800">Finaliser la réservation</Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
