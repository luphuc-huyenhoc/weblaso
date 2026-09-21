import { NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateBazi } from '@/domain/bazi';

const baziSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được để trống').max(128, 'Họ tên tối đa 128 ký tự'),
  gender: z.boolean(),
  day: z.number().int().min(1).max(31),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(1900).max(2150),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  focusYear: z.number().int().min(1900).max(2150).optional(),
  oneHundredYears: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = baziSchema.parse(body);

    const result = calculateBazi(validated);
    return NextResponse.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: 400, message: error.errors[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }
    console.error('Bazi calculation error:', error);
    return NextResponse.json(
      { status: 500, message: 'Đã xảy ra lỗi trong quá trình tính toán' },
      { status: 500 }
    );
  }
}
