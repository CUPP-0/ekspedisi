import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import db from '@/lib/db';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { payload }: any = await jwtVerify(token, secret);

    if (payload.role !== 'cashier') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';

    const status = searchParams.get('status') || '';

    let sql = `
SELECT
    p.id,
    p.amount,
    p.payment_method,
    p.payment_status,
    p.payment_date,
    p.created_at,

    s.id AS shipment_id,
    s.tracking_number,

    c.name AS customer_name

FROM payments p

JOIN shipments s
    ON s.id = p.shipment_id

JOIN customers c
    ON c.id = s.sender_id

WHERE 1=1
`;

    const params: any[] = [];

    if (search) {
      sql += `
    AND (
      s.tracking_number LIKE ?
      OR c.name LIKE ?
    )
  `;

      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      sql += ` AND p.payment_status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY p.created_at DESC`;

    const [rows]: any = await db.query(sql, params);

    return NextResponse.json(rows);
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
