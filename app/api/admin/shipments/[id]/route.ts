import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(
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

    const { id } = await params;

    // ===========================
    // Ambil branch admin
    // ===========================

    const [users]: any = await db.query(
      `
      SELECT
        branch_id
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

    const branchId = users[0].branch_id;

    // ===========================
    // Detail shipment
    // ===========================

    const [shipment]: any = await db.query(
      `
      SELECT

        s.*,

        sender.name AS sender_name,
        sender.phone AS sender_phone,
        sender.address AS sender_address,

        receiver.name AS receiver_name,
        receiver.phone AS receiver_phone,
        receiver.address AS receiver_address,

        ob.name AS origin_branch,
        dbs.name AS destination_branch,

        courier.id AS courier_id,
        courier.name AS courier_name,
        courier.phone AS courier_phone,

        COALESCE(p.payment_status,'pending') AS payment_status

      FROM shipments s

      JOIN customers sender
        ON sender.id=s.sender_id

      JOIN customers receiver
        ON receiver.id=s.receiver_id

      JOIN branches ob
        ON ob.id=s.origin_branch_id

      JOIN branches dbs
        ON dbs.id=s.destination_branch_id

      LEFT JOIN users courier
        ON courier.id=s.courier_id

      LEFT JOIN payments p
        ON p.shipment_id=s.id

      WHERE
        s.id=?
        AND
        (
          s.origin_branch_id=?
          OR
          s.destination_branch_id=?
        )

      LIMIT 1
      `,
      [id, branchId, branchId]
    );

    if (!shipment.length) {
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
    // Barang
    // ===========================

    const [items]: any = await db.query(
      `
      SELECT *
      FROM shipment_items
      WHERE shipment_id=?
      ORDER BY id ASC
      `,
      [id]
    );

    // ===========================
    // Tracking
    // ===========================

    const [trackings]: any = await db.query(
      `
      SELECT *
      FROM shipment_trackings
      WHERE shipment_id=?
      ORDER BY tracked_at ASC,id ASC
      `,
      [id]
    );

    // ===========================
    // Kurir cabang
    // ===========================

    const [couriers]: any = await db.query(
      `
      SELECT
        id,
        name,
        phone
      FROM users
      WHERE
        role='courier'
        AND branch_id=?
      ORDER BY name ASC
      `,
      [branchId]
    );

    return NextResponse.json({
      shipment: shipment[0],
      items,
      trackings,
      couriers,
    });

  } catch (error) {

    console.log(error);

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