import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/auth';
import { deleteUserChart, toggleFavoriteChart } from '@/server/charts';
import { db } from '@/server/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ status: 401, message: 'Chưa đăng nhập' }, { status: 401 });
    }

    const { id } = await params;
    const chart = await db.savedChart.findFirst({
      where: { id, userId: user.id },
    });

    if (!chart) {
      return NextResponse.json({ status: 404, message: 'Không tìm thấy lá số' }, { status: 404 });
    }

    return NextResponse.json({ status: 200, data: chart });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ status: 401, message: 'Chưa đăng nhập' }, { status: 401 });
    }

    const { id } = await params;
    await deleteUserChart(user.id, id);

    return NextResponse.json({ status: 200, message: 'Xóa lá số thành công' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ status: 401, message: 'Chưa đăng nhập' }, { status: 401 });
    }

    const { id } = await params;
    const updated = await toggleFavoriteChart(user.id, id);

    return NextResponse.json({ status: 200, data: updated });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
  }
}
