import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload }: any = await jwtVerify(token, secret);

    const [rows]: any = await db.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        address,
        created_at
      FROM customers
      WHERE id = ?
      LIMIT 1
      `,
      [payload.id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { message: "Customer tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload }: any = await jwtVerify(token, secret);

    const {
      name,
      email,
      phone,
      address,
    } = await req.json();

    await db.query(
      `
      UPDATE customers
      SET
        name=?,
        email=?,
        phone=?,
        address=?,
        updated_at=NOW()
      WHERE id=?
      `,
      [
        name,
        email,
        phone,
        address,
        payload.id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui.",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}