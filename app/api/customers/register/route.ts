import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendOTP } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, city, phone, address } = await req.json();

    const [exist]: any = await db.query('SELECT id FROM customers WHERE email=? LIMIT 1', [email]);

    if (exist.length > 0) {
      return NextResponse.json({ message: 'Email sudah digunakan.' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hash = await bcrypt.hash(password, 10);

    // hapus OTP lama jika ada
    await db.query('DELETE FROM customer_verifications WHERE email=?', [email]);

    await db.query(
      `
INSERT INTO customer_verifications
(
    name,
    email,
    password,
    city,
    phone,
    address,
    otp,
    expired_at,
    created_at,
    updated_at
)
VALUES
(
?,?,?,?,?,?,?,
DATE_ADD(NOW(),INTERVAL 10 MINUTE),
NOW(),
NOW()
)
`,
      [name, email, hash, city, phone, address, otp],
    );

    await sendOTP(email, otp);

    return NextResponse.json({
      success: true,
      message: 'OTP berhasil dikirim.',
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      {
        message: 'Terjadi kesalahan.',
      },
      {
        status: 500,
      },
    );
  }
}
