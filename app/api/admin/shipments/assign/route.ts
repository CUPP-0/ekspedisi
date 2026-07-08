import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import db from '@/lib/db';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: NextRequest) {
  const conn = await db.getConnection();

  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { payload }: any = await jwtVerify(token, secret);

    if (payload.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { shipment_id, courier_id } = await req.json();

    const [users]: any = await conn.query(
      `
      SELECT branch_id
      FROM users
      WHERE id=?
      LIMIT 1
      `,
      [payload.id],
    );

    const branchId = users[0].branch_id;

    // Pastikan kurir berasal dari cabang yang sama
    const [couriers]: any = await conn.query(
      `
      SELECT *
      FROM users
      WHERE
      id=?
      AND role='courier'
      AND branch_id=?
      `,
      [courier_id, branchId],
    );

    if (!couriers.length) {
      return NextResponse.json(
        {
          message: 'Kurir tidak ditemukan.',
        },
        {
          status: 404,
        },
      );
    }

    await conn.beginTransaction();

    await conn.query(
      `
      UPDATE shipments
  SET
      courier_id=?,
      status='picked_up',
      updated_at=NOW()
  WHERE id=?
      `,
      [courier_id, shipment_id],
    );

    await conn.query(
      `
      INSERT INTO shipment_trackings
      (
        shipment_id,
        location,
        description,
        status,
        tracked_at,
        created_at,
        updated_at
      )
      VALUES
      (
        ?,
        ?,
        ?,
        ?,
        NOW(),
        NOW(),
        NOW()
      )
      `,
      [shipment_id, 'Cabang', 'Kurir telah ditugaskan oleh admin.', 'picked_up'],
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
