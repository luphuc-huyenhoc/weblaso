import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { hashToken, hashPassword } from '@/server/auth';

const resetSchema = z.object({
  token: z.string().min(1, 'Mã xác nhận không hợp lệ'),
  newPassword: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, newPassword } = resetSchema.parse(body);

    const tokenHash = hashToken(token);
    const resetRecord = await db.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { status: 400, message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await db.$transaction([
      db.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      db.passwordResetToken.delete({
        where: { tokenHash },
      }),
    ]);

    return NextResponse.json({
      status: 200,
      message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: 400, message: error.errors[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }
    console.error('Reset password error:', error);
    return NextResponse.json(
      { status: 500, message: 'Lỗi khi cập nhật mật khẩu' },
      { status: 500 }
    );
  }
}
