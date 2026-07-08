import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {
  try {

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { payload }: any = await jwtVerify(token, secret);

    if (payload.role !== "admin") {
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    // ==========================
    // Ambil branch admin
    // ==========================

    const [users]: any = await db.query(
      `
      SELECT branch_id
      FROM users
      WHERE id=?
      LIMIT 1
      `,
      [payload.id]
    );

    const branchId = users[0].branch_id;

    // ==========================
    // Total Shipment
    // ==========================

    const [[shipmentCount]]: any = await db.query(
      `
      SELECT COUNT(*) total
      FROM shipments
      WHERE
      origin_branch_id=?
      OR destination_branch_id=?
      `,
      [branchId, branchId]
    );

    // ==========================
    // Pending Payment
    // ==========================

    const [[pendingPayment]]: any = await db.query(
      `
      SELECT COUNT(*) total
      FROM shipments s
      LEFT JOIN payments p
      ON p.shipment_id=s.id

      WHERE
      (
      s.origin_branch_id=?
      OR s.destination_branch_id=?
      )
      AND COALESCE(p.payment_status,'pending')='pending'
      `,
      [branchId, branchId]
    );

    // ==========================
    // Assigned
    // ==========================

    const [[assigned]]: any = await db.query(
      `
      SELECT COUNT(*) total
      FROM shipments
      WHERE
      (
      origin_branch_id=?
      OR destination_branch_id=?
      )
      AND status='assigned'
      `,
      [branchId, branchId]
    );

    // ==========================
    // Delivered
    // ==========================

    const [[delivered]]: any = await db.query(
      `
      SELECT COUNT(*) total
      FROM shipments
      WHERE
      (
      origin_branch_id=?
      OR destination_branch_id=?
      )
      AND status='delivered'
      `,
      [branchId, branchId]
    );

    // ==========================
    // Courier
    // ==========================

    const [[courier]]: any = await db.query(
      `
      SELECT COUNT(*) total
      FROM users
      WHERE
      role='courier'
      AND branch_id=?
      `,
      [branchId]
    );

    // ==========================
    // Hari ini
    // ==========================

    const [[today]]: any = await db.query(
      `
      SELECT COUNT(*) total
      FROM shipments
      WHERE
      (
      origin_branch_id=?
      OR destination_branch_id=?
      )
      AND DATE(created_at)=CURDATE()
      `,
      [branchId, branchId]
    );

    // ==========================
    // Shipment terbaru
    // ==========================

    const [latest]: any = await db.query(
      `
      SELECT

      tracking_number,
      status,
      total_price,
      created_at

      FROM shipments

      WHERE
      origin_branch_id=?
      OR destination_branch_id=?

      ORDER BY id DESC

      LIMIT 5
      `,
      [branchId, branchId]
    );

    return NextResponse.json({

      totalShipment: shipmentCount.total,

      pendingPayment: pendingPayment.total,

      assigned: assigned.total,

      delivered: delivered.total,

      totalCourier: courier.total,

      todayShipment: today.total,

      latest

    });

  } catch (err) {

    console.log(err);

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      }
    );

  }
}