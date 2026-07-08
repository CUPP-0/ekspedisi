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

    const [shipments]: any = await db.query(
      `
      SELECT
        s.id,
        s.tracking_number,
        s.status,
        s.total_weight,
        s.total_price,
        s.shipment_date,

        sender.name AS sender_name,
        receiver.name AS receiver_name,

        ob.name AS origin_branch,
        dbs.name AS destination_branch,

        COALESCE(p.payment_status,'pending') AS payment_status

      FROM shipments s

      JOIN customers sender
        ON sender.id = s.sender_id

      JOIN customers receiver
        ON receiver.id = s.receiver_id

      JOIN branches ob
        ON ob.id = s.origin_branch_id

      JOIN branches dbs
        ON dbs.id = s.destination_branch_id

      LEFT JOIN payments p
        ON p.shipment_id = s.id

      WHERE s.courier_id = ?

      ORDER BY s.created_at DESC
      `,
      [payload.id]
    );

    return NextResponse.json(shipments);

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