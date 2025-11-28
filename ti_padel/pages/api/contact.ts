import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Champs requis manquants' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Ti Padel <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL!],
      replyTo: email,
      subject: `[Ti Padel] Nouveau message de ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: #0b5fff; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 20px; margin-top: 0; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 4px; }
            .label { font-weight: bold; color: #0b5fff; display: block; margin-bottom: 5px; }
            .value { color: #333; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎾 Nouveau message de contact</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">👤 Nom</span>
                <span class="value">${name}</span>
              </div>
              <div class="field">
                <span class="label">📧 Email</span>
                <span class="value"><a href="mailto:${email}" style="color: #0b5fff;">${email}</a></span>
              </div>
              ${phone ? `
              <div class="field">
                <span class="label">📱 Téléphone</span>
                <span class="value">${phone}</span>
              </div>
              ` : ''}
              <div class="field">
                <span class="label">💬 Message</span>
                <div class="value" style="white-space: pre-wrap; margin-top: 10px;">${message}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de l\'envoi',
        error: error.message 
      });
    }

    return res.status(200).json({ success: true, message: 'Email envoyé avec succès', data });
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur',
      error: error.message 
    });
  }
}