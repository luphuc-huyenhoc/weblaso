'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, LogOut, Shield, FileText, Sparkles } from 'lucide-react';

export function Header({ user }: { user?: { fullName: string; role: string; email?: string } | null }) {
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
                Lữ Phúc: Gieo Phúc - Gặt Phước | Luận giải Bát Tự Lữ Phúc & Dịch Học thực chiến
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
                      <div className="px-3 py-2 border-b border-gray-100 bg-amber-50/50">
                        <p className="font-bold text-gray-900 truncate">{user.fullName}</p>
                        <p className="text-gray-500 truncate text-[10px]">{user.email}</p>
                      </div>

                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="flex items-center px-3 py-2 hover:bg-gray-100 text-gray-700 font-semibold"
                        >
                          <Shield className="w-3.5 h-3.5 mr-2 text-[#c8860a]" />
                          Quản trị hệ thống
                        </Link>
                      )}

                      <Link
                        href="/tai-khoan/la-so-da-luu"
                        className="flex items-center px-3 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        <FileText className="w-3.5 h-3.5 mr-2 text-gray-400" />
                        Lá số đã lưu
                      </Link>

                      <Link
                        href="/tai-khoan-premium"
                        className="flex items-center px-3 py-2 hover:bg-gray-100 text-[#c8860a] font-semibold"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-2 text-[#c8860a]" />
                        Nâng cấp VIP
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-3 py-2 hover:bg-gray-100 text-red-600 border-t border-gray-100 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5 mr-2 text-gray-400" />
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/tai-khoan/dang-nhap"
                        className="block px-3 py-2 hover:bg-gray-100 text-gray-700 font-semibold"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        href="/tai-khoan/dang-ky"
                        className="block px-3 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        Đăng ký
                      </Link>
                      <Link
                        href="/tai-khoan-premium"
                        className="block px-3 py-2 hover:bg-gray-100 text-[#c8860a] font-semibold border-t border-gray-100"
                      >
                        Nâng cấp VIP
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
        <Link href="/" className="flex items-center space-x-3.5 group">
          {/* Imperial Gold Medallion Logo */}
          <div className="relative w-13 h-13 flex-shrink-0 flex items-center justify-center filter drop-shadow-md group-hover:scale-105 transition-transform duration-300">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f7d070" />
                  <stop offset="35%" stopColor="#d4af37" />
                  <stop offset="70%" stopColor="#aa7c11" />
                  <stop offset="100%" stopColor="#e5b842" />
                </linearGradient>
                <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e2c3d" />
                  <stop offset="100%" stopColor="#0f1722" />
                </linearGradient>
              </defs>
              {/* Outer Radiant Sunburst Ring */}
              <circle cx="50" cy="50" r="48" fill="none" stroke="url(#goldGrad)" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="#d4af37" strokeWidth="0.8" strokeDasharray="2, 2" />
              {/* Dark Imperial Center Disc */}
              <circle cx="50" cy="50" r="41" fill="url(#navyGrad)" stroke="url(#goldGrad)" strokeWidth="1.8" />
              {/* 8 Auspicious Bagua Points */}
              <g stroke="url(#goldGrad)" strokeWidth="1.2" opacity="0.6">
                <line x1="50" y1="12" x2="50" y2="19" />
                <line x1="50" y1="81" x2="50" y2="88" />
                <line x1="12" y1="50" x2="19" y2="50" />
                <line x1="81" y1="50" x2="88" y2="50" />
                <line x1="23" y1="23" x2="28" y2="28" />
                <line x1="72" y1="72" x2="77" y2="77" />
                <line x1="77" y1="23" x2="72" y2="28" />
                <line x1="23" y1="77" x2="28" y2="72" />
              </g>
              {/* Stylized Yin Yang Waves */}
              <path
                d="M50,22 A28,28 0 0,0 50,78 A14,14 0 0,0 50,50 A14,14 0 0,1 50,22 Z"
                fill="url(#goldGrad)"
                opacity="0.22"
              />
              {/* Inner Crest Monogram: LP with Crown / Star Accent */}
              <circle cx="50" cy="27" r="2.5" fill="url(#goldGrad)" />
              <text
                x="50"
                y="57"
                textAnchor="middle"
                fontFamily="serif"
                fontSize="25"
                fontWeight="900"
                fill="url(#goldGrad)"
                letterSpacing="1"
              >
                LP
              </text>
              <text
                x="50"
                y="69"
                textAnchor="middle"
                fontSize="7.5"
                fontWeight="bold"
                fill="#f7d070"
                letterSpacing="2"
              >
                LỮ PHÚC
              </text>
            </svg>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-[#1e293b] flex items-center space-x-1.5">
              <span>LỮ PHÚC</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c8860a]"></span>
            </div>
            <div className="text-xs text-[#c8860a] font-extrabold tracking-wider uppercase">
              Gieo Phúc - Gặt Phước
            </div>
            <div className="text-[11px] text-gray-500 tracking-wide font-medium">
              Bát Tự Lữ Phúc & Dịch Học Cổ Truyền
            </div>
          </div>
        </Link>

        {/* Promotional Banner Area */}
        <div className="w-full md:w-auto bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs">
          <div className="pr-0 sm:pr-4">
            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              Khóa Học Bát Tự Lữ Phúc
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
