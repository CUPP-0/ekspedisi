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

    if (payload.role !== "manager") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const [[shipment]]: any = await db.query(`
      SELECT COUNT(*) total
      FROM shipments
    `);

    const [[today]]: any = await db.query(`
      SELECT COUNT(*) total
      FROM shipments
      WHERE DATE(created_at)=CURDATE()
    `);

    const [[customer]]: any = await db.query(`
      SELECT COUNT(*) total
      FROM customers
    `);

    const [[courier]]: any = await db.query(`
      SELECT COUNT(*) total
      FROM users
      WHERE role='courier'
    `);

    const [[branch]]: any = await db.query(`
      SELECT COUNT(*) total
      FROM branches
    `);

    const [[revenue]]: any = await db.query(`
      SELECT IFNULL(SUM(amount),0) total
      FROM payments
      WHERE payment_status='paid'
    `);

    const [[pending]]: any = await db.query(`
      SELECT COUNT(*) total
      FROM payments
      WHERE payment_status='pending'
    `);

    const [[delivered]]: any = await db.query(`
      SELECT COUNT(*) total
      FROM shipments
      WHERE status='delivered'
    `);

    const [[transit]]: any = await db.query(`
      SELECT COUNT(*) total
      FROM shipments
      WHERE status IN(
        'picked_up',
        'in_transit',
        'arrived_at_branch',
        'out_for_delivery'
      )
    `);

    const [recent]: any = await db.query(`
      SELECT

      s.id,
      s.tracking_number,
      s.status,
      s.created_at,

      sender.name sender_name,
      receiver.name receiver_name

      FROM shipments s

      JOIN customers sender
      ON sender.id=s.sender_id

      JOIN customers receiver
      ON receiver.id=s.receiver_id

      ORDER BY s.created_at DESC

      LIMIT 5
    `);

    return NextResponse.json({
      shipment: shipment.total,
      shipment_today: today.total,
      customer: customer.total,
      courier: courier.total,
      branch: branch.total,
      revenue: revenue.total,
      pending: pending.total,
      delivered: delivered.total,
      transit: transit.total,
      recent,
    });

  } catch (err) {

    console.log(err);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );

  }
}