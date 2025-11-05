import {Waves, Facebook, Instagram, Mail, LinkedinIcon, MessageCircle} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex space-x-2">
              <div className="relative h-28 w-28">
                <Image
                  src="images/tipadel-logo-white.png"
                  alt="Logo Ti Padel"
                  fill
                  sizes="32px"
                  className="object-contain"
                  priority
                />
              </div>
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
              <li className="hover:text-white transition-colors">Petite restauration</li>
              <li className="hover:text-white transition-colors">Évenements</li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Informations</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#propos" className="hover:text-white transition-colors">À Propos</a></li>
              <li>
                <Link href="/conditions" className="hover:text-white transition-colors">
                  Conditions Générales
                </Link>
              </li>
              <li>
                <Link href="/confidential" className="hover:text-white transition-colors">
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/legalmentions" className="hover:text-white transition-colors">
                  Mentions Légales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
          <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400 mb-6">
              <p>Club Ti Padel</p>
              <p>56150 Baud</p>
              <p>+33 2 98 56 78 90</p>
              <p>tipadelbaud@gmail.com
              </p>
            </div>

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

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Ti Padel. Tous droits réservés.
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            Fait avec 🤍 en Bretagne
          </p>
        </div>
      </div>
    </footer>
  );
}