require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

const corsMiddleware = cors(corsOptions);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  corsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const msg = {
      to: process.env.GMAIL_USER,
      from: process.env.GMAIL_USER,
      subject: `New Message from ${name}: ${subject}`,
      text: `You have a new message from ${name} (${email}):\n\n${message}`,
    };

    try {
      await sgMail.send(msg);
      return res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
  });
}
