import { db } from './db';
import { ChartType } from '@prisma/client';
import { AuthSessionUser } from './auth';
import { hasEntitlement } from './entitlements';

export interface SaveChartInput {
  chartType: ChartType;
  title: string;
  personName?: string;
  gender?: boolean;
  solarDate?: Date;
  lunarDateStr?: string;
  engineVersion: string;
  methodologyVersion: string;
  calendarVersion: string;
  timezonePolicy: string;
  inputHash: string;
  calculatedAt: Date;
  inputData: any;
  calculationData: any;
  interpretationData: any;
  notes?: string;
}

export async function saveUserChart(user: AuthSessionUser, data: SaveChartInput) {
  // Check quota for non-subscribers
  const isUnlimited = hasEntitlement(user, 'unlimited_saved_charts');
  if (!isUnlimited) {
    const existingCount = await db.savedChart.count({
      where: { userId: user.id },
    });
    if (existingCount >= 5) {
      throw new Error('Bạn đã đạt giới hạn 5 lá số lưu của gói Miễn phí. Vui lòng nâng cấp Premium để lưu không giới hạn.');
    }
  }

  return db.savedChart.create({
    data: {
      userId: user.id,
      chartType: data.chartType,
      title: data.title,
      personName: data.personName,
      gender: data.gender,
      solarDate: data.solarDate,
      lunarDateStr: data.lunarDateStr,
      engineVersion: data.engineVersion,
      methodologyVersion: data.methodologyVersion,
      calendarVersion: data.calendarVersion,
      timezonePolicy: data.timezonePolicy,
      inputHash: data.inputHash,
      calculatedAt: data.calculatedAt,
      inputData: data.inputData,
      calculationData: data.calculationData,
      interpretationData: data.interpretationData,
      notes: data.notes,
    },
  });
}

export async function listUserCharts(userId: string, chartType?: ChartType) {
  return db.savedChart.findMany({
    where: {
      userId,
      ...(chartType ? { chartType } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteUserChart(userId: string, chartId: string) {
  return db.savedChart.deleteMany({
    where: {
      id: chartId,
      userId,
    },
  });
}

export async function toggleFavoriteChart(userId: string, chartId: string) {
  const chart = await db.savedChart.findFirst({
    where: { id: chartId, userId },
  });
  if (!chart) throw new Error('Không tìm thấy lá số');

  return db.savedChart.update({
    where: { id: chartId },
    data: { isFavorite: !chart.isFavorite },
  });
}
