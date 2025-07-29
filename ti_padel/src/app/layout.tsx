import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ti Padel - Réservation de cours de Padel en Bretagne',
  description: 'Réservez vos cours de Padel sport en Bretagne. Ti Padel propose des sessions d\'entraînement pour tous niveaux dans un cadre exceptionnel.',
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