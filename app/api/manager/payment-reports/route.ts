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

    const searchParams = req.nextUrl.searchParams;

    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const status = searchParams.get("status");
    const method = searchParams.get("method");

    let sql = `
      SELECT

      p.id,
      p.order_id,
      p.transaction_id,
      p.amount,
      p.payment_method,
      p.payment_status,
      p.payment_date,
      p.created_at,

      s.tracking_number,

      c.name customer_name

      FROM payments p

      JOIN shipments s
      ON s.id = p.shipment_id

      JOIN customers c
      ON c.id = s.sender_id

      WHERE 1=1
    `;

    const params: any[] = [];

    if (start) {
      sql += ` AND DATE(p.payment_date) >= ?`;
      params.push(start);
    }

    if (end) {
      sql += ` AND DATE(p.payment_date) <= ?`;
      params.push(end);
    }

    if (status) {
      sql += ` AND p.payment_status = ?`;
      params.push(status);
    }

    if (method) {
      sql += ` AND p.payment_method = ?`;
      params.push(method);
    }

    sql += ` ORDER BY p.created_at DESC`;

    const [rows]: any = await db.query(sql, params);

    const totalPayment = rows.length;

    const totalRevenue = rows
      .filter((x: any) => x.payment_status === "paid")
      .reduce(
        (a: number, b: any) => a + Number(b.amount),
        0
      );

    const paid = rows.filter(
      (x: any) => x.payment_status === "paid"
    ).length;

    const pending = rows.filter(
      (x: any) => x.payment_status === "pending"
    ).length;

    const failed = rows.filter(
      (x: any) => x.payment_status === "failed"
    ).length;

    return NextResponse.json({
      summary: {
        totalPayment,
        totalRevenue,
        paid,
        pending,
        failed,
      },
      data: rows,
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