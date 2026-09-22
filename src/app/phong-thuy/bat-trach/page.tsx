'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BatTrachVisualizer } from '@/components/fengshui/BatTrachVisualizer';
import { calculateBatTrach, evaluateMountainDegree, Direction8 } from '@/domain/fengshui';
import { Compass, Loader2 } from 'lucide-react';

const DIRECTION_PRESETS: Array<{ label: string; dir: Direction8; deg: number }> = [
  { label: 'Bắc (0°)', dir: 'Bắc', deg: 0 },
  { label: 'Đông Bắc (45°)', dir: 'Đông Bắc', deg: 45 },
  { label: 'Đông (90°)', dir: 'Đông', deg: 90 },
  { label: 'Đông Nam (135°)', dir: 'Đông Nam', deg: 135 },
  { label: 'Nam (180°)', dir: 'Nam', deg: 180 },
  { label: 'Tây Nam (225°)', dir: 'Tây Nam', deg: 225 },
  { label: 'Tây (270°)', dir: 'Tây', deg: 270 },
  { label: 'Tây Bắc (315°)', dir: 'Tây Bắc', deg: 315 },
];

function BatTrachContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial params
  const paramYear = searchParams.get('year');
  const paramGender = searchParams.get('gender');
  const paramDir = searchParams.get('direction');

  const initialYear = paramYear ? parseInt(paramYear, 10) || 1990 : 1990;
  const initialGender = paramGender ? paramGender !== 'female' && paramGender !== '0' && paramGender !== 'false' : true;
  const initialDegree = paramDir ? parseFloat(paramDir) || 180 : 180;

  const [birthYear, setBirthYear] = useState<number>(initialYear);
  const [gender, setGender] = useState<boolean>(initialGender); // true = Nam, false = Nữ
  const [degree, setDegree] = useState<number>(initialDegree);

  // Result state
  const [result, setResult] = useState<any>(() => {
    const calc = calculateBatTrach(initialYear, initialGender);
    const degreeEvaluation = evaluateMountainDegree(initialDegree, calc.quaiMenh);
    return { ...calc, degreeEvaluation };
  });

  const updateUrl = (y: number, g: boolean, d: number) => {
    const params = new URLSearchParams();
    params.set('year', y.toString());
    params.set('gender', g ? 'male' : 'female');
    params.set('direction', d.toString());
    const newUrl = `/phong-thuy/bat-trach?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  };

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const calc = calculateBatTrach(birthYear, gender);
    const degreeEvaluation = evaluateMountainDegree(degree, calc.quaiMenh);
    setResult({ ...calc, degreeEvaluation });
    updateUrl(birthYear, gender, degree);
  };

  const handleDegreeChange = (newDeg: number) => {
    setDegree(newDeg);
    if (result) {
      const degreeEvaluation = evaluateMountainDegree(newDeg, result.quaiMenh);
      setResult((prev: any) => ({ ...prev, degreeEvaluation }));
      updateUrl(birthYear, gender, newDeg);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs text-center">
        <span className="text-[11px] uppercase font-bold tracking-widest px-3 py-1 bg-amber-50 text-[#c8860a] border border-amber-200 rounded-full">
          Bát Trạch Minh Cảnh & 24 Sơn Hướng
        </span>
        <h1 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-wide mt-3">
          Tra Cứu Hướng Nhà Phong Thủy Bát Trạch
        </h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1 max-w-2xl mx-auto">
          Xác định chính xác Cung Phi, Quái Mệnh theo năm sinh và giới tính. Đánh giá chi tiết 8 hướng cát hung và phân kim 24 sơn hướng kích hoạt tài lộc gia trạch.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs max-w-3xl mx-auto">
        <form onSubmit={handleCalculate} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Năm sinh */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Năm sinh gia chủ</label>
              <input
                type="number"
                min={1920}
                max={2040}
                value={birthYear}
                onChange={(e) => setBirthYear(parseInt(e.target.value, 10) || 1990)}
                className="w-full px-3 py-2 border border-gray-300 rounded font-bold text-center text-sm focus:border-[#c8860a] focus:ring-1 focus:ring-[#c8860a]"
              />
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Giới tính</label>
              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={gender}
                    onChange={() => setGender(true)}
                    className="text-[#c8860a] focus:ring-[#c8860a]"
                  />
                  <span className="text-xs font-bold text-gray-800">Nam</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={!gender}
                    onChange={() => setGender(false)}
                    className="text-[#c8860a] focus:ring-[#c8860a]"
                  />
                  <span className="text-xs font-bold text-gray-800">Nữ</span>
                </label>
              </div>
            </div>

            {/* Chọn hướng nhà nhanh */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Chọn 8 hướng chính</label>
              <select
                onChange={(e) => {
                  const deg = parseFloat(e.target.value);
                  setDegree(deg);
                }}
                value={
                  DIRECTION_PRESETS.find((p) => Math.abs(p.deg - degree) < 22.5)?.deg ?? 180
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white focus:border-[#c8860a]"
              >
                {DIRECTION_PRESETS.map((p) => (
                  <option key={p.dir} value={p.deg}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Số độ la bàn */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Số độ la bàn (0°-359°)</label>
              <input
                type="number"
                min={0}
                max={360}
                step={0.5}
                value={degree}
                onChange={(e) => setDegree(parseFloat(e.target.value) || 0)}
                placeholder="Ví dụ: 135"
                className="w-full px-3 py-2 border border-gray-300 rounded font-bold text-center text-sm focus:border-[#c8860a] focus:ring-1 focus:ring-[#c8860a]"
              />
            </div>
          </div>

          <div className="text-center pt-3">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 bg-[#c8860a] hover:bg-amber-700 text-white font-extrabold px-8 py-2.5 rounded shadow uppercase tracking-wider text-xs transition active:scale-98"
            >
              <Compass className="w-4 h-4" />
              <span>TRA CỨU BÁT TRẠCH</span>
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {result && (
        <BatTrachVisualizer
          result={result}
          currentDegree={degree}
          onDegreeChange={handleDegreeChange}
        />
      )}
    </div>
  );
}

export default function BatTrachPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Đang tải la bàn Bát Trạch...</div>}>
      <BatTrachContent />
    </Suspense>
  );
}
