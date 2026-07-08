import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { email, password, captchaToken } = await req.json();

    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: captchaToken,
      }),
    });

    const result = await verify.json();

    if (!result.success) {
      return NextResponse.json(
        {
          message: 'Captcha tidak valid.',
        },
        {
          status: 400,
        },
      );
    }

    const [rows]: any = await db.query('SELECT * FROM customers WHERE email = ? LIMIT 1', [email]);

    if (rows.length === 0) {
      return NextResponse.json(
        {
          message: 'Email atau password salah.',
        },
        {
          status: 401,
        },
      );
    }

    const customer = rows[0];

    const match = await bcrypt.compare(password, customer.password);

    if (!match) {
      return NextResponse.json(
        {
          message: 'Email atau password salah.',
        },
        {
          status: 401,
        },
      );
    }

    const token = jwt.sign(
      {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: 'customer',
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '7d',
      },
    );

    const response = NextResponse.json({
      success: true,
      role: 'customer',
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: 'Terjadi kesalahan server.',
      },
      {
        status: 500,
      },
    );
  }
}
