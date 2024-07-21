// emailService.js
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Configure dotenv for local development environment variables
dotenv.config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
    };

    return transporter.sendMail(mailOptions);
};

export default sendEmail;
