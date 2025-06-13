import Mail from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env.local',
});

const transporter = Mail.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export async function sendOtpEmail(destination, otp) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: destination,
            subject: 'Kode OTP Anda',
            text: `Kode OTP anda adalah: ${otp}. Berlaku selama 5 menit.`
        }

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP email');
    }
}