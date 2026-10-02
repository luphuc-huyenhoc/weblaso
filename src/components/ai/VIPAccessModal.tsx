'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, Sparkles, ShieldCheck, ArrowRight, X, LogIn } from 'lucide-react';

interface VIPAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  authenticated: boolean;
  userEmail?: string;
  chartTitle?: string;
}

export function VIPAccessModal({
  isOpen,
  onClose,
  authenticated,
  userEmail,
  chartTitle,
}: VIPAccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-300/60 relative my-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#27303f] via-[#1a222e] to-[#27303f] p-6 text-center text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30 mb-3 ring-4 ring-amber-400/20">
            <Crown className="w-8 h-8 text-white" />
          </div>

          <span className="text-[10px] uppercase font-black tracking-widest px-3 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full inline-block mb-2">
            Độc Quyền Thành Viên Trả Phí (VIP)
          </span>

          <h3 className="text-xl font-extrabold text-white uppercase tracking-tight">
            Mở Khóa Luận Giải AI Chuyên Sâu
          </h3>

          <p className="text-xs text-gray-300 mt-1 max-w-sm mx-auto">
            {chartTitle ? `Phân tích chuyên sâu: ${chartTitle}` : 'Trí tuệ nhân tạo phân tích toàn diện mệnh lý và vận hạn'}
          </p>
        </div>

        {/* Benefits List */}
        <div className="p-6 space-y-4">
          <div className="space-y-2.5 text-xs text-gray-700">
            <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-amber-50/50 border border-amber-200/50">
              <Sparkles className="w-4 h-4 text-[#c8860a] shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Luận Giải AI Trí Tuệ Nhân Tạo Toàn Diện</strong>
                <span className="text-gray-600 text-[11px]">
                  Tự động phân tích tính cách, công danh sự nghiệp, tài lộc, tình cảm gia đạo và thể trạng sức khỏe.
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-amber-50/50 border border-amber-200/50">
              <ShieldCheck className="w-4 h-4 text-[#c8860a] shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Bổ Khuyết Phong Thủy Cải Vận Độc Quyền</strong>
                <span className="text-gray-600 text-[11px]">
                  Chỉ dẫn phương vị đón sinh khí, màu sắc tương sinh, vật phẩm trợ mệnh theo chính xác Dụng Thần bản mệnh.
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-amber-50/50 border border-amber-200/50">
              <Crown className="w-4 h-4 text-[#c8860a] shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900 block">Quyền Lợi VIP Không Giới Hạn</strong>
                <span className="text-gray-600 text-[11px]">
                  Lưu trữ lá số trọn đời, tải báo cáo xuất bản sắc nét và sử dụng toàn bộ tính năng cao cấp.
                </span>
              </div>
            </div>
          </div>

          {/* Account status note */}
          {authenticated && userEmail ? (
            <div className="text-center text-[11px] text-gray-500 py-1 border-t border-gray-100">
              Đang đăng nhập: <strong className="text-gray-800">{userEmail}</strong> (Tài khoản Tiêu Chuẩn)
            </div>
          ) : null}

          {/* CTA Buttons */}
          <div className="space-y-2 pt-1">
            <Link
              href="/tai-khoan-premium"
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#c8860a] to-[#a66f08] hover:from-[#b57708] hover:to-[#915f05] text-white font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-amber-600/20 transition active:scale-[0.98]"
            >
              <span>Nâng Cấp Gói VIP Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {!authenticated && (
              <Link
                href="/tai-khoan/dang-nhap"
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Đã có tài khoản VIP? Đăng nhập ngay</span>
              </Link>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 font-medium py-1 transition"
            >
              Để sau, đóng lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
