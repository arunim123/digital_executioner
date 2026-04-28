import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

// SendGrid Init
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Twilio Init
const twilioClient = process.env.TWILIO_ACCOUNT_SID ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) : null;

class NotificationService {
  private static isLive() {
    return process.env.NODE_ENV === 'production' && process.env.SENDGRID_API_KEY && process.env.TWILIO_ACCOUNT_SID;
  }

  static async sendEmail(to: string, subject: string, template: string) {
    if (this.isLive()) {
      try {
        await sgMail.send({
          to,
          from: process.env.SENDGRID_FROM_EMAIL || 'vault@familyinstructionmanual.com',
          subject,
          text: template,
          html: `<p>${template}</p>`
        });
        console.log(`[LIVE SENDGRID] Fired to ${to}`);
      } catch(err) {
        console.error('SendGrid Error', err);
      }
    } else {
      console.log(`\n[DEV SENDGRID] To: ${to} | Base: ${subject}\nBody: ${template}\n`);
    }
  }

  static async sendSMS(to: string, message: string) {
    if (this.isLive() && twilioClient) {
      try {
        await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER as string,
          to
        });
        console.log(`[LIVE TWILIO] Fired to ${to}`);
      } catch(err) {
        console.error('Twilio Error', err);
      }
    } else {
      console.log(`\n[DEV TWILIO] To: ${to} \nMessage: ${message}\n`);
    }
  }
}

export default NotificationService;
