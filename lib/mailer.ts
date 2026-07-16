import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendOTP(email: string, otp: string) {

    await transporter.sendMail({
        from: `"Ekspedisi" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verifikasi Akun",

        html: `
            <h2>Verifikasi Akun</h2>

            <p>Masukkan kode OTP berikut :</p>

            <h1>${otp}</h1>

            <p>Berlaku selama 10 menit.</p>
        `,
    });

}