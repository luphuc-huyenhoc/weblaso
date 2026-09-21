import { NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateZiwei } from '@/domain/ziweidoushu';

const ziweiRequestSchema = z.object({
  fullName: z.string().default('Ẩn danh'),
  gender: z.boolean(),
  day: z.number().int().min(1).max(31),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(1900).max(2100),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59).default(0),
  viewYear: z.number().int().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = ziweiRequestSchema.parse(body);

    const envelope = calculateZiwei({
      fullName: validated.fullName,
      gender: validated.gender,
      day: validated.day,
      month: validated.month,
      year: validated.year,
      hour: validated.hour,
      minute: validated.minute,
      viewYear: validated.viewYear,
    });

    return NextResponse.json(envelope);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: 400, message: error.errors[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }
    console.error('Ziwei calculation error:', error);
    return NextResponse.json(
      { status: 500, message: error.message || 'Lỗi khi an sao tử vi' },
      { status: 500 }
    );
  }
}
