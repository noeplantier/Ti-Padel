'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { addOrder, type CourtOrder } from '@/lib/orders';
import { MapPin, Users, Calendar, Clock } from 'lucide-react';

interface Court {
    id: number;
    name: string;
    type: 'extérieur' | 'intérieur';
    surface: string;
    occupied: boolean;
    hourlyRate: number;
    capacity?: number;
    features?: string[];
    nextAvailable?: string;
}

export function CourtsPage() {
const [courts, setCourts] = useState<Court[]>([
        { 
            id: 1, 
            name: 'Terrain A', 
            type: 'extérieur', 
            surface: 'béton', 
            occupied: false, 
            hourlyRate: 12.5,
            capacity: 4,
            features: ['Éclairage LED', 'Vestiaires'],
            nextAvailable: '14:00'
        },
        { 
            id: 2, 
            name: 'Terrain B', 
            type: 'extérieur', 
            surface: 'synthétique', 
            occupied: true, 
            hourlyRate: 12.5,
            capacity: 4,
            features: ['Éclairage LED', 'Vestiaires', 'Gradin'],
            nextAvailable: '16:30'
        },
        { 
            id: 3, 
            name: 'Terrain C', 
            type: 'intérieur', 
            surface: 'synthétique', 
            occupied: false, 
            hourlyRate: 12.5,
            capacity: 4,
            features: ['Climatisation', 'Vestiaires', 'Éclairage LED'],
            nextAvailable: '15:00'
        },
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

    const liberateAllCourts = () => {
        setCourts(courts.map(court => ({ ...court, occupied: false })));
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
        <section id="terrains" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                <h2 className="text-6xl font-bold text-black mb-4">Nos Terrains</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Découvrez nos terrains de padel et réservez celui qui vous convient. <br />Tarif: 12,50€/90min
                    </p>
                </div>

                {/* Bouton pour libérer tous les terrains */}
                <div className="mb-8 text-center">
                    <Button 
                        onClick={liberateAllCourts}
                        variant="outline"
                        className="bg-white hover:bg-gray-50 border-gray-500 text-gray-700 hover:text-gray-900 font-semibold" 
                        size={'lg'}
                    >
                        Libérer tous les terrains
                    </Button>
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
                            <Card key={court.id} className={court.occupied ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="flex items-center space-x-2">
                                                <span>{court.name}</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    court.occupied 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {court.occupied ? 'Occupé' : 'Libre'}
                                                </span>
                                            </CardTitle>
                                            <CardDescription className="mt-2">
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="h-4 w-4" />
                                                        <span className="capitalize">{court.type} - Surface {court.surface}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Users className="h-4 w-4" />
                                                        <span>Capacité: {court.capacity} joueurs</span>
                                                    </div>
                                                    {court.nextAvailable && (
                                                        <div className="flex items-center space-x-2">
                                                            <Clock className="h-4 w-4" />
                                                            <span>Prochain créneau: {court.nextAvailable}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {/* Équipements */}
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-sm mb-2">Équipements:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {court.features?.map((feature, index) => (
                                                <span 
                                                    key={index}
                                                    className="px-2 py-1 bg-white rounded-md text-xs border"
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-bold">{court.hourlyRate.toFixed(2)}€/90min</span>
                                        <span className="text-sm text-gray-500">90 minutes de jeu</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        onClick={() => toggleCourtStatus(court.id)}
                                        className={`w-full ${
                                            court.occupied
                                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                                : 'bg-green-600 hover:bg-green-700 text-white'
                                        }`}
                                    >
                                        {court.occupied ? 'Libérer ce terrain' : 'Réserver ce terrain'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Informations sur les tarifs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">Tarif standard</h3>
                            <p className="text-3xl font-bold text-gray-900">12,50€</p>
                            <p className="text-gray-600">Par session de 90 minutes</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">Capacité</h3>
                            <p className="text-3xl font-bold text-gray-900">4</p>
                            <p className="text-gray-600">Joueurs maximum par terrain</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">Réservation</h3>
                            <p className="text-3xl font-bold text-gray-900">24h</p>
                            <p className="text-gray-600">À l'avance recommandé</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}