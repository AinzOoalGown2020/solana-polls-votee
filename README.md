# Solana Polls - Application de Gestion des Présences

Une application décentralisée (dApp) construite sur Solana pour gérer les présences aux formations.

## Fonctionnalités

- Création de formations
- Création de sessions
- Signature de présence par les étudiants
- Interface d'administration
- Interface étudiant

## Prérequis

- Node.js 16+
- Rust
- Solana CLI
- Anchor Framework

## Installation

1. Clonez le repository :
```bash
git clone https://github.com/votre-username/solana-polls.git
cd solana-polls
```

2. Installez les dépendances :
```bash
yarn install
```

3. Configurez le réseau local Solana :
```bash
solana config set --url localhost
solana-keygen new --outfile ~/.config/solana/id.json
solana airdrop 2
```

4. Déployez le programme :
```bash
anchor build
anchor deploy
```

5. Lancez l'application :
```bash
yarn dev
```

## Structure du Projet

```
solana-polls/
├── programs/
│   └── solana-polls/     # Programme Solana
├── src/
│   ├── app/             # Application Next.js
│   ├── components/      # Composants React
│   └── config/         # Configuration
└── tests/              # Tests
```

## Technologies Utilisées

- Solana
- Anchor Framework
- Next.js
- TypeScript
- Tailwind CSS

## Licence

MIT
