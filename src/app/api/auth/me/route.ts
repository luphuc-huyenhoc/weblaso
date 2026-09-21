import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/auth';
import { getEffectiveEntitlements } from '@/server/entitlements';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({
        status: 200,
        authenticated: false,
        user: null,
      });
    }

    const entitlements = getEffectiveEntitlements(user);

    return NextResponse.json({
      status: 200,
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: user.role,
        isActive: user.isActive,
        subscription: user.activeSubscription
          ? {
              planType: user.activeSubscription.planType,
              status: user.activeSubscription.status,
              endDate: user.activeSubscription.endDate,
            }
          : null,
        entitlements,
      },
    });
  } catch (error: any) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { status: 500, message: 'Lỗi khi kiểm tra phiên đăng nhập' },
      { status: 500 }
    );
  }
}
