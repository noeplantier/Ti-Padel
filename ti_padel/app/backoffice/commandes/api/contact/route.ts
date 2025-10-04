import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation des données
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Simulation d'envoi d'email (remplacez par votre service d'email préféré)
    // Exemple avec Nodemailer, SendGrid, ou autre service
    console.log('Nouveau message de contact:', { name, email, subject, message });

    // Ici vous pouvez intégrer votre service d'email
    // Exemple avec fetch vers un service externe ou Nodemailer
    
    return NextResponse.json(
      { message: 'Message envoyé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}