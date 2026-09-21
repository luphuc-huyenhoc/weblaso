'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Compass, BookOpen, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || searchParams.get('s') || '';
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any | null>(null);

  const performSearch = async (term: string) => {
    if (!term.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (res.ok) {
        setResults(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Search Bar Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs text-center space-y-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase">
          Tìm Kiếm Toàn Diện Hệ Thống
        </h1>
        <p className="text-xs text-gray-500 max-w-xl mx-auto">
          Tra cứu công cụ lập lá số Bát Tự, Tử Vi, Quẻ Dịch, bài viết phong thủy và danh mục vật phẩm cải vận.
        </p>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập từ khóa tìm kiếm (ví dụ: Bát tự, Sao hạn, Đồng xu, Thạch anh...)"
            className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg text-sm focus:border-[#c8860a] shadow-xs"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3" />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-1.5 px-4 py-2 bg-[#c8860a] hover:bg-amber-700 text-white text-xs font-bold uppercase rounded-md transition"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tìm'}
          </button>
        </form>
      </div>

      {/* Search Results */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 text-sm flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#c8860a]" />
          <span>Đang tìm kiếm kết quả...</span>
        </div>
      ) : results !== null ? (
        <div className="space-y-8">
          <div className="text-xs text-gray-500 font-medium">
            Tìm thấy <strong>{results.totalMatches}</strong> kết quả phù hợp cho từ khóa "{results.query}".
          </div>

          {/* Tools & Calculation Modules */}
          {results.tools.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-sm uppercase flex items-center space-x-2">
                <Compass className="w-4 h-4 text-[#c8860a]" />
                <span>Công Cụ Lập Lá Số & Dự Đoán ({results.tools.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.tools.map((t: any) => (
                  <Link
                    key={t.url}
                    href={t.url}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-[#c8860a] transition shadow-xs flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#c8860a] transition">
                        {t.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{t.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#c8860a] transition shrink-0 ml-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Feng Shui Items */}
          {results.items.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-sm uppercase flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>Vật Phẩm Phong Thủy ({results.items.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.items.map((item: any) => (
                  <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-xs space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-[#c8860a]">
                      Hành {item.element}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                    <div className="text-xs font-bold text-[#c8860a] pt-1">
                      {item.price.toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Articles */}
          {results.articles.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-sm uppercase flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Kiến Thức & Bài Viết ({results.articles.length})</span>
              </h3>
              <div className="space-y-3">
                {results.articles.map((art: any) => (
                  <div key={art.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-xs space-y-1">
                    <h4 className="font-bold text-gray-900 text-sm">{art.title}</h4>
                    <p className="text-xs text-gray-600">{art.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.totalMatches === 0 && (
            <div className="p-12 text-center text-gray-500 text-sm bg-white border border-gray-200 rounded-lg">
              Không tìm thấy kết quả nào phù hợp với từ khóa "{results.query}". Vui lòng thử từ khóa khác.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 text-sm">Đang tải...</div>}>
      <SearchContent />
    </Suspense>
  );
}
