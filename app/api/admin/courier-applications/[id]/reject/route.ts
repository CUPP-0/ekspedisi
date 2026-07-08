import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { payload }: any = await jwtVerify(token, secret);

    if (payload.role !== "admin") {
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const { reason } = await req.json();

    const { id } = await params;

    // ==========================
    // Branch admin
    // ==========================

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
          message: "Admin tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    const branchId = admins[0].branch_id;

    // ==========================
    // Pastikan lamaran milik cabang ini
    // ==========================

    const [rows]: any = await db.query(
      `
      SELECT id,status
      FROM courier_applications
      WHERE
        id=?
        AND branch_id=?
      LIMIT 1
      `,
      [
        id,
        branchId,
      ]
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

    if (rows[0].status !== "pending") {
      return NextResponse.json(
        {
          message: "Lamaran sudah diproses.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================
    // Reject
    // ==========================

    await db.query(
      `
      UPDATE courier_applications
      SET
        status='rejected',
        approved_by=?,
        rejection_reason=?,
        updated_at=NOW()
      WHERE id=?
      `,
      [
        payload.id,
        reason ?? null,
        id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Lamaran berhasil ditolak.",
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