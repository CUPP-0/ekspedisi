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

    if (payload.role !== "admin-pusat") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);

    const keyword = searchParams.get("keyword") || "";
    const status = searchParams.get("status") || "";

    let sql = `
      SELECT

        s.*,

        sender.name AS sender_name,
        receiver.name AS receiver_name,

        ob.name AS origin_branch,
        dbs.name AS destination_branch,

        courier.name AS courier_name,

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

      WHERE 1=1
    `;

    const params: any[] = [];

    if (keyword) {
      sql += `
        AND
        (
          s.tracking_number LIKE ?
          OR sender.name LIKE ?
          OR receiver.name LIKE ?
        )
      `;

      params.push(
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`
      );
    }

    if (status) {
      sql += `
        AND s.status=?
      `;

      params.push(status);
    }

    sql += `
      ORDER BY s.id DESC
    `;

    const [rows]: any = await db.query(sql, params);

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