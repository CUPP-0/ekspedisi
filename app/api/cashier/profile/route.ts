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

    if (payload.role !== "cashier") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const [rows]: any = await db.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        branch_id
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [payload.id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);

  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload }: any = await jwtVerify(token, secret);

    if (payload.role !== "cashier") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const {
      name,
      email,
      phone,
    } = await req.json();

    await db.query(
      `
      UPDATE users
      SET
        name = ?,
        email = ?,
        phone = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [
        name,
        email,
        phone,
        payload.id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui.",
    });

  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}