import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, secret);

    const customerId = payload.id;

    const [[total]]: any = await db.query(
      "SELECT COUNT(*) total FROM shipments WHERE sender_id=?",
      [customerId]
    );

    const [[pending]]: any = await db.query(
      "SELECT COUNT(*) total FROM shipments WHERE sender_id=? AND status='pending'",
      [customerId]
    );

    const [[process]]: any = await db.query(
      "SELECT COUNT(*) total FROM shipments WHERE sender_id=? AND status='process'",
      [customerId]
    );

    const [[done]]: any = await db.query(
      "SELECT COUNT(*) total FROM shipments WHERE sender_id=? AND status='delivered'",
      [customerId]
    );

    const [history]: any = await db.query(
  `
  SELECT
    s.id,
    s.tracking_number,
    c.name AS receiver_name,
    s.status,
    s.created_at
  FROM shipments s
  JOIN customers c
    ON c.id = s.receiver_id
  WHERE s.sender_id=?
  ORDER BY s.id DESC
  LIMIT 5
  `,
  [customerId]
);

    return NextResponse.json({
      total: total.total,
      pending: pending.total,
      process: process.total,
      delivered: done.total,
      history,
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