'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bookmark, Trash2, ExternalLink, Calendar, User, Compass, BookOpen, Sparkles, Filter, Loader2 } from 'lucide-react';

interface SavedChart {
  id: string;
  chartType: 'BAZI' | 'ZIWEI' | 'ICHING_LUCHAO' | 'ICHING_RANDOM' | 'ICHING_PHONE' | 'FENGSHUI';
  title: string;
  personName?: string | null;
  gender?: boolean | null;
  solarDate?: string | null;
  lunarDateStr?: string | null;
  engineVersion: string;
  methodologyVersion: string;
  createdAt: string;
  isFavorite: boolean;
}

const TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  BAZI: { label: 'Bát Tự', icon: Compass, color: 'bg-amber-100 text-amber-800 border-amber-200' },
  ZIWEI: { label: 'Tử Vi', icon: Sparkles, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  ICHING_LUCHAO: { label: 'Quẻ Lục Hào', icon: BookOpen, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  ICHING_RANDOM: { label: 'Quẻ Đồng Xu', icon: BookOpen, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  ICHING_PHONE: { label: 'Quẻ Sim', icon: BookOpen, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  FENGSHUI: { label: 'Phong Thủy', icon: User, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
};

export default function LaSoDaLuuPage() {
  const router = useRouter();
  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCharts = async (type?: string) => {
    setLoading(true);
    try {
      const url = type ? `/api/charts?type=${type}` : '/api/charts';
      const res = await fetch(url);
      if (res.status === 401) {
        router.push('/tai-khoan/dang-nhap');
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setCharts(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharts(selectedType);
  }, [selectedType]);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa lá số này khỏi danh sách đã lưu?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/charts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCharts((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert('Xóa lá số thất bại');
      }
    } catch (e) {
      alert('Lỗi kết nối khi xóa');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">
            Kho Lưu Trữ Lá Số Bản Mệnh
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Quản lý các lá số Bát Tự, Tử Vi, Quẻ Dịch và Phong Thủy Bát Trạch đã lưu trữ trong tài khoản của bạn.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 bg-amber-50 text-[#c8860a] border border-amber-200 rounded-full">
          Tổng cộng: {charts.length} lá số
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setSelectedType('')}
          className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition ${
            selectedType === '' ? 'bg-[#c8860a] text-white shadow-2xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tất cả ({charts.length})
        </button>
        {(['BAZI', 'ZIWEI', 'ICHING_LUCHAO', 'ICHING_RANDOM', 'ICHING_PHONE', 'FENGSHUI'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition ${
              selectedType === type ? 'bg-[#c8860a] text-white shadow-2xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {TYPE_CONFIG[type]?.label || type}
          </button>
        ))}
      </div>

      {/* List / Cards */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 text-sm flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#c8860a]" />
          <span>Đang tải danh sách lá số...</span>
        </div>
      ) : charts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-500 text-sm space-y-3">
          <Bookmark className="w-10 h-10 text-gray-300 mx-auto" />
          <div className="font-bold text-gray-700">Chưa có lá số nào được lưu</div>
          <p className="text-xs max-w-sm mx-auto text-gray-400">
            Hãy lập lá số Bát Tự, Tử Vi hoặc gieo Quẻ Dịch và nhấn nút "Lưu Lá Số" để dễ dàng xem lại bất kỳ lúc nào.
          </p>
          <div className="pt-2">
            <Link
              href="/la-so-bat-tu"
              className="inline-flex items-center space-x-1 px-4 py-2 bg-[#c8860a] hover:bg-amber-700 text-white rounded text-xs font-bold uppercase transition"
            >
              <span>Lập Lá Số Ngay</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {charts.map((item) => {
            const config = TYPE_CONFIG[item.chartType] || TYPE_CONFIG.BAZI;
            const IconComponent = config.icon;

            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base">
                    {item.title}
                  </h3>

                  {item.personName && (
                    <div className="text-xs text-gray-600 flex items-center space-x-3">
                      <span>Đương số: <strong>{item.personName}</strong></span>
                      {item.gender !== undefined && item.gender !== null && (
                        <span>({item.gender ? 'Nam' : 'Nữ'})</span>
                      )}
                    </div>
                  )}

                  {item.lunarDateStr && (
                    <div className="text-xs text-gray-500">
                      Âm lịch: {item.lunarDateStr}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-gray-400 font-mono">
                    Phiên bản engine: v{item.engineVersion}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition"
                      title="Xóa lá số"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
