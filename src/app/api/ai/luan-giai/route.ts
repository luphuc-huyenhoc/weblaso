import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/auth';
import { hasEntitlement } from '@/server/entitlements';
import { generateAIInterpretation, InterpretationRequest } from '@/server/ai/interpretation';

export async function POST(req: Request) {
  try {
    // 1. Check User Session
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          code: 'AUTH_REQUIRED',
          message: 'Vui lòng đăng nhập tài khoản để sử dụng tính năng luận giải AI.',
        },
        { status: 401 }
      );
    }

    // 2. Check VIP / Premium Entitlement (Strict Gating)
    const canAccess = hasEntitlement(user, 'advanced_interpretation');
    if (!canAccess) {
      return NextResponse.json(
        {
          success: false,
          code: 'PREMIUM_REQUIRED',
          message:
            'Tính năng Luận Giải Lá Số Bằng AI chuyên sâu chỉ dành riêng cho Thành viên Trả phí (VIP) hoặc Quản Trị Viên.',
        },
        { status: 403 }
      );
    }

    // 3. Parse Request Body
    const body = await req.json();
    const { chartType, data, userQuestion } = body as InterpretationRequest;

    if (!chartType || !data) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dữ liệu lá số không hợp lệ.',
        },
        { status: 400 }
      );
    }

    // 4. Generate AI Interpretation
    const result = await generateAIInterpretation({
      chartType,
      data,
      userQuestion,
    });

    return NextResponse.json({
      success: true,
      data: {
        interpretation: result.text,
        model: result.model,
        isAiGenerated: result.isAiGenerated,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error generating AI interpretation:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Lỗi khi tạo luận giải AI.',
      },
      { status: 500 }
    );
  }
}
