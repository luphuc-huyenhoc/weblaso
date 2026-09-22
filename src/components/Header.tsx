'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, LogOut, Shield, FileText, Sparkles } from 'lucide-react';

export function Header({ user }: { user?: { fullName: string; role: string } | null }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Vietnamese current date formatted like reference: "Thứ Hai, 21 Tháng Chín, 2026"
  const now = new Date();
  const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const months = [
    'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
    'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
  ];
  const dateStr = `${daysOfWeek[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()}`;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/tim-kiem?s=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearchOpen(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      {/* Top Bar matching reference */}
      <div className="bg-[#222222] text-gray-300 text-xs py-1.5 px-4">
        <div className="max-w-site mx-auto flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-200">{dateStr}</span>
            <span className="hidden md:inline-block text-gray-500">|</span>
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-[#c8860a] font-bold">Tin mới:</span>
              <span className="text-gray-300 hover:text-white transition">
                Lữ Phúc: Gieo Phúc - Gặt Phước | Luận giải Bát Tự Phúc Sơn & Dịch Học thực chiến
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Toggle */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hover:text-white p-1 flex items-center space-x-1"
                title="Tìm kiếm"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tìm kiếm</span>
              </button>

              {isSearchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 top-8 z-50 bg-white p-2 rounded shadow-lg border border-gray-200 flex"
                >
                  <input
                    type="text"
                    placeholder="Nhập từ khóa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-xs text-gray-900 focus:outline-none focus:border-[#c8860a] w-48"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="ml-1 bg-[#c8860a] text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-opacity-90"
                  >
                    Tìm
                  </button>
                </form>
              )}
            </div>

            {/* Account dropdown */}
            <div ref={accountRef} className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center space-x-1 hover:text-white py-1 px-1.5 rounded"
              >
                <User className="w-3.5 h-3.5 text-[#c8860a]" />
                <span className="hidden sm:inline">
                  {user ? user.fullName : 'Tài khoản'}
                </span>
              </button>

              {isAccountMenuOpen && (
                <div
                  className="absolute right-0 top-8 z-50 w-44 bg-white text-gray-800 rounded shadow-lg border border-gray-200 py-1.5 text-xs"
                  onClick={() => setIsAccountMenuOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-3 py-1.5 border-b border-gray-100 font-semibold text-gray-900 truncate">
                        {user.fullName}
                      </div>
                      <Link
                        href="/tai-khoan/la-so-da-luu"
                        className="flex items-center px-3 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        <FileText className="w-3.5 h-3.5 mr-2 text-[#c8860a]" />
                        Lá số đã lưu
                      </Link>
                      <Link
                        href="/tai-khoan-premium"
                        className="flex items-center px-3 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-2 text-yellow-500" />
                        Nâng cấp Premium
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="flex items-center px-3 py-2 hover:bg-gray-100 text-red-600 font-medium"
                        >
                          <Shield className="w-3.5 h-3.5 mr-2" />
                          Trang Quản Trị
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 hover:bg-gray-100 text-gray-600 border-t border-gray-100 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5 mr-2 text-gray-400" />
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/tai-khoan/dang-nhap"
                        className="block px-3 py-2 hover:bg-gray-100 text-gray-700 font-medium"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        href="/tai-khoan/dang-ky"
                        className="block px-3 py-2 hover:bg-gray-100 text-[#c8860a] font-semibold"
                      >
                        Đăng ký tài khoản
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand & Banner Area */}
      <div className="max-w-site mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 bg-[#27303f] rounded-full border-2 border-[#c8860a] flex items-center justify-center text-[#c8860a] font-bold text-xl shadow-sm group-hover:scale-105 transition-transform">
            LP
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[#27303f]">
              LỮ PHÚC
            </div>
            <div className="text-xs text-[#c8860a] font-bold tracking-wider uppercase">
              Gieo Phúc - Gặt Phước
            </div>
            <div className="text-[11px] text-gray-500 tracking-wide font-medium">
              Bát Tự Phúc Sơn & Dịch Học Cổ Truyền
            </div>
          </div>
        </Link>

        {/* Promotional Banner Area */}
        <div className="w-full md:w-auto bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs">
          <div className="pr-0 sm:pr-4">
            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              Khóa Học Bát Tự Phúc Sơn
            </span>
            <div className="text-xs sm:text-sm font-bold text-gray-900 mt-1">
              Giải Mã Vận Mệnh Từ Ngày Giờ Sinh
            </div>
            <div className="text-[11px] text-gray-600 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
              <span>Zalo/Hotline: <strong className="text-gray-900 font-bold">0374436921</strong></span>
              <span className="hidden sm:inline">·</span>
              <span>TikTok: <strong className="text-gray-900 font-bold">Huyền Học Lữ Phúc</strong></span>
            </div>
          </div>
          <Link
            href="/lien-he"
            className="w-full sm:w-auto text-center bg-[#c8860a] hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow transition whitespace-nowrap"
          >
            Đăng Ký Học →
          </Link>
        </div>
      </div>
    </header>
  );
}
