'use client';

import React, { useState } from 'react';
import { MOUNTAINS_24, evaluateMountainDegree } from '@/domain/fengshui';
import { Compass, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function BatTrach24SonHuongPage() {
  const [degree, setDegree] = useState<number>(0);
  const [evaluation, setEvaluation] = useState(() => evaluateMountainDegree(0));

  const handleDegreeChange = (val: number) => {
    setDegree(val);
    setEvaluation(evaluateMountainDegree(val));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs text-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
          Bảng Phân Kim 24 Sơn Hướng & Tuyến Không Vong
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Chi tiết 24 sơn hướng trên la bàn phong thủy (mỗi sơn 15 độ). Phân tích ranh giới phân kim, Đại Không Vong và Tiểu Không Vong trong việc định hướng nhà đất.
        </p>
      </div>

      {/* Interactive Compass Degree Inspector */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-4 gap-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 uppercase flex items-center space-x-2">
              <Compass className="w-5 h-5 text-[#c8860a]" />
              <span>Tra Cứu Tọa Độ La Bàn Trực Tiếp</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Kéo thanh trượt hoặc nhập trực tiếp số độ từ 0° đến 360° để kiểm tra.
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <input
              type="range"
              min={0}
              max={360}
              step={0.5}
              value={degree}
              onChange={(e) => handleDegreeChange(parseFloat(e.target.value))}
              className="w-full md:w-48 accent-[#c8860a]"
            />
            <input
              type="number"
              min={0}
              max={360}
              step={0.5}
              value={degree}
              onChange={(e) => handleDegreeChange(parseFloat(e.target.value) || 0)}
              className="w-20 px-2 py-1.5 border border-gray-300 rounded font-bold text-center text-sm focus:border-[#c8860a]"
            />
            <span className="text-xs font-bold text-gray-600">độ</span>
          </div>
        </div>

        {/* Live Evaluation Box */}
        <div
          className={`p-5 rounded-lg border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
            evaluation.status === 'An Toàn'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-red-50 border-red-200 text-red-950'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {evaluation.status === 'An Toàn' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-extrabold text-base">
                Tọa Độ {evaluation.degree}°: Sơn {evaluation.mountain} (Hướng {evaluation.direction})
              </span>
            </div>
            <p className="text-xs opacity-90 pl-7">
              {evaluation.warning || 'Tọa độ phân kim nằm ở vùng an toàn, chính khí vượng khí, thuận lợi khởi công.'}
            </p>
          </div>

          <span
            className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase whitespace-nowrap ${
              evaluation.status === 'An Toàn'
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {evaluation.status}
          </span>
        </div>

        {/* Theoretical Notes on Khong Vong */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-red-50/70 border border-red-200 text-red-950 space-y-1">
            <strong className="text-sm font-bold flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Đại Không Vong (Cực Kỳ Hung Hiểm)</span>
            </strong>
            <p className="leading-relaxed">
              Là ranh giới giáp lai giữa hai quẻ lớn (ví dụ: giữa Càn và Khảm, giữa Cấn và Chấn). Nhà phạm Đại Không Vong khí trường hỗn loạn, tài vận suy vi, nhân khẩu bất an.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-950 space-y-1">
            <strong className="text-sm font-bold flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Tiểu Không Vong (Bất Lợi Nhẹ Hơn)</span>
            </strong>
            <p className="leading-relaxed">
              Là ranh giới giữa hai sơn trong cùng một quẻ (ví dụ: giữa Tuất và Càn, giữa Càn và Hợi). Nhà phạm Tiểu Không Vong dễ sinh khẩu thiệt, quan hệ trong nhà thiếu thuận hòa.
            </p>
          </div>
        </div>

        {/* 24 Mountains Full Table */}
        <div className="space-y-3">
          <h4 className="font-bold text-gray-900 text-sm uppercase">
            Bảng Tra Cứu Toàn Bộ 24 Sơn Hướng (La Bàn 360°)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-800 font-bold border-b border-gray-300">
                  <th className="p-2.5 border text-center w-12">STT</th>
                  <th className="p-2.5 border">Sơn Hướng</th>
                  <th className="p-2.5 border">Phương Vị</th>
                  <th className="p-2.5 border text-center">Góc Bắt Đầu</th>
                  <th className="p-2.5 border text-center">Góc Kết Thúc</th>
                  <th className="p-2.5 border text-center">Tâm Sơn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {MOUNTAINS_24.map((m, idx) => {
                  const isCurrent = evaluation.mountain === m.name;
                  const centerDeg = (m.start + 7.5) % 360;

                  return (
                    <tr
                      key={m.name}
                      className={
                        isCurrent
                          ? 'bg-amber-100 font-bold text-amber-950'
                          : 'hover:bg-gray-50 text-gray-700'
                      }
                    >
                      <td className="p-2.5 border text-center">{idx + 1}</td>
                      <td className="p-2.5 border font-extrabold text-gray-900">Sơn {m.name}</td>
                      <td className="p-2.5 border font-medium">{m.dir}</td>
                      <td className="p-2.5 border text-center font-mono">{m.start}°</td>
                      <td className="p-2.5 border text-center font-mono">{m.end}°</td>
                      <td className="p-2.5 border text-center font-mono text-[#c8860a] font-bold">
                        {centerDeg}°
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
