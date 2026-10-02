import { describe, it, expect } from 'vitest';
import { generateAIInterpretation } from '../../src/server/ai/interpretation';
import { hasEntitlement } from '../../src/server/entitlements';
import { Role, SubscriptionStatus } from '@prisma/client';

describe('AI Interpretation Engine & VIP Entitlement Gating', () => {
  it('correctly gates AI interpretation feature for different roles and subscriptions', () => {
    // 1. Unauthenticated guest
    expect(hasEntitlement(null, 'advanced_interpretation')).toBe(false);

    // 2. Free user (no active subscription)
    const freeUser: any = {
      id: 'free_123',
      role: Role.USER,
      activeSubscription: null,
    };
    expect(hasEntitlement(freeUser, 'advanced_interpretation')).toBe(false);

    // 3. User with canceled/expired subscription
    const expiredUser: any = {
      id: 'exp_123',
      role: Role.USER,
      activeSubscription: { status: SubscriptionStatus.EXPIRED },
    };
    expect(hasEntitlement(expiredUser, 'advanced_interpretation')).toBe(false);

    // 4. Paid VIP user with active subscription
    const vipUser: any = {
      id: 'vip_123',
      role: Role.USER,
      activeSubscription: { status: SubscriptionStatus.ACTIVE },
    };
    expect(hasEntitlement(vipUser, 'advanced_interpretation')).toBe(true);

    // 5. Admin user (full access)
    const adminUser: any = {
      id: 'admin_123',
      role: Role.ADMIN,
      activeSubscription: null,
    };
    expect(hasEntitlement(adminUser, 'advanced_interpretation')).toBe(true);
  });

  it('generates structured Bazi interpretation report', async () => {
    const result = await generateAIInterpretation({
      chartType: 'BAZI',
      data: {
        personal: {
          fullName: 'Trần Văn Nam',
          gender: true,
          solarDate: '1995-10-20',
          lunarDateStr: '27 Tháng 9 Năm Ất Hợi',
        },
        pillars: {
          year: { stem: 'Ất', branch: 'Hợi', napAm: 'Sơn Đầu Hỏa', tenGod: 'Chính Tài' },
          month: { stem: 'Bính', branch: 'Tuất', napAm: 'Ốc Thượng Thổ', tenGod: 'Thực Thần' },
          day: { stem: 'Giáp', branch: 'Thìn', napAm: 'Phúc Đăng Hỏa', tenGod: 'Nhật Chủ' },
          hour: { stem: 'Mậu', branch: 'Thìn', napAm: 'Đại Lâm Mộc', tenGod: 'Thiên Tài' },
        },
        dayMaster: {
          stem: 'Giáp',
          strength: 'Thân Vượng',
          percentage: 65,
        },
        interpretation: {
          dungThan: 'Hỏa / Thổ',
          hyThan: 'Kim',
          kyThan: 'Thủy',
          elementsScore: { Kim: 12, Mộc: 28, Thủy: 10, Hỏa: 30, Thổ: 20 },
          recommendations: {
            favorableColors: ['Đỏ', 'Cam', 'Vàng'],
            favorableDirections: ['Nam', 'Tây Nam'],
            favorableGemstones: ['Thạch anh tím', 'Mắt hổ vàng'],
          },
        },
      },
      userQuestion: 'Năm nay có thuận lợi để khởi nghiệp không?',
    });

    expect(result.text).toBeDefined();
    expect(result.text.length).toBeGreaterThan(100);
    expect(result.text).toContain('Trần Văn Nam');
  });

  it('generates structured Ziwei interpretation report', async () => {
    const result = await generateAIInterpretation({
      chartType: 'ZIWEI',
      data: {
        personal: {
          fullName: 'Lê Thị Hoa',
          genderLabel: 'Nữ mạng',
          lunarAge: 32,
          currentYearCanChi: 'Bính Ngọ',
          menhElement: 'Giản Hạ Thủy',
          cuc: 'Thủy Nhị Cục',
          menhMainStar: 'Tử Vi, Thiên Phủ',
          thanCungName: 'Quan Lộc',
        },
        palaces: [
          { isMenh: true, cungName: 'Mệnh', branch: 'Dần', mainStars: [{ name: 'Tử Vi' }] },
          { isThan: true, cungName: 'Quan Lộc', branch: 'Ngọ', mainStars: [{ name: 'Liêm Trinh' }] },
        ],
      },
    });

    expect(result.text).toBeDefined();
    expect(result.text.length).toBeGreaterThan(50);
    expect(result.text).toContain('Lê Thị Hoa');
  });

  it('generates structured Iching interpretation report', async () => {
    const result = await generateAIInterpretation({
      chartType: 'ICHING',
      data: {
        calculation: {
          originalHexagram: {
            name: 'Thuần Càn',
            number: 1,
            upperTrigram: 'Càn',
            lowerTrigram: 'Càn',
            judgment: 'Nguyên hanh lợi trinh',
          },
        },
      },
    });

    expect(result.text).toBeDefined();
    expect(result.text.length).toBeGreaterThan(30);
  });
});
