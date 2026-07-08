import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: NextRequest) {
  const conn = await db.getConnection();

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

    const {
      shipment_id,
      status,
      location,
      description,
    } = await req.json();

    // ===========================
    // Validasi shipment
    // ===========================

    const [shipments]: any = await conn.query(
      `
      SELECT
        id,
        origin_branch_id,
        destination_branch_id
      FROM shipments
      WHERE id=?
      LIMIT 1
      `,
      [shipment_id]
    );

    if (!shipments.length) {
      return NextResponse.json(
        {
          message: "Shipment tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    // ===========================
    // Ambil branch admin
    // ===========================

    const [users]: any = await conn.query(
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

    // Admin hanya boleh mengubah shipment
    // milik cabangnya

    if (
      shipments[0].origin_branch_id !== branchId &&
      shipments[0].destination_branch_id !== branchId
    ) {
      return NextResponse.json(
        {
          message: "Anda tidak memiliki akses ke shipment ini.",
        },
        {
          status: 403,
        }
      );
    }

    // ===========================
    // Cek pembayaran
    // ===========================

    const [payments]: any = await conn.query(
      `
      SELECT payment_status
      FROM payments
      WHERE shipment_id=?
      LIMIT 1
      `,
      [shipment_id]
    );

    if (!payments.length) {
      return NextResponse.json(
        {
          message: "Data pembayaran tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    if (payments[0].payment_status !== "paid") {
      return NextResponse.json(
        {
          message:
            "Tracking hanya dapat diperbarui setelah pembayaran berhasil.",
        },
        {
          status: 400,
        }
      );
    }

    // ===========================
    // Simpan tracking
    // ===========================

    await conn.beginTransaction();

    await conn.query(
      `
      INSERT INTO shipment_trackings
      (
        shipment_id,
        location,
        description,
        status,
        tracked_at,
        created_at,
        updated_at
      )
      VALUES
      (
        ?,
        ?,
        ?,
        ?,
        NOW(),
        NOW(),
        NOW()
      )
      `,
      [
        shipment_id,
        location,
        description,
        status,
      ]
    );

    // ===========================
    // Update status shipment
    // ===========================

    await conn.query(
      `
      UPDATE shipments
      SET
        status=?,
        updated_at=NOW()
      WHERE id=?
      `,
      [
        status,
        shipment_id,
      ]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Tracking berhasil ditambahkan.",
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