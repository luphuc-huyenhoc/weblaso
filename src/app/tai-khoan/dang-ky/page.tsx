'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Lock, Mail, User, Loader2 } from 'lucide-react';

export default function DangKyPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
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
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 uppercase">Tạo Tài Khoản Mới</h1>
          <p className="text-xs text-gray-500 mt-1">
            Đăng ký để nhận 5 lượt lưu lá số miễn phí và theo dõi tiến trình đại vận.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Họ và tên</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:border-[#c8860a] text-sm"
              />
            </div>
          </div>

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
            <label className="block text-xs font-semibold text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
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
                <span>Đang đăng ký...</span>
              </>
            ) : (
              <span>ĐĂNG KÝ TÀI KHOẢN</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 border-t pt-4">
          Đã có tài khoản?{' '}
          <Link href="/tai-khoan/dang-nhap" className="text-[#c8860a] font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
