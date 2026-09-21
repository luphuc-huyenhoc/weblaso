'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KeyRound, Mail, Loader2, CheckCircle2 } from 'lucide-react';

export default function QuenMatKhauPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Yêu cầu thất bại');
      }

      setSuccess(true);
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
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 uppercase">Quên Mật Khẩu</h1>
          <p className="text-xs text-gray-500 mt-1">
            Nhập email đã đăng ký để nhận liên kết thiết lập lại mật khẩu an toàn.
          </p>
        </div>

        {success ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 space-y-2 text-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <p className="font-semibold">
              Hướng dẫn khôi phục mật khẩu đã được gửi đến email của bạn!
            </p>
            <p className="text-gray-500">
              Vui lòng kiểm tra hộp thư đến (và mục spam nếu cần) để đặt lại mật khẩu mới.
            </p>
            <div className="pt-2">
              <Link href="/tai-khoan/dang-nhap" className="text-[#c8860a] font-bold hover:underline">
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        ) : (
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
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>GỬI LIÊN KẾT ĐẶT LẠI</span>
              )}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-gray-500 border-t pt-4">
          <Link href="/tai-khoan/dang-nhap" className="text-[#c8860a] font-bold hover:underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
