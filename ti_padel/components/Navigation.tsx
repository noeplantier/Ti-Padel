'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

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
              <Image
                  src="/images/tipadel-logo.png"
                  alt="Ti Padel Logo"
                  width={100}
                  height={100}
                  className="h-50 w-50"
              />
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
                  onClick={() => scrollToSection('terrains')}
                  className="text-gray-700 hover:text-black transition-colors duration-200"
              >
                Terrains
              </button>
              <button
                  onClick={() => scrollToSection('carte')}
                  className="text-gray-700 hover:text-black transition-colors duration-200"
              >
                Carte
              </button>
              <button
                  onClick={() => scrollToSection('location')}
                  className="text-gray-700 hover:text-black transition-colors duration-200"
              >
                Location
              </button>
              <button
                  onClick={() => scrollToSection('propos')}
                  className="text-gray-700 hover:text-black transition-colors duration-200"
              >
                À Propos
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
                  <Link
                      href="/courts"
                      className="block px-3 py-2 text-gray-700 hover:text-black transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Terrains
                  </Link>
                  <Link
                      href="/menu"
                      className="block px-3 py-2 text-gray-700 hover:text-black transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Carte
                  </Link>
                  <Link
                      href="/racket-rental"
                      className="block px-3 py-2 text-gray-700 hover:text-black transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Location
                  </Link>
                  <button
                      onClick={() => scrollToSection('propos')}
                      className="block px-3 py-2 text-gray-700 hover:text-black transition-colors duration-200"
                  >
                    À Propos
                  </button>
                  <button
                      onClick={() => scrollToSection('contact')}
                      className="block px-3 py-2 text-gray-700 hover:text-black transition-colors duration-200"
                  >
                    Contact
                  </button>
                  <button
                      onClick={() => scrollToSection('reservation')}
                      className="block px-3 py-2 text-gray-700 hover:text-black transition-colors duration-200"
                  >
                    Réservation
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