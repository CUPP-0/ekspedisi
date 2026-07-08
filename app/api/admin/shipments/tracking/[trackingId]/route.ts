import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
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

    const { trackingId } = await params;

    const {
      status,
      location,
      description,
    } = await req.json();

    // ===========================
    // Cari tracking
    // ===========================

    const [trackingRows]: any = await conn.query(
      `
      SELECT
        shipment_id
      FROM shipment_trackings
      WHERE id=?
      LIMIT 1
      `,
      [trackingId]
    );

    if (!trackingRows.length) {
      return NextResponse.json(
        {
          message: "Tracking tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    const shipmentId = trackingRows[0].shipment_id;

    // ===========================
    // Ambil shipment
    // ===========================

    const [shipments]: any = await conn.query(
      `
      SELECT
        origin_branch_id,
        destination_branch_id
      FROM shipments
      WHERE id=?
      LIMIT 1
      `,
      [shipmentId]
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
    // Branch admin
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

    const branchId = users[0].branch_id;

    if (
      shipments[0].origin_branch_id !== branchId &&
      shipments[0].destination_branch_id !== branchId
    ) {
      return NextResponse.json(
        {
          message: "Anda tidak memiliki akses.",
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
      [shipmentId]
    );

    if (
      !payments.length ||
      payments[0].payment_status !== "paid"
    ) {
      return NextResponse.json(
        {
          message:
            "Tracking tidak dapat diubah sebelum pembayaran berhasil.",
        },
        {
          status: 400,
        }
      );
    }

    await conn.beginTransaction();

    // ===========================
    // Update tracking
    // ===========================

    await conn.query(
      `
      UPDATE shipment_trackings
      SET
        status=?,
        location=?,
        description=?,
        updated_at=NOW()
      WHERE id=?
      `,
      [
        status,
        location,
        description,
        trackingId,
      ]
    );

    // ===========================
    // Ambil tracking terbaru
    // ===========================

    const [latest]: any = await conn.query(
      `
      SELECT
        status
      FROM shipment_trackings
      WHERE shipment_id=?
      ORDER BY tracked_at DESC,id DESC
      LIMIT 1
      `,
      [shipmentId]
    );

    // ===========================
    // Sinkronkan status shipment
    // ===========================

    if (latest.length) {
      await conn.query(
        `
        UPDATE shipments
        SET
          status=?,
          updated_at=NOW()
        WHERE id=?
        `,
        [
          latest[0].status,
          shipmentId,
        ]
      );
    }

    await conn.commit();

    return NextResponse.json({
      success: true,
      message: "Tracking berhasil diperbarui.",
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