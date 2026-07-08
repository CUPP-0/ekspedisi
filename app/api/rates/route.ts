import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT *
      FROM rates
      ORDER BY id DESC
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

export async function POST(req: NextRequest) {
  try {
    const {
      origin_branch_id,
      destination_branch_id,
      price_per_kg,
      estimated_days,
    } = await req.json();

    const [origin]: any = await db.query(
      "SELECT city FROM branches WHERE id=?",
      [origin_branch_id]
    );

    const [destination]: any = await db.query(
      "SELECT city FROM branches WHERE id=?",
      [destination_branch_id]
    );

    if (!origin.length || !destination.length) {
      return NextResponse.json(
        {
          message: "Cabang tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    await db.query(
      `
      INSERT INTO rates
      (
        origin_city,
        destination_city,
        price_per_kg,
        estimated_days,
        created_at,
        updated_at
      )
      VALUES
      (
        ?, ?, ?, ?, NOW(), NOW()
      )
      `,
      [
        origin[0].city,
        destination[0].city,
        price_per_kg,
        estimated_days,
      ]
    );

    return NextResponse.json({
      message: "Tarif berhasil ditambahkan.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal menambahkan tarif.",
      },
      {
        status: 500,
      }
    );
  }
}