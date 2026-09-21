import { NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateSaoHan } from '@/domain/ziweidoushu';

const saohanRequestSchema = z.object({
  birthYear: z.number().int().min(1900).max(2100),
  gender: z.boolean(),
  targetYear: z.number().int().min(1900).max(2100).default(() => new Date().getFullYear()),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = saohanRequestSchema.parse(body);

    const result = calculateSaoHan(
      validated.birthYear,
      validated.gender,
      validated.targetYear
    );

    return NextResponse.json({
      status: 200,
      data: result,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: 400, message: error.errors[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }
    console.error('Sao Han calculation error:', error);
    return NextResponse.json(
      { status: 500, message: error.message || 'Lỗi khi tính sao hạn' },
      { status: 500 }
    );
  }
}
