import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: NextRequest) {
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
        { status:403 }
      );
    }

    const {
      name,
      email,
      phone,
      password,
    } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message:"Data belum lengkap.",
        },
        {
          status:400,
        }
      );
    }

    // Ambil branch admin
    const [admins]: any = await db.query(
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
          message:"Admin tidak ditemukan.",
        },
        {
          status:404,
        }
      );
    }

    const branchId = admins[0].branch_id;

    // cek email
    const [exists]: any = await db.query(
      `
      SELECT id
      FROM users
      WHERE email=?
      LIMIT 1
      `,
      [email]
    );

    if (exists.length) {
      return NextResponse.json(
        {
          message:"Email sudah digunakan.",
        },
        {
          status:400,
        }
      );
    }

    const hash = await bcrypt.hash(password,10);

    await db.query(
      `
      INSERT INTO users
      (
        name,
        email,
        phone,
        password,
        role,
        branch_id,
        created_at,
        updated_at
      )
      VALUES
      (
        ?,?,?,?,?,?,
        NOW(),
        NOW()
      )
      `,
      [
        name,
        email,
        phone,
        hash,
        "courier",
        branchId,
      ]
    );

    return NextResponse.json({
      success:true,
      message:"Kurir berhasil ditambahkan.",
    });

  } catch(err){

    console.log(err);

    return NextResponse.json(
      {
        message:"Server Error",
      },
      {
        status:500,
      }
    );
  }
}

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

    // Ambil semua courier di cabang admin
    const [rows]: any = await db.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        u.created_at,
        b.name AS branch_name
      FROM users u
      LEFT JOIN branches b
        ON b.id = u.branch_id
      WHERE
        u.role='courier'
        AND u.branch_id=?
      ORDER BY u.id DESC
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