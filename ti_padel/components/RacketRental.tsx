'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {addOrder, RacketOrder} from '@/lib/orders';

interface Racket {
    id: number;
    brand: string;
    model: string;
    weight: string;
    balance: string;
    price: number;
}

export function RacketRental() {
    const [racketRental, setRacketRental] = useState(false);
    const [selectedRacket, setSelectedRacket] = useState<number | null>(null);

    const rackets: Racket[] = [
        { id: 1, brand: 'Location Raquette', model: '', weight: '370g', balance: 'Équilibrée', price: 2.0 },

    ];

    const toggleRacketRental = () => {
        setRacketRental(!racketRental);
        if (!racketRental) {
            setSelectedRacket(1); // Sélectionner la première raquette par défaut
        } else {
            setSelectedRacket(null);
        }
    };

    return (
        <section id="location" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Location de raquettes de padel</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Vous n'avez pas de raquette ? Pas de problème !<br></br> Louez une de nos raquettes professionnelles.
                    </p>
                </div>

                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Location de raquette</CardTitle>
                        <CardDescription>
                            Ajoutez une location de raquette à votre réservation pour 5€-6.5€ par session
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-8">
                            <Label htmlFor="racket-rental" className="text-lg font-medium">
                                Souhaitez-vous louer une raquette ?
                            </Label>
                            <Switch
                                id="racket-rental"
                                checked={racketRental}
                                onCheckedChange={toggleRacketRental}
                            />
                        </div>

                        {racketRental && (
                            <div className="mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {rackets.map((racket) => (
                                        <Card
                                            key={racket.id}
                                            className={`cursor-pointer transition-all ${
                                                selectedRacket === racket.id
                                                    ? 'border-2 border-black ring-2 ring-black ring-opacity-20'
                                                    : 'border-gray-200'
                                            }`}
                                            onClick={() => setSelectedRacket(racket.id)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold">{racket.brand}</h4>
                                                        <p className="text-gray-600">{racket.model}</p>
                                                    </div>
                                                    <span className="font-bold">{racket.price.toFixed(2)}€</span>
                                                </div>
                                                <div className="mt-3 text-sm text-gray-500">
                                                    <p>Poids: {racket.weight}</p>
                                                    <p>Équilibre: {racket.balance}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-lg">
                                        Coût total de la location: {
                                        selectedRacket
                                            ? rackets.find(r => r.id === selectedRacket)?.price.toFixed(2)
                                            : '0.00'
                                    }€
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="mt-8">
                            <Button
                                className={`w-full ${racketRental ? 'bg-black hover:bg-gray-800' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                                disabled={!racketRental}
                                onClick={() => {
                                    if (!racketRental || !selectedRacket) return;
                                    const r = rackets.find(rr => rr.id === selectedRacket);
                                    if (!r) return;
                                    const racketOrder: Omit<RacketOrder, 'id' | 'createdAt'> = {
                                        kind: 'racket',
                                        racketId: r.id,
                                        label: `${r.brand} ${r.model}`.trim(),
                                        price: r.price,
                                    };
                                    addOrder(racketOrder);
                                    alert('Location ajoutée à votre réservation');
                                }}
                            >
                                {racketRental
                                    ? `Ajouter la location (${selectedRacket ? rackets.find(r => r.id === selectedRacket)?.price.toFixed(2) : '0.00'}€)`
                                    : 'Location de raquette non sélectionnée'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
