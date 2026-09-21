'use client';

import React, { useRef, useState } from 'react';
import { BaziEnvelope } from '@/domain/bazi';
import { Download, Printer, Bookmark, Check, AlertCircle } from 'lucide-react';
import { toPng } from 'html-to-image';

export function BaziChartResult({ envelope }: { envelope: BaziEnvelope }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const { calculation: calc, interpretation: interp } = envelope;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPng = async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, { cacheBust: true, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `LaSoBatTu_${calc.personal.fullName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image:', err);
      alert('Không thể tạo ảnh lá số. Bạn có thể dùng tính năng In lá số.');
    }
  };

  const handleSaveChart = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/charts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chartType: 'BAZI',
          title: `Lá số Bát Tự - ${calc.personal.fullName}`,
          personName: calc.personal.fullName,
          gender: envelope.input.gender,
          solarDate: new Date(`${envelope.input.year}-${envelope.input.month}-${envelope.input.day}T${envelope.input.hour}:${envelope.input.minute}:00+07:00`),
          lunarDateStr: calc.personal.lunarDateStr,
          engineVersion: envelope.engineVersion,
          methodologyVersion: envelope.methodology,
          calendarVersion: envelope.calendarVersion,
          timezonePolicy: envelope.timezonePolicy,
          inputHash: envelope.inputHash,
          calculatedAt: envelope.calculatedAt,
          inputData: envelope.input,
          calculationData: calc,
          interpretationData: interp,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Không thể lưu lá số');
      }

      setSaveStatus('saved');
      setSaveMessage('Lá số đã được lưu vào tài khoản thành công!');
    } catch (err: any) {
      setSaveStatus('error');
      setSaveMessage(err.message || 'Vui lòng đăng nhập để lưu lá số.');
    }
  };

  // Ngũ Hành color helper
  const getElemClass = (elem: string) => {
    switch (elem) {
      case 'Kim': return 'text-nguhanh-kim font-bold';
      case 'Mộc': return 'text-nguhanh-moc font-bold';
      case 'Thủy': return 'text-nguhanh-thuy font-bold';
      case 'Hỏa': return 'text-nguhanh-hoa font-bold';
      case 'Thổ': return 'text-nguhanh-tho font-bold';
      default: return 'text-gray-800 font-bold';
    }
  };

  const pYear = calc.pillars.year;
  const pMonth = calc.pillars.month;
  const pDay = calc.pillars.day;
  const pHour = calc.pillars.hour;

  return (
    <div className="w-full mt-8 bg-white rounded-lg shadow-md border border-gray-200 p-4 md:p-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap justify-between items-center pb-4 border-b border-gray-200 gap-3 no-print">
        <div className="text-sm text-gray-500">
          Phương pháp: <span className="font-semibold text-gray-800">{envelope.methodology}</span> (v{envelope.engineVersion})
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadPng}
            className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải lá số</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In lá số</span>
          </button>
          <button
            onClick={handleSaveChart}
            disabled={saveStatus === 'saving' || saveStatus === 'saved'}
            className="flex items-center space-x-1 bg-[#c8860a] hover:bg-amber-700 text-white px-3.5 py-1.5 rounded text-xs font-bold transition disabled:opacity-50"
          >
            {saveStatus === 'saved' ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{saveStatus === 'saved' ? 'Đã lưu' : saveStatus === 'saving' ? 'Đang lưu...' : 'Lưu lá số'}</span>
          </button>
        </div>
      </div>

      {saveStatus === 'error' && (
        <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center space-x-2 no-print">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {saveStatus === 'saved' && (
        <div className="mt-3 p-2.5 bg-green-50 border border-green-200 text-green-700 text-xs rounded flex items-center space-x-2 no-print">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Printable / Renderable Chart Area */}
      <div ref={chartRef} className="print-container mt-4 p-2 bg-white text-gray-900">
        {/* Header Information matching reference */}
        <div className="border border-gray-300 bg-gray-50 p-4 rounded-t flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#27303f] rounded border-2 border-[#c8860a] flex items-center justify-center text-[#c8860a] font-bold text-lg">
              NH
            </div>
            <div>
              <div className="text-xl font-bold text-[#27303f]">Nguhanh.net</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
                Lá Số Bát Tự — Cải Vận Bổ Khuyết
              </div>
            </div>
          </div>

          <div className="text-xs text-right space-y-1">
            <div>
              <span className="font-semibold text-gray-600">Họ và tên:</span>{' '}
              <strong className="text-sm text-gray-900">{calc.personal.fullName}</strong>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Giới tính:</span>{' '}
              <span className="font-bold text-blue-700">{calc.personal.genderLabel}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Dương lịch:</span> {calc.personal.solarDateStr}
            </div>
            <div>
              <span className="font-semibold text-gray-600">Âm lịch:</span> {calc.personal.lunarDateStr}
            </div>
            <div>
              <span className="font-semibold text-gray-600">Nạp âm niên mệnh:</span>{' '}
              <strong className="text-[#856404]">{calc.personal.napAm}</strong>
            </div>
          </div>
        </div>

        {/* Tứ Trụ Grid Table */}
        <div className="overflow-x-auto">
          <table className="table-lasotutru mt-2 border border-gray-300">
            <thead>
              <tr className="th-dark">
                <th className="py-2.5 px-2 bg-[#2b3036] text-white w-28">Nội dung</th>
                <th className="py-2.5 px-2 bg-[#2b3036] text-white">Năm Sinh (Niên Trụ)</th>
                <th className="py-2.5 px-2 bg-[#2b3036] text-white">Tháng Sinh (Nguyệt Trụ)</th>
                <th className="py-2.5 px-2 bg-[#2b3036] text-white bg-amber-900/80">Ngày Sinh (Nhật Trụ)</th>
                <th className="py-2.5 px-2 bg-[#2b3036] text-white">Giờ Sinh (Thời Trụ)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold bg-gray-100">DƯƠNG LỊCH</td>
                <td className="font-semibold">{pYear.solarValue}</td>
                <td className="font-semibold">{pMonth.solarValue}</td>
                <td className="font-semibold bg-amber-50">{pDay.solarValue}</td>
                <td className="font-semibold">{pHour.solarValue}</td>
              </tr>
              <tr>
                <td className="font-bold bg-gray-100">CHỦ TINH</td>
                <td className="font-bold text-indigo-700">{pYear.stemTenGod}</td>
                <td className="font-bold text-indigo-700">{pMonth.stemTenGod}</td>
                <td className="font-extrabold text-red-600 bg-amber-50">NHẬT CHỦ</td>
                <td className="font-bold text-indigo-700">{pHour.stemTenGod}</td>
              </tr>
              <tr className="text-lg bg-gray-50/50">
                <td className="font-bold bg-gray-100 text-sm">BÁT TỰ</td>
                <td className="py-3">
                  <span className={getElemClass(pYear.stemElement)}>{pYear.stem}</span>{' '}
                  <span className={getElemClass(pYear.branchElement)}>{pYear.branch}</span>
                </td>
                <td className="py-3">
                  <span className={getElemClass(pMonth.stemElement)}>{pMonth.stem}</span>{' '}
                  <span className={getElemClass(pMonth.branchElement)}>{pMonth.branch}</span>
                </td>
                <td className="py-3 bg-amber-100/60 font-black">
                  <span className={getElemClass(pDay.stemElement)}>{pDay.stem}</span>{' '}
                  <span className={getElemClass(pDay.branchElement)}>{pDay.branch}</span>
                </td>
                <td className="py-3">
                  <span className={getElemClass(pHour.stemElement)}>{pHour.stem}</span>{' '}
                  <span className={getElemClass(pHour.branchElement)}>{pHour.branch}</span>
                </td>
              </tr>
              <tr>
                <td className="font-bold bg-gray-100">TÀNG ẨN</td>
                <td>
                  {pYear.hiddenStems.map((h, i) => (
                    <span key={i} className={`inline-block mx-1 ${getElemClass(h.element)}`}>
                      {h.stem}
                    </span>
                  ))}
                </td>
                <td>
                  {pMonth.hiddenStems.map((h, i) => (
                    <span key={i} className={`inline-block mx-1 ${getElemClass(h.element)}`}>
                      {h.stem}
                    </span>
                  ))}
                </td>
                <td className="bg-amber-50">
                  {pDay.hiddenStems.map((h, i) => (
                    <span key={i} className={`inline-block mx-1 ${getElemClass(h.element)}`}>
                      {h.stem}
                    </span>
                  ))}
                </td>
                <td>
                  {pHour.hiddenStems.map((h, i) => (
                    <span key={i} className={`inline-block mx-1 ${getElemClass(h.element)}`}>
                      {h.stem}
                    </span>
                  ))}
                </td>
              </tr>
              <tr>
                <td className="font-bold bg-gray-100">PHÓ TINH</td>
                <td className="text-xs text-gray-600">
                  {pYear.hiddenStems.map((h, i) => (
                    <span key={i} className="inline-block mx-1">{h.tenGod}</span>
                  ))}
                </td>
                <td className="text-xs text-gray-600">
                  {pMonth.hiddenStems.map((h, i) => (
                    <span key={i} className="inline-block mx-1">{h.tenGod}</span>
                  ))}
                </td>
                <td className="text-xs text-gray-600 bg-amber-50">
                  {pDay.hiddenStems.map((h, i) => (
                    <span key={i} className="inline-block mx-1">{h.tenGod}</span>
                  ))}
                </td>
                <td className="text-xs text-gray-600">
                  {pHour.hiddenStems.map((h, i) => (
                    <span key={i} className="inline-block mx-1">{h.tenGod}</span>
                  ))}
                </td>
              </tr>
              <tr>
                <td className="font-bold bg-gray-100">THẦN SÁT</td>
                <td className="p-1">
                  <div className="flex flex-wrap justify-center gap-1">
                    {pYear.stars.map((s, i) => (
                      <span key={i} className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-[10px] font-medium text-gray-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-1">
                  <div className="flex flex-wrap justify-center gap-1">
                    {pMonth.stars.map((s, i) => (
                      <span key={i} className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-[10px] font-medium text-gray-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-1 bg-amber-50">
                  <div className="flex flex-wrap justify-center gap-1">
                    {pDay.stars.map((s, i) => (
                      <span key={i} className="bg-amber-100 border border-amber-300 rounded px-1.5 py-0.5 text-[10px] font-medium text-amber-900">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-1">
                  <div className="flex flex-wrap justify-center gap-1">
                    {pHour.stars.map((s, i) => (
                      <span key={i} className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-[10px] font-medium text-gray-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Đại Vận & Lưu Niên Timeline Section */}
        <div className="mt-6 border border-gray-300 rounded p-4 bg-gray-50/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-2 border-b border-gray-200 gap-2">
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
              Đại Vận & Lưu Niên Timeline (100 Năm)
            </h4>
            <div className="text-xs text-gray-600">
              Số tính đại vận = <strong className="text-gray-900">{calc.majorLuck.calcValue.toFixed(4)}</strong> ; Nhập đại vận lúc{' '}
              <strong className="text-[#c8860a]">{calc.majorLuck.startAgeYears} tuổi {calc.majorLuck.startAgeMonths} tháng</strong> ({calc.majorLuck.direction})
            </div>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="table-lasotutru border border-gray-300 bg-white">
              <thead>
                <tr className="bg-gray-100 text-xs">
                  <th className="w-20 p-2 font-bold bg-gray-200">ĐẠI VẬN</th>
                  {calc.majorLuck.pillars.map((p, idx) => {
                    const isFocusPillar = p.annualYears.some(a => a.isFocusYear);
                    return (
                      <th
                        key={idx}
                        className={`p-2 min-w-[95px] ${isFocusPillar ? 'bg-amber-100 border-2 border-[#c8860a]' : ''}`}
                      >
                        <div className="text-[11px] text-gray-500">{p.startYearMonth}</div>
                        <div className="text-red-600 font-bold">{p.startAge} - {p.endAge}t</div>
                        <div className="text-sm mt-0.5">
                          <span className={getElemClass(p.stem)}>{p.stem}</span>{' '}
                          <span className={getElemClass(p.branch)}>{p.branch}</span>
                        </div>
                        <div className="text-[11px] text-indigo-700 font-medium">{p.tenGod}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {/* 10 Rows of Lưu Niên years */}
                {Array.from({ length: 10 }).map((_, rowIdx) => (
                  <tr key={rowIdx} className="text-xs hover:bg-gray-50">
                    <td className="font-semibold bg-gray-50 text-[11px] text-gray-500">
                      Năm thứ {rowIdx + 1}
                    </td>
                    {calc.majorLuck.pillars.map((p, pIdx) => {
                      const yr = p.annualYears[rowIdx];
                      if (!yr) return <td key={pIdx}>-</td>;
                      return (
                        <td
                          key={pIdx}
                          className={`p-1.5 ${yr.isFocusYear ? 'focus-year-cell font-bold' : ''}`}
                        >
                          <div className="font-semibold text-gray-900">{yr.year} ({yr.age}t)</div>
                          <div className="text-[11px]">
                            <span className={getElemClass(yr.stem)}>{yr.stem}</span>{' '}
                            <span className={getElemClass(yr.branch)}>{yr.branch}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ngũ Hành Scoring & Recommendation Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 border border-gray-300 rounded">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-2">
              Điểm Phân Bổ Ngũ Hành & Thân Mệnh
            </h4>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-gray-100 border border-gray-200">
                <div className="font-bold text-nguhanh-kim">Kim</div>
                <div className="text-sm font-semibold">{interp.elementsScore.Kim}</div>
              </div>
              <div className="p-2 rounded bg-green-50 border border-green-200">
                <div className="font-bold text-nguhanh-moc">Mộc</div>
                <div className="text-sm font-semibold">{interp.elementsScore.Mộc}</div>
              </div>
              <div className="p-2 rounded bg-blue-50 border border-blue-200">
                <div className="font-bold text-nguhanh-thuy">Thủy</div>
                <div className="text-sm font-semibold">{interp.elementsScore.Thủy}</div>
              </div>
              <div className="p-2 rounded bg-red-50 border border-red-200">
                <div className="font-bold text-nguhanh-hoa">Hỏa</div>
                <div className="text-sm font-semibold">{interp.elementsScore.Hỏa}</div>
              </div>
              <div className="p-2 rounded bg-amber-50 border border-amber-200">
                <div className="font-bold text-nguhanh-tho">Thổ</div>
                <div className="text-sm font-semibold">{interp.elementsScore.Thổ}</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-700 space-y-1">
              <div>
                Đánh giá thân mệnh: <strong className="text-blue-800">{calc.dayMaster.strength}</strong> ({calc.dayMaster.percentage}% lực bản mệnh).
              </div>
              <div>
                Dụng Thần: <strong className="text-green-700">{interp.dungThan}</strong> | Hỷ Thần:{' '}
                <strong className="text-blue-700">{interp.hyThan}</strong> | Kỵ Thần:{' '}
                <strong className="text-red-700">{interp.kyThan}</strong>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-300 rounded">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-2">
              Phong Thủy Cải Vận Bổ Khuyết
            </h4>
            <p className="text-xs text-gray-600 mb-3">{interp.recommendations.summary}</p>
            <div className="text-xs space-y-1.5">
              <div>
                <span className="font-semibold text-gray-700">Màu sắc tương sinh:</span>{' '}
                {interp.recommendations.favorableColors.join(', ')}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Hướng thuận lợi:</span>{' '}
                {interp.recommendations.favorableDirections.join(', ')}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Vật phẩm bổ trợ:</span>{' '}
                <span className="text-[#c8860a] font-semibold">
                  {interp.recommendations.favorableGemstones.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Cultural Notice */}
        <div className="mt-4 pt-3 border-t border-gray-200 text-center text-gray-500 text-[11px]">
          Lá số lập tại: <strong className="text-[#27303f]">https://nguhanh.net/</strong>. Cố vấn học thuật: Thầy Đoàn Gia (091.688.9131).
        </div>
      </div>
    </div>
  );
}
