import { ShieldCheckIcon, ScaleIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import styles from '@/styles/legal-pages.module.css';

export default function ConditionsPage() {
  return (
    <section suppressHydrationWarning className={`relative min-h-screen flex items-center justify-center hero-gradient celtic-pattern theme-conditions ${styles.page}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 ${styles.inner}`}>
        <div className="text-center">
          <h1 className={`text-6xl md:text-9xl font-bold text-black mb-6 tracking-tight ${styles.title}`}>
            Conditions Générales
          </h1>
          <h2 className={`text-base md:text-xl font-medium mx-auto leading-relaxed ${styles.subtitle}`}>
            Veuillez lire attentivement nos conditions d’utilisation. L’accès et l’usage du site impliquent leur acceptation.
          </h2>

          <div className="mt-10 md:mt-10">
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto mb-12 ${styles.grid}`}>
              <div className={`group p-6 transition-all duration-300 hover:shadow-2xl ${styles.card}`}>
                <div className={`mb-4 ${styles.cardIcon}`}>
                  <ScaleIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">Utilisation du site</h3>
                <p className="text-sm text-gray-600">Accès licite, respect des règles et des droits des autres utilisateurs.</p>
              </div>

              <div className={`group p-6 transition-all duration-300 hover:shadow-2xl ${styles.card}`}>
                <div className={`mb-4 ${styles.cardIcon}`}>
                  <ShieldCheckIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">Propriété intellectuelle</h3>
                <p className="text-sm text-gray-600">Contenus protégés. Toute reproduction nécessite autorisation.</p>
              </div>

              <div className={`group p-6 transition-all duration-300 hover:shadow-2xl ${styles.card}`}>
                <div className={`mb-4 ${styles.cardIcon}`}>
                  <ExclamationTriangleIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">Responsabilité</h3>
                <p className="text-sm text-gray-600">Le site est fourni “en l’état”. Limitation de responsabilité dans les limites légales.</p>
              </div>

              <div className={`group p-6 transition-all duration-300 hover:shadow-2xl ${styles.card}`}>
                <div className={`mb-4 ${styles.cardIcon}`}>
                  <ArrowPathIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">Modifications</h3>
                <p className="text-sm text-gray-600">Nous pouvons adapter ces conditions. Consultez-les régulièrement.</p>
              </div>
            </div>

            <p className="text-gray-700 max-w-3xl mx-auto text-justify">
              Pour toute question, contactez-nous via la page contact. L’utilisation continue du site vaut acceptation des mises à jour.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 wave-decoration"></div>
    </section>
  );
}