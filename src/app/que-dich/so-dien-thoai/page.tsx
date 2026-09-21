'use client';

import React, { useState } from 'react';
import { IchingEnvelope } from '@/domain/iching';
import { HexagramVisualizer } from '@/components/iching/HexagramVisualizer';
import { Phone, Sparkles, Loader2 } from 'lucide-react';

export default function SoDienThoaiPage() {
  const [phoneNumber, setPhoneNumber] = useState('0912345678');
  const [ownerName, setOwnerName] = useState('NGUYỄN VĂN A');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IchingEnvelope | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const res = await fetch('/api/iching/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Quẻ Dịch Sim Số Điện Thoại ${phoneNumber} (${ownerName})`,
          method: 'Số Điện Thoại',
          phoneNumber,
          day: now.getDate(),
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          hour: now.getHours(),
          minute: now.getMinutes(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi bói sim số điện thoại');
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs text-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
          Bói Sim Phong Thủy Theo Quẻ Dịch Mai Hoa
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Ứng dụng thuật Mai Hoa Dịch Số chia dãy số điện thoại thành Thượng quái, Hạ quái và tìm Hào động, dự đoán năng lượng cát hung và mức độ phù hợp với người dùng.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Số Điện Thoại Cần Xem
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                required
                maxLength={11}
                placeholder="Ví dụ: 0912345678"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded font-mono text-base font-bold text-gray-800 focus:border-[#c8860a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Họ và tên người sử dụng
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-[#c8860a]"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
              {error}
            </div>
          )}

          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 bg-[#c8860a] hover:bg-amber-700 text-white font-extrabold px-8 py-3 rounded shadow uppercase tracking-wider text-xs transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tính toán...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>TRA CỨU QUẺ DỊCH SIM</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {result && <HexagramVisualizer envelope={result} />}
    </div>
  );
}
