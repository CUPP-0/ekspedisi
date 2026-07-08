import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const conn = await db.getConnection();

  try {
    const {
      branch_id,
      name,
      email,
      phone,
      password,
      address,
    } = await req.json();

    // ==========================
    // Validasi
    // ==========================

    if (
      !branch_id ||
      !name ||
      !email ||
      !phone ||
      !password
    ) {
      return NextResponse.json(
        {
          message: "Semua field wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================
    // Cek cabang
    // ==========================

    const [branches]: any = await conn.query(
      `
      SELECT id
      FROM branches
      WHERE id=?
      LIMIT 1
      `,
      [branch_id]
    );

    if (!branches.length) {
      return NextResponse.json(
        {
          message: "Cabang tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    // ==========================
    // Email di users
    // ==========================

    const [users]: any = await conn.query(
      `
      SELECT id
      FROM users
      WHERE email=?
      LIMIT 1
      `,
      [email]
    );

    if (users.length) {
      return NextResponse.json(
        {
          message: "Email sudah digunakan.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================
    // Email di aplikasi
    // ==========================

    const [applications]: any = await conn.query(
      `
      SELECT id,status
      FROM courier_applications
      WHERE email=?
      LIMIT 1
      `,
      [email]
    );

    if (applications.length) {
      return NextResponse.json(
        {
          message:
            applications[0].status === "pending"
              ? "Lamaran masih menunggu persetujuan."
              : "Email sudah pernah digunakan.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================
    // Hash Password
    // ==========================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ==========================
    // Simpan
    // ==========================

    await conn.query(
      `
      INSERT INTO courier_applications
      (
        branch_id,
        name,
        email,
        phone,
        password,
        address,
        status,
        created_at,
        updated_at
      )
      VALUES
      (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        'pending',
        NOW(),
        NOW()
      )
      `,
      [
        branch_id,
        name,
        email,
        phone,
        hashedPassword,
        address,
      ]
    );

    return NextResponse.json({
      success: true,
      message:
        "Pendaftaran berhasil. Menunggu persetujuan admin cabang.",
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

  } finally {

    conn.release();

  }
}