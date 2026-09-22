import { NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateSimFortune } from '@/domain/sim';

const simRequestSchema = z.object({
  phoneNumber: z.string().min(8).max(15),
  fullName: z.string().max(100).optional(),
  gender: z.boolean().default(true), // true = Nam, false = Nữ
  day: z.number().int().min(1).max(31),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(1900).max(2100),
  hour: z.number().int().min(0).max(23).default(12),
  minute: z.number().int().min(0).max(59).default(0),
  calendarType: z.enum(['solar', 'lunar']).default('solar'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = simRequestSchema.parse(body);

    const result = calculateSimFortune({
      phoneNumber: validated.phoneNumber,
      fullName: validated.fullName,
      gender: validated.gender,
      day: validated.day,
      month: validated.month,
      year: validated.year,
      hour: validated.hour,
      minute: validated.minute,
      calendarType: validated.calendarType,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0]?.message || 'Dữ liệu đầu vào không hợp lệ' },
        { status: 400 }
      );
    }
    console.error('Sim API error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Lỗi tính toán luận giải sim' },
      { status: 500 }
    );
  }
}
