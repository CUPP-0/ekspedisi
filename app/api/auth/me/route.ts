import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    const { payload }: any = await jwtVerify(token, secret);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.id,
        name: payload.name,
        role: payload.role,
      },
    });
  } catch {
    return NextResponse.json({
      authenticated: false,
    });
  }
}