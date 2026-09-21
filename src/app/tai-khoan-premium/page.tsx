'use client';

import React, { useState } from 'react';
import { Check, Sparkles, ShieldCheck, Crown, Loader2 } from 'lucide-react';

export default function TaiKhoanPremiumPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleUpgrade = async (planType: string, amount: number, days: number) => {
    setLoadingPlan(planType);
    setSuccessMessage(null);

    try {
      // First get current user
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();

      if (!meData.authenticated) {
        window.location.href = '/tai-khoan/dang-nhap';
        return;
      }

      // Trigger payment webhook simulation
      const res = await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'payment.succeeded',
          userId: meData.user.id,
          amount,
          planType,
          durationDays: days,
        }),
      });

      if (res.ok) {
        setSuccessMessage('Nâng cấp gói thành công! Quyền lợi VIP đã được kích hoạt trên tài khoản của bạn.');
      } else {
        alert('Lỗi kích hoạt gói');
      }
    } catch (e) {
      alert('Lỗi kết nối khi thanh toán');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 my-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase font-extrabold tracking-widest px-3 py-1 bg-amber-50 text-[#c8860a] border border-amber-200 rounded-full">
          Dịch Vụ Cao Cấp
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 uppercase">
          Nâng Cấp Tài Khoản Premium VIP
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Mở khóa lưu trữ không giới hạn lá số, xuất báo cáo PDF chuẩn in ấn và nhận luận giải chi tiết từ hệ thống thuật toán cao cấp.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg text-center">
          {successMessage}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Free Plan */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-base">Gói Cơ Bản (Free)</h3>
            <div className="text-3xl font-black text-gray-900">
              0 <span className="text-xs font-normal text-gray-500">đ/tháng</span>
            </div>
            <p className="text-xs text-gray-500">Dành cho người mới bắt đầu tìm hiểu và lập lá số cơ bản.</p>

            <ul className="space-y-2.5 text-xs text-gray-700 pt-4 border-t">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Lập lá số Bát Tự, Tử Vi, Quẻ Dịch</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Lưu tối đa 5 lá số</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Xem thời vận năm hiện tại</span>
              </li>
            </ul>
          </div>

          <button
            disabled
            className="w-full py-2.5 rounded bg-gray-100 text-gray-500 font-bold text-xs uppercase cursor-default"
          >
            Đang sử dụng
          </button>
        </div>

        {/* Monthly VIP Plan (Featured) */}
        <div className="bg-white border-2 border-[#c8860a] rounded-lg p-6 shadow-md flex flex-col justify-between space-y-6 relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#c8860a] text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
            Phổ Biến Nhất
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-[#c8860a] text-base flex items-center space-x-1.5">
              <Crown className="w-4 h-4" />
              <span>Premium Tháng</span>
            </h3>
            <div className="text-3xl font-black text-gray-900">
              199.000 <span className="text-xs font-normal text-gray-500">đ/tháng</span>
            </div>
            <p className="text-xs text-gray-500">Toàn bộ quyền lợi VIP không giới hạn trong 30 ngày.</p>

            <ul className="space-y-2.5 text-xs text-gray-700 pt-4 border-t">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#c8860a] shrink-0" />
                <span><strong>Lưu trữ không giới hạn</strong> mọi lá số</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#c8860a] shrink-0" />
                <span>Xuất PDF & Hình ảnh độ phân giải cao</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#c8860a] shrink-0" />
                <span>Báo cáo 100 năm Đại Vận & Lưu Niên chi tiết</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#c8860a] shrink-0" />
                <span>Ưu tiên hỗ trợ kỹ thuật và phong thủy</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('PREMIUM_MONTHLY', 199000, 30)}
            disabled={loadingPlan !== null}
            className="w-full py-3 rounded bg-[#c8860a] hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-sm disabled:opacity-50"
          >
            {loadingPlan === 'PREMIUM_MONTHLY' ? 'Đang kích hoạt...' : 'KÍCH HOẠT GÓI THÁNG'}
          </button>
        </div>

        {/* Lifetime Plan */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-base flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Premium Trọn Đời</span>
            </h3>
            <div className="text-3xl font-black text-gray-900">
              1.990.000 <span className="text-xs font-normal text-gray-500">đ/vĩnh viễn</span>
            </div>
            <p className="text-xs text-gray-500">Thanh toán 1 lần duy nhất, sở hữu mọi tính năng trọn đời.</p>

            <ul className="space-y-2.5 text-xs text-gray-700 pt-4 border-t">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Tất cả quyền lợi của gói Premium</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Không phát sinh thêm bất kỳ chi phí nào</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Tự động cập nhật mọi thuật toán mới nhất</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('PREMIUM_LIFETIME', 1990000, 36500)}
            disabled={loadingPlan !== null}
            className="w-full py-3 rounded bg-gray-900 hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider transition shadow-sm disabled:opacity-50"
          >
            {loadingPlan === 'PREMIUM_LIFETIME' ? 'Đang kích hoạt...' : 'SỞ HỮU TRỌN ĐỜI'}
          </button>
        </div>
      </div>
    </div>
  );
}
