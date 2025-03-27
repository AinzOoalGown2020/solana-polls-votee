import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Program } from '@project-serum/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import { IDL } from '../../config/idl';
import { PROGRAM_ID, findSessionPda } from '../../config/program';
import { getProvider } from '../../config/provider';

interface SessionFormProps {
    eventId: string;
}

export default function SessionForm({ eventId }: SessionFormProps) {
    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const wallet = useWallet();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wallet.publicKey) return;

        try {
            const provider = getProvider(wallet);
            const program = new Program(IDL, PROGRAM_ID, provider);

            const eventPubkey = new PublicKey(eventId);
            const sessionPda = findSessionPda(eventPubkey, name);

            const startTimestamp = new BN(new Date(startTime).getTime() / 1000);
            const endTimestamp = new BN(new Date(endTime).getTime() / 1000);

            await program.methods
                .createSession(name, startTimestamp, endTimestamp)
                .accounts({
                    session: sessionPda,
                    event: eventPubkey,
                    authority: wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            // Reset form
            setName('');
            setStartTime('');
            setEndTime('');
        } catch (error) {
            console.error('Error creating session:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom de la session
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    Date et heure de début
                </label>
                <input
                    type="datetime-local"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                    Date et heure de fin
                </label>
                <input
                    type="datetime-local"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                />
            </div>
            <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Créer la session
            </button>
        </form>
    );
} 