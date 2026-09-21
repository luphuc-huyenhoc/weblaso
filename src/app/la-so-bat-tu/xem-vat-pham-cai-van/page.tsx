'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingBag, Filter, CheckCircle2 } from 'lucide-react';

interface Item {
  id: string;
  name: string;
  slug: string;
  category: string;
  element: string;
  description: string;
  price: number;
  imageUrl?: string | null;
}

const ELEMENTS = [
  { name: 'Tất cả', value: '' },
  { name: 'Hành Kim', value: 'Kim', color: 'bg-amber-100 text-amber-800' },
  { name: 'Hành Mộc', value: 'Mộc', color: 'bg-emerald-100 text-emerald-800' },
  { name: 'Hành Thủy', value: 'Thủy', color: 'bg-blue-100 text-blue-800' },
  { name: 'Hành Hỏa', value: 'Hỏa', color: 'bg-red-100 text-red-800' },
  { name: 'Hành Thổ', value: 'Thổ', color: 'bg-yellow-100 text-yellow-800' },
];

export default function XemVatPhamCaiVanPage() {
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Quick Bazi Form to detect Useful God
  const [calcDay, setCalcDay] = useState<number>(15);
  const [calcMonth, setCalcMonth] = useState<number>(8);
  const [calcYear, setCalcYear] = useState<number>(1990);
  const [calcHour, setCalcHour] = useState<number>(10);
  const [calculatedGod, setCalculatedGod] = useState<{ useful: string; favorable: string } | null>(null);

  const fetchItems = async (elem: string) => {
    setLoading(true);
    try {
      const url = elem ? `/api/items?element=${elem}` : '/api/items';
      const res = await fetch(url);
      const json = await res.json();
      if (res.ok) {
        setItems(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(selectedElement);
  }, [selectedElement]);

  const handleDetectUsefulGod = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bazi/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'Khách',
          gender: true,
          day: calcDay,
          month: calcMonth,
          year: calcYear,
          hour: calcHour,
          minute: 0,
        }),
      });
      const data = await res.json();
      if (res.ok && data.calculation) {
        setCalculatedGod({
          useful: data.calculation.usefulGod,
          favorable: data.calculation.favorableGod,
        });
        setSelectedElement(data.calculation.usefulGod);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs text-center">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
          Vật Phẩm Phong Thủy Bổ Khuyết Cải Vận Theo Bát Tự
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
          Chọn vật phẩm đá quý phong thủy chính tông phù hợp với Dụng Thần và Hỷ Thần của bản mệnh để cân bằng ngũ hành, kích hoạt may mắn và chiêu tài lộc.
        </p>
      </div>

      {/* Useful God Detector widget */}
      <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-6 shadow-xs">
        <h3 className="text-sm font-bold text-amber-950 uppercase flex items-center space-x-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#c8860a]" />
          <span>Tra Cứu Nhanh Dụng Thần Để Chọn Vật Phẩm Cải Vận</span>
        </h3>
        <form onSubmit={handleDetectUsefulGod} className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end text-xs">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Ngày sinh</label>
            <input
              type="number"
              min={1}
              max={31}
              value={calcDay}
              onChange={(e) => setCalcDay(parseInt(e.target.value, 10))}
              className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Tháng sinh</label>
            <input
              type="number"
              min={1}
              max={12}
              value={calcMonth}
              onChange={(e) => setCalcMonth(parseInt(e.target.value, 10))}
              className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Năm sinh</label>
            <input
              type="number"
              min={1920}
              max={2040}
              value={calcYear}
              onChange={(e) => setCalcYear(parseInt(e.target.value, 10))}
              className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Giờ sinh</label>
            <input
              type="number"
              min={0}
              max={23}
              value={calcHour}
              onChange={(e) => setCalcHour(parseInt(e.target.value, 10))}
              className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-[#c8860a] hover:bg-amber-700 text-white font-bold py-2 px-3 rounded uppercase text-xs transition"
            >
              Tìm Dụng Thần
            </button>
          </div>
        </form>

        {calculatedGod && (
          <div className="mt-4 p-3 bg-white border border-amber-200 rounded flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Dụng thần bản mệnh của bạn là: <strong className="text-amber-800 uppercase font-extrabold">{calculatedGod.useful}</strong> (Hỷ thần: {calculatedGod.favorable})
              </span>
            </div>
            <span className="text-gray-500 italic">Hệ thống đã tự động lọc vật phẩm phù hợp nhất bên dưới!</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        <div className="flex items-center text-xs text-gray-500 mr-2 font-medium">
          <Filter className="w-3.5 h-3.5 mr-1" />
          Lọc theo ngũ hành:
        </div>
        {ELEMENTS.map((elem) => (
          <button
            key={elem.value}
            onClick={() => setSelectedElement(elem.value)}
            className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition ${
              selectedElement === elem.value
                ? 'bg-[#c8860a] text-white shadow-2xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {elem.name}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 text-sm">Đang tải danh mục vật phẩm...</div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center text-gray-500 text-sm bg-white border border-gray-200 rounded-lg">
          Không có vật phẩm nào phù hợp với bộ lọc hiện tại.
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
                <h4 className="font-bold text-gray-900 text-sm hover:text-[#c8860a] transition line-clamp-2">
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
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#c8860a] hover:bg-amber-700 text-white text-xs font-semibold rounded shadow-2xs transition"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
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
