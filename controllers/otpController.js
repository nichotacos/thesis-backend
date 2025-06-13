import OTP from "../models/OTP.js";
import { sendOtpEmail } from "../utils/mailSender.js";
import otpGenerator from "otp-generator"

export async function generateOtp(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const otpCode = otpGenerator.generate(
            4,
            {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
                digits: true,
            }
        );

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await OTP.deleteMany({ email });
        await OTP.create({
            email,
            otp: otpCode,
            expiresAt,
        })
        await sendOtpEmail(email, otpCode);

        return res.status(200).json({
            message: "OTP generated and sent to email",
        });
    } catch (error) {
        return res.status(500).json({ message: "Error generating OTP", error });
    }
}

export async function verifyOtp(req, res) {
    const { email, code } = req.body;

    try {
        console.log("Verifying OTP for email:", email, "with code:", code);

        const otp = await OTP.findOne({ email, otp: code });

        console.log("is expired?", otp.expiresAt < new Date());

        if (!otp || otp.expiresAt < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        await OTP.deleteMany({ email });

        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error verifying OTP", error });
    }
}