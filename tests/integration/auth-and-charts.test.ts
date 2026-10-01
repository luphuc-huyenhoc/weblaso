import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../../src/server/db';
import { hashPassword, verifyPassword, hashToken } from '../../src/server/auth';
import { saveUserChart, listUserCharts, deleteUserChart } from '../../src/server/charts';
import { calculateBazi } from '../../src/domain/bazi';
import { Role, ChartType } from '@prisma/client';
import { POST as authLogin } from '../../src/app/api/auth/login/route';

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

  it('promotes user to ADMIN role and verifies role-based flags', async () => {
    const updated = await db.user.update({
      where: { id: testUserId },
      data: { role: Role.ADMIN },
    });

    expect(updated.role).toBe(Role.ADMIN);
    expect(updated.role === 'ADMIN').toBe(true);

    const userInDb = await db.user.findUnique({
      where: { id: testUserId },
      select: { role: true, isActive: true },
    });
    expect(userInDb?.role).toBe(Role.ADMIN);
    expect(userInDb?.isActive).toBe(true);
  });

  it('authenticates admin account using username "admin" or email "admin@luphuc.vn" with password "luphuc87"', async () => {
    // 1. By username "admin"
    const reqUser = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin', password: 'luphuc87' }),
    });
    const resUser = await authLogin(reqUser);
    expect(resUser.status).toBe(200);
    const jsonUser = await resUser.json();
    expect(jsonUser.user.role).toBe(Role.ADMIN);

    // 2. By email "admin@luphuc.vn"
    const reqEmail = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@luphuc.vn', password: 'luphuc87' }),
    });
    const resEmail = await authLogin(reqEmail);
    expect(resEmail.status).toBe(200);
    const jsonEmail = await resEmail.json();
    expect(jsonEmail.user.role).toBe(Role.ADMIN);
  });
});
