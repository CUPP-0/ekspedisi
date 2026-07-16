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

    if (payload.role !== "cashier") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const [[pending]]: any = await db.query(`
      SELECT COUNT(*) total
      FROM payments
      WHERE payment_status='pending'
    `);

    const [[paidToday]]: any = await db.query(`
  SELECT COUNT(*) AS total
  FROM payments
  WHERE payment_status='paid'
  AND payment_date = CURDATE()
`);

    const [[revenueToday]]: any = await db.query(`
  SELECT IFNULL(SUM(amount),0) AS total
  FROM payments
  WHERE payment_status='paid'
  AND payment_date = CURDATE()
`);

    const [[revenueMonth]]: any = await db.query(`
  SELECT IFNULL(SUM(amount),0) AS total
  FROM payments
  WHERE payment_status='paid'
  AND MONTH(payment_date)=MONTH(CURDATE())
  AND YEAR(payment_date)=YEAR(CURDATE())
`);

    const [[totalPayment]]: any = await db.query(`
      SELECT COUNT(*) total
      FROM payments
    `);

    const [[totalPaid]]: any = await db.query(`
      SELECT COUNT(*) total
      FROM payments
      WHERE payment_status='paid'
    `);

    const [[totalPending]]: any = await db.query(`
      SELECT COUNT(*) total
      FROM payments
      WHERE payment_status='pending'
    `);

    const [recent]: any = await db.query(`
      SELECT
        p.id,
        p.amount,
        p.payment_status,
        p.payment_method,
        p.created_at,
        s.tracking_number,
        c.name customer_name
      FROM payments p
      JOIN shipments s
        ON s.id=p.shipment_id
      JOIN customers c
        ON c.id=s.sender_id
      ORDER BY p.created_at DESC
      LIMIT 5
    `);

    return NextResponse.json({
      pending: pending.total,
      paid_today: paidToday.total,
      revenue_today: revenueToday.total,
      revenue_month: revenueMonth.total,
      total_payment: totalPayment.total,
      total_paid: totalPaid.total,
      total_pending: totalPending.total,
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