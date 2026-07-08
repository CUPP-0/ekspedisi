import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload }: any = await jwtVerify(token, secret);

    const { id } = await params;

    // ==========================
    // Shipment
    // ==========================
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
        dbs.name AS destination_branch

      FROM shipments s

      JOIN customers sender
        ON sender.id = s.sender_id

      JOIN customers receiver
        ON receiver.id = s.receiver_id

      JOIN branches ob
        ON ob.id = s.origin_branch_id

      JOIN branches dbs
        ON dbs.id = s.destination_branch_id

      WHERE s.id = ?
      AND s.sender_id = ?
      `,
      [id, payload.id]
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

    // ==========================
    // Items
    // ==========================
    const [items]: any = await db.query(
      `
      SELECT
        id,
        item_name,
        quantity,
        weight,
        photo
      FROM shipment_items
      WHERE shipment_id=?
      ORDER BY id ASC
      `,
      [id]
    );

    // ==========================
    // Payment
    // ==========================
    const [payment]: any = await db.query(
      `
      SELECT
        id,
        order_id,
        snap_token,
        amount,
        payment_method,
        payment_status,
        payment_date,
        transaction_id
      FROM payments
      WHERE shipment_id=?
      ORDER BY id DESC
      LIMIT 1
      `,
      [id]
    );

    return NextResponse.json({
      shipment: shipment[0],
      items,
      payment: payment.length ? payment[0] : null,
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