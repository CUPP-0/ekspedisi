import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import path from "path";
import fs from "fs/promises";
import { dbPromise } from "@/lib/indexeddb";

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
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload }: any = await jwtVerify(token, secret);

    const senderId = payload.id;

    // ==========================
    // Ambil FormData
    // ==========================
    const formData = await req.formData();

    const receiver_id = Number(formData.get("receiver_id"));
    const origin_branch_id = Number(formData.get("origin_branch_id"));
    const destination_branch_id = Number(
      formData.get("destination_branch_id")
    );
    const rate_id = Number(formData.get("rate_id"));
    const total_weight = Number(formData.get("total_weight"));
    const total_price = Number(formData.get("total_price"));

    const items = JSON.parse(formData.get("items") as string);

    const trackingNumber = generateTrackingNumber();

    await conn.beginTransaction();

    // ==========================
    // Insert Shipment
    // ==========================
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

    // Folder upload
    const uploadDir = path.join(process.cwd(), "public/uploads/items");
    await fs.mkdir(uploadDir, { recursive: true });

    // ==========================
    // Insert Item
    // ==========================
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const photo = formData.get(`photo_${i}`) as File | null;

      let photoName: string | null = null;

      if (photo && photo.size > 0) {
        const buffer = Buffer.from(await photo.arrayBuffer());

        const ext = photo.name.split(".").pop();

        photoName = `${Date.now()}-${i}.${ext}`;

        await fs.writeFile(
          path.join(uploadDir, photoName),
          buffer
        );
      }

      await conn.query(
        `
        INSERT INTO shipment_items (
          shipment_id,
          item_name,
          quantity,
          weight,
          photo,
          created_at,
          updated_at
        )
        VALUES (
          ?,?,?,?,?,NOW(),NOW()
        )
        `,
        [
          shipment.insertId,
          item.item_name,
          item.quantity,
          item.weight,
          photoName,
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
        message: "Gagal membuat shipment.",
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