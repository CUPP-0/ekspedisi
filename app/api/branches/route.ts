import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT * FROM branches ORDER BY id DESC"
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil data." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, city, address, phone } = await req.json();

    await db.query(
      `INSERT INTO branches
      (name, city, address, phone, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [name, city, address, phone]
    );

    return NextResponse.json({
      success: true,
      message: "Cabang berhasil ditambahkan.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal menambah cabang." },
      { status: 500 }
    );
  }
}