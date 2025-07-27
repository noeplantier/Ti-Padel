import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ti Paddle - Réservation de cours de paddle en Bretagne',
  description: 'Réservez vos cours de paddle sport en Bretagne. Ti Paddle propose des sessions d\'entraînement pour tous niveaux dans un cadre exceptionnel.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}