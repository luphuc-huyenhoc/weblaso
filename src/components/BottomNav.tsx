'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Sparkles,
  Compass,
  BookOpen,
  Menu,
  X,
  Calendar,
  Layers,
  ShoppingBag,
  Download,
  User,
  Phone,
  Banknote,
  Coins,
  ChevronRight,
} from 'lucide-react';

export function BottomNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(isAdmin);

  React.useEffect(() => {
    setUserIsAdmin(isAdmin);
  }, [isAdmin]);

  React.useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated && data?.user?.role === 'ADMIN') {
          setUserIsAdmin(true);
        } else {
          setUserIsAdmin(false);
        }
      })
      .catch(() => {});
  }, []);

  const navItems = [
    {
      title: 'Trang chủ',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      title: 'Bát Tự',
      href: '/la-so-bat-tu',
      icon: Sparkles,
      isActive: pathname.startsWith('/la-so-bat-tu'),
    },
    {
      title: 'Tử Vi',
      href: '/la-so-tu-vi',
      icon: Compass,
      isActive: pathname === '/la-so-tu-vi' || pathname === '/la-so-tu-vi/xem-sao-han',
    },
    {
      title: 'Quẻ Dịch',
      href: '/que-dich',
      icon: BookOpen,
      isActive: pathname.startsWith('/que-dich'),
    },
  ];

  return (
    <>
      {/* Fixed Bottom Navigation Bar on Mobile */}
      <nav
        aria-label="Điều hướng di động"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200/50 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      >
        <div className="grid grid-cols-5 items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${
                  item.isActive
                    ? 'text-[#c8860a] font-bold'
                    : 'text-gray-500 hover:text-gray-900 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#c8860a] rounded-full" />
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight">{item.title}</span>
              </Link>
            );
          })}

          {/* 5th Tab: Menu Drawer Toggle */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
              drawerOpen ? 'text-[#c8860a] font-bold' : 'text-gray-500 hover:text-gray-900 font-medium'
            }`}
          >
            <div className="relative">
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Thêm</span>
          </button>
        </div>
      </nav>

      {/* Slide-up Menu Drawer */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 pb-8 space-y-5 shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
                <div>
                  <h3 className="text-sm font-extrabold text-[#27303f] uppercase tracking-wide">
                    Bát Tự Lữ Phúc
                  </h3>
                  <p className="text-[10px] text-gray-400">Gieo Phúc - Gặt Phước</p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Feature Groups */}
            <div className="space-y-4 text-xs">
              {/* Group 0: Bát Tự Nâng Cao (Quản Trị Admin) */}
              {userIsAdmin && (
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Bát Tự Chuyên Sâu (Admin)
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    <Link
                      href="/la-so-bat-tu/thuc-nghiem"
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition border border-amber-300/60 text-gray-900"
                    >
                      <div className="flex items-center space-x-2.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <div>
                          <span className="font-bold block">Bát Tự Thực Nghiệm</span>
                          <span className="text-[10px] text-amber-700">Tứ Trụ Mệnh Bàn & Lữ Phúc 7 cột</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Group 1: Lịch Âm Dương */}
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Lịch Âm Dương & Vạn Sự
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  <Link
                    href="/la-so-tu-vi/lich-am-duong"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/50 hover:bg-amber-100/50 transition border border-amber-200/40 text-gray-800"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Calendar className="w-4 h-4 text-[#c8860a]" />
                      <span className="font-semibold">Xem lịch âm dương tháng</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>

                  <Link
                    href="/la-so-tu-vi/doi-lich-am-duong"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition border border-gray-200/50 text-gray-800"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">Đổi ngày âm sang dương & ngược lại</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>

                  <Link
                    href="/lich-ngay-tot-xau"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition border border-gray-200/50 text-gray-800"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold">Lịch ngày tốt xấu & Thông thư vạn sự</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>
                </div>
              </div>

              {/* Group 2: Quẻ Dịch Nâng Cao */}
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Dự Đoán Dịch Học
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/que-dich/seri-tien"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-emerald-900 font-semibold"
                  >
                    <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Quẻ Seri Tiền</span>
                  </Link>

                  <Link
                    href="/que-dich/so-dien-thoai"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-purple-50/60 border border-purple-200/60 text-purple-900 font-semibold"
                  >
                    <Phone className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="truncate">Bói Sim Số</span>
                  </Link>

                  <Link
                    href="/que-dich/luc-hao"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-amber-900 font-semibold"
                  >
                    <BookOpen className="w-4 h-4 text-[#c8860a] shrink-0" />
                    <span className="truncate">Quẻ Lục Hào</span>
                  </Link>

                  <Link
                    href="/que-dich/ngau-nhien"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/60 text-blue-900 font-semibold"
                  >
                    <Coins className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="truncate">Tung Đồng Xu</span>
                  </Link>
                </div>
              </div>

              {/* Group 3: Phong Thủy & Vật Phẩm */}
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Phong Thủy & Cải Vận
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/phong-thuy/bat-trach"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200/60 text-gray-800 font-semibold"
                  >
                    <Layers className="w-4 h-4 text-[#c8860a] shrink-0" />
                    <span className="truncate">Bát Trạch Cung Mệnh</span>
                  </Link>

                  <Link
                    href="/phong-thuy/bat-trach-24-son-huong"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200/60 text-gray-800 font-semibold"
                  >
                    <Compass className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="truncate">La Bàn 24 Sơn Hướng</span>
                  </Link>

                  <Link
                    href="/vat-pham"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-gray-50 border border-gray-200/60 text-gray-800 font-semibold col-span-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Vật phẩm phong thủy & cải vận Bát Tự</span>
                  </Link>
                </div>
              </div>

              {/* Group 4: Tài Khoản */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href="/tai-khoan/dang-nhap"
                  onClick={() => setDrawerOpen(false)}
                  className="inline-flex items-center space-x-2 text-xs font-bold text-gray-700 hover:text-[#c8860a]"
                >
                  <User className="w-4 h-4 text-[#c8860a]" />
                  <span>Đăng nhập / Tài khoản</span>
                </Link>

                <Link
                  href="/tai-khoan-premium"
                  onClick={() => setDrawerOpen(false)}
                  className="px-3 py-1 bg-amber-100 text-[#935f37] font-bold rounded-full text-[11px]"
                >
                  Tài khoản Premium
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
