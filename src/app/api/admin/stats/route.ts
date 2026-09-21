import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/auth';
import { db } from '@/server/db';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== Role.ADMIN) {
      return NextResponse.json(
        { status: 403, message: 'Quyền truy cập bị từ chối' },
        { status: 403 }
      );
    }

    const [totalUsers, totalCharts, activeSubs, totalPayments, recentUsers, recentCharts] =
      await Promise.all([
        db.user.count(),
        db.savedChart.count(),
        db.subscription.count({ where: { status: 'ACTIVE' } }),
        db.payment.aggregate({ _sum: { amount: true }, where: { status: 'SUCCESS' } }),
        db.user.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, fullName: true, email: true, role: true, createdAt: true },
        }),
        db.savedChart.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, title: true, chartType: true, engineVersion: true, createdAt: true },
        }),
      ]);

    return NextResponse.json({
      status: 200,
      data: {
        stats: {
          totalUsers,
          totalCharts,
          activeSubs,
          revenue: Number(totalPayments._sum.amount || 0),
        },
        recentUsers: recentUsers.map((u) => ({ ...u, name: u.fullName })),
        recentCharts,
      },
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { status: 500, message: error.message || 'Lỗi khi tải thống kê' },
      { status: 500 }
    );
  }
}
