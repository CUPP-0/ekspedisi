import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Cek apakah sudah ada manager
    const [rows]: any = await db.query(
      "SELECT id FROM users WHERE role = 'manager' LIMIT 1"
    );

    if (rows.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Manager sudah ada.",
      });
    }

    const password = await bcrypt.hash("admin123", 10);

    await db.query(
      `INSERT INTO users
      (name, email, password, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [
        "Administrator",
        "admin@ekspedisi.com",
        password,
        "manager",
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Akun manager berhasil dibuat.",
      email: "admin@ekspedisi.com",
      password: "admin123",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server.",
      },
      {
        status: 500,
      }
    );
  }
}