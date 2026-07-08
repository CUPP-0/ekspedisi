import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [rows]: any = await db.query(
    "SELECT * FROM rates WHERE id=?",
    [id]
  );

  return NextResponse.json(rows[0]);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    await db.query(
      `
      UPDATE rates
      SET
        origin_city=?,
        destination_city=?,
        price_per_kg=?,
        estimated_days=?,
        updated_at=NOW()
      WHERE id=?
      `,
      [
        origin[0].city,
        destination[0].city,
        price_per_kg,
        estimated_days,
        id,
      ]
    );

    return NextResponse.json({
      message: "Tarif berhasil diupdate.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal update tarif.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.query(
      "DELETE FROM rates WHERE id=?",
      [id]
    );

    return NextResponse.json({
      message: "Tarif berhasil dihapus.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal menghapus tarif.",
      },
      {
        status: 500,
      }
    );
  }
}