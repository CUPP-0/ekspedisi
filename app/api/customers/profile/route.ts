import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import db from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload }: any = await jwtVerify(token, secret);

    const [rows]: any = await db.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        address,
        photo,
        created_at
      FROM customers
      WHERE id = ?
      LIMIT 1
      `,
      [payload.id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { message: "Customer tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload }: any = await jwtVerify(token, secret);

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    const photo = formData.get("photo") as File | null;

    // Ambil foto lama
    const [rows]: any = await db.query(
      "SELECT photo FROM customers WHERE id=? LIMIT 1",
      [payload.id]
    );

    let photoName = rows[0]?.photo || null;

    if (photo && photo.size > 0) {
      const uploadDir = path.join(
        process.cwd(),
        "public/uploads/customers"
      );

      await fs.mkdir(uploadDir, {
        recursive: true,
      });

      // hapus foto lama
      if (photoName) {
        try {
          await fs.unlink(
            path.join(uploadDir, photoName)
          );
        } catch {}
      }

      const ext = photo.name.split(".").pop();

      photoName = `${Date.now()}.${ext}`;

      const buffer = Buffer.from(
        await photo.arrayBuffer()
      );

      await fs.writeFile(
        path.join(uploadDir, photoName),
        buffer
      );
    }

    await db.query(
      `
      UPDATE customers
      SET
        name=?,
        email=?,
        phone=?,
        address=?,
        photo=?,
        updated_at=NOW()
      WHERE id=?
      `,
      [
        name,
        email,
        phone,
        address,
        photoName,
        payload.id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui.",
      photo: photoName,
    });
  } catch (error) {
    console.log(error);

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