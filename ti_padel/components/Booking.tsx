



'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Clock, CreditCard, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function Booking() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedService, setSelectedService] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const services = [
    { id: 'collectif', name: 'Padel entre amis', price: 35 },
    { id: 'particulier', name: 'Petite restauration', price: 80 },
    { id: 'randonnee', name: 'Séminaires d\'entreprise', price: 45 },
    { id: 'stage', name: 'Évenements', price: 280 }
  ];

  const timeSlots = [
    '09:00', '10:30', '12:00', '14:00', '15:30', '17:00'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = () => {
    // This would integrate with Stripe
    alert('Intégration Stripe requise - Veuillez configurer vos clés API Stripe pour activer les paiements.');
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <section id="reservation" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Réservation</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez votre créneau et réservez votre session de Padel en quelques clics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Détails de réservation</span>
                </CardTitle>
                <CardDescription>
                  Sélectionnez votre service, date et heure préférés
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Service Selection */}
                <div>
                  <Label htmlFor="service">Type de service</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez un service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div>
                  <Label>Date souhaitée</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="rounded-md border"
                    locale={fr}
                  />
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <Label htmlFor="time">Créneau horaire</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisissez un horaire" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{time}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes (optionnel)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Informations complémentaires, niveau d'expérience..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div>
            <Card className="border-0 shadow-sm sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Récapitulatif</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedServiceData && (
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{selectedServiceData.name}</span>
                      <span className="font-bold">{selectedServiceData.price}€</span>
                    </div>
                  </div>
                )}

                {selectedDate && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
                      </span>
                    </div>
                  </div>
                )}

                {selectedTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Heure:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                )}

                {selectedServiceData && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span>{selectedServiceData.price}€</span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handlePayment}
                  disabled={!selectedService || !selectedDate || !selectedTime || !formData.name || !formData.email}
                  className="w-full bg-black text-white hover:bg-gray-800 transition-colors duration-200"
                  size="lg"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payer avec Stripe
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Paiement sécurisé par Stripe. Annulation gratuite jusqu'à 24h avant.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}