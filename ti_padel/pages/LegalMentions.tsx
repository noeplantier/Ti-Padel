import { DocumentTextIcon } from '@heroicons/react/24/outline';

export default function LegalMentionsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
        <DocumentTextIcon className="h-12 w-12 text-purple-500 mb-4" />
        <h1 className="text-3xl font-bold mb-6 text-center">Mentions Légales</h1>
        <div className="text-gray-700 space-y-4 text-justify">
          <p>Conformément à la loi, voici les informations légales de notre site...</p>
          <ul className="list-disc ml-6">
            <li>Éditeur du site</li>
            <li>Hébergement</li>
            <li>Contact</li>
            <li>Propriété intellectuelle</li>
          </ul>
          <p>Pour toute question, contactez-nous via la page contact.</p>
        </div>
      </div>
    </div>
  );
}