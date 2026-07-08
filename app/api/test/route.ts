import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT NOW() AS waktu");

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Database Error",
      },
      {
        status: 500,
      }
    );
  }
}