export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
  }
  
  export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      
      if (response.ok) {
        return { success: true, message: 'Message envoyé avec succès !' };
      } else {
        return { success: false, message: result.message || 'Erreur lors de l\'envoi du message' };
      }
    } catch (error) {
      return { success: false, message: 'Erreur de connexion' };
    }
  }