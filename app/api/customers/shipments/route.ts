import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

function generateTrackingNumber() {
  const now = new Date();

  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const i = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');

  return `EXP${y}${m}${d}${h}${i}${s}`;
}

// ===============================
// CREATE SHIPMENT
// ===============================
export async function POST(req: NextRequest) {
  const conn = await db.getConnection();

  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { payload }: any = await jwtVerify(token, secret);

    const senderId = payload.id;

    const {
      receiver_id,
      origin_branch_id,
      destination_branch_id,
      rate_id,
      items,
      total_weight,
      total_price,
    } = await req.json();

    const trackingNumber = generateTrackingNumber();

    await conn.beginTransaction();

    const [shipment]: any = await conn.query(
      `
      INSERT INTO shipments (
        tracking_number,
        sender_id,
        receiver_id,
        origin_branch_id,
        destination_branch_id,
        rate_id,
        total_weight,
        total_price,
        status,
        shipment_date,
        created_at,
        updated_at
      )
      VALUES (
        ?,?,?,?,?,?,?,?,
        'pending',
        CURDATE(),
        NOW(),
        NOW()
      )
      `,
      [
        trackingNumber,
        senderId,
        receiver_id,
        origin_branch_id,
        destination_branch_id,
        rate_id,
        total_weight,
        total_price,
      ]
    );

    for (const item of items) {
      await conn.query(
        `
        INSERT INTO shipment_items (
          shipment_id,
          item_name,
          quantity,
          weight,
          created_at,
          updated_at
        )
        VALUES (
          ?,?,?,?,
          NOW(),
          NOW()
        )
        `,
        [
          shipment.insertId,
          item.item_name,
          item.quantity,
          item.weight,
        ]
      );
    }

    await conn.commit();

    return NextResponse.json({
      success: true,
      shipment_id: shipment.insertId,
      tracking_number: trackingNumber,
    });

  } catch (error) {

    await conn.rollback();

    console.error(error);

    return NextResponse.json(
      {
        message: 'Gagal membuat shipment.',
      },
      {
        status: 500,
      }
    );

  } finally {

    conn.release();

  }
}

// ===============================
// LIST SHIPMENT CUSTOMER
// ===============================
export async function GET() {
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
        }
      );
    }

    const { payload }: any = await jwtVerify(
      token,
      secret
    );

    const [rows]: any = await db.query(
      `
      SELECT
    s.id,
    s.tracking_number,

    COALESCE(p.payment_status, 'unpaid') AS payment_status,

    r.name AS receiver_name,
    ob.city AS origin_city,
    dbs.city AS destination_city,

    s.total_weight,
    s.total_price,
    s.status,
    s.created_at

FROM shipments s

JOIN customers r
    ON r.id = s.receiver_id

JOIN branches ob
    ON ob.id = s.origin_branch_id

JOIN branches dbs
    ON dbs.id = s.destination_branch_id

LEFT JOIN (
    SELECT p1.*
    FROM payments p1
    INNER JOIN (
        SELECT shipment_id, MAX(id) AS id
        FROM payments
        GROUP BY shipment_id
    ) p2
    ON p1.id = p2.id
) p
ON p.shipment_id = s.id

WHERE s.sender_id = ?

ORDER BY s.id DESC
      `,
      [payload.id]
    );

    return NextResponse.json(rows);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        message: 'Server Error',
      },
      {
        status: 500,
      }
    );

  }
}