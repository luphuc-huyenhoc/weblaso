import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../../src/server/db';
import { hashPassword, verifyPassword, hashToken } from '../../src/server/auth';
import { saveUserChart, listUserCharts, deleteUserChart } from '../../src/server/charts';
import { calculateBazi } from '../../src/domain/bazi';
import { Role, ChartType } from '@prisma/client';

describe('Auth & Versioned Chart Persistence Integration', () => {
  const testEmail = `test_${Date.now()}@luphuc.vn`;
  let testUserId = '';

  beforeAll(async () => {
    const passwordHash = await hashPassword('TestPass@123');
    const user = await db.user.create({
      data: {
        username: `user_${Date.now()}`,
        email: testEmail,
        fullName: 'Test Integration User',
        passwordHash,
        role: Role.USER,
        isActive: true,
      },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    if (testUserId) {
      await db.user.delete({ where: { id: testUserId } });
    }
  });

  it('correctly hashes and verifies passwords', async () => {
    const raw = 'SecureSecret!99';
    const hash = await hashPassword(raw);
    expect(hash).not.toBe(raw);
    const valid = await verifyPassword(raw, hash);
    expect(valid).toBe(true);
    const invalid = await verifyPassword('WrongPass', hash);
    expect(invalid).toBe(false);
  });

  it('persists a complete Bát Tự chart with versioning into PostgreSQL JSONB', async () => {
    const calc = calculateBazi({
      fullName: 'Nguyễn Văn A',
      gender: true,
      day: 15,
      month: 8,
      year: 1990,
      hour: 10,
      minute: 30,
    });

    const userObj = {
      id: testUserId,
      role: Role.USER,
      activeSubscription: null,
    } as any;

    const saved = await saveUserChart(userObj, {
      chartType: ChartType.BAZI,
      title: 'Lá số Nguyễn Văn A',
      personName: 'Nguyễn Văn A',
      gender: true,
      solarDate: new Date('1990-08-15T10:30:00+07:00'),
      lunarDateStr: calc.calculation.personal.lunarDateStr,
      engineVersion: calc.engineVersion,
      methodologyVersion: calc.methodology,
      calendarVersion: calc.calendarVersion,
      timezonePolicy: calc.timezonePolicy,
      inputHash: calc.inputHash,
      calculatedAt: new Date(calc.calculatedAt),
      inputData: calc.input,
      calculationData: calc.calculation,
      interpretationData: calc.interpretation,
      notes: 'Lá số mẫu kiểm thử tích hợp',
    });

    expect(saved.id).toBeDefined();
    expect(saved.engineVersion).toBe('1.0.0');
    expect((saved.calculationData as any).dayMaster.stem).toBe('Nhâm');

    // List charts
    const charts = await listUserCharts(testUserId);
    expect(charts.length).toBeGreaterThan(0);
    expect(charts[0].title).toBe('Lá số Nguyễn Văn A');

    // Delete chart
    await deleteUserChart(testUserId, saved.id);
    const afterDelete = await listUserCharts(testUserId);
    expect(afterDelete.some(c => c.id === saved.id)).toBe(false);
  });
});
