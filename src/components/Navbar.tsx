'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ChevronDown } from 'lucide-react';

export interface MenuItem {
  title: string;
  href: string;
  children?: Array<{ title: string; href: string }>;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Lá số bát tự',
    href: '/la-so-bat-tu',
    children: [
      { title: 'Bát Tự thực nghiệm', href: '/la-so-bat-tu/thuc-nghiem' },
      { title: 'Xem thời vận', href: '/la-so-bat-tu/xem-thoi-van' },
      { title: 'Xem vật phẩm cải vận', href: '/la-so-bat-tu/xem-vat-pham-cai-van' },
      { title: 'Tìm ngày sinh theo tứ trụ', href: '/la-so-bat-tu/tim-ngay-sinh-theo-tu-tru' },
    ],
  },
  {
    title: 'Lá số Tử Vi',
    href: '/la-so-tu-vi',
  },
  {
    title: 'Lịch Âm Dương',
    href: '/la-so-tu-vi/lich-am-duong',
    children: [
      { title: 'Lịch âm dương', href: '/la-so-tu-vi/lich-am-duong' },
      { title: 'Đổi lịch âm dương', href: '/la-so-tu-vi/doi-lich-am-duong' },
      { title: 'Lịch ngày tốt xấu', href: '/lich-ngay-tot-xau' },
    ],
  },
  {
    title: 'Quẻ dịch',
    href: '/que-dich',
    children: [
      { title: 'Lục hào', href: '/que-dich/luc-hao' },
      { title: 'Ngẫu nhiên', href: '/que-dich/ngau-nhien' },
      { title: 'Số điện thoại', href: '/que-dich/so-dien-thoai' },
      { title: 'Seri tiền', href: '/que-dich/seri-tien' },
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
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isItemActive = (item: MenuItem): boolean => {
    if (!pathname) return false;
    if (item.href === '/') return pathname === '/';
    if (item.href === '/la-so-tu-vi') {
      return pathname === '/la-so-tu-vi' || pathname === '/la-so-tu-vi/xem-sao-han';
    }
    if (item.title === 'Lịch Âm Dương' || item.href === '/la-so-tu-vi/lich-am-duong') {
      return (
        pathname.startsWith('/la-so-tu-vi/lich-am-duong') ||
        pathname.startsWith('/la-so-tu-vi/doi-lich-am-duong') ||
        pathname.startsWith('/lich-ngay-tot-xau') ||
        pathname.startsWith('/lich-am-duong') ||
        pathname.startsWith('/doi-lich-am-duong')
      );
    }
    if (item.href === '/phong-thuy') {
      return pathname.startsWith('/phong-thuy');
    }
    if (item.href === '/que-dich') {
      return pathname.startsWith('/que-dich');
    }
    if (item.href === '/la-so-bat-tu') {
      return pathname.startsWith('/la-so-bat-tu');
    }
    return pathname.startsWith(item.href);
  };

  return (
    <nav ref={navRef} className="hidden lg:block w-full bg-[#27303f] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-site mx-auto flex items-center justify-between px-4">
        {/* Desktop Nav */}
        <div className="flex items-center space-x-0.5">
          <Link
            href="/"
            className={`p-3 transition text-[#c8860a] flex items-center ${
              pathname === '/' ? 'bg-[#1a222e] border-b-2 border-[#c8860a]' : 'hover:bg-[#1a222e]'
            }`}
            title="Trang chủ"
          >
            <Home className="w-4 h-4" />
          </Link>

          {MENU_ITEMS.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const active = isItemActive(item);
            const isOpen = activeDropdown === item.title;

            return (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.title)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={`px-2 xl:px-3 py-3 text-xs xl:text-sm font-semibold uppercase tracking-wide transition flex items-center space-x-1 ${
                      active
                        ? 'text-[#c8860a] bg-[#1a222e] border-b-2 border-[#c8860a]'
                        : 'text-gray-100 hover:bg-[#1a222e] hover:text-[#c8860a]'
                    }`}
                  >
                    <span>{item.title}</span>
                  </Link>

                  {hasChildren && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(isOpen ? null : item.title);
                      }}
                      className={`py-3 pr-2 pl-0.5 text-gray-300 hover:text-[#c8860a] transition ${
                        active ? 'bg-[#1a222e]' : ''
                      }`}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      title={`Mở rộng ${item.title}`}
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-150 ${
                          isOpen ? 'rotate-180 text-[#c8860a]' : 'opacity-70'
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Dropdown Menu */}
                {hasChildren && isOpen && (
                  <div
                    className="absolute left-0 top-full bg-white text-gray-800 shadow-2xl rounded-b border-t-2 border-[#c8860a] min-w-[220px] py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-100"
                    role="menu"
                  >
                    {item.children?.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.title}
                          href={child.href}
                          role="menuitem"
                          onClick={() => setActiveDropdown(null)}
                          className={`block px-4 py-2 text-xs font-medium transition ${
                            isChildActive
                              ? 'bg-amber-50 text-[#c8860a] font-bold border-l-2 border-[#c8860a]'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-[#c8860a]'
                          }`}
                        >
                          {child.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
