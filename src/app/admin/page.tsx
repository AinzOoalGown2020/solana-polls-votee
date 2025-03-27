'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import EventForm from '../components/EventForm';
import SessionForm from '../components/SessionForm';
import { Program } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { IDL } from '../../config/idl';
import { PROGRAM_ID } from '../../config/program';
import { getProvider } from '../../config/provider';

interface Event {
    publicKey: PublicKey;
    account: {
        name: string;
        description: string;
        authority: PublicKey;
        createdAt: BN;
    };
}

interface Session {
    publicKey: PublicKey;
    account: {
        name: string;
        startTime: BN;
        endTime: BN;
        event: PublicKey;
        createdAt: BN;
    };
}

export default function AdminPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
    const wallet = useWallet();

    useEffect(() => {
        if (!wallet.publicKey) return;

        const fetchData = async () => {
            const provider = getProvider(wallet);
            const program = new Program(IDL, PROGRAM_ID, provider);

            // Fetch events
            const eventsData = await program.account.Event.all();
            setEvents(eventsData);

            // Fetch sessions
            const sessionsData = await program.account.Session.all();
            setSessions(sessionsData);
        };

        fetchData();
    }, [wallet]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Administration</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Créer une formation</h2>
                    <EventForm />
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Créer une session</h2>
                    <select
                        value={selectedEvent || ''}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        className="mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Sélectionner une formation</option>
                        {events.map((event) => (
                            <option key={event.publicKey.toString()} value={event.publicKey.toString()}>
                                {event.account.name}
                            </option>
                        ))}
                    </select>
                    {selectedEvent && <SessionForm eventId={selectedEvent} />}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Formations existantes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => (
                        <div
                            key={event.publicKey.toString()}
                            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-lg font-medium">{event.account.name}</h3>
                            <p className="text-gray-600">{event.account.description}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Créé le {new Date(event.account.createdAt.toNumber() * 1000).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Sessions existantes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessions.map((session) => (
                        <div
                            key={session.publicKey.toString()}
                            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-lg font-medium">{session.account.name}</h3>
                            <p className="text-gray-600">
                                Du {new Date(session.account.startTime.toNumber() * 1000).toLocaleString()}
                                <br />
                                Au {new Date(session.account.endTime.toNumber() * 1000).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Créé le {new Date(session.account.createdAt.toNumber() * 1000).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 