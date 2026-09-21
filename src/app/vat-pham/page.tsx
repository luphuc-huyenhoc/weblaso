'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Filter, Sparkles, PhoneCall } from 'lucide-react';

interface Item {
  id: string;
  name: string;
  slug: string;
  category: string;
  element: string;
  description: string;
  price: number;
}

const ELEMENTS = [
  { name: 'Tất cả ngũ hành', value: '' },
  { name: 'Kim', value: 'Kim' },
  { name: 'Mộc', value: 'Mộc' },
  { name: 'Thủy', value: 'Thủy' },
  { name: 'Hỏa', value: 'Hỏa' },
  { name: 'Thổ', value: 'Thổ' },
];

export default function VatPhamCatalogPage() {
  const [selectedElement, setSelectedElement] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const url = selectedElement ? `/api/items?element=${selectedElement}` : '/api/items';
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setItems(data.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [selectedElement]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs text-center">
        <span className="text-xs uppercase font-extrabold tracking-widest px-3 py-1 bg-amber-50 text-[#c8860a] border border-amber-200 rounded-full">
          Pháp Bảo Phong Thủy & Đá Quý Tự Nhiên
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 uppercase mt-4">
          Danh Mục Vật Phẩm Cải Vận Chiêu Tài
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Tất cả vật phẩm phong thủy được chế tác từ đá tự nhiên, đã được tẩy uế và trì chú năng lượng tương sinh theo Dụng Thần bản mệnh.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {ELEMENTS.map((el) => (
            <button
              key={el.value}
              onClick={() => setSelectedElement(el.value)}
              className={`text-xs px-4 py-2 rounded-full font-bold transition ${
                selectedElement === el.value
                  ? 'bg-[#c8860a] text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {el.name}
            </button>
          ))}
        </div>

        <Link
          href="/la-so-bat-tu/xem-vat-pham-cai-van"
          className="inline-flex items-center space-x-1.5 text-xs text-[#c8860a] font-bold hover:underline"
        >
          <Sparkles className="w-4 h-4" />
          <span>Tìm vật phẩm theo Dụng Thần Bát Tự →</span>
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 text-sm">Đang tải danh mục vật phẩm...</div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center text-gray-500 text-sm bg-white border border-gray-200 rounded-lg">
          Không có vật phẩm nào cho bộ lọc này.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-[#c8860a] border border-amber-200">
                    Hành {item.element}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm line-clamp-2">
                  {item.name}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400">Giá tham khảo:</div>
                  <div className="font-extrabold text-[#c8860a] text-sm">
                    {item.price.toLocaleString('vi-VN')} đ
                  </div>
                </div>
                <Link
                  href="/lien-he"
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#c8860a] hover:bg-amber-700 text-white text-xs font-bold rounded shadow-2xs transition"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Tư vấn</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
