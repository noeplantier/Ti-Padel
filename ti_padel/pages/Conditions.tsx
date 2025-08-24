import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Conditions() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
        <ShieldCheckIcon className="h-12 w-12 text-blue-500 mb-4" />
        <h1 className="text-3xl font-bold mb-6 text-center">Conditions Générales</h1>
        <div className="text-gray-700 space-y-4 text-justify">
          <p>Bienvenue sur notre site. Veuillez lire attentivement nos conditions générales d’utilisation...</p>
          <ul className="list-disc ml-6">
            <li>Utilisation du site</li>
            <li>Propriété intellectuelle</li>
            <li>Responsabilité</li>
            <li>Modification des conditions</li>
          </ul>
          <p>Pour toute question, contactez-nous via la page contact.</p>
        </div>
      </div>
    </div>
  );
}