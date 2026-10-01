import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';
import { BaziEmpiricalChart } from '@/components/bazi/BaziEmpiricalChart';
import { getCurrentUser } from '@/server/auth';

export const metadata: Metadata = {
  title: 'Bát Tự Thực Nghiệm - Tứ Trụ Mệnh Bàn & Lữ Phúc Bát Tự | Lữ Phúc',
  description: 'Ứng dụng lập lá số Bát Tự chuyên sâu theo Manh Phái (Tứ Trụ Mệnh Bàn & Lữ Phúc Bát Tự 7 Cột), tích hợp kho lưu trữ ghi chú 6 chủ đề, real-time clock, và xuất ảnh chất lượng cao.',
};

export default async function BaziEmpiricalPage() {
  const user = await getCurrentUser();

  // If user is not authenticated, redirect to login page with return callback
  if (!user) {
    redirect('/tai-khoan/dang-nhap?redirect=/la-so-bat-tu/thuc-nghiem');
  }

  // If user is authenticated but not an ADMIN
  if (user.role !== 'ADMIN') {
    return (
      <main className="w-full min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-lg">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50/50">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">
            Quyền Truy Cập Bị Giới Hạn
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Chức năng <strong className="text-gray-800">Bát Tự Thực Nghiệm</strong> chỉ dành riêng cho tài khoản <strong className="text-red-700">Quản Trị Viên (Admin)</strong>.
          </p>
          <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-500">
            Tài khoản hiện tại: <span className="font-semibold text-gray-800">{user.email}</span> (Vai trò: <span className="font-semibold uppercase text-amber-600">{user.role}</span>)
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-lg border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về Trang Chủ</span>
            </Link>
            <Link
              href="/tai-khoan/dang-nhap?redirect=/la-so-bat-tu/thuc-nghiem"
              className="flex-1 inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-lg bg-[#c8860a] hover:bg-amber-700 text-white text-xs font-bold uppercase transition shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Đổi Tài Khoản Admin</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Admin access granted
  return (
    <main className="w-full min-h-screen bg-white">
      <BaziEmpiricalChart />
    </main>
  );
}
