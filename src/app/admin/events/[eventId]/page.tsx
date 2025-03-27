'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'next/navigation';

interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: number[];
}

export default function EventPollsPage() {
  const { eventId } = useParams();
  const { publicKey } = useWallet();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreatePoll, setShowCreatePoll] = useState(false);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        // TODO: Implémenter la logique de récupération des sondages depuis Solana
        // Pour l'instant, on utilise des données de test
        const mockPolls: Poll[] = [
          {
            id: '1',
            question: 'Quelle est votre option préférée ?',
            options: ['Option 1', 'Option 2', 'Option 3'],
            votes: [10, 15, 5]
          }
        ];
        setPolls(mockPolls);
      } catch (error) {
        console.error('Erreur lors de la récupération des sondages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (publicKey && eventId) {
      fetchPolls();
    }
  }, [publicKey, eventId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des Sondages</h1>
        <button
          onClick={() => setShowCreatePoll(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Créer un nouveau sondage
        </button>
      </div>

      {showCreatePoll && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Créer un nouveau sondage</h2>
          {/* TODO: Implémenter le formulaire de création de sondage */}
          <button
            onClick={() => setShowCreatePoll(false)}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Annuler
          </button>
        </div>
      )}

      <div className="space-y-6">
        {polls.length === 0 ? (
          <p className="text-center text-gray-500">Aucun sondage trouvé</p>
        ) : (
          polls.map((poll) => (
            <div
              key={poll.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-4">{poll.question}</h3>
              <div className="space-y-2">
                {poll.options.map((option, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span>{option}</span>
                    <span className="text-gray-500">{poll.votes[index]} votes</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex space-x-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    // TODO: Implémenter la modification du sondage
                    console.log('Modifier le sondage:', poll.id);
                  }}
                >
                  Modifier
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => {
                    // TODO: Implémenter la suppression du sondage
                    console.log('Supprimer le sondage:', poll.id);
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 