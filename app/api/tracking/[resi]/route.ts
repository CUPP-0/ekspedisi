import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resi: string }> }
) {
  try {
    const { resi } = await params;

    // =========================
    // Shipment
    // =========================

    const [shipments]: any = await db.query(
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

      WHERE s.tracking_number = ?

      LIMIT 1
      `,
      [resi]
    );

    if (!shipments.length) {
      return NextResponse.json(
        {
          message: "Nomor resi tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    const shipment = shipments[0];

    // =========================
    // Barang
    // =========================

    const [items]: any = await db.query(
      `
      SELECT *
      FROM shipment_items
      WHERE shipment_id = ?
      `,
      [shipment.id]
    );

    // =========================
    // Tracking
    // =========================

    const [trackings]: any = await db.query(
      `
      SELECT *
      FROM shipment_trackings
      WHERE shipment_id = ?
      ORDER BY tracked_at DESC
      `,
      [shipment.id]
    );

    const [payments]: any = await db.query(
      `
      SELECT *
      FROM payments
      WHERE shipment_id = ?
      ORDER BY created_at DESC
      `,
      [shipment.id]
    );

    return NextResponse.json({
      shipment,
      items,
      trackings,
      payments
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