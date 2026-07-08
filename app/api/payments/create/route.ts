import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

import db from '@/lib/db';
import snap from '@/lib/midtrans';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { payload }: any = await jwtVerify(token, secret);

    const { shipment_id } = await req.json();

    // ==========================
    // Shipment
    // ==========================

    const [shipments]: any = await db.query(
      `
      SELECT
        s.*,
        c.name,
        c.email,
        c.phone
      FROM shipments s
      JOIN customers c
        ON c.id=s.sender_id
      WHERE s.id=?
      AND s.sender_id=?
      `,
      [shipment_id, payload.id],
    );

    if (!shipments.length) {
      return NextResponse.json(
        {
          message: 'Shipment tidak ditemukan.',
        },
        {
          status: 404,
        },
      );
    }

    const shipment = shipments[0];

    // ==========================
    // Payment terakhir
    // ==========================

    const [payments]: any = await db.query(
      `
      SELECT *
      FROM payments
      WHERE shipment_id=?
      ORDER BY id DESC
      LIMIT 1
      `,
      [shipment.id],
    );

    if (payments.length) {
      const payment = payments[0];

      // sudah bayar
      if (payment.payment_status === 'paid') {
        return NextResponse.json(
          {
            message: 'Shipment sudah dibayar.',
          },
          {
            status: 400,
          },
        );
      }

      // masih pending
      if (payment.payment_status === 'pending' && payment.snap_token) {
        return NextResponse.json({
          token: payment.snap_token,
        });
      }
    }

    // ==========================
    // Buat transaksi Midtrans
    // ==========================

    const orderId = `EXP-${shipment.id}-${Date.now()}`;

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: Number(shipment.total_price),
      },

      customer_details: {
        first_name: shipment.name,
        email: shipment.email,
        phone: shipment.phone,
      },

      callbacks: {
        finish: `http://localhost:3000/customer/payment/success?shipment_id=${shipment.id}`,
        pending: `http://localhost:3000/customer/payment/${shipment.id}`,
        error: `http://localhost:3000/customer/payment/${shipment.id}`,
      },
    });

    // ==========================
    // Simpan Payment
    // ==========================

    await db.query(
      `
      INSERT INTO payments
      (
        shipment_id,
        order_id,
        snap_token,
        amount,
        payment_status,
        created_at,
        updated_at
      )
      VALUES
      (
        ?,
        ?,
        ?,
        ?,
        'pending',
        NOW(),
        NOW()
      )
      `,
      [shipment.id, orderId, transaction.token, shipment.total_price],
    );

    return NextResponse.json({
      token: transaction.token,
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      {
        message: 'Server Error',
      },
      {
        status: 500,
      },
    );
  }
}
