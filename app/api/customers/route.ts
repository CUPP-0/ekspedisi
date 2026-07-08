import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query(`
  SELECT
    c.*,
    COUNT(s.id) AS total_shipment
  FROM customers c
  LEFT JOIN shipments s
    ON s.sender_id = c.id
  GROUP BY c.id
  ORDER BY c.id DESC
`);

    console.log(rows);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'Gagal mengambil data customer.',
      },
      {
        status: 500,
      },
    );
  }
}
