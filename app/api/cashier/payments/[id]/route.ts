import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload }: any = await jwtVerify(token, secret);

    if (payload.role !== "cashier") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const [rows]: any = await db.query(
      `
      SELECT

      p.*,

      s.tracking_number,

      s.total_weight,

      c.name customer_name,
      c.phone customer_phone,
      c.address customer_address

      FROM payments p

      JOIN shipments s
      ON s.id=p.shipment_id

      JOIN customers c
      ON c.id=s.sender_id

      WHERE p.id=?

      LIMIT 1
      `,
      [id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { message: "Payment tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);

  } catch (err) {

    console.log(err);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );

  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload }: any = await jwtVerify(token, secret);

    if (payload.role !== "cashier") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const { status } = await req.json();

    const { id } = await params;

    if (status === "paid") {

      await db.query(
        `
        UPDATE payments
        SET

        payment_status='paid',

        paid_at=NOW(),

        updated_at=NOW()

        WHERE id=?
        `,
        [id]
      );

    } else {

      await db.query(
        `
        UPDATE payments
        SET

        payment_status='failed',

        updated_at=NOW()

        WHERE id=?
        `,
        [id]
      );

    }

    return NextResponse.json({
      success: true,
      message: "Status berhasil diperbarui.",
    });

  } catch (err) {

    console.log(err);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );

  }

}