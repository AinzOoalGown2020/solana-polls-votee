import { PublicKey } from '@solana/web3.js';
import { IDL } from './idl';

export const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

export const findEventPda = (authority: PublicKey, name: string): PublicKey => {
    const [pda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('event'),
            authority.toBuffer(),
            Buffer.from(name),
        ],
        PROGRAM_ID
    );
    return pda;
};

export const findSessionPda = (event: PublicKey, name: string): PublicKey => {
    const [pda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('session'),
            event.toBuffer(),
            Buffer.from(name),
        ],
        PROGRAM_ID
    );
    return pda;
};

export const findPresencePda = (session: PublicKey, student: PublicKey): PublicKey => {
    const [pda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('presence'),
            session.toBuffer(),
            student.toBuffer(),
        ],
        PROGRAM_ID
    );
    return pda;
}; 