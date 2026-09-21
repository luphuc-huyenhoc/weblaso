import { NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateBatTrach, evaluateMountainDegree } from '@/domain/fengshui';

const batTrachRequestSchema = z.object({
  birthYear: z.number().int().min(1900).max(2100),
  gender: z.boolean(),
  degree: z.number().min(0).max(360).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = batTrachRequestSchema.parse(body);

    const result = calculateBatTrach(validated.birthYear, validated.gender);
    let degreeEvaluation = null;
    if (validated.degree !== undefined) {
      degreeEvaluation = evaluateMountainDegree(validated.degree);
    }

    return NextResponse.json({
      status: 200,
      data: {
        ...result,
        degreeEvaluation,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { status: 400, message: error.errors[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }
    console.error('Bat Trach calculation error:', error);
    return NextResponse.json(
      { status: 500, message: error.message || 'Lỗi khi tính toán Bát Trạch' },
      { status: 500 }
    );
  }
}
