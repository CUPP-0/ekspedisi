import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: NextRequest) {
  const conn = await db.getConnection();

  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload }: any = await jwtVerify(token, secret);

    const {
      shipment_id,
      order_id,
      transaction_id,
      transaction_status,
      payment_type,
      fraud_status,
    } = await req.json();

    // Ambil payment terakhir milik shipment
    const [rows]: any = await conn.query(
      `
      SELECT
        p.*,
        s.sender_id
      FROM payments p
      JOIN shipments s
        ON s.id = p.shipment_id
      WHERE p.shipment_id=?
      ORDER BY p.id DESC
      LIMIT 1
      `,
      [shipment_id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { message: "Payment tidak ditemukan." },
        { status: 404 }
      );
    }

    const payment = rows[0];

    if (payment.sender_id != payload.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    let paymentStatus = "pending";

    if (
      transaction_status === "settlement" ||
      (transaction_status === "capture" &&
        fraud_status === "accept")
    ) {
      paymentStatus = "paid";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      paymentStatus = "failed";
    }

    await conn.query(
      `
      UPDATE payments
      SET
        order_id=?,
        transaction_id=?,
        payment_method=?,
        payment_status=?,
        payment_date=NOW(),
        updated_at=NOW()
      WHERE id=?
      `,
      [
        order_id,
        transaction_id,
        payment_type,
        paymentStatus,
        payment.id,
      ]
    );

    return NextResponse.json({
      success: true,
      payment_status: paymentStatus,
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
  } finally {
    conn.release();
  }
}