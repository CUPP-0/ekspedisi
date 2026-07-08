import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const conn = await db.getConnection();

  try {
    const body = await req.json();

    const {
      order_id,
      transaction_status,
      fraud_status,
      payment_type,
      transaction_id,
      gross_amount,
      signature_key,
      status_code,
    } = body;

    const expectedSignature = crypto
      .createHash("sha512")
      .update(
        order_id +
          status_code +
          gross_amount +
          process.env.MIDTRANS_SERVER_KEY
      )
      .digest("hex");

    if (signature_key !== expectedSignature) {
      return NextResponse.json(
        {
          message: "Invalid Signature",
        },
        {
          status: 403,
        }
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

    await conn.beginTransaction();

    const [payments]: any = await conn.query(
      `
      SELECT *
      FROM payments
      WHERE order_id=?
      LIMIT 1
      `,
      [order_id]
    );

    if (!payments.length) {
      await conn.rollback();

      return NextResponse.json(
        {
          message: "Payment tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    const payment = payments[0];

    await conn.query(
      `
      UPDATE payments
      SET
        payment_status=?,
        payment_method=?,
        transaction_id=?,
        payment_date=NOW(),
        updated_at=NOW()
      WHERE id=?
      `,
      [
        paymentStatus,
        payment_type,
        transaction_id,
        payment.id,
      ]
    );

    await conn.query(
      `
      UPDATE shipments
      SET
        payment_status=?,
        updated_at=NOW()
      WHERE id=?
      `,
      [
        paymentStatus,
        payment.shipment_id,
      ]
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    await conn.rollback();

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