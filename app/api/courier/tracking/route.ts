import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

const statusFlow: Record<string, string> = {
  assigned: "picked_up",
  picked_up: "in_transit",
  in_transit: "arrived_at_branch",
  arrived_at_branch: "out_for_delivery",
  out_for_delivery: "delivered",
};

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

    const {
      shipment_id,
      location,
      description,
    } = await req.json();

    if (!shipment_id) {
      return NextResponse.json(
        {
          message: "Shipment tidak valid.",
        },
        {
          status: 400,
        }
      );
    }

    if (!location) {
      return NextResponse.json(
        {
          message: "Lokasi wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // Ambil Shipment
    // =========================

    const [shipments]: any = await conn.query(
      `
      SELECT
        id,
        courier_id,
        status
      FROM shipments
      WHERE id = ?
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

    const shipment = shipments[0];

    if (shipment.courier_id !== payload.id) {
      return NextResponse.json(
        {
          message: "Shipment bukan milik Anda.",
        },
        {
          status: 403,
        }
      );
    }

    const nextStatus = statusFlow[shipment.status];

    if (!nextStatus) {
      return NextResponse.json(
        {
          message: "Shipment sudah selesai.",
        },
        {
          status: 400,
        }
      );
    }

    await conn.beginTransaction();

    // =========================
    // Insert Tracking
    // =========================

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
        description || "",
        nextStatus,
      ]
    );

    // =========================
    // Update Shipment
    // =========================

    await conn.query(
      `
      UPDATE shipments
      SET
        status = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [
        nextStatus,
        shipment_id,
      ]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      status: nextStatus,
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