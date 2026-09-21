'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Lock, Mail, Loader2, CheckCircle2 } from 'lucide-react';

export default function DangNhapPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      router.push('/tai-khoan/la-so-da-luu');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-[#c8860a] mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 uppercase">Đăng Nhập Tài Khoản</h1>
          <p className="text-xs text-gray-500 mt-1">
            Đăng nhập để quản lý và lưu giữ các lá số Bát Tự, Tử Vi, Quẻ Dịch trọn đời.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Địa chỉ Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:border-[#c8860a] text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-gray-700">Mật khẩu</label>
              <Link
                href="/tai-khoan/quen-mat-khau"
                className="text-[11px] text-[#c8860a] hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:border-[#c8860a] text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center space-x-2 bg-[#c8860a] hover:bg-amber-700 text-white font-bold py-2.5 rounded shadow text-xs uppercase tracking-wider transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              <span>ĐĂNG NHẬP</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 border-t pt-4">
          Chưa có tài khoản?{' '}
          <Link href="/tai-khoan/dang-ky" className="text-[#c8860a] font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
