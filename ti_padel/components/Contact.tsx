'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {MapPin, Phone, Mail, Clock, BadgeCheck, Facebook, Instagram, LinkedinIcon, MessageCircle} from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Contact</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une question ? Besoin d'informations ? Contactez-nous, nous vous répondrons rapidement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6 order-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-black/5 rounded-lg">
                    <MapPin className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-2">Adresse</h3>
                    <p className="text-gray-600">
                      Club Ti Padel<br />
                      56150 Baud<br />
                      Bretagne, France
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-black/5 rounded-lg">
                    <Phone className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-2">Téléphone</h3>
                    <p className="text-gray-600">+33 2 98 56 78 90</p>
                  </div>
                </div>
              </CardContent>
            </Card>



            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-black/5 rounded-lg">
                    <Mail className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-2">Email</h3>
                    <p className="text-gray-600">tipadelbaud@gmail.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-black/5 rounded-lg">
                    <Clock className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-2">Horaires</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Lun - Dim: 9h - 22h30</p>
                      <p className="text-sm">Fermé le dimanche en hiver</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}

          <Card className="border-0 shadow-sm order-2">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-black/5 rounded-lg">
                  <BadgeCheck className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2">Réseaux</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      <LinkedinIcon className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      <MessageCircle className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 order-1">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Envoyez-nous un message sur nos réseaux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-name">Nom</Label>
                    <Input id="contact-name" placeholder="Votre nom" />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email</Label>
                    <Input id="contact-email" type="email" placeholder="votre@email.com" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contact-subject">Sujet</Label>
                  <Input id="contact-subject" placeholder="Sujet de votre message" />
                </div>

                <div>
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Votre message..."
                    rows={6}
                  />
                </div>

                <Button className="w-full bg-black text-white hover:bg-gray-800 transition-colors duration-200" size="lg">
                  Envoyer le message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}