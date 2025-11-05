import { Facebook, Instagram, Mail, LinkedinIcon, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative h-12 w-12 bg-black flex-shrink-0">
                <Image
                  src="/images/tipadel-logo-white.png"
                  alt="Logo Ti Padel"
                  fill
                  sizes="48px"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl font-bold">Ti Padel</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              École de Padel sport en Bretagne. Découvrez les joies du Padel dans un cadre exceptionnel.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors">Padel entre amis</li>
              <li className="hover:text-white transition-colors">Petite restauration</li>
              <li className="hover:text-white transition-colors">Événements privés</li>
              <li className="hover:text-white transition-colors">Tournois</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors">+33 6 XX XX XX XX</li>
              <li className="hover:text-white transition-colors">contact@tipadel.fr</li>
              <li className="hover:text-white transition-colors">Bretagne, France</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <LinkedinIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <MessageCircle className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Ti Padel. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/legalmentions" className="hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="/confidential" className="hover:text-white transition-colors">
                Confidentialité
              </Link>
              <Link href="/conditions" className="hover:text-white transition-colors">
                CGU
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}