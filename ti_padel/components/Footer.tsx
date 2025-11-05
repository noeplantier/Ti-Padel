import { Facebook, Instagram, Mail, LinkedinIcon, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 lg:gap-8">
          {/* Horaires */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-4">Horaires</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors">Lun - Ven : 9h - 22h</li>
              <li className="hover:text-white transition-colors">Sam - Dim : 8h - 23h</li>
              <li className="hover:text-white transition-colors">Jours fériés : 10h - 20h</li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors">Padel entre amis</li>
              <li className="hover:text-white transition-colors">Petite restauration</li>
              <li className="hover:text-white transition-colors">Séminaires d'entreprise</li>
              <li className="hover:text-white transition-colors">Évènements</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors">Club Ti Padel</li>
              <li className="hover:text-white transition-colors">56150 Baud</li>
              <li className="hover:text-white transition-colors">+33 2 98 56 78 90</li>
              <li className="hover:text-white transition-colors">tipadelbaud@gmail.com</li>
            </ul>
          </div>

          {/* Social */}
          <div className="flex-1">
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
              © 2025 Ti Padel. Tous droits réservés.
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
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Fait avec 🤍 en Bretagne
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}