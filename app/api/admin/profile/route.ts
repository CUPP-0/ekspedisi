import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcryptjs";
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

    const [rows]: any = await db.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        b.name AS branch_name
      FROM users u
      LEFT JOIN branches b
        ON b.id=u.branch_id
      WHERE u.id=?
      LIMIT 1
      `,
      [payload.id]
    );

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

    const {
      name,
      email,
      password,
    } = await req.json();

    let sql = `
      UPDATE users
      SET
        name=?,
        email=?,
        updated_at=NOW()
    `;

    const params: any[] = [name, email];

    if (password) {
      const hash = await bcrypt.hash(password, 10);

      sql += `,
        password=?
      `;

      params.push(hash);
    }

    sql += `
      WHERE id=?
    `;

    params.push(payload.id);

    await db.query(sql, params);

    return NextResponse.json({
      success: true,
      message: "Profile berhasil diperbarui.",
    });

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