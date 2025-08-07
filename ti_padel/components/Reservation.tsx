'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { CourtsPage } from '@/components/Courts';
import { MenuPage } from '@/components/Menu';
import { RacketRental } from '@/components/RacketRental';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ReservationPage() {
    const [activeTab, setActiveTab] = useState('courts');

    return (
        <main className="min-h-screen bg-white">
            <Navigation />

            <div className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
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
                            <CourtsPage />
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
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <p className="text-gray-600">
                                    Vous n'avez pas encore ajouté d'éléments à votre réservation
                                </p>
                                <Button className="bg-black text-white hover:bg-gray-800">
                                    Finaliser la réservation
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
