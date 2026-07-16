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

    if (payload.role !== "manager") {
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

    // ==========================
    // Shipment
    // ==========================

    const [shipmentRows]: any = await db.query(
      `
      SELECT

      s.*,

      sender.name sender_name,
      sender.phone sender_phone,
      sender.address sender_address,

      receiver.name receiver_name,
      receiver.phone receiver_phone,
      receiver.address receiver_address,

      ob.name origin_branch,
      dbs.name destination_branch,

      p.payment_status,
      p.payment_method,
      p.amount

      FROM shipments s

      JOIN customers sender
      ON sender.id=s.sender_id

      JOIN customers receiver
      ON receiver.id=s.receiver_id

      JOIN branches ob
      ON ob.id=s.origin_branch_id

      JOIN branches dbs
      ON dbs.id=s.destination_branch_id

      LEFT JOIN payments p
      ON p.shipment_id=s.id

      WHERE s.id=?

      LIMIT 1
      `,
      [id]
    );

    if (!shipmentRows.length) {
      return NextResponse.json(
        {
          message: "Shipment tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    // ==========================
    // Items
    // ==========================

    const [items]: any = await db.query(
      `
      SELECT *

      FROM shipment_items

      WHERE shipment_id=?

      ORDER BY id ASC
      `,
      [id]
    );

    // ==========================
    // Tracking
    // ==========================

    const [trackings]: any = await db.query(
      `
      SELECT *

      FROM shipment_trackings

      WHERE shipment_id=?

      ORDER BY tracked_at ASC
      `,
      [id]
    );

    return NextResponse.json({
      shipment: shipmentRows[0],
      items,
      trackings,
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