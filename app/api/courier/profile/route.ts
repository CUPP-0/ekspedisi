import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {
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

    if (payload.role !== "courier") {
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    // ===========================
    // Profil Kurir
    // ===========================

    const [users]: any = await db.query(
      `
      SELECT

        u.id,
        u.name,
        u.email,
        u.phone,
        u.role,
        u.created_at,

        b.id AS branch_id,
        b.name AS branch_name,
        b.city,
        b.address,
        b.phone AS branch_phone

      FROM users u

      LEFT JOIN branches b
        ON b.id = u.branch_id

      WHERE u.id = ?

      LIMIT 1
      `,
      [payload.id]
    );

    if (!users.length) {
      return NextResponse.json(
        {
          message: "Kurir tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    const profile = users[0];

    // ===========================
    // Statistik
    // ===========================

    const [[assigned]]: any = await db.query(
      `
      SELECT COUNT(*) total
      FROM shipments
      WHERE courier_id = ?
      `,
      [payload.id]
    );

    const [[inProgress]]: any = await db.query(
      `
      SELECT COUNT(*) total
      FROM shipments
      WHERE
        courier_id = ?
        AND status <> 'delivered'
      `,
      [payload.id]
    );

    const [[delivered]]: any = await db.query(
      `
      SELECT COUNT(*) total
      FROM shipments
      WHERE
        courier_id = ?
        AND status = 'delivered'
      `,
      [payload.id]
    );

    return NextResponse.json({
      profile,

      stats: {
        assigned: assigned.total,
        in_progress: inProgress.total,
        delivered: delivered.total,
      },
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