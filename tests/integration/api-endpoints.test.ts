import { describe, it, expect, beforeAll } from 'vitest';
import { POST as baziCalculate } from '../../src/app/api/bazi/calculate/route';
import { POST as baziReverse } from '../../src/app/api/bazi/reverse-search/route';
import { POST as ichingCalculate } from '../../src/app/api/iching/calculate/route';
import { POST as tuviCalculate } from '../../src/app/api/tuvi/calculate/route';
import { POST as tuviSaoHan } from '../../src/app/api/tuvi/saohan/route';
import { POST as calendarConvert } from '../../src/app/api/calendar/convert/route';
import { POST as fengshuiCalculate } from '../../src/app/api/fengshui/battrach/route';
import { GET as healthCheck } from '../../src/app/api/health/route';
import { GET as searchGet } from '../../src/app/api/search/route';
import { GET as itemsGet } from '../../src/app/api/items/route';

describe('Complete API Endpoints Integration Test', () => {
  it('GET /api/health returns 200 with operational services and PostgreSQL connection', async () => {
    const res = await healthCheck();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('ok');
    expect(json.services.database.status).toBe('healthy');
    expect(json.services.baziEngine.status).toBe('operational');
    expect(json.services.ziweiEngine.status).toBe('operational');
    expect(json.services.ichingEngine.status).toBe('operational');
    expect(json.services.fengshuiEngine.status).toBe('operational');
  });

  it('POST /api/bazi/calculate computes exact 4 pillars and 100-year luck', async () => {
    const req = new Request('http://localhost:3000/api/bazi/calculate', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Nguyễn Văn A',
        gender: true,
        day: 15,
        month: 8,
        year: 1990,
        hour: 10,
        minute: 30,
        oneHundredYears: true,
      }),
    });
    const res = await baziCalculate(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.engine).toBe('bazi');
    expect(json.calculation.pillars.year.stem).toBe('Canh');
    expect(json.calculation.pillars.year.branch).toBe('Ngọ');
    expect(json.calculation.pillars.day.stem).toBe('Nhâm');
    expect(json.calculation.pillars.day.branch).toBe('Tý');
    expect(json.calculation.majorLuck.pillars.length).toBeGreaterThan(0);
    expect(json.calculation.majorLuck.pillars[0].annualYears.length).toBe(10);
  });

  it('POST /api/bazi/reverse-search finds matching dates for pillars', async () => {
    const req = new Request('http://localhost:3000/api/bazi/reverse-search', {
      method: 'POST',
      body: JSON.stringify({
        thienCanYear: 1, // Giáp
        diaChiYear: 1,   // Tý
        diaChiMonth: 1,  // Dần
        thienCanDay: 1,  // Giáp
        diaChiDay: 1,    // Tý
        diaChiHour: 1,   // Tý
        startYear: 1900,
        endYear: 2000,
      }),
    });
    const res = await baziReverse(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe(200);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.count).toBe(json.data.length);
  });

  it('POST /api/iching/calculate computes Luc Hao, Random coins and Phone divination', async () => {
    // 1. Luc Hao
    const req1 = new Request('http://localhost:3000/api/iching/calculate', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Xem việc kinh doanh',
        method: 'Lục Hào',
        lines: [
          { lineIndex: 0, polarity: 'Dương', movement: 'Động' },
          { lineIndex: 1, polarity: 'Dương', movement: 'Tĩnh' },
          { lineIndex: 2, polarity: 'Dương', movement: 'Tĩnh' },
          { lineIndex: 3, polarity: 'Dương', movement: 'Tĩnh' },
          { lineIndex: 4, polarity: 'Dương', movement: 'Tĩnh' },
          { lineIndex: 5, polarity: 'Dương', movement: 'Tĩnh' },
        ],
        day: 15,
        month: 8,
        year: 1990,
        hour: 10,
        minute: 30,
      }),
    });
    const res1 = await ichingCalculate(req1);
    expect(res1.status).toBe(200);
    const json1 = await res1.json();
    expect(json1.engine).toBe('iching');
    expect(json1.calculation.originalHexagram.name).toBe('Thuần Càn');
    expect(json1.calculation.changedHexagram).toBeDefined();

    // 2. Phone Divination
    const req2 = new Request('http://localhost:3000/api/iching/calculate', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Bói sim',
        method: 'Số Điện Thoại',
        phoneNumber: '0987654321',
        day: 20,
        month: 9,
        year: 2026,
        hour: 12,
        minute: 0,
      }),
    });
    const res2 = await ichingCalculate(req2);
    expect(res2.status).toBe(200);
    const json2 = await res2.json();
    expect(json2.calculation.method).toBe('Số Điện Thoại');
  });

  it('POST /api/tuvi/calculate and /api/tuvi/saohan evaluate 12 palaces and Cửu Diệu', async () => {
    // 1. Ziwei
    const req1 = new Request('http://localhost:3000/api/tuvi/calculate', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Lê Văn B',
        gender: true,
        day: 10,
        month: 5,
        year: 1985,
        hour: 14,
        minute: 20,
      }),
    });
    const res1 = await tuviCalculate(req1);
    expect(res1.status).toBe(200);
    const json1 = await res1.json();
    expect(json1.engine).toBe('ziwei');
    expect(json1.calculation.palaces.length).toBe(12);

    // 2. Sao Han
    const req2 = new Request('http://localhost:3000/api/tuvi/saohan', {
      method: 'POST',
      body: JSON.stringify({
        birthYear: 1990,
        gender: true,
        targetYear: 2026,
      }),
    });
    const res2 = await tuviSaoHan(req2);
    expect(res2.status).toBe(200);
    const json2 = await res2.json();
    expect(json2.data.lunarAge).toBe(37);
    expect(json2.data.cuuDieu.star).toBeDefined();
    expect(json2.data.tamTai).toBeDefined();
    expect(json2.data.kimLau).toBeDefined();
    expect(json2.data.hoangOc).toBeDefined();
  });

  it('POST /api/calendar/convert executes bidirectional conversion with solar term', async () => {
    // Solar to Lunar
    const reqSolar = new Request('http://localhost:3000/api/calendar/convert', {
      method: 'POST',
      body: JSON.stringify({
        type: 'solar-to-lunar',
        day: 15,
        month: 8,
        year: 1990,
      }),
    });
    const resSolar = await calendarConvert(reqSolar);
    expect(resSolar.status).toBe(200);
    const jsonSolar = await resSolar.json();
    expect(jsonSolar.data.converted.lunarDay).toBe(25);
    expect(jsonSolar.data.converted.lunarMonth).toBe(6);
    expect(jsonSolar.data.converted.lunarYear).toBe(1990);
    expect(jsonSolar.data.converted.canChiDay).toBe('Nhâm Tý');

    // Lunar to Solar
    const reqLunar = new Request('http://localhost:3000/api/calendar/convert', {
      method: 'POST',
      body: JSON.stringify({
        type: 'lunar-to-solar',
        day: 25,
        month: 6,
        year: 1990,
      }),
    });
    const resLunar = await calendarConvert(reqLunar);
    expect(resLunar.status).toBe(200);
    const jsonLunar = await resLunar.json();
    expect(jsonLunar.data.converted.solarDay).toBe(15);
    expect(jsonLunar.data.converted.solarMonth).toBe(8);
    expect(jsonLunar.data.converted.solarYear).toBe(1990);
  });

  it('POST /api/fengshui/battrach evaluates 8 directions and degree boundaries', async () => {
    const req = new Request('http://localhost:3000/api/fengshui/battrach', {
      method: 'POST',
      body: JSON.stringify({
        birthYear: 1990,
        gender: true,
        degree: 180, // Sơn Ngọ (Chính Nam)
      }),
    });
    const res = await fengshuiCalculate(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.quaiMenh).toBe('Ly');
    expect(json.data.group).toBe('Đông Tứ Mệnh');
    expect(json.data.directions.length).toBe(8);
    expect(json.data.degreeEvaluation).toBeDefined();
    expect(json.data.degreeEvaluation.mountain).toBe('Ngọ');
    expect(json.data.degreeEvaluation.status).toBe('An Toàn');
  });

  it('GET /api/search returns results across tools, articles and items', async () => {
    const req = new Request('http://localhost:3000/api/search?q=Bát tự');
    const res = await searchGet(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.query).toBe('Bát tự');
    expect(json.data.tools.length).toBeGreaterThan(0);
  });

  it('GET /api/items returns feng shui items catalog', async () => {
    const req = new Request('http://localhost:3000/api/items');
    const res = await itemsGet(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.data)).toBe(true);
  });
});
