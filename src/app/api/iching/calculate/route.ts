import { NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateIching, IchingLineInput } from '@/domain/iching';

const lineSchema = z.object({
  lineIndex: z.number().int().min(0).max(5),
  polarity: z.enum(['Âm', 'Dương']),
  movement: z.enum(['Tĩnh', 'Động']),
});

const ichingRequestSchema = z.object({
  title: z.string().default('Gieo quẻ sự vụ'),
  method: z.enum(['Lục Hào', 'Ngẫu Nhiên', 'Số Điện Thoại']),
  lines: z.array(lineSchema).length(6).optional(),
  phoneNumber: z.string().optional(),
  day: z.number().int().min(1).max(31).default(() => new Date().getDate()),
  month: z.number().int().min(1).max(12).default(() => new Date().getMonth() + 1),
  year: z.number().int().min(1900).max(2100).default(() => new Date().getFullYear()),
  hour: z.number().int().min(0).max(23).default(() => new Date().getHours()),
  minute: z.number().int().min(0).max(59).default(() => new Date().getMinutes()),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = ichingRequestSchema.parse(body);

    const envelope = calculateIching({
      title: validated.title,
      method: validated.method,
      lines: validated.lines as IchingLineInput[] | undefined,
      phoneNumber: validated.phoneNumber,
      day: validated.day,
      month: validated.month,
      year: validated.year,
      hour: validated.hour,
      minute: validated.minute,
    });

    return NextResponse.json(envelope);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: 400, message: error.errors[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }
    console.error('Iching API error:', error);
    return NextResponse.json(
      { status: 500, message: error.message || 'Lỗi xử lý quẻ dịch' },
      { status: 500 }
    );
  }
}
