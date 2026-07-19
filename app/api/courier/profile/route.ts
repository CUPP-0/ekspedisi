import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import db from "@/lib/db";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { payload }: any = await jwtVerify(token, secret);
    if (payload.role !== "courier") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    // 1. Ambil Profil
    const [users]: any = await db.query(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at,
              b.id AS branch_id, b.name AS branch_name, b.city, b.address, b.phone AS branch_phone
       FROM users u
       LEFT JOIN branches b ON b.id = u.branch_id
       WHERE u.id = ? LIMIT 1`,
      [payload.id]
    );

    if (!users.length) return NextResponse.json({ message: "Kurir tidak ditemukan." }, { status: 404 });
    const profile = users[0];

    // 2. Ambil Statistik
    const [[assigned]]: any = await db.query(`SELECT COUNT(*) as total FROM shipments WHERE courier_id = ?`, [payload.id]);
    const [[inProgress]]: any = await db.query(`SELECT COUNT(*) as total FROM shipments WHERE courier_id = ? AND status <> 'delivered'`, [payload.id]);
    const [[delivered]]: any = await db.query(`SELECT COUNT(*) as total FROM shipments WHERE courier_id = ? AND status = 'delivered'`, [payload.id]);

    // 3. Ambil Kendaraan
    const [vehicles]: any = await db.query(
      `SELECT id, plate_number, type, created_at FROM vehicles WHERE courier_id = ? ORDER BY created_at DESC`,
      [payload.id]
    );

    return NextResponse.json({ profile, stats: { assigned: assigned.total, in_progress: inProgress.total, delivered: delivered.total }, vehicles });
  } catch (err: any) {
    console.error("GET /api/courier/profile ERROR:", err);
    return NextResponse.json({ message: "Server Error: " + err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { payload }: any = await jwtVerify(token, secret);
    if (payload.role !== "courier") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { plate_number, type } = body;

    if (!plate_number || !type) return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });

    const [existing]: any = await db.query(`SELECT id FROM vehicles WHERE plate_number = ? AND courier_id = ?`, [plate_number, payload.id]);
    if (existing.length > 0) return NextResponse.json({ message: "Plat nomor sudah terdaftar" }, { status: 409 });

    await db.query(`INSERT INTO vehicles (plate_number, type, courier_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())`, [plate_number, type, payload.id]);

    return NextResponse.json({ message: "Kendaraan berhasil ditambahkan" });
  } catch (err: any) {
    console.error("POST /api/courier/profile ERROR:", err);
    return NextResponse.json({ message: "Server Error: " + err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { payload }: any = await jwtVerify(token, secret);
    if (payload.role !== "courier") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const vehicleId = req.nextUrl.searchParams.get("vehicleId");
    if (!vehicleId) return NextResponse.json({ message: "ID kendaraan diperlukan" }, { status: 400 });

    const [vehicle]: any = await db.query(`SELECT id FROM vehicles WHERE id = ? AND courier_id = ?`, [vehicleId, payload.id]);
    if (vehicle.length === 0) return NextResponse.json({ message: "Kendaraan tidak ditemukan" }, { status: 404 });

    await db.query(`DELETE FROM vehicles WHERE id = ?`, [vehicleId]);

    return NextResponse.json({ message: "Kendaraan berhasil dihapus" });
  } catch (err: any) {
    console.error("DELETE /api/courier/profile ERROR:", err);
    return NextResponse.json({ message: "Server Error: " + err.message }, { status: 500 });
  }
}