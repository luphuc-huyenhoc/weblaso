'use client';

import React, { useState } from 'react';
import { BatTrachResult } from '@/domain/fengshui';
import { Compass, CheckCircle2, AlertTriangle, ShieldCheck, Bookmark, Printer } from 'lucide-react';

interface BatTrachVisualizerProps {
  result: BatTrachResult & {
    degreeEvaluation?: {
      degree: number;
      mountain: string;
      direction: string;
      status: 'An Toàn' | 'Đại Không Vong' | 'Tiểu Không Vong';
      warning?: string;
    } | null;
  };
}

export function BatTrachVisualizer({ result }: BatTrachVisualizerProps) {
  const [degreeInput, setDegreeInput] = useState<number>(result.degreeEvaluation?.degree ?? 180);
  const [degreeResult, setDegreeResult] = useState(result.degreeEvaluation);

  const goodDirections = result.directions.filter((d) => d.nature === 'Cát');
  const badDirections = result.directions.filter((d) => d.nature === 'Hung');

  const checkDegree = async (deg: number) => {
    try {
      const res = await fetch('/api/fengshui/battrach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthYear: result.birthYear,
          gender: result.gender,
          degree: deg,
        }),
      });
      const json = await res.json();
      if (res.ok && json.data?.degreeEvaluation) {
        setDegreeResult(json.data.degreeEvaluation);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chartType: 'FENGSHUI',
          title: `Phong thủy Bát Trạch - ${result.quaiMenh} (${result.birthYear})`,
          chartData: result,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Lưu kết quả Bát Trạch thành công!');
      } else {
        alert(data.message || 'Vui lòng đăng nhập để lưu kết quả');
      }
    } catch (e) {
      alert('Lỗi khi lưu kết quả');
    }
  };

  return (
    <div className="space-y-8">
      {/* Control Bar */}
      <div className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg shadow-xs no-print">
        <div className="text-xs text-gray-600 font-semibold">
          Quái Mệnh: <strong className="text-[#c8860a]">{result.quaiMenh}</strong> ({result.quaiElement}) • {result.group}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-semibold text-gray-700 transition"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#c8860a]" />
            <span>Lưu Bát Trạch</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#c8860a] hover:bg-amber-700 rounded text-xs font-semibold text-white transition shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In Kết Quả</span>
          </button>
        </div>
      </div>

      {/* Main Quái Mệnh Hero Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white rounded-lg p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest bg-white/20 px-3 py-1 rounded-full">
              Bát Trạch Minh Cảnh Chuyên Khảo
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase">
              Cung Phi: {result.quaiMenh} — Hành {result.quaiElement}
            </h2>
            <p className="text-sm opacity-90">
              Người sinh năm <strong>{result.birthYear}</strong> ({result.gender ? 'Nam' : 'Nữ'} Mạng) thuộc nhóm <strong className="underline">{result.group}</strong>.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-lg text-center min-w-[180px]">
            <div className="text-xs opacity-80 uppercase tracking-wide">Số Quái Khởi Điểm</div>
            <div className="text-3xl font-black text-amber-200 mt-1">{result.quaiNumber}</div>
            <div className="text-xs font-semibold mt-1">{result.group}</div>
          </div>
        </div>
      </div>

      {/* 4 Good Directions vs 4 Bad Directions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 4 Cát Hướng */}
        <div className="bg-white border border-emerald-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <h3 className="font-extrabold text-emerald-900 text-base flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>4 Cát Hướng (Thuận Khí — May Mắn)</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Nên đặt cửa, bếp, bàn thờ
            </span>
          </div>

          <div className="space-y-3">
            {goodDirections.map((dir) => (
              <div key={dir.direction} className="bg-emerald-50/50 p-3.5 rounded border border-emerald-200/60 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-emerald-950">
                    Hướng {dir.direction} ({dir.degreesRange})
                  </span>
                  <span className="font-bold px-2 py-0.5 bg-emerald-600 text-white rounded text-[11px]">
                    Sao {dir.star} (+{dir.score})
                  </span>
                </div>
                <p className="text-emerald-900/80 leading-relaxed pt-1">
                  {dir.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Hung Hướng */}
        <div className="bg-white border border-red-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-red-100 pb-3">
            <h3 className="font-extrabold text-red-900 text-base flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>4 Hung Hướng (Nghịch Khí — Cần Tránh)</span>
            </h3>
            <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full">
              Kỵ mở cửa chính, giường ngủ
            </span>
          </div>

          <div className="space-y-3">
            {badDirections.map((dir) => (
              <div key={dir.direction} className="bg-red-50/50 p-3.5 rounded border border-red-200/60 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-red-950">
                    Hướng {dir.direction} ({dir.degreesRange})
                  </span>
                  <span className="font-bold px-2 py-0.5 bg-red-600 text-white rounded text-[11px]">
                    Sao {dir.star} ({dir.score})
                  </span>
                </div>
                <p className="text-red-900/80 leading-relaxed pt-1">
                  {dir.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 24 Sơn Hướng & Compass Degree Precision Checker */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-4 gap-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 uppercase flex items-center space-x-2">
              <Compass className="w-5 h-5 text-[#c8860a]" />
              <span>Thước Đo Phân Kim 24 Sơn Hướng & Không Vong</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Nhập số độ la bàn thực tế của hướng nhà để xác định chính xác sơn hướng và kiểm tra phạm tuyến Không Vong.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs font-bold text-gray-700 whitespace-nowrap">Độ la bàn:</label>
            <input
              type="number"
              min={0}
              max={360}
              step={0.5}
              value={degreeInput}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                setDegreeInput(val);
                checkDegree(val);
              }}
              className="w-24 px-2 py-1.5 border border-gray-300 rounded font-bold text-center text-sm focus:border-[#c8860a]"
            />
            <span className="text-xs font-bold text-gray-600">độ</span>
          </div>
        </div>

        {/* Degree evaluation box */}
        {degreeResult && (
          <div
            className={`p-4 rounded-lg border text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
              degreeResult.status === 'An Toàn'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-red-50 border-red-200 text-red-950'
            }`}
          >
            <div>
              <div className="text-sm font-bold">
                Tọa độ {degreeResult.degree}°: Sơn <strong className="uppercase">{degreeResult.mountain}</strong> (Hướng {degreeResult.direction})
              </div>
              <p className="text-xs mt-0.5 opacity-90">
                {degreeResult.warning || 'Vị trí phân kim an toàn, không phạm phân tuyến Không Vong.'}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded font-extrabold uppercase text-[11px] whitespace-nowrap ${
                degreeResult.status === 'An Toàn' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {degreeResult.status}
            </span>
          </div>
        )}

        {/* Complete 24 Mountains Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-gray-200">
            <thead>
              <tr className="bg-amber-50 text-amber-950 font-bold border-b border-amber-200">
                <th className="p-2.5 border">Sơn Hướng</th>
                <th className="p-2.5 border">Phương Vị</th>
                <th className="p-2.5 border text-center">Góc Độ (Độ La Bàn)</th>
                <th className="p-2.5 border text-center">Bát Trạch Bản Mệnh</th>
                <th className="p-2.5 border text-center">Tính Chất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {result.mountain24.map((m) => (
                <tr key={m.mountain} className="hover:bg-gray-50">
                  <td className="p-2.5 border font-extrabold text-gray-900">Sơn {m.mountain}</td>
                  <td className="p-2.5 border font-medium text-gray-600">{m.direction}</td>
                  <td className="p-2.5 border text-center font-mono">{m.startDegree}° — {m.endDegree}°</td>
                  <td className="p-2.5 border text-center font-bold">
                    Sao {m.quaiMenhStar}
                  </td>
                  <td className="p-2.5 border text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.nature === 'Cát' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {m.nature}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
