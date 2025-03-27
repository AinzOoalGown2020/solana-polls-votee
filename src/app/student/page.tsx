'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Program } from '@project-serum/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { IDL } from '../../config/idl';
import { PROGRAM_ID, findPresencePda } from '../../config/program';
import { getProvider } from '../../config/provider';

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

interface Event {
    publicKey: PublicKey;
    account: {
        name: string;
        description: string;
        authority: PublicKey;
        createdAt: BN;
    };
}

export default function StudentPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const wallet = useWallet();

    useEffect(() => {
        if (!wallet.publicKey) return;

        const fetchData = async () => {
            const provider = getProvider(wallet);
            const program = new Program(IDL, PROGRAM_ID, provider);

            // Fetch active sessions
            const sessionsData = await program.account.Session.all();
            const now = Date.now() / 1000;
            const activeSessions = sessionsData.filter(
                (session) => session.account.startTime.toNumber() <= now && session.account.endTime.toNumber() >= now
            );
            setSessions(activeSessions);

            // Fetch events
            const eventsData = await program.account.Event.all();
            setEvents(eventsData);
        };

        fetchData();
    }, [wallet]);

    const handleSignPresence = async (sessionId: string) => {
        if (!wallet.publicKey) return;

        try {
            const provider = getProvider(wallet);
            const program = new Program(IDL, PROGRAM_ID, provider);

            const sessionPubkey = new PublicKey(sessionId);
            const presencePda = findPresencePda(sessionPubkey, wallet.publicKey);

            await program.methods
                .signPresence()
                .accounts({
                    presence: presencePda,
                    session: sessionPubkey,
                    student: wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            // Refresh sessions
            const sessionsData = await program.account.Session.all();
            const now = Date.now() / 1000;
            const activeSessions = sessionsData.filter(
                (session) => session.account.startTime.toNumber() <= now && session.account.endTime.toNumber() >= now
            );
            setSessions(activeSessions);
        } catch (error) {
            console.error('Error signing presence:', error);
        }
    };

    const getEventName = (eventId: PublicKey) => {
        const event = events.find((e) => e.publicKey.equals(eventId));
        return event ? event.account.name : 'Formation inconnue';
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Sessions en cours</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((session) => (
                    <div
                        key={session.publicKey.toString()}
                        className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                        <h3 className="text-lg font-medium">{session.account.name}</h3>
                        <p className="text-gray-600">
                            Formation: {getEventName(session.account.event)}
                        </p>
                        <p className="text-gray-600">
                            Du {new Date(session.account.startTime.toNumber() * 1000).toLocaleString()}
                            <br />
                            Au {new Date(session.account.endTime.toNumber() * 1000).toLocaleString()}
                        </p>
                        <button
                            onClick={() => handleSignPresence(session.publicKey.toString())}
                            className="mt-4 w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Signer ma présence
                        </button>
                    </div>
                ))}
            </div>

            {sessions.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    Aucune session en cours pour le moment.
                </div>
            )}
        </div>
    );
} 