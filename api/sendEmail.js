const { google } = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Carregando variáveis do .env

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { name, email, subject, message } = req.body;

    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );

    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    try {
        // Gerando o access token
        const accessToken = await oAuth2Client.getAccessToken();

        // Configurando o transporte do Nodemaler
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_USER, // Email remetente
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        // Configurando os detalhes do email
        const mailOptions = {
            from: `${name} <${email}>`, // Nome e email do remetente
            to: process.env.GMAIL_USER, // Email destinatário
            subject, // Assunto do email
            text: message, // Corpo da mensagem
        };

        // Enviando o email
        await transport.sendMail(mailOptions);
        res.status(200).json({ message: 'Email enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ error: 'Erro ao enviar email.' });
    }
}
