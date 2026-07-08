import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

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

    if (payload.role !== "courier") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const {
      oldPassword,
      newPassword,
      confirmPassword,
    } = await req.json();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          message: "Semua field wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          message: "Konfirmasi password tidak sama.",
        },
        {
          status: 400,
        }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          message: "Password minimal 6 karakter.",
        },
        {
          status: 400,
        }
      );
    }

    // ===========================
    // Ambil data user
    // ===========================

    const [users]: any = await db.query(
      `
      SELECT id,password
      FROM users
      WHERE id=?
      LIMIT 1
      `,
      [payload.id]
    );

    if (!users.length) {
      return NextResponse.json(
        {
          message: "User tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    const user = users[0];

    const match = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!match) {
      return NextResponse.json(
        {
          message: "Password lama salah.",
        },
        {
          status: 400,
        }
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.query(
      `
      UPDATE users
      SET
        password=?,
        updated_at=NOW()
      WHERE id=?
      `,
      [
        hashed,
        payload.id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Password berhasil diubah.",
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