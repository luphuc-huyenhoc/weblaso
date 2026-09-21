'use client';

import React, { useRef } from 'react';
import { IchingEnvelope, HexagramLineDetail } from '@/domain/iching';
import { Printer, Download, Bookmark, Sparkles, Compass } from 'lucide-react';

interface HexagramVisualizerProps {
  envelope: IchingEnvelope;
}

export function HexagramVisualizer({ envelope }: HexagramVisualizerProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { calculation } = envelope;
  const original = calculation.originalHexagram;
  const changed = calculation.changedHexagram;

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chartType: 'ICHING_LUCHAO',
          title: calculation.title,
          chartData: envelope,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Lưu quẻ dịch thành công vào tài khoản của bạn!');
      } else {
        alert(data.message || 'Vui lòng đăng nhập để lưu quẻ');
      }
    } catch (e) {
      alert('Lỗi khi lưu quẻ');
    }
  };

  // Render an individual I Ching line
  const renderLineBar = (polarity: 'Âm' | 'Dương', isMoving: boolean) => {
    if (polarity === 'Dương') {
      return (
        <div className="flex items-center space-x-1.5 w-36 md:w-48 justify-center">
          <div
            className={`h-4.5 w-full rounded-sm ${
              isMoving ? 'bg-amber-600 shadow-xs' : 'bg-red-700'
            }`}
          />
          {isMoving && <span className="text-amber-600 font-extrabold text-xs">○</span>}
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2 w-36 md:w-48 justify-center">
          <div
            className={`h-4.5 w-[46%] rounded-sm ${
              isMoving ? 'bg-amber-600 shadow-xs' : 'bg-gray-800'
            }`}
          />
          <div className="w-[8%]" />
          <div
            className={`h-4.5 w-[46%] rounded-sm ${
              isMoving ? 'bg-amber-600 shadow-xs' : 'bg-gray-800'
            }`}
          />
          {isMoving && <span className="text-amber-600 font-extrabold text-xs">✕</span>}
        </div>
      );
    }
  };

  // Lines are stored 0=Hào Sơ to 5=Hào Thượng. We render from top to bottom (5 down to 0).
  const linesDescending = [...original.lines].reverse();
  const changedLinesDescending = changed ? [...changed.lines].reverse() : null;

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg shadow-xs no-print">
        <div className="text-xs text-gray-600 font-semibold">
          Mã Quẻ: <span className="font-mono text-gray-800">{envelope.castId}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-semibold text-gray-700 transition"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#c8860a]" />
            <span>Lưu Quẻ</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#c8860a] hover:bg-amber-700 rounded text-xs font-semibold text-white transition shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In Quẻ</span>
          </button>
        </div>
      </div>

      <div ref={chartRef} className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs space-y-8">
        {/* Header Header Info */}
        <div className="text-center border-b pb-6">
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-amber-50 text-[#c8860a] border border-amber-200 rounded-full">
            Dịch Học Hoa Lục Hào Dự Trắc
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 uppercase mt-3">
            {calculation.title}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Thời khắc gieo: {calculation.castTime} (Dương lịch: {calculation.solarDateStr} • {calculation.lunarDateStr})
          </p>
        </div>

        {/* Astronomical & Day Parameters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-amber-50/40 p-4 rounded-lg border border-amber-200/60">
          <div>
            <span className="text-gray-500 block">Năm / Tháng / Ngày / Giờ:</span>
            <span className="font-bold text-gray-900">
              {calculation.canChi.year} • {calculation.canChi.month} • {calculation.canChi.day} • {calculation.canChi.hour}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Nhật Thần & Nguyệt Lệnh:</span>
            <span className="font-bold text-gray-900">
              {calculation.nhatThan} / {calculation.nguyetLenh}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Tuần Không:</span>
            <span className="font-bold text-red-700">{calculation.tuanKhong.join(', ')}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Thần Sát Nhật Chủ:</span>
            <span className="font-bold text-gray-900">
              Lộc {calculation.spiritDeities.loc} • Mã {calculation.spiritDeities.ma} • Quý {calculation.spiritDeities.quyNhan.join(', ')}
            </span>
          </div>
        </div>

        {/* Dual Hexagrams Layout (Quẻ Chủ vs Quẻ Biến) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Quẻ Chủ */}
          <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-xs space-y-4">
            <div className="text-center border-b pb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase">Quẻ Gốc (Chủ)</span>
              <h3 className="text-lg font-extrabold text-[#c8860a] uppercase mt-1">
                {original.name}
              </h3>
              <p className="text-xs text-gray-600">
                {original.palace} ({original.palaceElement}) • {original.nature}
              </p>
            </div>

            {/* 6 Lines Table */}
            <div className="space-y-3 pt-2">
              {linesDescending.map((line, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded text-xs border ${
                    line.isMoving
                      ? 'bg-amber-50/80 border-amber-300 font-semibold'
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  {/* Lục Thú */}
                  <div className="w-18 text-gray-600 text-[11px] font-medium">
                    {line.lucThu}
                  </div>

                  {/* Phục Thần (if any) */}
                  <div className="w-20 text-blue-600 text-[11px] truncate">
                    {line.phucThan ? `Phục: ${line.phucThan}` : ''}
                  </div>

                  {/* Line Graphic */}
                  <div className="flex flex-col items-center">
                    {renderLineBar(line.polarity, line.isMoving)}
                  </div>

                  {/* Lục Thân & Can Chi */}
                  <div className="w-24 text-right">
                    <span className="font-bold text-gray-900">{line.lucThan}</span>
                    <span className="text-[11px] text-gray-500 block">{line.canChi}</span>
                  </div>

                  {/* Thế / Ứng */}
                  <div className="w-12 text-right font-extrabold">
                    {line.isThe && <span className="text-red-600">[Thế]</span>}
                    {line.isUng && <span className="text-blue-600">[Ứng]</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t text-xs text-gray-600">
              <strong>Thoán Từ:</strong> {original.judgment}
            </div>
          </div>

          {/* Quẻ Biến (If applicable) */}
          {changed && changedLinesDescending ? (
            <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-xs space-y-4">
              <div className="text-center border-b pb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase">Quẻ Biến (Hậu Vận)</span>
                <h3 className="text-lg font-extrabold text-blue-700 uppercase mt-1">
                  {changed.name}
                </h3>
                <p className="text-xs text-gray-600">
                  {changed.palace} ({changed.palaceElement}) • {changed.nature}
                </p>
              </div>

              {/* 6 Lines Table */}
              <div className="space-y-3 pt-2">
                {changedLinesDescending.map((line, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded text-xs border border-transparent hover:bg-gray-50"
                  >
                    {/* Line Graphic */}
                    <div className="flex flex-col items-center">
                      {renderLineBar(line.polarity, false)}
                    </div>

                    {/* Lục Thân & Can Chi */}
                    <div className="w-28 text-right">
                      <span className="font-bold text-gray-900">{line.lucThan}</span>
                      <span className="text-[11px] text-gray-500 block">{line.canChi}</span>
                    </div>

                    {/* Thế / Ứng */}
                    <div className="w-12 text-right font-extrabold">
                      {line.isThe && <span className="text-red-600">[Thế]</span>}
                      {line.isUng && <span className="text-blue-600">[Ứng]</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t text-xs text-gray-600">
                <strong>Thoán Từ Biến:</strong> {changed.judgment}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
              <Compass className="w-10 h-10 text-gray-400" />
              <div className="font-bold text-gray-700">Quẻ Thuần Tĩnh (Không Có Hào Động)</div>
              <p className="text-xs max-w-xs">
                Toàn bộ 6 hào đều an tĩnh, diễn tiến sự việc giữ nguyên trạng thái theo Thoán Từ của Quẻ Chủ, không sinh Quẻ Biến.
              </p>
            </div>
          )}
        </div>

        {/* Luận giải sự vụ chi tiết */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-3">
          <h4 className="font-bold text-gray-900 text-sm uppercase flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#c8860a]" />
            <span>Phân Tích & Định Hướng Hành Động Lục Hào</span>
          </h4>
          <p className="text-xs text-gray-700 leading-relaxed">
            Hào <strong>Thế</strong> đại diện cho đương số (chủ thể mưu sự), hào <strong>Ứng</strong> đại diện cho đối tác, sự việc hoặc ngoại cảnh.
            {original.lines.some(l => l.isThe && l.canChi.includes(calculation.canChi.day.split(' ')[1]))
              ? ' Hào Thế lâm Nhật Thần, đắc địa vượng khí, bản thân nắm thế chủ động.'
              : ' Quan sát tương quan Ngũ Hành giữa Thế và Dụng Thần sự việc để quyết định tiến thoái nhịp nhàng.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="bg-white p-3 rounded border border-gray-200">
              <strong className="text-gray-900 block mb-1">Công Danh — Sự Nghiệp</strong>
              <p className="text-gray-500">Xem hào Quan Quỷ và Phụ Mẫu làm Dụng Thần. Nếu vượng tướng không gặp Không Vong là điềm hanh thông thăng chức.</p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <strong className="text-gray-900 block mb-1">Tài Lộc — Kinh Doanh</strong>
              <p className="text-gray-500">Xem hào Thê Tài và Tử Tôn (nguồn sinh tài). Hào Tài phát động sinh Thế thì tiền bạc tự tìm đến.</p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <strong className="text-gray-900 block mb-1">Hôn Nhân — Gia Đạo</strong>
              <p className="text-gray-500">Nam coi Tài, Nữ coi Quan. Thế Ứng tương sinh tương hợp thì hòa thuận trăm năm.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
