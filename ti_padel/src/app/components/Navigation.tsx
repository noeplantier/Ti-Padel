'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Waves } from 'lucide-react';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Waves className="h-8 w-8 text-black" />
            <span className="text-2xl font-bold text-black">Ti Paddle</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('accueil')}
              className="text-gray-700 hover:text-black transition-colors duration-200"
            >
              Accueil
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-black transition-colors duration-200"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('propos')}
              className="text-gray-700 hover:text-black transition-colors duration-200"
            >
              À Propos
            </button>
            <button 
              onClick={() => scrollToSection('reservation')}
              className="text-gray-700 hover:text-black transition-colors duration-200"
            >
              Réservation
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-black transition-colors duration-200"
            >
              Contact
            </button>
            <Button 
              onClick={() => scrollToSection('reservation')}
              className="bg-black text-white hover:bg-gray-800 transition-colors duration-200"
            >
              Réserver Maintenant
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => scrollToSection('accueil')}
                className="block px-3 py-2 text-gray-700 hover:text-black transition-colors duration-200"
              >
                Accueil
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="block px-3 py-2 text-gray-700 hover:text-black transition-colors duration-200"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('propos')}
                className="block px-3 py-2 text-gray-700 hover:text-black transition-colors duration-200"
              >
                À Propos
              </button>
              <button 
                onClick={() => scrollToSection('reservation')}
                className="block px-3 py-2 text-gray-700 hover:text-black transition-colors duration-200"
              >
                Réservation
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block px-3 py-2 text-gray-700 hover:text-black transition-colors duration-200"
              >
                Contact
              </button>
              <div className="px-3 py-2">
                <Button 
                  onClick={() => scrollToSection('reservation')}
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  Réserver Maintenant
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}