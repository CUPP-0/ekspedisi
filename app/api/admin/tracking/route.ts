import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload }: any = await jwtVerify(token, secret);

    if (payload.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    // Branch admin
    const [users]: any = await db.query(
      `
      SELECT branch_id
      FROM users
      WHERE id=?
      LIMIT 1
      `,
      [payload.id]
    );

    const branchId = users[0].branch_id;

    const [rows]: any = await db.query(
      `
      SELECT

        st.id,
        st.shipment_id,
        st.location,
        st.description,
        st.status,
        st.tracked_at,

        s.tracking_number,

        sender.name AS sender_name,
        receiver.name AS receiver_name,

        u.name AS courier_name

      FROM shipment_trackings st

      JOIN shipments s
        ON s.id=st.shipment_id

      JOIN customers sender
        ON sender.id=s.sender_id

      JOIN customers receiver
        ON receiver.id=s.receiver_id

      LEFT JOIN users u
        ON u.id=s.courier_id

      WHERE
        s.origin_branch_id=?
        OR
        s.destination_branch_id=?

      ORDER BY st.tracked_at DESC, st.id DESC
      `,
      [branchId, branchId]
    );

    return NextResponse.json(rows);

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