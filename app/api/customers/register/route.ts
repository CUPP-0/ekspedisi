import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      email,
      password,
      city,
      phone,
      address,
    } = await req.json();

    const [exist]: any = await db.query(
      "SELECT id FROM customers WHERE email=? LIMIT 1",
      [email]
    );

    if (exist.length > 0) {
      return NextResponse.json(
        { message: "Email sudah digunakan." },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO customers
      (
        name,
        email,
        password,
        city,
        phone,
        address,
        created_at,
        updated_at
      )
      VALUES
      (
        ?,?,?,?,?,?,NOW(),NOW()
      )`,
      [
        name,
        email,
        hash,
        city,
        phone,
        address,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil.",
    });

  } catch (err) {
    console.log(err);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan.",
      },
      {
        status: 500,
      }
    );
  }
}