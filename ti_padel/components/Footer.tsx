import {Waves, Facebook, Instagram, Mail, LinkedinIcon, MessageCircle} from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Waves className="h-8 w-8 text-white" />
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
            {/* ...existing code... */}
          </div>
        </div>
      </div>
    </footer>
  );
}