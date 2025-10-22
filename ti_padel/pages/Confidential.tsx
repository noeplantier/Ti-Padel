import { LockClosedIcon, EyeIcon, ArrowPathRoundedSquareIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import styles from '@/styles/legal-pages.module.css';

export default function ConfidentialPage() {
  return (
    <section suppressHydrationWarning className={`relative min-h-screen flex items-center justify-center hero-gradient celtic-pattern theme-confidential ${styles.page}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 ${styles.inner}`}>
        <div className="text-center">
          <h1 className={`text-6xl md:text-9xl font-bold text-black mb-6 tracking-tight ${styles.title}`}>
            Politique de Confidentialité
          </h1>
          <h2 className={`text-base md:text-xl font-medium mx-auto leading-relaxed ${styles.subtitle}`}>
            Votre vie privée est essentielle. Découvrez nos engagements sur la collecte, l’usage et la protection de vos données.
          </h2>

          <div className="mt-10 md:mt-10">
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto mb-12 ${styles.grid}`}>
              <div className={`group p-6 transition-all duration-300 hover:shadow-2xl ${styles.card}`}>
                <div className={`mb-4 ${styles.cardIcon}`}>
                  <EyeIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">Données collectées</h3>
                <p className="text-sm text-gray-600">Informations de compte, usage du site et données techniques minimales.</p>
              </div>

              <div className={`group p-6 transition-all duration-300 hover:shadow-2xl ${styles.card}`}>
                <div className={`mb-4 ${styles.cardIcon}`}>
                  <ArrowPathRoundedSquareIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">Utilisation</h3>
                <p className="text-sm text-gray-600">Prestation des services, sécurité, amélioration et communication.</p>
              </div>

              <div className={`group p-6 transition-all duration-300 hover:shadow-2xl ${styles.card}`}>
                <div className={`mb-4 ${styles.cardIcon}`}>
                  <LockClosedIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">Partage</h3>
                <p className="text-sm text-gray-600">Jamais vendu. Partage limité à des partenaires techniques conformes.</p>
              </div>

              <div className={`group p-6 transition-all duration-300 hover:shadow-2xl ${styles.card}`}>
                <div className={`mb-4 ${styles.cardIcon}`}>
                  <UserCircleIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">Vos droits</h3>
                <p className="text-sm text-gray-600">Accès, rectification, effacement et opposition selon la réglementation.</p>
              </div>
            </div>

            <p className="text-gray-700 max-w-3xl mx-auto text-justify">
              Pour toute demande liée à vos données, contactez-nous via la page contact. Nous répondons dans les meilleurs délais.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 wave-decoration"></div>
    </section>
  );
}