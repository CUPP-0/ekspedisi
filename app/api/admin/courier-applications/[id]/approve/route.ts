import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const conn = await db.getConnection();

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

    // ==========================
    // Ambil branch admin
    // ==========================

    const [admins]: any = await conn.query(
      `
      SELECT branch_id
      FROM users
      WHERE id=?
      LIMIT 1
      `,
      [payload.id]
    );

    if (!admins.length) {
      return NextResponse.json(
        {
          message: "Admin tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    const branchId = admins[0].branch_id;

    // ==========================
    // Ambil lamaran
    // ==========================

    const [rows]: any = await conn.query(
      `
      SELECT *
      FROM courier_applications
      WHERE
        id=?
        AND branch_id=?
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

    const application = rows[0];

    if (application.status !== "pending") {
      return NextResponse.json(
        {
          message: "Lamaran sudah diproses.",
        },
        {
          status: 400,
        }
      );
    }

    // Cek email di users
    const [exists]: any = await conn.query(
      `
      SELECT id
      FROM users
      WHERE email=?
      LIMIT 1
      `,
      [application.email]
    );

    if (exists.length) {
      return NextResponse.json(
        {
          message: "Email sudah digunakan.",
        },
        {
          status: 400,
        }
      );
    }

    await conn.beginTransaction();

    // ==========================
    // Buat akun kurir
    // ==========================

    await conn.query(
      `
      INSERT INTO users
      (
        branch_id,
        name,
        email,
        password,
        role,
        created_at,
        updated_at
      )
      VALUES
      (
        ?,
        ?,
        ?,
        ?,
        'courier',
        NOW(),
        NOW()
      )
      `,
      [
        application.branch_id,
        application.name,
        application.email,
        application.password,
      ]
    );

    // ==========================
    // Update status lamaran
    // ==========================

    await conn.query(
      `
      UPDATE courier_applications
      SET
        status='approved',
        approved_by=?,
        approved_at=NOW(),
        updated_at=NOW()
      WHERE id=?
      `,
      [
        payload.id,
        id,
      ]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Kurir berhasil disetujui.",
    });

  } catch (err) {

    await conn.rollback();

    console.log(err);

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      }
    );

  } finally {

    conn.release();

  }
}