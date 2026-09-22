'use client';

export const dynamic = 'force-dynamic';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SimForm } from '@/components/sim/SimForm';
import { SimResultView } from '@/components/sim/SimResultView';
import { SimCalculationResult } from '@/domain/sim';

function SoDienThoaiContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<SimCalculationResult | null>(null);

  // Read searchParams
  const phoneNumber = searchParams.get('so') || searchParams.get('phoneNumber') || searchParams.get('phone') || undefined;
  const fullName = searchParams.get('name') || searchParams.get('fullName') || searchParams.get('ten') || undefined;

  const genderParam = searchParams.get('gioitinh') || searchParams.get('gender');
  const gender =
    genderParam !== null && genderParam !== undefined
      ? genderParam.toLowerCase() === 'nam' ||
        genderParam === '1' ||
        genderParam === 'true' ||
        genderParam === 'male'
      : undefined;

  const getNum = (names: string[]) => {
    for (const name of names) {
      const val = searchParams.get(name);
      if (val !== null && val !== '') {
        const num = parseInt(val, 10);
        if (!isNaN(num)) return num;
      }
    }
    return undefined;
  };

  const day = getNum(['ngay', 'day', 'Day']);
  const month = getNum(['thang', 'month', 'Month']);
  const year = getNum(['nam', 'year', 'Year']);
  const hour = getNum(['gio', 'hour', 'Hour']);
  const minute = getNum(['phut', 'minute', 'min', 'Minutes']);

  const calParam = searchParams.get('lich') || searchParams.get('calendarType');
  const calendarType = calParam === 'al' || calParam === 'lunar' ? 'lunar' : 'solar';

  const hasAutoParams = Boolean(phoneNumber && day && month && year);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs text-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
          Bói Sim Phong Thủy Theo Kinh Dịch Lục Hào
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-3xl mx-auto">
          Ứng dụng Dịch Lý Mai Hoa xác định Quẻ Chủ, Quẻ Biến, kết hợp Bát Tự Tứ Trụ, Lạc Thư Cửu Tinh và Chiêm Bói 4 Số Cuối để đánh giá toàn diện năng lượng cát hung của dãy số sim.
        </p>
      </div>

      {/* Input Form or Result View */}
      {!result ? (
        <SimForm
          key={`${phoneNumber}-${day}-${month}-${year}`}
          initialValues={{
            phoneNumber,
            fullName,
            gender,
            day,
            month,
            year,
            hour,
            minute,
            calendarType,
          }}
          onResultCalculated={(res) => setResult(res)}
          autoSubmit={hasAutoParams}
        />
      ) : (
        <SimResultView
          result={result}
          onReset={() => setResult(null)}
        />
      )}
    </div>
  );
}

export default function SoDienThoaiPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 text-sm">Đang tải công cụ bói sim...</div>}>
      <SoDienThoaiContent />
    </Suspense>
  );
}
