import React from 'react';
import { PillarData, MinorLuckResult, calculateMinorLuck } from '@/domain/bazi';
import { getStemColor, getBranchColor, getElementColor } from './BaziChartColors';

interface FourPillarsGridProps {
  pillars: {
    year: PillarData;
    month: PillarData;
    day: PillarData;
    hour: PillarData;
  };
  genderLabel?: 'Dương Nam' | 'Âm Nam' | 'Dương Nữ' | 'Âm Nữ';
  focusYear?: number;
  minorLuck?: MinorLuckResult;
}

export function FourPillarsGrid({
  pillars,
  genderLabel,
  focusYear,
  minorLuck,
}: FourPillarsGridProps) {
  const pList = [pillars.year, pillars.month, pillars.day, pillars.hour];

  // Resolve or compute Minor Luck (Tiểu Vận)
  const activeMinorLuck: MinorLuckResult =
    minorLuck ??
    calculateMinorLuck({
      gender: genderLabel ? genderLabel.includes('Nam') : true,
      yearStem: pillars.year.stem,
      hourStem: pillars.hour.stem,
      hourBranch: pillars.hour.branch,
      dayMaster: pillars.day.stem,
      birthYear: parseInt(pillars.year.solarValue, 10) || new Date().getFullYear(),
      focusYear,
    });

  return (
    <div className="w-full h-[450px] flex-shrink-0 text-[#112244] box-border flex flex-col">
      {/* 1. DƯƠNG LỊCH ROW (46px) */}
      <div
        className="w-full border-b-[1.5px] border-[#3182ce] h-[46px] items-stretch text-center"
        style={{ display: 'grid', gridTemplateColumns: '86px repeat(4, 1fr)' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-black text-[12px] tracking-wider uppercase bg-blue-50/20 text-[#1b3b6f]">
          <span>DƯƠNG</span>
          <span>LỊCH</span>
        </div>
        {pList.map((p, idx) => (
          <div
            key={`solar-${idx}`}
            className={`h-full flex items-center justify-center font-black text-[16px] text-[#112244] py-1 ${
              idx < 3 ? 'border-r-[1.5px] border-[#3182ce]' : ''
            }`}
          >
            {p.solarValue}
          </div>
        ))}
      </div>

      {/* 2. CHỦ TINH ROW (46px) */}
      <div
        className="w-full border-b-[1.5px] border-[#3182ce] h-[46px] items-stretch text-center"
        style={{ display: 'grid', gridTemplateColumns: '86px repeat(4, 1fr)' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-black text-[12px] tracking-wider uppercase bg-blue-50/20 text-[#1b3b6f]">
          <span>CHỦ</span>
          <span>TINH</span>
        </div>
        {pList.map((p, idx) => {
          const isDay = idx === 2;
          return (
            <div
              key={`main-god-${idx}`}
              className={`h-full flex items-center justify-center font-bold text-[14.5px] text-[#112244] py-1 ${
                idx < 3 ? 'border-r-[1.5px] border-[#3182ce]' : ''
              }`}
            >
              {isDay ? (
                <div className="leading-tight font-black uppercase text-[#112244] text-[13px]">
                  <div>NHẬT</div>
                  <div>CHỦ</div>
                </div>
              ) : (
                <span>{p.stemTenGod}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. BÁT TỰ ROW (148px) — Prominent typography with Ngũ Hành Colors */}
      <div
        className="w-full border-b-[1.5px] border-[#3182ce] h-[148px] items-stretch text-center bg-transparent"
        style={{ display: 'grid', gridTemplateColumns: '86px repeat(4, 1fr)' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-black text-[12.5px] tracking-widest uppercase bg-blue-50/20 text-[#1b3b6f]">
          <span>BÁT</span>
          <span>TỰ</span>
        </div>
        {pList.map((p, idx) => {
          const stemColor = getStemColor(p.stem);
          const branchColor = getBranchColor(p.branch);
          return (
            <div
              key={`battu-cell-${idx}`}
              className={`h-full flex flex-col justify-center items-center py-2 space-y-2 ${
                idx < 3 ? 'border-r-[1.5px] border-[#3182ce]' : ''
              }`}
            >
              <div
                className="text-[28px] font-black uppercase tracking-wider leading-none"
                style={{ color: stemColor }}
              >
                {p.stem}
              </div>
              <div
                className="text-[28px] font-black uppercase tracking-wider leading-none"
                style={{ color: branchColor }}
              >
                {p.branch}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. TÀNG ẨN ROW (46px) */}
      <div
        className="w-full border-b-[1.5px] border-[#3182ce] h-[46px] items-stretch text-center"
        style={{ display: 'grid', gridTemplateColumns: '86px repeat(4, 1fr)' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-black text-[12px] tracking-wider uppercase bg-blue-50/20 text-[#1b3b6f]">
          <span>TÀNG</span>
          <span>ẨN</span>
        </div>
        {pList.map((p, idx) => (
          <div
            key={`tang-an-${idx}`}
            className={`h-full flex items-center justify-around px-1 py-1 ${
              idx < 3 ? 'border-r-[1.5px] border-[#3182ce]' : ''
            }`}
          >
            {p.hiddenStems.map((h, hIdx) => (
              <span
                key={hIdx}
                className="font-black text-[15px] px-1"
                style={{ color: getElementColor(h.element) }}
              >
                {h.stem}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* 5. PHÓ TINH ROW (46px) */}
      <div
        className="w-full border-b-[1.5px] border-[#3182ce] h-[46px] items-stretch text-center"
        style={{ display: 'grid', gridTemplateColumns: '86px repeat(4, 1fr)' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-black text-[12px] tracking-wider uppercase bg-blue-50/20 text-[#1b3b6f]">
          <span>PHÓ</span>
          <span>TINH</span>
        </div>
        {pList.map((p, idx) => (
          <div
            key={`pho-tinh-${idx}`}
            className={`h-full flex items-center justify-around px-1 py-1 text-[13px] font-bold text-[#112244] ${
              idx < 3 ? 'border-r-[1.5px] border-[#3182ce]' : ''
            }`}
          >
            {p.hiddenStems.map((h, hIdx) => (
              <span key={hIdx} className="px-0.5">{h.tenGod}</span>
            ))}
          </div>
        ))}
      </div>

      {/* 6. THẦN SÁT ROW (59px) — Split from previous 118px row */}
      <div
        className="w-full border-b-[1.5px] border-[#3182ce] h-[59px] items-stretch text-center"
        style={{ display: 'grid', gridTemplateColumns: '86px repeat(4, 1fr)' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-black text-[12px] tracking-wider uppercase bg-blue-50/20 text-[#1b3b6f]">
          <span>THẦN</span>
          <span>SÁT</span>
        </div>
        {pList.map((p, idx) => (
          <div
            key={`than-sat-${idx}`}
            className={`h-full flex flex-wrap justify-center items-center content-center py-1 px-1 gap-x-1.5 gap-y-0.5 text-[12px] font-bold text-[#112244] leading-tight overflow-hidden ${
              idx < 3 ? 'border-r-[1.5px] border-[#3182ce]' : ''
            }`}
          >
            {p.stars && p.stars.length > 0 ? (
              p.stars.map((star, sIdx) => (
                <span key={sIdx} className="whitespace-nowrap">{star}</span>
              ))
            ) : (
              <span className="text-gray-400 font-normal">—</span>
            )}
          </div>
        ))}
      </div>

      {/* 7. TIỂU VẬN ROW (59px) — New dedicated row calculating Minor Luck from Hour Pillar */}
      <div
        className="w-full border-b-[1.5px] border-[#3182ce] h-[59px] items-stretch text-center bg-transparent"
        style={{ display: 'grid', gridTemplateColumns: '86px repeat(4, 1fr)' }}
      >
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center font-black text-[12px] tracking-wider uppercase bg-blue-50/20 text-[#1b3b6f]">
          <span>TIỂU</span>
          <span>VẬN</span>
        </div>

        {/* Cột 1 (Dưới Trụ Năm): Chiều tính */}
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center py-1 px-1 text-[#112244]">
          <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Chiều tính</div>
          <div className="text-[13.5px] font-black text-[#1b3b6f] mt-0.5">
            {activeMinorLuck.direction} ({activeMinorLuck.directionValue > 0 ? '+1' : '-1'})
          </div>
          <div className="text-[10px] text-gray-600 font-medium">
            {genderLabel || (activeMinorLuck.directionValue > 0 ? 'Dương Nam / Âm Nữ' : 'Âm Nam / Dương Nữ')}
          </div>
        </div>

        {/* Cột 2 (Dưới Trụ Tháng): Mốc khởi từ Trụ Giờ */}
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center py-1 px-1 text-[#112244]">
          <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Mốc khởi (0t)</div>
          <div className="text-[14px] font-black mt-0.5">
            <span style={{ color: getStemColor(activeMinorLuck.baseHourPillar.stem) }}>
              {activeMinorLuck.baseHourPillar.stem}
            </span>{' '}
            <span style={{ color: getBranchColor(activeMinorLuck.baseHourPillar.branch) }}>
              {activeMinorLuck.baseHourPillar.branch}
            </span>
          </div>
          <div className="text-[10px] text-gray-600 font-medium">Từ Trụ Giờ</div>
        </div>

        {/* Cột 3 (Dưới Trụ Ngày - Nhật Chủ): Can Chi Tiểu Vận năm xem */}
        <div className="border-r-[1.5px] border-[#3182ce] h-full flex flex-col justify-center items-center py-1 px-1 text-[#112244] bg-amber-50/40">
          <div className="text-[11px] text-amber-800 font-bold uppercase tracking-wider">
            Năm {activeMinorLuck.currentYear} ({activeMinorLuck.currentAge}t)
          </div>
          <div className="text-[15.5px] font-black mt-0.5">
            <span style={{ color: getStemColor(activeMinorLuck.current.stem) }}>
              {activeMinorLuck.current.stem}
            </span>{' '}
            <span style={{ color: getBranchColor(activeMinorLuck.current.branch) }}>
              {activeMinorLuck.current.branch}
            </span>
          </div>
          <div className="text-[10px] text-amber-900 font-semibold">
            Tiểu Vận năm xem
          </div>
        </div>

        {/* Cột 4 (Dưới Trụ Giờ): Thập Thần của Can Tiểu Vận vs Nhật Can */}
        <div className="h-full flex flex-col justify-center items-center py-1 px-1 text-[#112244]">
          <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Thập Thần</div>
          <div className="text-[13.5px] font-black text-[#b45309] mt-0.5">
            {activeMinorLuck.current.tenGodFullName} ({activeMinorLuck.current.tenGod})
          </div>
          <div className="text-[10px] text-gray-600 font-medium">
            vs Nhật Chủ {pillars.day.stem}
          </div>
        </div>
      </div>
    </div>
  );
}
