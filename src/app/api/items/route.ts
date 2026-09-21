import { NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const element = searchParams.get('element');

    const where: any = { isActive: true };
    if (element) {
      where.element = element;
    }

    const items = await db.fengShuiItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      status: 200,
      data: items,
    });
  } catch (error: any) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { status: 500, message: 'Lỗi khi tải danh sách vật phẩm' },
      { status: 500 }
    );
  }
}
