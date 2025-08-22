'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {addOrder, CourtOrder} from '@/lib/orders';

interface Court {
    id: number;
    name: string;
    type: 'extérieur' | 'intérieur';
    surface: 'béton' | 'synthétique' | 'herbe';
    occupied: boolean;
    hourlyRate: number;
}

export function CourtsPage() {
    const [courts, setCourts] = useState<Court[]>([
        { id: 1, name: 'Terrain A', type: 'extérieur', surface: 'béton', occupied: false, hourlyRate: 12.5 },
        { id: 2, name: 'Terrain B', type: 'extérieur', surface: 'synthétique', occupied: true, hourlyRate: 12.5 },
        { id: 3, name: 'Terrain C', type: 'intérieur', surface: 'synthétique', occupied: false, hourlyRate: 12.5 },
        { id: 4, name: 'Terrain D', type: 'intérieur', surface: 'synthétique', occupied: false, hourlyRate: 12.5 },

    ]);

    const toggleCourtStatus = (id: number) => {
        const target = courts.find(c => c.id === id);
        if (target && !target.occupied) {
            // Save as an order when reserving a free court
            const courtOrder: Omit<CourtOrder, 'id' | 'createdAt'> = {
                kind: 'court',
                courtId: target.id,
                courtName: target.name,
                price: target.hourlyRate,
            };
            addOrder(courtOrder);
        }
        setCourts(courts.map(court =>
            court.id === id ? { ...court, occupied: !court.occupied } : court
        ));
    };

    // Composant simple pour représenter un terrain de padel
    const CourtVisual = ({ court }: { court: Court }) => (
        <div className="relative">
            <div className={`w-24 h-16 mx-auto rounded border-2 ${court.occupied ? 'bg-gray-200 border-gray-200' : 'border-green-500 bg-green-100'} flex items-center justify-center`}>
        <span className="text-xs font-bold text-center px-1">
          {court.name}
        </span>
            </div>

        </div>
    );

    return (
        <section id="terrains" className="py-24  bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Terrains de Padel</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Découvrez nos terrains de padel et réservez celui qui vous convient. <br></br>Tarif: 12,50€/90min
                    </p>
                </div>

                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Vue d'ensemble des terrains</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {courts.map((court) => (
                            <CourtVisual key={court.id} court={court} />
                        ))}
                    </div>
                </div>

                <Separator className="my-12" />

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Détails des terrains</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courts.map((court) => (
                            <Card key={court.id} className={court.occupied ? 'border-gray-200' : 'border-green-200'}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{court.name}</CardTitle>
                                            <CardDescription className="mt-2">
                                                <span className="capitalize">{court.type}</span> - Surface {court.surface}
                                            </CardDescription>
                                        </div>

                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-bold">{court.hourlyRate.toFixed(2)}€/heure</span>
                                        <span className="text-sm text-gray-500">Places: illimité</span>
                                    </div>
                                    <Button
                                        onClick={() => !court.occupied && toggleCourtStatus(court.id)}
                                        className={court.occupied
                                            ? 'w-full bg-black hover:bg-gray-800'
                                            : 'w-full bg-black hover:bg-gray-800'}
                                        disabled={court.occupied}
                                    >
                                        {court.occupied ? 'Libérer ce terrain' : 'Réserver ce terrain'}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="mt-12 bg-gray-50 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Informations sur les tarifs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-bold text-lg mb-2">Tarif standard</h3>
                            <p className="text-3xl font-bold text-gray-900">12,50€</p>
                            <p className="text-gray-600">Par heure</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-bold text-lg mb-2">Places</h3>
                            <p className="text-3xl font-bold text-gray-900">Illimité</p>
                            <p className="text-gray-600">Pas de limite de joueurs</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="font-bold text-lg mb-2">Réservation</h3>
                            <p className="text-gray-600">Réservez à l'avance pour garantir votre créneau</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
