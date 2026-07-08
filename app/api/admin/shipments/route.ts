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

    // Pastikan hanya admin
    if (payload.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    // Ambil branch admin
    const [users]: any = await db.query(
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
        { message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    const branchId = users[0].branch_id;

    const [rows]: any = await db.query(
      `
      SELECT

        s.id,
        s.tracking_number,

        sender.name AS sender_name,
        receiver.name AS receiver_name,

        ob.name AS origin_branch,
        dbs.name AS destination_branch,

        s.total_weight,
        s.total_price,

        s.status,

        COALESCE(p.payment_status,'pending') AS payment_status,

        s.created_at

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

      WHERE
        s.origin_branch_id=?
        OR
        s.destination_branch_id=?

      ORDER BY s.id DESC
      `,
      [branchId, branchId]
    );

    return NextResponse.json(rows);

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