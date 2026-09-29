import React from 'react';
import type { Metadata } from 'next';
import { BaziEmpiricalChart } from '@/components/bazi/BaziEmpiricalChart';

export const metadata: Metadata = {
  title: 'Bát Tự Thực Nghiệm - Tứ Trụ Mệnh Bàn & Lữ Phúc Bát Tự | Lữ Phúc',
  description: 'Ứng dụng lập lá số Bát Tự chuyên sâu theo Manh Phái (Tứ Trụ Mệnh Bàn & Lữ Phúc Bát Tự 7 Cột), tích hợp kho lưu trữ ghi chú 6 chủ đề, real-time clock, và xuất ảnh chất lượng cao.',
};

export default function BaziEmpiricalPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      <BaziEmpiricalChart />
    </main>
  );
}
