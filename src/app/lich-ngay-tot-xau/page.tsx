'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  calculateAlmanacDay,
  searchGoodDaysForPurpose,
  ActivityPurpose,
  AlmanacDaySummary,
  DayQuality,
} from '@/domain/almanac';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';

const PURPOSES: ActivityPurpose[] = [
  'Cưới hỏi',
  'Khai trương',
  'Động thổ',
  'Nhập trạch',
  'Mua nhà',
  'Sửa nhà',
  'Xuất hành',
  'Ký hợp đồng',
  'Mua xe',
  'An táng',
  'Cầu tài',
];

export default function LichNgayTotXauPage() {
  const today = new Date();
  const [activeTab, setActiveTab] = useState<'month' | 'purpose'>('month');

  // Month navigation state
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [qualityFilter, setQualityFilter] = useState<'ALL' | DayQuality>('ALL');

  // Purpose search state
  const [selectedPurpose, setSelectedPurpose] = useState<ActivityPurpose>('Cưới hỏi');
  const [searchFromDate, setSearchFromDate] = useState<string>(
    today.toISOString().split('T')[0]
  );
  // Default 30 days later
  const defaultToDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  const [searchToDate, setSearchToDate] = useState<string>(defaultToDate);
  const [purposeResults, setPurposeResults] = useState<
    Array<AlmanacDaySummary & { matchedReasons: string[] }> | null
  >(null);

  // Compute all days in current month
  const monthDays = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const days: AlmanacDaySummary[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(calculateAlmanacDay(currentYear, currentMonth, d));
    }
    return days;
  }, [currentYear, currentMonth]);

  // Filtered month days
  const filteredDays = useMemo(() => {
    if (qualityFilter === 'ALL') return monthDays;
    return monthDays.filter((d) => d.dayQuality === qualityFilter);
  }, [monthDays, qualityFilter]);

  const countTot = monthDays.filter((d) => d.dayQuality === 'TỐT').length;
  const countXau = monthDays.filter((d) => d.dayQuality === 'XẤU').length;
  const countThuong = monthDays.filter((d) => d.dayQuality === 'THƯỜNG').length;

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    setCurrentMonth(today.getMonth() + 1);
    setCurrentYear(today.getFullYear());
  };

  const handleSearchPurpose = (e: React.FormEvent) => {
    e.preventDefault();
    const [fromY, fromM, fromD] = searchFromDate.split('-').map(Number);
    const [toY, toM, toD] = searchToDate.split('-').map(Number);

    const res = searchGoodDaysForPurpose(
      { year: fromY, month: fromM, day: fromD },
      { year: toY, month: toM, day: toD },
      selectedPurpose
    );
    setPurposeResults(res);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs text-center">
        <span className="text-[11px] uppercase font-bold tracking-widest px-3 py-1 bg-amber-50 text-[#c8860a] border border-amber-200 rounded-full">
          Hiệp Kỷ Biện Phương Thư • Lịch Vạn Sự
        </span>
        <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-wide mt-3">
          Lịch Ngày Tốt Xấu & Tra Cứu Ngày Cát Lợi
        </h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1.5 max-w-2xl mx-auto leading-relaxed">
          Phân định chính xác Ngày Hoàng Đạo, Trực ngày, Giờ tốt và kiêng kỵ theo thuật trạch cát chính tông. Chọn ngày giờ lành khởi tạo vạn sự đại cát.
        </p>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-lg p-2 gap-2 shadow-xs">
        <button
          onClick={() => setActiveTab('month')}
          className={`flex-1 py-3 text-xs md:text-sm font-extrabold rounded-md transition flex items-center justify-center space-x-2 ${
            activeTab === 'month'
              ? 'bg-[#c8860a] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>XEM LỊCH THEO THÁNG</span>
        </button>
        <button
          onClick={() => setActiveTab('purpose')}
          className={`flex-1 py-3 text-xs md:text-sm font-extrabold rounded-md transition flex items-center justify-center space-x-2 ${
            activeTab === 'purpose'
              ? 'bg-[#c8860a] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>TÌM NGÀY TỐT THEO MỤC ĐÍCH</span>
        </button>
      </div>

      {/* TAB 1: MONTH VIEW */}
      {activeTab === 'month' && (
        <div className="space-y-6">
          {/* Navigation Bar */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 border border-gray-200 rounded-md hover:bg-gray-100 text-gray-700 transition"
                title="Tháng trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-base md:text-lg font-black text-gray-900 px-3 tracking-wide uppercase">
                THÁNG {currentMonth < 10 ? `0${currentMonth}` : currentMonth} / {currentYear}
              </div>

              <button
                onClick={handleNextMonth}
                className="p-2 border border-gray-200 rounded-md hover:bg-gray-100 text-gray-700 transition"
                title="Tháng sau"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleGoToday}
                className="px-3 py-1.5 border border-amber-300 bg-amber-50 text-[#c8860a] hover:bg-amber-100 rounded-md text-xs font-bold transition"
              >
                Hôm Nay
              </button>
            </div>

            {/* Quality Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setQualityFilter('ALL')}
                className={`px-3 py-1.5 rounded-md font-bold transition ${
                  qualityFilter === 'ALL'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất cả ({monthDays.length})
              </button>
              <button
                onClick={() => setQualityFilter('TỐT')}
                className={`px-3 py-1.5 rounded-md font-bold transition flex items-center space-x-1 ${
                  qualityFilter === 'TỐT'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span>🟢 Ngày Tốt ({countTot})</span>
              </button>
              <button
                onClick={() => setQualityFilter('THƯỜNG')}
                className={`px-3 py-1.5 rounded-md font-bold transition flex items-center space-x-1 ${
                  qualityFilter === 'THƯỜNG'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span>🟡 Ngày Thường ({countThuong})</span>
              </button>
              <button
                onClick={() => setQualityFilter('XẤU')}
                className={`px-3 py-1.5 rounded-md font-bold transition flex items-center space-x-1 ${
                  qualityFilter === 'XẤU'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
                }`}
              >
                <span>🔴 Ngày Xấu ({countXau})</span>
              </button>
            </div>
          </div>

          {/* Day Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDays.map((d) => {
              const isToday =
                d.day === today.getDate() &&
                d.month === today.getMonth() + 1 &&
                d.year === today.getFullYear();

              return (
                <div
                  key={d.solarDateStr}
                  className={`bg-white rounded-lg border p-4 shadow-xs transition hover:shadow-md flex flex-col justify-between space-y-3 ${
                    isToday
                      ? 'ring-2 ring-[#c8860a] border-[#c8860a]'
                      : 'border-gray-200'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between border-b pb-2.5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-black text-gray-900">
                          {d.dayOfWeek}
                        </span>
                        {isToday && (
                          <span className="bg-amber-100 text-[#c8860a] text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                            HÔM NAY
                          </span>
                        )}
                      </div>
                      <div className="text-xl font-black text-[#c8860a]">
                        {d.day < 10 ? `0${d.day}` : d.day}/{d.month < 10 ? `0${d.month}` : d.month}/{d.year}
                      </div>
                    </div>

                    {/* Badge Quality */}
                    <div>
                      {d.dayQuality === 'TỐT' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-black rounded-full shadow-2xs">
                          <span>●</span>
                          <span>NGÀY TỐT</span>
                        </span>
                      ) : d.dayQuality === 'XẤU' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-red-600 text-white text-[11px] font-black rounded-full shadow-2xs">
                          <span>●</span>
                          <span>NGÀY XẤU</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-500 text-white text-[11px] font-black rounded-full shadow-2xs">
                          <span>●</span>
                          <span>BÌNH THƯỜNG</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Lunar & Can Chi Details */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Âm lịch:</span>
                      <strong className="text-gray-900 text-sm">
                        Ngày {d.lunarDay}/{d.lunarMonth}
                        {d.isLeapMonth ? ' (nhuận)' : ''}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>Can chi ngày:</span>
                      <strong className="text-gray-900">{d.canChiDay}</strong>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>Hoàng / Hắc Đạo:</span>
                      <span
                        className={`font-bold ${
                          d.isHoangDao ? 'text-emerald-700' : 'text-red-700'
                        }`}
                      >
                        {d.hoangDaoType} ({d.hoangDaoDeity})
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <span>Trực ngày:</span>
                      <span className="font-semibold text-gray-900">
                        Trực {d.truc} ({d.trucQuality})
                      </span>
                    </div>

                    {d.specialDays.length > 0 && (
                      <div className="pt-1">
                        <span className="inline-block bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded">
                          {d.specialDays.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Zodiac Hours Preview */}
                  <div className="pt-2 border-t text-[11px]">
                    <span className="text-gray-500 block mb-1">Giờ tốt hoàng đạo:</span>
                    <div className="flex flex-wrap gap-1">
                      {d.goodHourBranches.slice(0, 4).map((b) => (
                        <span
                          key={b}
                          className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded font-medium text-[10px]"
                        >
                          {b}
                        </span>
                      ))}
                      {d.goodHourBranches.length > 4 && (
                        <span className="text-gray-400 text-[10px] self-center">
                          +{d.goodHourBranches.length - 4} giờ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Link to detail */}
                  <div className="pt-2">
                    <Link
                      href={`/lich-ngay-tot-xau/${d.solarDateStr}`}
                      className="w-full inline-flex items-center justify-center space-x-1.5 py-2 bg-amber-50 hover:bg-[#c8860a] hover:text-white text-[#c8860a] border border-amber-200 rounded font-extrabold text-xs uppercase tracking-wide transition shadow-2xs"
                    >
                      <span>XEM CHI TIẾT NGÀY</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PURPOSE SEARCH */}
      {activeTab === 'purpose' && (
        <div className="space-y-6">
          {/* Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-xs max-w-3xl mx-auto">
            <form onSubmit={handleSearchPurpose} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Purpose Selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Công việc / Mục đích
                  </label>
                  <select
                    value={selectedPurpose}
                    onChange={(e) => setSelectedPurpose(e.target.value as ActivityPurpose)}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm font-bold text-gray-800 focus:border-[#c8860a]"
                  >
                    {PURPOSES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* From Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={searchFromDate}
                    onChange={(e) => setSearchFromDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:border-[#c8860a]"
                  />
                </div>

                {/* To Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={searchToDate}
                    onChange={(e) => setSearchToDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:border-[#c8860a]"
                  />
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 bg-[#c8860a] hover:bg-amber-700 text-white font-extrabold px-8 py-2.5 rounded shadow uppercase tracking-wider text-xs transition active:scale-98"
                >
                  <Search className="w-4 h-4" />
                  <span>TÌM NGÀY ĐẠI CÁT</span>
                </button>
              </div>
            </form>
          </div>

          {/* Purpose Results List */}
          {purposeResults && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-base font-extrabold text-gray-900 uppercase">
                  Kết Quả Tìm Ngày Tốt Cho Việc: <span className="text-[#c8860a]">{selectedPurpose}</span>
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Tìm thấy {purposeResults.length} ngày cát lợi
                </span>
              </div>

              {purposeResults.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500 text-sm">
                  Không tìm thấy ngày cát lợi trong khoảng thời gian đã chọn. Vui lòng mở rộng phạm vi tìm kiếm.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {purposeResults.map((item) => (
                    <div
                      key={item.solarDateStr}
                      className="bg-white border border-emerald-200 rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-emerald-950">
                            {item.dayOfWeek}, Ngày {item.day}/{item.month}/{item.year}
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded uppercase">
                            {item.dayQuality}
                          </span>
                        </div>

                        <div className="text-xs text-gray-600 flex items-center space-x-3">
                          <span>
                            Âm lịch: <strong>{item.lunarDay}/{item.lunarMonth}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Can chi: <strong>{item.canChiDay}</strong>
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">
                            {item.hoangDaoDeity}
                          </span>
                        </div>

                        <div className="bg-emerald-50/60 p-3 rounded border border-emerald-100 text-xs space-y-1">
                          <span className="font-bold text-emerald-900 block text-[11px] uppercase">
                            Lý do đắc cát:
                          </span>
                          {item.matchedReasons.map((reason, idx) => (
                            <div
                              key={idx}
                              className="text-emerald-900 text-xs flex items-start space-x-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link
                          href={`/lich-ngay-tot-xau/${item.solarDateStr}`}
                          className="w-full inline-flex items-center justify-center space-x-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs uppercase tracking-wide transition shadow-2xs"
                        >
                          <span>XEM TOÀN BỘ GIỜ TỐT & HƯỚNG XUẤT HÀNH</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Traditional Disclaimer */}
      <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-4 text-center text-xs text-amber-900/80 space-y-1">
        <p className="font-semibold">LƯU Ý TRUYỀN THỐNG</p>
        <p className="text-[11px] leading-relaxed">
          Phép trạch cát tuyển trạch ngày lành cần kết hợp hài hòa giữa Thiên Thời (Trực, Thần Sát của ngày), Địa Lợi (Phương vị xuất hành, tọa hướng công trình) và Nhân Hòa (Bản mệnh gia chủ, tránh xung khắc tuổi).
        </p>
      </div>
    </div>
  );
}
