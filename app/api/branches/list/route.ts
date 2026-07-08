import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT
        id,
        name,
        city
      FROM branches
      ORDER BY name ASC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal mengambil data cabang." },
      { status: 500 }
    );
  }
}