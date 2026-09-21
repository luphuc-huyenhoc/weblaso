import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { hashPassword, createSession, hashToken } from '@/server/auth';
import crypto from 'crypto';

const registerSchema = z.object({
  name: z.string().min(2, 'Họ tên tối thiểu 2 ký tự').max(100),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);
    const normalizedEmail = email.toLowerCase();

    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { status: 400, message: 'Email này đã được đăng ký trong hệ thống' },
        { status: 400 }
      );
    }

    const username = `${normalizedEmail.split('@')[0]}_${crypto.randomBytes(2).toString('hex')}`;
    const passwordHash = await hashPassword(password);

    const newUser = await db.user.create({
      data: {
        username,
        email: normalizedEmail,
        fullName: name,
        passwordHash,
        isActive: true,
      },
    });

    // Generate Email Verification Token
    const rawVerificationToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawVerificationToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.emailVerificationToken.create({
      data: {
        userId: newUser.id,
        tokenHash,
        expiresAt,
      },
    });

    const userAgent = req.headers.get('user-agent') || undefined;
    const ip = req.headers.get('x-forwarded-for') || undefined;
    await createSession(newUser.id, ip, userAgent);

    return NextResponse.json({
      status: 201,
      message: 'Đăng ký tài khoản thành công',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.fullName,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: 400, message: error.errors[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }
    console.error('Register error:', error);
    return NextResponse.json(
      { status: 500, message: 'Lỗi trong quá trình đăng ký tài khoản' },
      { status: 500 }
    );
  }
}
