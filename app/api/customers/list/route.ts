import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search") || "";

    const [rows]: any = await db.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        city
      FROM customers
      WHERE name LIKE ?
      ORDER BY name ASC
      LIMIT 20
      `,
      [`%${search}%`]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal mengambil data customer." },
      { status: 500 }
    );
  }
}