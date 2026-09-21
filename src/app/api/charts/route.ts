import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/auth';
import { saveUserChart, listUserCharts } from '@/server/charts';
import { ChartType } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { status: 401, message: 'Chưa đăng nhập' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const chartType = searchParams.get('type') as ChartType | null;

    const charts = await listUserCharts(user.id, chartType || undefined);
    return NextResponse.json({
      status: 200,
      data: charts,
    });
  } catch (error: any) {
    console.error('List charts error:', error);
    return NextResponse.json(
      { status: 500, message: error.message || 'Lỗi khi tải danh sách lá số' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { status: 401, message: 'Vui lòng đăng nhập để lưu lá số' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { chartType, title, chartData, notes } = body;

    if (!chartType || !chartData) {
      return NextResponse.json(
        { status: 400, message: 'Thiếu thông tin lá số' },
        { status: 400 }
      );
    }

    const saved = await saveUserChart(user, {
      chartType,
      title: title || 'Lá số lưu',
      personName: chartData.input?.fullName || chartData.calculation?.personal?.fullName || undefined,
      gender: chartData.input?.gender ?? chartData.calculation?.personal?.gender ?? undefined,
      solarDate: chartData.input?.day ? new Date(chartData.input.year, chartData.input.month - 1, chartData.input.day) : undefined,
      lunarDateStr: chartData.calculation?.lunarDateStr || undefined,
      engineVersion: chartData.engineVersion || '1.0.0',
      methodologyVersion: chartData.methodology || 'standard-v1',
      calendarVersion: chartData.calendarVersion || '1.0.0',
      timezonePolicy: chartData.timezonePolicy || 'UTC+07-fixed',
      inputHash: chartData.inputHash || `${Date.now()}`,
      calculatedAt: chartData.calculatedAt ? new Date(chartData.calculatedAt) : new Date(),
      inputData: chartData.input || {},
      calculationData: chartData.calculation || chartData,
      interpretationData: chartData.interpretation || {},
      notes,
    });

    return NextResponse.json({
      status: 201,
      message: 'Lưu lá số thành công',
      data: saved,
    });
  } catch (error: any) {
    console.error('Save chart error:', error);
    return NextResponse.json(
      { status: 500, message: error.message || 'Lỗi khi lưu lá số' },
      { status: 500 }
    );
  }
}
