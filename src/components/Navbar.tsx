'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});

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
        setMobileMenuOpen(false);
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
      return pathname.startsWith('/la-so-tu-vi') || pathname.startsWith('/lich-ngay-tot-xau');
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

  const toggleMobileSubmenu = (title: string) => {
    setMobileExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <nav ref={navRef} className="w-full bg-[#27303f] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-site mx-auto flex items-center justify-between px-4">
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-0.5">
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
                    className={`px-3 py-3 text-xs xl:text-sm font-semibold uppercase tracking-wide transition flex items-center space-x-1 ${
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

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center py-2.5">
          <Link href="/" className="p-1 text-[#c8860a] mr-2" title="Trang chủ">
            <Home className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center space-x-1.5 text-gray-200 hover:text-white px-2 py-1 bg-gray-800/80 rounded border border-gray-700/60 focus:outline-none text-xs"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-[#c8860a]" /> : <Menu className="w-4 h-4 text-[#c8860a]" />}
            <span className="font-semibold text-gray-200">Danh mục</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Quick Links Bar */}
      <div className="lg:hidden flex items-center space-x-2 overflow-x-auto py-2 px-3 text-xs whitespace-nowrap bg-[#1e2633] border-t border-gray-700/50 scrollbar-none">
        <Link
          href="/la-so-bat-tu"
          className={`px-3 py-1 rounded-full font-medium transition ${
            pathname === '/' || pathname?.startsWith('/la-so-bat-tu')
              ? 'bg-[#c8860a] text-white font-bold'
              : 'bg-gray-800/80 text-gray-300 hover:text-white'
          }`}
        >
          Bát Tự Lữ Phúc
        </Link>
        <Link
          href="/la-so-tu-vi"
          className={`px-3 py-1 rounded-full font-medium transition ${
            pathname?.startsWith('/la-so-tu-vi')
              ? 'bg-[#c8860a] text-white font-bold'
              : 'bg-gray-800/80 text-gray-300 hover:text-white'
          }`}
        >
          Tử Vi
        </Link>
        <Link
          href="/que-dich/luc-hao"
          className={`px-3 py-1 rounded-full font-medium transition ${
            pathname?.startsWith('/que-dich')
              ? 'bg-[#c8860a] text-white font-bold'
              : 'bg-gray-800/80 text-gray-300 hover:text-white'
          }`}
        >
          Lục Hào
        </Link>
        <Link
          href="/phong-thuy/bat-trach"
          className={`px-3 py-1 rounded-full font-medium transition ${
            pathname?.startsWith('/phong-thuy')
              ? 'bg-[#c8860a] text-white font-bold'
              : 'bg-gray-800/80 text-gray-300 hover:text-white'
          }`}
        >
          Phong Thủy
        </Link>
        <Link
          href="/lien-he"
          className={`px-3 py-1 rounded-full font-medium transition ${
            pathname === '/lien-he'
              ? 'bg-[#c8860a] text-white font-bold'
              : 'bg-gray-800/80 text-gray-300 hover:text-white'
          }`}
        >
          Liên Hệ
        </Link>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1f2937] border-t border-gray-700 px-4 py-3 space-y-2 text-sm max-h-[80vh] overflow-y-auto z-50">
          {MENU_ITEMS.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const active = isItemActive(item);
            const isExpanded = !!mobileExpanded[item.title];

            return (
              <div key={item.title} className="border-b border-gray-700/60 pb-2">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-1.5 font-bold uppercase text-xs tracking-wider transition ${
                      active ? 'text-[#c8860a]' : 'text-white hover:text-[#c8860a]'
                    }`}
                  >
                    {item.title}
                  </Link>

                  {hasChildren && (
                    <button
                      type="button"
                      onClick={() => toggleMobileSubmenu(item.title)}
                      className="p-1 text-gray-400 hover:text-white"
                      title="Mở menu con"
                    >
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-150 ${
                          isExpanded ? 'rotate-90 text-[#c8860a]' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <div className="pl-4 mt-1 space-y-1 bg-[#18202d] py-1.5 rounded">
                    {item.children?.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.title}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block py-1 px-2 text-xs transition rounded ${
                            isChildActive
                              ? 'text-[#c8860a] font-bold bg-[#131b26]'
                              : 'text-gray-300 hover:text-[#c8860a]'
                          }`}
                        >
                          • {child.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}
