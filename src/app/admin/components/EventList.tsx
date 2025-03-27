'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  polls: any[]; // TODO: Définir le type correct pour les polls
}

export default function EventList() {
  const { publicKey } = useWallet();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // TODO: Implémenter la logique de récupération des événements depuis Solana
        // Pour l'instant, on utilise des données de test
        const mockEvents: Event[] = [
          {
            id: '1',
            title: 'Événement Test 1',
            description: 'Description de l\'événement test 1',
            startDate: '2024-03-27T10:00:00',
            endDate: '2024-03-27T18:00:00',
            polls: []
          },
          {
            id: '2',
            title: 'Événement Test 2',
            description: 'Description de l\'événement test 2',
            startDate: '2024-03-28T10:00:00',
            endDate: '2024-03-28T18:00:00',
            polls: []
          }
        ];
        setEvents(mockEvents);
      } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (publicKey) {
      fetchEvents();
    }
  }, [publicKey]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.length === 0 ? (
        <p className="text-center text-gray-500">Aucun événement trouvé</p>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Début:</span>{' '}
                {new Date(event.startDate).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Fin:</span>{' '}
                {new Date(event.endDate).toLocaleString()}
              </div>
            </div>
            <div className="mt-4">
              <span className="font-medium">Nombre de sondages:</span>{' '}
              {event.polls.length}
            </div>
            <div className="mt-4 flex space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  // TODO: Implémenter la navigation vers la page de gestion des sondages
                  console.log('Gérer les sondages pour l\'événement:', event.id);
                }}
              >
                Gérer les sondages
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  // TODO: Implémenter la suppression de l'événement
                  console.log('Supprimer l\'événement:', event.id);
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
} 