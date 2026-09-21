'use client';
export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BaziForm } from '@/components/bazi/BaziForm';

function BaziPageContent() {
  const searchParams = useSearchParams();

  const fullName = searchParams.get('Fullname') || searchParams.get('name') || searchParams.get('fullName') || undefined;
  const genderParam = searchParams.get('Gender') ?? searchParams.get('gender');
  const gender = genderParam !== null ? genderParam === '1' || genderParam === 'true' || genderParam === 'male' : undefined;
  
  const getNum = (names: string[]) => {
    for (const name of names) {
      const val = searchParams.get(name);
      if (val !== null && val !== '') return parseInt(val, 10);
    }
    return undefined;
  };

  const day = getNum(['Day', 'day']);
  const month = getNum(['Month', 'month']);
  const year = getNum(['Year', 'year']);
  const hour = getNum(['Hour', 'hour']);
  const minute = getNum(['Minutes', 'minute', 'min']);
  const focusYear = getNum(['FocusYear', 'focusYear']);

  const hasParams = Boolean(day && month && year);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 uppercase">Lập Lá Số Bát Tự Tứ Trụ</h1>
        <p className="text-sm text-gray-500 mt-1">
          Hệ thống luận giải Bát Tự theo Manh Phái & Tử Bình chính tông
        </p>
      </div>
      <BaziForm
        key={`${day}-${month}-${year}-${hour}-${minute}`}
        initialValues={{
          fullName,
          gender,
          day,
          month,
          year,
          hour,
          minute,
          focusYear,
        }}
        autoSubmit={hasParams}
      />
    </div>
  );
}

export default function BaziPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 text-sm">Đang tải biểu mẫu...</div>}>
      <BaziPageContent />
    </Suspense>
  );
}
