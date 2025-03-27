import { AnchorProvider, Wallet as AnchorWallet } from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Keypair } from '@solana/web3.js';

export function getProvider(wallet: WalletContextState): AnchorProvider {
    const connection = new Connection('http://localhost:8899', 'confirmed');
    
    if (!wallet.publicKey) {
        throw new Error('Wallet not connected');
    }

    // Créer un keypair temporaire pour le payer
    const payer = Keypair.generate();

    // Convertir le wallet adapter en wallet Anchor
    const anchorWallet: AnchorWallet = {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction!,
        signAllTransactions: wallet.signAllTransactions!,
        payer
    };

    return new AnchorProvider(connection, anchorWallet, { commitment: 'confirmed' });
} 