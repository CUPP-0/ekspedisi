import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const originBranchId = req.nextUrl.searchParams.get("origin_branch_id");
    const destinationBranchId = req.nextUrl.searchParams.get("destination_branch_id");

    if (!originBranchId || !destinationBranchId) {
      return NextResponse.json(
        { message: "Parameter tidak lengkap." },
        { status: 400 }
      );
    }

    const [origin]: any = await db.query(
      `SELECT city FROM branches WHERE id=?`,
      [originBranchId]
    );

    const [destination]: any = await db.query(
      `SELECT city FROM branches WHERE id=?`,
      [destinationBranchId]
    );

    if (!origin.length || !destination.length) {
      return NextResponse.json(
        { message: "Cabang tidak ditemukan." },
        { status: 404 }
      );
    }

    const [rate]: any = await db.query(
      `
      SELECT *
      FROM rates
      WHERE origin_city=?
      AND destination_city=?
      LIMIT 1
      `,
      [
        origin[0].city,
        destination[0].city,
      ]
    );

    if (!rate.length) {
      return NextResponse.json(
        {
          message: "Tarif belum tersedia.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(rate[0]);

  } catch (error) {
    console.error(error);

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