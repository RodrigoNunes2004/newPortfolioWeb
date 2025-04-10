const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const credentials = require('../config/credentials.json'); // Importando credenciais do JSON

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { name, email, subject, message } = req.body;

    const oAuth2Client = new google.auth.OAuth2(
        credentials.web.client_id,
        credentials.web.client_secret,
        credentials.web.redirect_uris[0]
    );
    
    oAuth2Client.setCredentials({ refresh_token: 'YOUR_REFRESH_TOKEN' });

    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const mailOptions = {
            from: `${name} <${email}>`,
            to: process.env.GMAIL_USER,
            subject,
            text: message,
        };

        await transport.sendMail(mailOptions);
        res.status(200).json({ message: 'Email enviado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao enviar email.' });
    }
}