import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {
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

    // Ambil branch admin
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
        {
          message: "Admin tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    const branchId = users[0].branch_id;

    // Ambil semua lamaran di cabang admin
    const [rows]: any = await db.query(
      `
      SELECT

        ca.*,

        b.name AS branch_name

      FROM courier_applications ca

      JOIN branches b
        ON b.id = ca.branch_id

      WHERE ca.branch_id = ?

      ORDER BY
        FIELD(ca.status,'pending','approved','rejected'),
        ca.created_at DESC
      `,
      [branchId]
    );

    return NextResponse.json(rows);

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