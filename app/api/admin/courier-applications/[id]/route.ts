import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload }: any = await jwtVerify(token, secret);

    if (payload.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // =========================
    // Ambil branch admin
    // =========================

    const [users]: any = await db.query(
      `
      SELECT branch_id
      FROM users
      WHERE id=?
      LIMIT 1
      `,
      [payload.id]
    );

    if (!users.length) {
      return NextResponse.json(
        { message: "Admin tidak ditemukan." },
        { status: 404 }
      );
    }

    const branchId = users[0].branch_id;

    // =========================
    // Detail lamaran
    // =========================

    const [rows]: any = await db.query(
      `
      SELECT

        ca.*,

        b.name AS branch_name,
        b.city AS branch_city

      FROM courier_applications ca

      JOIN branches b
        ON b.id = ca.branch_id

      WHERE
        ca.id = ?
        AND ca.branch_id = ?

      LIMIT 1
      `,
      [id, branchId]
    );

    if (!rows.length) {
      return NextResponse.json(
        {
          message: "Lamaran tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(rows[0]);

  } catch (err) {

    console.log(err);

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