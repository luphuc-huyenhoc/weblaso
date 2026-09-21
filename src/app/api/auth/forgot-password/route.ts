import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { hashToken } from '@/server/auth';
import crypto from 'crypto';

const forgotSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = forgotSchema.parse(body);
    const normalizedEmail = email.toLowerCase();

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      // Invalidate existing tokens
      await db.passwordResetToken.deleteMany({
        where: { userId: user.id },
      });

      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });

      console.log(`[PASSWORD_RESET] Token for ${normalizedEmail}: ${rawToken}`);
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      status: 200,
      message: 'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi đi.',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: 400, message: error.errors[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { status: 500, message: 'Lỗi khi yêu cầu đặt lại mật khẩu' },
      { status: 500 }
    );
  }
}
