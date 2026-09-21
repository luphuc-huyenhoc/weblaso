'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, ChevronDown, Menu, X } from 'lucide-react';

interface MenuItem {
  title: string;
  href: string;
  children?: Array<{ title: string; href: string }>;
}

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Lá số bát tự',
    href: '/la-so-bat-tu',
    children: [
      { title: 'Xem thời vận', href: '/la-so-bat-tu/xem-thoi-van' },
      { title: 'Xem vật phẩm cải vận', href: '/la-so-bat-tu/xem-vat-pham-cai-van' },
      { title: 'Tìm ngày sinh theo tứ trụ', href: '/la-so-bat-tu/tim-ngay-sinh-theo-tu-tru' },
    ],
  },
  {
    title: 'Lá số tử vi',
    href: '/la-so-tu-vi',
    children: [
      { title: 'Xem sao hạn', href: '/la-so-tu-vi/xem-sao-han' },
      { title: 'Lịch âm dương', href: '/la-so-tu-vi/lich-am-duong' },
      { title: 'Đổi lịch âm dương', href: '/la-so-tu-vi/doi-lich-am-duong' },
    ],
  },
  {
    title: 'Quẻ dịch',
    href: '/que-dich',
    children: [
      { title: 'Lục hào', href: '/que-dich/luc-hao' },
      { title: 'Ngẫu nhiên', href: '/que-dich/ngau-nhien' },
      { title: 'Số điện thoại', href: '/que-dich/so-dien-thoai' },
    ],
  },
  {
    title: 'Phong thủy',
    href: '/phong-thuy',
    children: [
      { title: 'Bát trạch', href: '/phong-thuy/bat-trach' },
      { title: 'Bát trạch cho 8 cung', href: '/phong-thuy/bat-trach-cho-8-cung' },
      { title: 'Bát trạch 24 sơn hướng', href: '/phong-thuy/bat-trach-24-son-huong' },
    ],
  },
  {
    title: 'Vật phẩm',
    href: '/vat-pham',
    children: [
      { title: 'Vật phẩm phong thủy', href: '/vat-pham' },
      { title: 'Vật phẩm cải vận Bát Tự', href: '/la-so-bat-tu/xem-vat-pham-cai-van' },
    ],
  },
  {
    title: 'Tài khoản Premium',
    href: '/tai-khoan-premium',
  },
  {
    title: 'Liên hệ',
    href: '/lien-he',
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="w-full bg-[#27303f] text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-site mx-auto flex items-center justify-between px-4">
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-1">
          <Link
            href="/"
            className="p-3 hover:bg-[#1a222e] transition text-[#c8860a]"
            title="Trang chủ"
          >
            <Home className="w-4 h-4" />
          </Link>

          {MENU_ITEMS.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            return (
              <div
                key={item.title}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.title)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="px-3.5 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-[#1a222e] transition flex items-center space-x-1"
                >
                  <span>{item.title}</span>
                  {hasChildren && <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
                </Link>

                {hasChildren && activeDropdown === item.title && (
                  <div className="absolute left-0 top-full bg-white text-gray-800 shadow-xl rounded-b border-t-2 border-[#c8860a] min-w-[210px] py-1 z-50">
                    {item.children?.map((child) => (
                      <Link
                        key={child.title}
                        href={child.href}
                        className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-[#c8860a] transition"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center py-2.5">
          <Link href="/" className="p-1 text-[#c8860a] mr-3">
            <Home className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-200 hover:text-white p-1"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1f2937] border-t border-gray-700 px-4 py-3 space-y-2 text-sm">
          {MENU_ITEMS.map((item) => (
            <div key={item.title} className="border-b border-gray-700/60 pb-2">
              <Link
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 font-semibold text-white uppercase text-xs tracking-wider"
              >
                {item.title}
              </Link>
              {item.children && (
                <div className="pl-4 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.title}
                      href={child.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 text-xs text-gray-300 hover:text-[#c8860a]"
                    >
                      • {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
