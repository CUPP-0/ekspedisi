import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Semua halaman yang membutuhkan login
  if (
    pathname.startsWith("/manager") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/customer")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);

      // Manager
      if (
        pathname.startsWith("/manager") &&
        payload.role !== "manager"
      ) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // Admin Cabang
      if (
        pathname.startsWith("/admin") &&
        payload.role !== "admin"
      ) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // Customer
      if (
        pathname.startsWith("/customer") &&
        payload.role !== "customer"
      ) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/manager/:path*",
    "/admin/:path*",
    "/customer/:path*",
  ],
};