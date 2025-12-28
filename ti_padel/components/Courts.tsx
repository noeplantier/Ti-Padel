'use client';

import React, { useState } from 'react';
import { addBookingOrder } from '@/lib/orders';
import { Button } from 'react-day-picker';
import { ArrowRight } from 'lucide-react';

interface Court {
    id: number;
    name: string;
    surface: string;
    type: string;
    occupied: boolean;
    hourlyRate: number;
    capacity: number;
    features: string[];
    nextAvailable: string;
}

export default function Courts() {
    const [courts, setCourts] = useState<Court[]>([
        {
            id: 1,
            name: 'Court Central',
            surface: 'Gazon synthétique',
            type: 'Intérieur',
            occupied: false,
            hourlyRate: 25,
            capacity: 4,
            features: ['Climatisation', 'Éclairage LED', 'Gradins'],
            nextAvailable: '14:00'
        },
        {
            id: 2,
            name: 'Court 2',
            surface: 'Béton poreux',
            type: 'Extérieur',
            occupied: true,
            hourlyRate: 20,
            capacity: 4,
            features: ['Éclairage nocturne', 'Filet professionnel'],
            nextAvailable: '16:30'
        },
        {
            id: 3,
            name: 'Court 3',
            surface: 'Gazon synthétique',
            type: 'Intérieur',
            occupied: false,
            hourlyRate: 22,
            capacity: 4,
            features: ['Climatisation', 'Vestiaires premium'],
            nextAvailable: '13:00'
        },
        {
            id: 4,
            name: 'Court 4',
            surface: 'Résine',
            type: 'Couvert',
            occupied: false,
            hourlyRate: 18,
            capacity: 4,
            features: ['Éclairage LED', 'Sonorisation'],
            nextAvailable: '15:30'
        },
        {
            id: 5,
            name: 'Court 5',
            surface: 'Béton poreux',
            type: 'Extérieur',
            occupied: false,
            hourlyRate: 15,
            capacity: 4,
            features: ['Vue panoramique', 'Filet standard'],
            nextAvailable: '12:00'
        },
        {
            id: 6,
            name: 'Court Premium',
            surface: 'Gazon synthétique',
            type: 'Intérieur VIP',
            occupied: false,
            hourlyRate: 35,
            capacity: 4,
            features: ['Climatisation', 'Vestiaires VIP', 'Éclairage LED'],
            nextAvailable: '15:00'
        },
    ]);

    const toggleCourtStatus = (id: number) => {
        const target = courts.find(c => c.id === id);
        
        if (!target) return;
        
        if (!target.occupied) {
            // Utiliser addBookingOrder avec les propriétés correctes
            try {
                addBookingOrder({
                    date: new Date().toISOString().split('T')[0], // Date du jour
                    time: target.nextAvailable, // Heure de disponibilité
                    courtId: target.id,
                    courtName: target.name,
                    price: target.hourlyRate,
                    surface: target.surface,
                    type: target.type,
                    duration: 90, // 90 minutes
                    name: 'Réservation rapide',
                });
                
                // Marquer le terrain comme occupé
                setCourts(prev => prev.map(court =>
                    court.id === id ? { ...court, occupied: true } : court
                ));
            } catch (error) {
                console.error('Erreur lors de l\'ajout de la réservation:', error);
            }
        } else {
            // Libérer le terrain
            setCourts(prev => prev.map(court =>
                court.id === id ? { ...court, occupied: false } : court
            ));
        }
    };

    const liberateAllCourts = () => {
        setCourts(prev => prev.map(court => ({ ...court, occupied: false })));
    };

    return (
        <section id="courts" className="py-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        Nos Terrains
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Des installations de qualité professionnelle pour tous les niveaux
                    </p>
                 
            <button 
                onClick={liberateAllCourts}
                className="bg-black text-white hover:bg-gray-800 px-6 py-2 text-lg group transition-all duration-300 rounded-lg font-semibold mt-6"
            >
                Libérer tous les terrains
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200 inline" />
            </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courts.map((court) => (
                        <div
                            key={court.id}
                            className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                                court.occupied ? 'opacity-75' : 'hover:-translate-y-1'
                            }`}
                        >
                            {/* Header avec statut */}
                            <div className={`p-6 ${court.occupied ? 'bg-red-50' : 'bg-green-50'}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {court.name}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                court.occupied 
                                                    ? 'bg-red-100 text-red-700' 
                                                    : 'bg-green-100 text-green-700'
                                            }`}>
                                                {court.occupied ? 'Occupé' : 'Disponible'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-black">
                                            {court.hourlyRate}€
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            par heure
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Caractéristiques */}
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <span className="text-sm text-gray-700">{court.type}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                        </svg>
                                        <span className="text-sm text-gray-700">{court.surface}</span>
                                    </div>
                                </div>

                                {/* Équipements */}
                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Équipements</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {court.features.map((feature, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>

             
                                {/* Bouton d'action */}
                                <button
                                    onClick={() => toggleCourtStatus(court.id)}
                                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                                        court.occupied
                                            ? 'bg-gray-200 text-gray-700 '
                                            : 'bg-black text-white  shadow-lg hover:shadow-xl'
                                    }`}
                                >
                                    {court.occupied ? 'Libérer le terrain' : 'Réserver maintenant'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}