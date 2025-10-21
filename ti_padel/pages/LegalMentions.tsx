import { DocumentTextIcon, BuildingOffice2Icon, ServerIcon, EnvelopeIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function LegalMentionsPage() {
  return (
    <section suppressHydrationWarning className="relative min-h-screen flex items-center justify-center hero-gradient celtic-pattern theme-legalmentions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <DocumentTextIcon className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          <h1 className="text-6xl md:text-9xl font-bold text-black mb-6 tracking-tight">
            Mentions Légales
          </h1>
          <h2 className="text-base md:text-xl font-medium text-gray-700 mx-auto leading-relaxed">
            Informations légales du site conformément à la réglementation en vigueur.
          </h2>

          <div className="mt-10 md:mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto mb-12">
              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-black/5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]">
                <div className="h-12 w-12 rounded-xl bg-black/5 text-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BuildingOffice2Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">Éditeur du site</h3>
                <p className="text-sm text-gray-600">Raison sociale, adresse et responsable de la publication.</p>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-black/5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]">
                <div className="h-12 w-12 rounded-xl bg-black/5 text-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ServerIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">Hébergement</h3>
                <p className="text-sm text-gray-600">Nom de l’hébergeur, adresse et coordonnées de contact.</p>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-black/5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]">
                <div className="h-12 w-12 rounded-xl bg-black/5 text-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <EnvelopeIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">Contact</h3>
                <p className="text-sm text-gray-600">Adresse email dédiée aux demandes officielles et générales.</p>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-black/5 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]">
                <div className="h-12 w-12 rounded-xl bg-black/5 text-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <AcademicCapIcon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-1">Propriété intellectuelle</h3>
                <p className="text-sm text-gray-600">Droits d’auteur et conditions d’utilisation des contenus.</p>
              </div>
            </div>

            <p className="text-gray-700 max-w-3xl mx-auto text-justify">
              Pour toute question, contactez-nous via la page contact. Les informations ci-dessus peuvent être adaptées selon l’évolution légale.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 wave-decoration"></div>
    </section>
  );
}