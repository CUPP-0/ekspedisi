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

    // Fetch current shipment to determine appropriate target status
    const [existingShipments]: any = await conn.query(
      `
      SELECT id, status
      FROM shipments
      WHERE id=?
      LIMIT 1
      `,
      [shipment_id]
    );

    if (!existingShipments.length) {
      return NextResponse.json({ message: 'Shipment tidak ditemukan.' }, { status: 404 });
    }

    const currentStatus = existingShipments[0].status;

    // If shipment is already in a delivery flow (in_transit/arrived_at_branch/out_for_delivery),
    // assigning a courier should result in 'out_for_delivery' (not revert back to 'assigned').
    const deliveryStatuses = ['in_transit', 'arrived_at_branch', 'out_for_delivery'];
    const targetStatus = deliveryStatuses.includes(currentStatus) ? 'out_for_delivery' : 'assigned';

    await conn.beginTransaction();

    // Update shipment with courier and appropriate status
    await conn.query(
      `
      UPDATE shipments
      SET
        courier_id=?,
        status=?,
        updated_at=NOW()
      WHERE id=?
      `,
      [courier_id, targetStatus, shipment_id]
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
      [shipment_id, 'Cabang', 'Kurir telah ditugaskan oleh admin.', targetStatus]
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
