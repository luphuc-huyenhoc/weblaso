import { NextResponse } from 'next/server';
import { destroySession } from '@/server/auth';

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({
      status: 200,
      message: 'Đăng xuất thành công',
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { status: 500, message: 'Lỗi khi đăng xuất' },
      { status: 500 }
    );
  }
}
