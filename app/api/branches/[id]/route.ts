import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, city, address, phone } = await req.json();

  await db.query(
    `UPDATE branches
     SET name=?, city=?, address=?, phone=?, updated_at=NOW()
     WHERE id=?`,
    [name, city, address, phone, id]
  );

  return NextResponse.json({
    success: true,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await db.query("DELETE FROM branches WHERE id=?", [id]);

  return NextResponse.json({
    success: true,
  });
}