import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  solarToLunar,
  lunarToSolar,
  gregorianToJdn,
  getCanChiDay,
  getCanChiMonth,
  getCanChiYear,
  getSolarTerm,
} from '@/domain/calendar';

const convertSchema = z.object({
  type: z.enum(['solar-to-lunar', 'lunar-to-solar']),
  day: z.number().int().min(1).max(31),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(1900).max(2100),
  isLeapMonth: z.boolean().default(false),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = convertSchema.parse(body);

    if (validated.type === 'solar-to-lunar') {
      const lunar = solarToLunar(validated.year, validated.month, validated.day);
      const jdn = gregorianToJdn(validated.year, validated.month, validated.day);
      const canChiDay = getCanChiDay(jdn);
      const canChiMonth = getCanChiMonth(validated.year, lunar.month);
      const canChiYear = getCanChiYear(lunar.year);
      const solarTerm = getSolarTerm(jdn);

      return NextResponse.json({
        status: 200,
        data: {
          input: {
            solarDay: validated.day,
            solarMonth: validated.month,
            solarYear: validated.year,
          },
          converted: {
            lunarDay: lunar.day,
            lunarMonth: lunar.month,
            lunarYear: lunar.year,
            isLeap: lunar.isLeap,
            canChiDay,
            canChiMonth,
            canChiYear,
            solarTerm,
          },
        },
      });
    } else {
      const solar = lunarToSolar(
        validated.year,
        validated.month,
        validated.day,
        validated.isLeapMonth
      );
      const jdn = gregorianToJdn(solar.year, solar.month, solar.day);
      const canChiDay = getCanChiDay(jdn);
      const canChiMonth = getCanChiMonth(solar.year, validated.month);
      const canChiYear = getCanChiYear(validated.year);
      const solarTerm = getSolarTerm(jdn);

      return NextResponse.json({
        status: 200,
        data: {
          input: {
            lunarDay: validated.day,
            lunarMonth: validated.month,
            lunarYear: validated.year,
            isLeap: validated.isLeapMonth,
          },
          converted: {
            solarDay: solar.day,
            solarMonth: solar.month,
            solarYear: solar.year,
            canChiDay,
            canChiMonth,
            canChiYear,
            solarTerm,
          },
        },
      });
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: 400, message: error.errors[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }
    console.error('Calendar convert error:', error);
    return NextResponse.json(
      { status: 500, message: error.message || 'Lỗi khi chuyển đổi lịch' },
      { status: 500 }
    );
  }
}
