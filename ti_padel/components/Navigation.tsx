'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, ShoppingCart, X } from 'lucide-react';
import Image from 'next/image';
import '../src/app/globals.css';

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
        <div className="max-w-7xl mx-auto px-0"> {/* px-0 pour supprimer les marges latérales */}
          <div className="flex items-center justify-between h-16 w-full">
            {/* Logo à l'extrême gauche, sans marge */}
            <div className="ml-0">
              <Image
                  src="/images/tipadel-logo.png"
                  alt="Ti Padel Logo"
                  width={100}
                  height={100}
                  className="shaking-image h-12 w-12"
              />
            </div>

            {/* Desktop Navigation centrée */}
            <div className="hidden md:flex md:absolute md:left-1/2 md:transform md:-translate-x-1/2 items-center space-x-8">
              <button
                  onClick={() => scrollToSection('accueil')}
                  className="gradient-underline-effect text-gray-900 hover:text-black font-bold"
              >
                Accueil
              </button>
              <button
                  onClick={() => scrollToSection('services')}
                  className="gradient-underline-effect text-gray-900 hover:text-black font-bold"
              >
                Services
              </button>
              <button
                  onClick={() => scrollToSection('propos')}
                  className="gradient-underline-effect text-gray-900 hover:text-black font-bold"
              >
                À Propos
              </button>
              <button
                  onClick={() => scrollToSection('terrains')}
                  className="gradient-underline-effect text-gray-900 hover:text-black font-bold"
              >
                Terrains
              </button>
              <button
                  onClick={() => scrollToSection('reservation')}
                  className="gradient-underline-effect text-gray-900 hover:text-black font-bold"
              >
                Réserver
              </button>

              <button
                  onClick={() => scrollToSection('carte')}
                  className="gradient-underline-effect text-gray-900 hover:text-black font-bold"
              >
                Carte
              </button>
              <button
                  onClick={() => scrollToSection('contact')}
                  className="gradient-underline-effect text-gray-900 hover:text-black font-bold"
              >
                Contact
              </button>
            </div>

            {/* Panier à l'extrême droite, sans marge */}
            <div className="hidden md:block mr-0">
              <Link href="/backoffice/commandes" className="text-black">
                <ShoppingCart className="h-8 w-8" />
              </Link>
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
                      className="gradient-underline-effect text-gray-900 hover:text-black font-bold"
                  >
                    Accueil
                  </button>
                  <button
                      onClick={() => scrollToSection('services')}
                      className="gradient-underline-effect text-gray-900 hover:text-black font-bold"
                  >
                    Services
                  </button>
                  <button
                      onClick={() => scrollToSection('propos')}
                      className="gradient-underline-effect text-gray-900 hover:text-black font-bold"
                  >
                    À Propos
                  </button>
                  <button
                      onClick={() => scrollToSection('terrains')}
                      className="gradient-underline-effect text-gray-900 hover:text-black font-bold"
                  >
                    Terrains
                  </button>
                  <button
                      onClick={() => scrollToSection('reservation')}
                      className="gradient-underline-effect text-gray-900 hover:text-black font-bold"
                  >
                    Réserver
                  </button>

                  <button
                      onClick={() => scrollToSection('carte')}
                      className="gradient-underline-effect text-gray-900 hover:text-black font-bold"
                  >
                    Carte
                  </button>
                  <button
                      onClick={() => scrollToSection('location')}
                      className="gradient-underline-effect text-gray-900 hover:text-black font-bold"
                  >
                    Location
                  </button>
                  <Link href="/backoffice/commandes" className="text-gray-400 hover:text-black transition-colors">
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                </div>
              </div>
          )}
        </div>
      </nav>
  );
}
