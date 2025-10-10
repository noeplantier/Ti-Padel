# Ti Padel

Application web moderne développée avec Next.js pour la création de Ti Padel, un club de padel sport breton sur mesure.

## 🚀 Technologies

- **Framework**: Next.js 14
- **Runtime**: Node.js 18+
- **Styling**: Tailwind CSS
- **Base de données**: Prisma/PostgreSQL
- **Authentification**: NextAuth.js
- **Déploiement**: Netlify
- **Package Manager**: npm

## 📋 Prérequis

- Node.js >= 18.0.0
- npm ou yarn
- PostgreSQL (pour la base de données)

## 🛠️ Installation

```bash
# Cloner le repository
git clone https://github.com/noeplantier/Ti-Padel
cd skin-metrics-lab

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local

# Initialiser la base de données
npx prisma migrate dev
npx prisma db seed