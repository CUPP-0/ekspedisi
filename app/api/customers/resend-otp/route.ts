import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { sendOTP } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const [rows]: any = await db.query(
      `
      SELECT *
      FROM customer_verifications
      WHERE email=?
      LIMIT 1
      `,
      [email]
    );

    if (!rows.length) {
      return NextResponse.json(
        {
          message: "Data verifikasi tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    const user = rows[0];

    // OTP baru
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await db.query(
      `
      UPDATE customer_verifications
      SET
        otp=?,
        expired_at=DATE_ADD(NOW(),INTERVAL 10 MINUTE),
        updated_at=NOW()
      WHERE id=?
      `,
      [otp, user.id]
    );

    await sendOTP(email, otp);

    return NextResponse.json({
      success: true,
      message: "OTP berhasil dikirim ulang.",
    });

  } catch (err) {

    console.log(err);

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      }
    );

  }
}