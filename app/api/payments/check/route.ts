import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import db from '@/lib/db';
import midtransClient from 'midtrans-client';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export async function POST(req: NextRequest) {
  const conn = await db.getConnection();

  try {
    const cookieStore = await cookies();

    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
        },
        {
          status: 401,
        },
      );
    }

    const { payload }: any = await jwtVerify(token, secret);

    const { shipment_id } = await req.json();

    const [rows]: any = await conn.query(
      `
      SELECT
    p.*,
    s.sender_id
FROM payments p
JOIN shipments s
    ON s.id = p.shipment_id
WHERE p.shipment_id = ?
ORDER BY p.id DESC
LIMIT 1
      `,
      [shipment_id],
    );

    if (!rows.length) {
      return NextResponse.json(
        {
          message: 'Payment tidak ditemukan.',
        },
        {
          status: 404,
        },
      );
    }

    const payment = rows[0];

    if (payment.sender_id != payload.id) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
        },
        {
          status: 401,
        },
      );
    }

    // =============================
    // Cek Status Midtrans
    // =============================
    console.log('ORDER ID:', payment.order_id);
    console.log('Payment ID:', payment.id);

    console.log(JSON.stringify(payment));

const status = await coreApi.transaction.status(payment.order_id.trim());
    console.log('MIDTRANS STATUS:', status);
    let paymentStatus = 'pending';

    if (status.transaction_status === 'settlement' || (status.transaction_status === 'capture' && status.fraud_status === 'accept')) {
      paymentStatus = 'paid';
    } else if (status.transaction_status === 'cancel' || status.transaction_status === 'deny' || status.transaction_status === 'expire') {
      paymentStatus = 'failed';
    }

    await conn.beginTransaction();

    // =============================
    // Update Payments
    // =============================

    await conn.query(
      `
      UPDATE payments
      SET
        payment_status = ?,
        payment_method = ?,
        transaction_id = ?,
        payment_date = NOW(),
        updated_at = NOW()
      WHERE id = ?
      `,
      [paymentStatus, status.payment_type ?? null, status.transaction_id ?? null, payment.id],
    );

    // =============================
    // Update Shipment
    // =============================

    await conn.query(
      `
      UPDATE shipments
      SET
        payment_status = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [paymentStatus, payment.shipment_id],
    );

    await conn.commit();

    return NextResponse.json({
      success: true,
      payment_status: paymentStatus,
      transaction_status: status.transaction_status,
      payment_type: status.payment_type,
    });
  } catch (err) {
    await conn.rollback();

    console.log(err);

    return NextResponse.json(
      {
        message: 'Server Error',
      },
      {
        status: 500,
      },
    );
  } finally {
    conn.release();
  }
}
