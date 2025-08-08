'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Star } from 'lucide-react';

export function Hero() {
  const scrollToReservation = () => {
    const element = document.getElementById('reservation');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center hero-gradient celtic-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
   

          {/* Main Heading */}
          <h1 className="text-6xl mt-3 md:text-8xl font-bold text-black mb-6 tracking-tight">
            Ti Padel
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
            Découvrez le Padel dans toute sa splendeur.
          </p>
          
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Cours d'entraînement personnalisés pour tous niveaux dans un cadre exceptionnel. 
            Réservez votre session dès maintenant.
          </p>

                 {/* Hero Badge */}
                 <div className="inline-flex items-center space-x-2 bg-black/5 rounded-full px-6 py-2 mb-8">
            <Star className="h-4 w-4 text-black" />
            <span className="text-sm font-medium text-gray-700">Centre d'excellence Padel en Bretagne</span>
          </div>
          <br></br>

          {/* Location Badge */}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button 
              onClick={scrollToReservation}
              size="lg" 
              className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg group transition-all duration-300"
            >
              Réserver une session
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg transition-all duration-300"
            >
              Découvrir nos services
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mt-16 pt-16 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">500+</div>
              <div className="text-sm text-gray-600">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">150+</div>
              <div className="text-sm text-gray-600">Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">5★</div>
              <div className="text-sm text-gray-600">Évaluation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 wave-decoration"></div>
    </section>
  );
}