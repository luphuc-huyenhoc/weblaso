'use client';

import React, { useState } from 'react';
import { BAT_TRACH_MAP, STAR_DETAILS, QuaiMenh, Direction8 } from '@/domain/fengshui';
import { Home, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

const CUNG_LIST: Array<{
  cung: QuaiMenh;
  element: string;
  group: string;
  represent: string;
  nature: string;
}> = [
  { cung: 'Càn', element: 'Kim', group: 'Tây Tứ Mệnh', represent: 'Người cha, chủ gia đình', nature: 'Trời, cương nghị, quyền quý' },
  { cung: 'Khôn', element: 'Thổ', group: 'Tây Tứ Mệnh', represent: 'Người mẹ, phụ nữ lớn tuổi', nature: 'Đất, nhu thuận, dung nạp' },
  { cung: 'Cấn', element: 'Thổ', group: 'Tây Tứ Mệnh', represent: 'Con trai út', nature: 'Núi, tĩnh lặng, kiên định' },
  { cung: 'Đoài', element: 'Kim', group: 'Tây Tứ Mệnh', represent: 'Con gái út', nature: 'Đầm hồ, vui vẻ, hoạt bát' },
  { cung: 'Khảm', element: 'Thủy', group: 'Đông Tứ Mệnh', represent: 'Con trai thứ', nature: 'Nước, hiểm trở, trí tuệ' },
  { cung: 'Ly', element: 'Hỏa', group: 'Đông Tứ Mệnh', represent: 'Con gái thứ', nature: 'Lửa, sáng suốt, văn minh' },
  { cung: 'Chấn', element: 'Mộc', group: 'Đông Tứ Mệnh', represent: 'Con trai trưởng', nature: 'Sấm sét, khởi phát, quyết đoán' },
  { cung: 'Tốn', element: 'Mộc', group: 'Đông Tứ Mệnh', represent: 'Con gái trưởng', nature: 'Gió, mềm dẻo, thuận hòa' },
];

const DIRECTIONS: Direction8[] = [
  'Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'
];

export default function BatTrachCho8CungPage() {
  const [selectedCung, setSelectedCung] = useState<QuaiMenh>('Càn');
  const activeMeta = CUNG_LIST.find((c) => c.cung === selectedCung)!;
  const dirMap = BAT_TRACH_MAP[selectedCung];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs text-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
          Bát Trạch Minh Cảnh Cho 8 Cung Quái Mệnh
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Tra cứu toàn diện 8 quái mệnh: Càn, Khảm, Cấn, Chấn, Tốn, Ly, Khôn, Đoài. Phương pháp an vị cổng, cửa chính, bàn thờ và phòng ngủ chuẩn phong thủy.
        </p>
      </div>

      {/* 8 Cung Tabs */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {CUNG_LIST.map((c) => (
          <button
            key={c.cung}
            onClick={() => setSelectedCung(c.cung)}
            className={`p-3 rounded-lg border text-center transition flex flex-col items-center justify-center space-y-1 ${
              selectedCung === c.cung
                ? 'bg-[#c8860a] border-[#c8860a] text-white shadow-xs font-bold'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-amber-50/40 font-medium'
            }`}
          >
            <span className="text-base font-extrabold">{c.cung}</span>
            <span className="text-[10px] opacity-80 font-normal">Hành {c.element}</span>
          </button>
        ))}
      </div>

      {/* Selected Cung Detail Panel */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs space-y-6">
        {/* Banner */}
        <div className="border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase">Cung Quái Mệnh</span>
            <h2 className="text-2xl font-extrabold text-[#c8860a] uppercase mt-1">
              Cung {activeMeta.cung} (Hành {activeMeta.element}) — {activeMeta.group}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Tượng trưng: <strong>{activeMeta.represent}</strong> • Đặc tính: <strong>{activeMeta.nature}</strong>
            </p>
          </div>
        </div>

        {/* 8 Directions Table for this Cung */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-sm uppercase">
            Phân Định Cát Hung 8 Hướng Cho Cung {activeMeta.cung}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DIRECTIONS.map((dir) => {
              const star = dirMap[dir];
              const meta = STAR_DETAILS[star];
              const isGood = meta.nature === 'Cát';

              return (
                <div
                  key={dir}
                  className={`p-4 rounded-lg border text-xs flex flex-col justify-between space-y-2 ${
                    isGood
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : 'bg-red-50/60 border-red-200 text-red-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm">
                      Hướng {dir}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isGood ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}
                    >
                      {star} ({meta.nature})
                    </span>
                  </div>
                  <p className="opacity-90 leading-relaxed">
                    {meta.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Construction Recommendations */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4 text-xs">
          <h4 className="font-bold text-gray-900 text-sm uppercase flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#c8860a]" />
            <span>Quy Tắc Bố Trí Nhà Ở Cho Người Cung {activeMeta.cung}</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
            <div className="bg-white p-3.5 rounded border border-gray-200 space-y-1">
              <strong className="text-emerald-800 block">Cửa Chính & Phòng Khách</strong>
              <p>Ưu tiên đặt tại các hướng Sinh Khí, Diên Niên để đón vượng khí tài lộc và gia đạo êm ấm.</p>
            </div>
            <div className="bg-white p-3.5 rounded border border-gray-200 space-y-1">
              <strong className="text-amber-800 block">Bếp Nấu (Tọa Hung Hướng Cát)</strong>
              <p>Tọa tại các phương vị Tuyệt Mệnh, Lục Sát, Ngũ Quỷ và hướng miệng bếp nhìn về hướng Sinh Khí hoặc Phục Vị.</p>
            </div>
            <div className="bg-white p-3.5 rounded border border-gray-200 space-y-1">
              <strong className="text-blue-800 block">Phòng Thờ & Giường Ngủ</strong>
              <p>Bàn thờ hướng Thiên Y hoặc Sinh Khí; giường ngủ kê đầu về hướng Diên Niên, Phục Vị giúp an giấc và bảo toàn sức khỏe.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
