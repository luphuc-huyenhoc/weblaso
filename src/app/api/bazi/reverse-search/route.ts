import { NextResponse } from 'next/server';
import { z } from 'zod';
import { searchBaziByPillars } from '@/domain/bazi/reverse';

const reverseSchema = z.object({
  thienCanYear: z.number().int().min(1).max(10),
  diaChiYear: z.number().int().min(1).max(12),
  diaChiMonth: z.number().int().min(1).max(12),
  thienCanDay: z.number().int().min(1).max(10),
  diaChiDay: z.number().int().min(1).max(12),
  diaChiHour: z.number().int().min(1).max(12),
  startYear: z.number().int().optional(),
  endYear: z.number().int().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = reverseSchema.parse(body);

    const matches = searchBaziByPillars(validated);
    return NextResponse.json({
      status: 200,
      count: matches.length,
      data: matches,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: 400, message: error.errors[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }
    console.error('Reverse Bazi search error:', error);
    return NextResponse.json(
      { status: 500, message: 'Lỗi trong quá trình tìm kiếm' },
      { status: 500 }
    );
  }
}
