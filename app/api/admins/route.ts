import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT
        users.id,
        users.name,
        users.email,
        users.branch_id,
        branches.name AS branch
      FROM users
      LEFT JOIN branches
      ON users.branch_id = branches.id
      WHERE users.role='admin'
      ORDER BY users.id DESC
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Gagal mengambil data." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, branch_id } = await req.json();

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users
      (name,email,password,role,branch_id,created_at,updated_at)
      VALUES
      (?,?,?,'admin',?,NOW(),NOW())`,
      [name, email, hash, branch_id]
    );

    return NextResponse.json({
      success: true,
      message: "Admin berhasil ditambahkan.",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Gagal menambah admin." },
      { status: 500 }
    );
  }
}