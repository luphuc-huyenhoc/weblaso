import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { verifyPassword, createSession } from '@/server/auth';

const loginSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { status: 401, message: 'Email hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { status: 401, message: 'Email hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    const userAgent = req.headers.get('user-agent') || undefined;
    const ip = req.headers.get('x-forwarded-for') || undefined;

    await createSession(user.id, ip, userAgent);

    return NextResponse.json({
      status: 200,
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: 400, message: error.errors[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }
    console.error('Login error:', error);
    return NextResponse.json(
      { status: 500, message: 'Lỗi trong quá trình đăng nhập' },
      { status: 500 }
    );
  }
}
