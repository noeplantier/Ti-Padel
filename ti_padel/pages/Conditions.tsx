import { ShieldCheckIcon, ScaleIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function ConditionsPage() {
  return (
    <section suppressHydrationWarning className="relative min-h-screen flex items-center justify-center hero-gradient celtic-pattern theme-conditions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <ShieldCheckIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h1 className="text-6xl md:text-9xl font-bold text-black mb-6 tracking-tight">
            Conditions Générales
          </h1>
          <h2 className="text-base md:text-xl font-medium text-gray-700 mx-auto leading-relaxed">
            Veuillez lire attentivement nos conditions d’utilisation. L’accès et l’usage du site impliquent leur acceptation.
          </h2>

          <div className="mt-10 md:mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto mb-12">
              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-black/5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]">
                <div className="h-12 w-12 rounded-xl bg-black/5 text-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ScaleIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">Utilisation du site</h3>
                <p className="text-sm text-gray-600">Accès licite, respect des règles et des droits des autres utilisateurs.</p>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-black/5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]">
                <div className="h-12 w-12 rounded-xl bg-black/5 text-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheckIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">Propriété intellectuelle</h3>
                <p className="text-sm text-gray-600">Contenus protégés. Toute reproduction nécessite autorisation.</p>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-black/5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]">
                <div className="h-12 w-12 rounded-xl bg-black/5 text-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ExclamationTriangleIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">Responsabilité</h3>
                <p className="text-sm text-gray-600">Le site est fourni “en l’état”. Limitation de responsabilité dans les limites légales.</p>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-black/5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]">
                <div className="h-12 w-12 rounded-xl bg-black/5 text-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
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