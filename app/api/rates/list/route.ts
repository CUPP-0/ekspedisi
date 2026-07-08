import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT
        id,
        origin_city,
        destination_city,
        price_per_kg,
        estimated_days
      FROM rates
      ORDER BY origin_city ASC, destination_city ASC
    `);

    return NextResponse.json(rows);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal mengambil data tarif.",
      },
      {
        status: 500,
      }
    );
  }
}