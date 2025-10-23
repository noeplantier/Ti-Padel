'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Star, Trophy, Users, Calendar } from 'lucide-react';

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;


  const scrollToReservation = () => {
    const element = document.getElementById('reservation');
    element?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <section suppressHydrationWarning id="accueil" className="relative min-h-screen flex items-center justify-center hero-gradient celtic-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-6xl mt-2 md:text-9xl font-bold text-black mb-6 tracking-tight">
            Ti Padel
          </h1>
          
          <h2 className="text-xl md:text-4xl font-semibold text-black mb-4 mx-auto leading-relaxed">
            Découvrez le Padel dans toute sa splendeur.
          </h2>

          <h3 className="text-base md:text-xl font-medium text-gray-700 mx-auto leading-relaxed">
            Chez Ti Padel, nous cultivons la convivialité, le fair-play et la progression pour tous.<br></br> Notre club valorise l’esprit d’équipe, l’inclusion et le respect, dans une ambiance chaleureuse et accessible.
          </h3>
   
    

          {/* Tilted Cards */}
          <div className="mt-10 md:mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto mb-12">
              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-black/5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]">
                <div className="h-12 w-12 rounded-xl bg-black/5 text-black flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <MapPin className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-semibold text-black mb-1">Terrains Premium</h4>
                <p className="text-sm text-gray-600">Surfaces soignées, éclairage optimal, confort garanti.</p>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-black/5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]">
                <div className="h-12 w-12 rounded-xl bg-black/5 text-black flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <Users className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-semibold text-black mb-1">Communauté Active</h4>
                <p className="text-sm text-gray-600">Jouez, progressez et rencontrez des partenaires motivés.</p>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-black/5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]">
                <div className="h-12 w-12 rounded-xl bg-black/5 text-black flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <Trophy className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-semibold text-black mb-1">Tournois & Défis</h4>
                <p className="text-sm text-gray-600">Des événements réguliers pour se challenger en fun.</p>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-black/5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]">
                <div className="h-12 w-12 rounded-xl bg-black/5 text-black flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <Calendar className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-semibold text-black mb-1">Réservation Facile</h4>
                <p className="text-sm text-gray-600">Choisissez votre créneau en quelques secondes.</p>
              </div>
            </div>
          </div>

           

          {/* CTA Buttons */}
          <div className="mt-12 md:mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
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

      
          </div>
        </div>

      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 wave-decoration"></div>
    </section>
  );
}
