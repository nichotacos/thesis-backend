import axios from 'axios';

export const verifyCaptcha = async (captchaToken) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`);
    console.log("Captcha verification response:", response);
    return response.data.success;
}