import { LockClosedIcon } from '@heroicons/react/24/outline';

export default function Confidential () {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
        <LockClosedIcon className="h-12 w-12 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold mb-6 text-center">Politique de Confidentialité</h1>
        <div className="text-gray-700 space-y-4 text-justify">
          <p>Votre vie privée est importante pour nous. Cette politique explique comment nous collectons et utilisons vos données...</p>
          <ul className="list-disc ml-6">
            <li>Données collectées</li>
            <li>Utilisation des données</li>
            <li>Partage des données</li>
            <li>Vos droits</li>
          </ul>
          <p>Pour toute demande, contactez-nous via la page contact.</p>
        </div>
      </div>
    </div>
  );
}