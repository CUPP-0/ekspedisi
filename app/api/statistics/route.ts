import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [[shipment]]: any = await db.query(`
      SELECT COUNT(*) AS total
      FROM shipments
    `);

    const [[customer]]: any = await db.query(`
      SELECT COUNT(*) AS total
      FROM customers
    `);

    const [[courier]]: any = await db.query(`
      SELECT COUNT(*) AS total
      FROM users
      WHERE role='courier'
    `);

    const [[branch]]: any = await db.query(`
      SELECT COUNT(*) AS total
      FROM branches
    `);

    return NextResponse.json({
      shipments: shipment.total,
      customers: customer.total,
      couriers: courier.total,
      branches: branch.total,
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