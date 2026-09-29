'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import {
  calculateBazi,
  calculateLuckCycles,
  calculateAnnualPillars,
  calculateTieuVanPillars,
  calculateMonthlyPillars,
  getTenGod,
  CAN,
  CHI,
  COLORS,
  ELEMENTS,
  NAP_AM,
  safeStorage
} from '@/domain/bazi/empiricalEngine';
import {
  Calendar,
  Clock,
  Download,
  Save,
  FolderOpen,
  Edit3,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
  Search,
  Users,
  Briefcase,
  Heart,
  Activity,
  Compass,
  Shield,
  Bold,
  Italic,
  List,
  Check,
  Settings2
} from 'lucide-react';

export interface NoteTopicItem {
  id: 'menh' | 'nhanMach' | 'suNghiep' | 'tinhCam' | 'sucKhoe' | 'vanTrinh';
  label: string;
  icon: any;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  placeholder: string;
}

export const NOTE_TOPICS: NoteTopicItem[] = [
  {
    id: 'menh',
    label: 'Mệnh',
    icon: Shield,
    color: 'text-purple-600',
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-800',
    placeholder: 'Nhập ghi chú Mệnh...',
  },
  {
    id: 'nhanMach',
    label: 'Nhân Mạch',
    icon: Users,
    color: 'text-blue-600',
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-800',
    placeholder: 'Nhập ghi chú Nhân Mạch...',
  },
  {
    id: 'suNghiep',
    label: 'Sự nghiệp',
    icon: Briefcase,
    color: 'text-emerald-600',
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-800',
    placeholder: 'Nhập ghi chú Sự nghiệp...',
  },
  {
    id: 'tinhCam',
    label: 'Tình cảm',
    icon: Heart,
    color: 'text-rose-600',
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200',
    badgeText: 'text-rose-800',
    placeholder: 'Nhập ghi chú Tình cảm...',
  },
  {
    id: 'sucKhoe',
    label: 'Sức khoẻ',
    icon: Activity,
    color: 'text-amber-600',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-800',
    placeholder: 'Nhập ghi chú Sức khoẻ...',
  },
  {
    id: 'vanTrinh',
    label: 'Vận trình',
    icon: Compass,
    color: 'text-teal-600',
    badgeBg: 'bg-teal-50',
    badgeBorder: 'border-teal-200',
    badgeText: 'text-teal-800',
    placeholder: 'Nhập ghi chú Vận trình...',
  },
];

export const parseChartNotes = (rawNotes?: string): Record<string, string> => {
  const defaultNotes: Record<string, string> = {
    menh: '',
    nhanMach: '',
    suNghiep: '',
    tinhCam: '',
    sucKhoe: '',
    vanTrinh: '',
  };
  if (!rawNotes || !rawNotes.trim()) return defaultNotes;

  try {
    const parsed = JSON.parse(rawNotes);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return {
        menh: String(parsed.menh || ''),
        nhanMach: String(parsed.nhanMach || ''),
        suNghiep: String(parsed.suNghiep || ''),
        tinhCam: String(parsed.tinhCam || ''),
        sucKhoe: String(parsed.sucKhoe || ''),
        vanTrinh: String(parsed.vanTrinh || ''),
      };
    }
  } catch {
    // Continue with structured tags
  }

  const topicMap: Record<string, string> = {
    'mệnh': 'menh',
    'nhân mạch': 'nhanMach',
    'sự nghiệp': 'suNghiep',
    'tình cảm': 'tinhCam',
    'sức khoẻ': 'sucKhoe',
    'sức khỏe': 'sucKhoe',
    'vận trình': 'vanTrinh',
  };

  const lines = rawNotes.split('\n');
  let currentTopic: string | null = null;
  const result: Record<string, string[]> = {
    menh: [],
    nhanMach: [],
    suNghiep: [],
    tinhCam: [],
    sucKhoe: [],
    vanTrinh: [],
  };

  let foundTag = false;
  for (const line of lines) {
    const trimmed = line.trim();
    const match = trimmed.match(/^[【\[](.*?)[】\]]/);
    if (match) {
      const tagContent = match[1].trim().toLowerCase();
      if (topicMap[tagContent]) {
        currentTopic = topicMap[tagContent];
        foundTag = true;
        const rest = trimmed.replace(/^[【\[].*?[】\]]\s*:?/, '').trim();
        if (rest) {
          result[currentTopic].push(rest);
        }
        continue;
      }
    }

    if (currentTopic) {
      result[currentTopic].push(line);
    } else {
      result.menh.push(line);
    }
  }

  if (foundTag) {
    return {
      menh: result.menh.join('\n').trim(),
      nhanMach: result.nhanMach.join('\n').trim(),
      suNghiep: result.suNghiep.join('\n').trim(),
      tinhCam: result.tinhCam.join('\n').trim(),
      sucKhoe: result.sucKhoe.join('\n').trim(),
      vanTrinh: result.vanTrinh.join('\n').trim(),
    };
  }

  defaultNotes.menh = rawNotes.trim();
  return defaultNotes;
};

export const serializeChartNotes = (topics: Record<string, string>): string => {
  const parts: string[] = [];
  const labels: { id: string; label: string }[] = [
    { id: 'menh', label: 'Mệnh' },
    { id: 'nhanMach', label: 'Nhân Mạch' },
    { id: 'suNghiep', label: 'Sự nghiệp' },
    { id: 'tinhCam', label: 'Tình cảm' },
    { id: 'sucKhoe', label: 'Sức khoẻ' },
    { id: 'vanTrinh', label: 'Vận trình' },
  ];

  for (const { id, label } of labels) {
    const val = (topics[id] || '').trim();
    if (val) {
      parts.push(`【${label}】\n${val}`);
    }
  }

  return parts.join('\n\n');
};

export function BaziEmpiricalChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [activeChartMode, setActiveChartMode] = useState<'bazi' | 'tutru'>('bazi'); // 'tutru' is LỮ PHÚC mode

  // Input state
  const [formData, setFormData] = useState({
    name: 'Khách',
    gender: 'female' as 'male' | 'female',
    date: '2003-12-01',
    time: '13:00',
    timezone: 7,
    calendarType: 'solar' as 'solar' | 'lunar',
    isLeapMonth: false,
    yearSelected: 2026,
  });

  const [inputData, setInputData] = useState({ ...formData });

  // Navigation history
  const [chartHistory, setChartHistory] = useState<typeof formData[]>([{ ...formData }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Selected sub-cycles
  const [selectedCycle, setSelectedCycle] = useState<number | null>(null);
  const [selectedAnnualYear, setSelectedAnnualYear] = useState<number | null>(null);

  // Real-time Clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const currentDayOfWeekStr = daysOfWeek[currentTime.getDay()];
  const currentDateFormatted = `${currentTime.getDate().toString().padStart(2, '0')}/${(currentTime.getMonth() + 1).toString().padStart(2, '0')}/${currentTime.getFullYear()}`;
  const currentTimeFormatted = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}`;

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Kho Lưu Trữ Mệnh Bàn state
  const [savedCharts, setSavedCharts] = useState<Array<{
    id: string;
    name: string;
    date: string;
    time: string;
    gender: 'male' | 'female';
    savedAt: string;
    timestamp?: number;
    notes?: string;
    formData: typeof formData;
  }>>(() => {
    try {
      const saved = safeStorage.getItem('bazi_saved_charts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archiveSearchTerm, setArchiveSearchTerm] = useState('');
  const [archiveSortBy, setArchiveSortBy] = useState<'date_desc' | 'date_asc' | 'name_asc' | 'name_desc'>('date_desc');
  const [editingNoteChart, setEditingNoteChart] = useState<{ id: string; name: string; notes: string; date?: string; time?: string } | null>(null);
  const [topicNotes, setTopicNotes] = useState<Record<string, string>>({
    menh: '', nhanMach: '', suNghiep: '', tinhCam: '', sucKhoe: '', vanTrinh: ''
  });
  const [activeNoteTab, setActiveNoteTab] = useState<'all' | 'menh' | 'nhanMach' | 'suNghiep' | 'tinhCam' | 'sucKhoe' | 'vanTrinh'>('all');
  const [noteEditorMode, setNoteEditorMode] = useState<'write' | 'preview'>('write');

  // Customizer Drawer state
  interface EmpiricalDesignConfig {
    chartBgColor: string;
    cardBgColor: string;
    accentColor: string;
    goldBorderColor: string;
    fontFamily: string;
    baziFontSize: number;
    cycleFontSize: number;
  }

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [designConfig, setDesignConfig] = useState<EmpiricalDesignConfig>(() => {
    const saved = safeStorage.getItem('bazi_empirical_design_config');
    const defaults: EmpiricalDesignConfig = {
      chartBgColor: '#ffffff',
      cardBgColor: '#ffffff',
      accentColor: '#d97706',
      goldBorderColor: '#b45309',
      fontFamily: 'Inter',
      baziFontSize: 34,
      cycleFontSize: 16,
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.chartBgColor === '#0f172a') {
          parsed.chartBgColor = '#ffffff';
        }
        return { ...defaults, ...parsed };
      } catch {}
    }
    return defaults;
  });

  const updateDesignConfig = (partial: Partial<EmpiricalDesignConfig>) => {
    setDesignConfig((prev: EmpiricalDesignConfig) => {
      const updated = { ...prev, ...partial };
      safeStorage.setItem('bazi_empirical_design_config', JSON.stringify(updated));
      return updated;
    });
  };

  // Quick Date Picker Dialog state
  const [quickPickerType, setQuickPickerType] = useState<'year' | 'month' | 'day' | 'hour' | null>(null);

  // Synchronize inputs & execute calculation
  const handleAnLaSo = (mode: 'bazi' | 'tutru') => {
    setActiveChartMode(mode);
    setFormData({ ...inputData });
    setChartHistory(prev => {
      const newHistory = [...prev.slice(0, historyIndex + 1), { ...inputData }];
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
    setSelectedCycle(null);
    setSelectedAnnualYear(null);
    showToast(`Đã an lá số ${mode === 'bazi' ? 'BÁT TỰ' : 'LỮ PHÚC'} thành công!`);
  };

  const handlePrevChart = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      const target = chartHistory[prevIdx];
      if (target) {
        setHistoryIndex(prevIdx);
        setFormData({ ...target });
        setInputData({ ...target });
        setSelectedCycle(null);
        setSelectedAnnualYear(null);
      }
    }
  };

  const handleNextChart = () => {
    if (historyIndex < chartHistory.length - 1) {
      const nextIdx = historyIndex + 1;
      const target = chartHistory[nextIdx];
      if (target) {
        setHistoryIndex(nextIdx);
        setFormData({ ...target });
        setInputData({ ...target });
        setSelectedCycle(null);
        setSelectedAnnualYear(null);
      }
    }
  };

  // Base Bazi Calculations
  const baziData = useMemo(() => {
    try {
      const [year, month, day] = formData.date.split('-').map(Number);
      const [hour, minute] = formData.time.split(':').map(Number);
      const isLunar = formData.calendarType === 'lunar';

      const birthDate = new Date(Date.UTC(year, month - 1, day, hour - 7, minute));

      const { pillars, solarDateStr, lunarDateStr } = calculateBazi(
        year, month, day, hour, minute, formData.timezone, formData.gender, isLunar, formData.isLeapMonth
      );

      const { cycles, initiationInfo } = calculateLuckCycles(
        pillars.year.stem, pillars.month.stem, pillars.month.branch,
        formData.gender, birthDate, pillars.day.stem, formData.timezone
      );

      const targetYear = formData.yearSelected || new Date().getFullYear();
      const currentAgeMu = targetYear - year + 1;

      // Find active luck cycle
      let activeLuckIdx = cycles.findIndex((c, i) => {
        const nextAge = cycles[i + 1]?.age || (c.age + 10);
        return currentAgeMu >= c.age && currentAgeMu < nextAge;
      });

      if (activeLuckIdx === -1 && cycles.length > 0) {
        activeLuckIdx = cycles.findIndex((c, i) => {
          const nextYear = cycles[i + 1]?.year || (c.year + 10);
          return targetYear >= c.year && targetYear < nextYear;
        });
      }

      if (activeLuckIdx === -1) {
        activeLuckIdx = 0;
      }

      const activeLuck = selectedCycle !== null ? selectedCycle : activeLuckIdx;
      const luckCycleForAnnuals = cycles[activeLuck] || cycles[0];
      const annualStartYear = luckCycleForAnnuals ? luckCycleForAnnuals.year : year;

      const annuals = calculateAnnualPillars(year, pillars.day.stem, 10, annualStartYear);
      const tieuVans = calculateTieuVanPillars(
        pillars.hour.stem, pillars.hour.branch, pillars.year.stem,
        formData.gender, year, annuals
      );

      const defaultAnnualYear = annuals.some(a => a.year === targetYear)
        ? targetYear
        : (annuals[0]?.year || targetYear);

      const yearToViewMonthly = selectedAnnualYear !== null ? selectedAnnualYear : defaultAnnualYear;
      const monthlyLuck = calculateMonthlyPillars(yearToViewMonthly, formData.timezone);

      return {
        pillars,
        cycles,
        annuals,
        tieuVans,
        monthlyLuck,
        solarDateStr,
        lunarDateStr,
        currentAgeMu,
        activeLuckIdx,
        selectedLuckIdx: activeLuck,
        initiationInfo,
        yearToViewMonthly,
        year,
        month,
        day,
        hour,
        minute
      };
    } catch (e) {
      console.error('Bazi calculation error', e);
      return null;
    }
  }, [formData, selectedCycle, selectedAnnualYear]);

  // Derived metadata for current input date
  const inputDateMetadata = useMemo(() => {
    if (!baziData) return null;
    return {
      y: baziData.year,
      m: baziData.month,
      d: baziData.day,
      yearCanChi: `${baziData.pillars.year.stem} ${baziData.pillars.year.branch}`,
      monthCanChi: `${baziData.pillars.month.stem} ${baziData.pillars.month.branch}`,
      dayCanChi: `${baziData.pillars.day.stem} ${baziData.pillars.day.branch}`,
      hourCanChi: `${baziData.pillars.hour.stem} ${baziData.pillars.hour.branch}`,
      lunarDate: baziData.lunarDateStr
    };
  }, [baziData]);

  // Save current chart to Kho Lưu Trữ
  const saveCurrentChart = () => {
    const rawName = inputData.name?.trim() || formData.name?.trim() || '';
    const chartName = rawName || `Khách - ${inputData.date}`;
    const now = Date.now();
    const currentForm = { ...formData, ...inputData, name: chartName };

    const newChart = {
      id: now.toString(),
      name: chartName,
      date: currentForm.date,
      time: currentForm.time,
      gender: currentForm.gender,
      savedAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      timestamp: now,
      notes: '',
      formData: currentForm
    };

    const filtered = savedCharts.filter(c => c.name !== newChart.name || c.date !== newChart.date);
    const updated = [newChart, ...filtered];
    setSavedCharts(updated);
    safeStorage.setItem('bazi_saved_charts', JSON.stringify(updated));
    showToast(`Đã lưu lá số "${chartName}" vào Kho Lưu Trữ Mệnh Bàn!`);
  };

  const loadSavedChart = (chart: typeof savedCharts[0]) => {
    setFormData({ ...chart.formData });
    setInputData({ ...chart.formData });
    setSelectedCycle(null);
    setSelectedAnnualYear(null);
    setIsArchiveModalOpen(false);
    showToast(`Đã tải lá số "${chart.name}"!`);
  };

  const deleteSavedChart = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = savedCharts.filter(c => c.id !== id);
    setSavedCharts(updated);
    safeStorage.setItem('bazi_saved_charts', JSON.stringify(updated));
    showToast('Đã xóa lá số khỏi kho lưu trữ!');
  };

  const openNoteEditor = (chart: typeof savedCharts[0], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const parsed = parseChartNotes(chart.notes || '');
    setEditingNoteChart({
      id: chart.id,
      name: chart.name,
      notes: chart.notes || '',
      date: chart.date,
      time: chart.time
    });
    setTopicNotes(parsed);
    setActiveNoteTab('all');
    setNoteEditorMode('write');
  };

  const saveChartNotes = () => {
    if (!editingNoteChart) return;
    const serialized = serializeChartNotes(topicNotes);
    const updated = savedCharts.map(c =>
      c.id === editingNoteChart.id ? { ...c, notes: serialized } : c
    );
    setSavedCharts(updated);
    safeStorage.setItem('bazi_saved_charts', JSON.stringify(updated));
    setEditingNoteChart(null);
    showToast('Đã lưu ghi chú lá số thành công!');
  };

  const applyTextFormatting = (topicId: string, format: 'bold' | 'italic' | 'list') => {
    const currentText = topicNotes[topicId] || '';
    let updated = '';
    if (format === 'bold') {
      updated = currentText ? `${currentText} **văn bản đậm**` : '**văn bản đậm**';
    } else if (format === 'italic') {
      updated = currentText ? `${currentText} *văn bản nghiêng*` : '*văn bản nghiêng*';
    } else if (format === 'list') {
      updated = currentText ? `${currentText}\n• ` : '• ';
    }
    setTopicNotes(prev => ({ ...prev, [topicId]: updated }));
  };

  // Image Export function
  const downloadImage = async (format: 'png' | 'jpeg') => {
    if (!chartRef.current) return;
    setIsExporting(true);
    showToast('Đang tạo ảnh chất lượng cao...');

    try {
      const fn = format === 'png' ? toPng : toJpeg;
      const dataUrl = await fn(chartRef.current, {
        pixelRatio: 2.5,
        backgroundColor: designConfig.chartBgColor || '#ffffff',
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `LaSo-BatTu-${formData.name.replace(/\s+/g, '_')}-${formData.date}.${format}`;
      link.href = dataUrl;
      link.click();
      showToast('Tải lá số thành công!');
    } catch (err) {
      console.error('Download error', err);
      showToast('Có lỗi khi tạo ảnh lá số!');
    } finally {
      setIsExporting(false);
    }
  };

  // Helper for Element Color (Optimized for crisp contrast on light theme)
  const getStemBranchColor = (char: string) => {
    const elem = ELEMENTS[char];
    if (elem === 'Mộc') return '#009e49'; // Mộc - Xanh lục đậm, nổi bật
    if (elem === 'Hỏa') return '#dc2626'; // Hỏa - Đỏ cờ rực rỡ, tương phản cao
    if (elem === 'Thổ') return '#b8860b'; // Thổ - Vàng đất hổ phách sang trọng, rõ nét trên nền trắng
    if (elem === 'Kim') return '#52525b'; // Kim - Xám titan chì đậm, sắc sảo trên nền trắng
    if (elem === 'Thủy') return '#1b73f8'; // Thủy - Xanh lam đậm
    return '#334155';
  };

  if (!baziData) return null;

  const isTuTru = activeChartMode === 'tutru';
  const effectiveBaziFontSize = isTuTru
    ? Math.round(designConfig.baziFontSize * 0.92)
    : designConfig.baziFontSize;

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 py-6 px-2 sm:px-4 md:px-6">
      {/* TOAST ALERT */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-lg shadow-xl border border-amber-300 flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP CONTROL BAR (WHITE THEME) */}
      <div className="max-w-[1400px] mx-auto mb-4 bg-slate-50 border border-slate-200/90 rounded-xl p-3 sm:p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Buttons: Presets, Customizer, Archive */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Presets A & B */}
            <button
              type="button"
              onClick={() => showToast('Đã áp dụng cấu hình A!')}
              className="px-3 py-1.5 rounded-full bg-white border border-amber-500/40 text-xs font-black text-amber-900 hover:bg-amber-50 transition shadow-2xs"
              title="Cấu hình Preset A"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => showToast('Đã áp dụng cấu hình B!')}
              className="px-3 py-1.5 rounded-full bg-white border border-amber-500/40 text-xs font-black text-amber-900 hover:bg-amber-50 transition shadow-2xs"
              title="Cấu hình Preset B"
            >
              B
            </button>

            {/* Customizer Button */}
            <button
              type="button"
              onClick={() => setIsCustomizerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-800 transition shadow-2xs"
            >
              <Settings2 className="w-3.5 h-3.5 text-amber-600" />
              <span>BÁT TỰ</span>
            </button>

            {/* Archive / Kho Lưu Trữ */}
            <button
              type="button"
              onClick={() => setIsArchiveModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-800 transition shadow-2xs"
              title="Kho Lưu Trữ Mệnh Bàn"
            >
              <FolderOpen className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">KHO LƯU TRỮ</span>
              <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                {savedCharts.length}
              </span>
            </button>
          </div>

          {/* Right: Live Real-time Clock Pill */}
          <div className="ml-auto">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const y = now.getFullYear();
                const m = (now.getMonth() + 1).toString().padStart(2, '0');
                const d = now.getDate().toString().padStart(2, '0');
                const h = now.getHours().toString().padStart(2, '0');
                const min = now.getMinutes().toString().padStart(2, '0');
                const newDate = `${y}-${m}-${d}`;
                const newTime = `${h}:${min}`;
                setInputData(prev => ({ ...prev, date: newDate, time: newTime }));
                setFormData(prev => ({ ...prev, date: newDate, time: newTime }));
                setSelectedCycle(null);
                setSelectedAnnualYear(null);
                showToast('Đã tự động an lá số theo thời gian thực tế!');
              }}
              title="Nhấp để tự động an lá số theo thời gian thực tế"
              className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-white border border-amber-500/60 shadow-md hover:brightness-110 active:scale-95 transition-all px-3.5 py-1.5 rounded-full flex items-center gap-2.5 text-xs sm:text-[13px] whitespace-nowrap cursor-pointer"
            >
              <span className="font-black text-amber-300">{currentDayOfWeekStr}</span>
              <span className="inline-flex items-center gap-1 text-amber-100 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>{currentDateFormatted}</span>
              </span>
              <div className="inline-flex items-center gap-1.5 font-mono font-bold text-amber-100 bg-black/40 px-2 py-0.5 rounded-full ml-1">
                <Clock className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
                <span>{currentTimeFormatted}</span>
              </div>
            </button>
          </div>
        </div>

        {/* FAST SELECTOR CARDS (Năm - Tháng - Ngày - Giờ - Giới tính) */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2 items-center">
          {/* 1. Năm Card */}
          <div
            onClick={() => setQuickPickerType('year')}
            className="bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-400 p-2 rounded-lg cursor-pointer transition text-center shadow-xs"
          >
            <div className="text-xs sm:text-sm font-black text-slate-800">
              Năm {inputDateMetadata?.y}
            </div>
            <div className="text-[11px] font-bold text-amber-700 mt-0.5">
              {inputDateMetadata?.yearCanChi}
            </div>
          </div>

          {/* 2. Tháng Card */}
          <div
            onClick={() => setQuickPickerType('month')}
            className="bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-400 p-2 rounded-lg cursor-pointer transition text-center shadow-xs"
          >
            <div className="text-xs sm:text-sm font-black text-slate-800">
              Tháng {inputDateMetadata?.m ? inputDateMetadata.m.toString().padStart(2, '0') : ''}
            </div>
            <div className="text-[11px] font-bold text-amber-700 mt-0.5">
              {inputDateMetadata?.monthCanChi}
            </div>
          </div>

          {/* 3. Ngày Card */}
          <div
            onClick={() => setQuickPickerType('day')}
            className="bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-400 p-2 rounded-lg cursor-pointer transition text-center shadow-xs"
          >
            <div className="text-xs sm:text-sm font-black text-slate-800 flex items-center justify-center gap-1">
              <span>Ngày {inputDateMetadata?.d ? inputDateMetadata.d.toString().padStart(2, '0') : ''}</span>
              <Calendar className="w-3 h-3 text-amber-600" />
            </div>
            <div className="text-[11px] font-bold text-amber-700 mt-0.5">
              {inputDateMetadata?.dayCanChi} (Â/{inputDateMetadata?.lunarDate?.split('-')[1]})
            </div>
          </div>

          {/* 4. Giờ Card */}
          <div
            onClick={() => setQuickPickerType('hour')}
            className="bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-400 p-2 rounded-lg cursor-pointer transition text-center shadow-xs"
          >
            <div className="text-xs sm:text-sm font-black text-slate-800">
              {inputData.time}
            </div>
            <div className="text-[11px] font-bold text-amber-700 mt-0.5">
              {inputDateMetadata?.hourCanChi}
            </div>
          </div>

          {/* 5. Giới tính buttons */}
          <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-1.5 h-full">
            <button
              type="button"
              onClick={() => setInputData(prev => ({ ...prev, gender: 'male' }))}
              className={`py-2 rounded-lg font-bold text-xs sm:text-sm transition flex items-center justify-center ${
                inputData.gender === 'male'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400'
              }`}
            >
              Nam
            </button>
            <button
              type="button"
              onClick={() => setInputData(prev => ({ ...prev, gender: 'female' }))}
              className={`py-2 rounded-lg font-bold text-xs sm:text-sm transition flex items-center justify-center ${
                inputData.gender === 'female'
                  ? 'bg-emerald-600 text-white font-black shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-400'
              }`}
            >
              Nữ
            </button>
          </div>
        </div>

        {/* ACTION ROW (Họ tên > Bát Tự > Lữ Phúc > Tải > Lưu > Tiến Lùi) */}
        <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2">
          {/* Name Input */}
          <div className="flex-1 w-full">
            <input
              type="text"
              value={inputData.name}
              onChange={e => setInputData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nhập họ tên người lập lá số..."
              className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm font-bold focus:outline-none focus:border-amber-500 transition shadow-2xs placeholder:text-slate-400"
            />
          </div>

          {/* Action Buttons Group */}
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap w-full sm:w-auto">
            {/* BÁT TỰ */}
            <button
              type="button"
              onClick={() => handleAnLaSo('bazi')}
              className={`flex-1 sm:flex-initial h-10 px-4 rounded-lg font-black text-xs uppercase tracking-wider transition shadow cursor-pointer ${
                activeChartMode === 'bazi'
                  ? 'bg-emerald-700 text-white border border-emerald-600'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              BÁT TỰ
            </button>

            {/* LỮ PHÚC (7 Columns - Trước đây là Hoa Sơn) */}
            <button
              type="button"
              onClick={() => handleAnLaSo('tutru')}
              className={`flex-1 sm:flex-initial h-10 px-4 rounded-lg font-black text-xs uppercase tracking-wider transition shadow cursor-pointer ${
                activeChartMode === 'tutru'
                  ? 'bg-indigo-600 text-white border border-indigo-500'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              LỮ PHÚC
            </button>

            {/* TẢI ẢNH */}
            <button
              type="button"
              onClick={() => downloadImage('png')}
              disabled={isExporting}
              title="Tải ảnh lá số PNG độ phân giải cao"
              className="h-10 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold flex items-center justify-center transition shadow-2xs"
            >
              <Download className="w-4 h-4 text-amber-600" />
            </button>

            {/* LƯU LÁ SỐ */}
            <button
              type="button"
              onClick={saveCurrentChart}
              title="Lưu vào Kho Lưu Trữ Mệnh Bàn"
              className="h-10 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold flex items-center justify-center transition gap-1 shadow-2xs"
            >
              <Save className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">LƯU</span>
            </button>

            {/* TIẾN / LÙI LỊCH SỬ */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevChart}
                disabled={historyIndex <= 0}
                className={`h-10 w-9 rounded-lg border flex items-center justify-center transition ${
                  historyIndex > 0
                    ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 cursor-pointer shadow-2xs'
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextChart}
                disabled={historyIndex >= chartHistory.length - 1}
                className={`h-10 w-9 rounded-lg border flex items-center justify-center transition ${
                  historyIndex < chartHistory.length - 1
                    ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 cursor-pointer shadow-2xs'
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CHART CONTAINER TO CAPTURE (WHITE BACKGROUND) */}
      <div className="max-w-[1400px] mx-auto overflow-hidden">
        <div
          ref={chartRef}
          className="w-full bg-white border border-amber-300/80 rounded-2xl p-4 sm:p-6 shadow-xl relative"
          style={{ backgroundColor: designConfig.chartBgColor || '#ffffff' }}
        >
          {/* HEADER: Title & Info Banner */}
          <div className="text-center mb-5">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-widest text-slate-900 drop-shadow-xs">
              {isTuTru ? 'LỮ PHÚC BÁT TỰ (TỨ TRỤ 7 CỘT)' : 'TỨ TRỤ MỆNH BÀN'}
            </h1>

            {/* Info Pill Banner */}
            <div className="mt-3 max-w-4xl mx-auto bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-700 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 shadow-xs">
              <div><span className="text-slate-500 font-semibold">HỌ TÊN:</span> <span className="font-black text-amber-800">{formData.name.toUpperCase()}</span></div>
              <div className="text-slate-300">|</div>
              <div><span className="text-slate-500 font-semibold">GIỚI TÍNH:</span> <span className="font-bold text-slate-800">{formData.gender === 'male' ? 'NAM' : 'NỮ'}</span></div>
              <div className="text-slate-300">|</div>
              <div><span className="text-slate-500 font-semibold">DƯƠNG:</span> <span className="font-bold text-slate-800">{baziData.solarDateStr}</span></div>
              <div className="text-slate-300">|</div>
              <div><span className="text-slate-500 font-semibold">ÂM:</span> <span className="font-bold text-slate-800">{baziData.lunarDateStr}</span></div>
              <div className="text-slate-300">|</div>
              <div><span className="text-slate-500 font-semibold">TUỔI:</span> <span className="font-black text-amber-800">{baziData.currentAgeMu}</span></div>
            </div>

            {/* Khởi vận & Tiết Khí */}
            <div className="mt-1 text-[11px] sm:text-xs text-amber-800 font-semibold">
              KHỞI VẬN: {baziData.initiationInfo}
            </div>
          </div>

          {/* MAIN GRID: 4 NATAL PILLARS (+ 3 EXTRA COLUMNS IN LỮ PHÚC MODE) */}
          <div className="overflow-x-auto no-scrollbar">
            <div className="min-w-[700px] flex border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
              {/* Vertical Side Label: CÀN TẠO / KHÔN TẠO */}
              <div className="w-10 sm:w-12 bg-slate-50 border-r border-slate-200 flex items-center justify-center p-2 text-center">
                <span className="font-black tracking-widest text-xs sm:text-sm text-slate-800 writing-vertical uppercase select-none">
                  {formData.gender === 'male' ? 'CÀN TẠO' : 'KHÔN TẠO'}
                </span>
              </div>

              {/* Pillars Columns */}
              <div className={`flex-1 grid ${isTuTru ? 'grid-cols-7' : 'grid-cols-4'} divide-x divide-slate-200`}>
                {/* 1. Trụ Năm */}
                <PillarCard
                  label="TRỤ NĂM"
                  pillar={baziData.pillars.year}
                  getStemBranchColor={getStemBranchColor}
                  baziFontSize={effectiveBaziFontSize}
                />

                {/* 2. Trụ Tháng */}
                <PillarCard
                  label="TRỤ THÁNG"
                  pillar={baziData.pillars.month}
                  getStemBranchColor={getStemBranchColor}
                  baziFontSize={effectiveBaziFontSize}
                />

                {/* 3. Trụ Ngày (Nhật Chủ) */}
                <PillarCard
                  label="TRỤ NGÀY"
                  pillar={baziData.pillars.day}
                  isDayMaster
                  getStemBranchColor={getStemBranchColor}
                  baziFontSize={effectiveBaziFontSize}
                />

                {/* 4. Trụ Giờ */}
                <PillarCard
                  label="TRỤ GIỜ"
                  pillar={baziData.pillars.hour}
                  getStemBranchColor={getStemBranchColor}
                  baziFontSize={effectiveBaziFontSize}
                />

                {/* EXTRA 3 COLUMNS IN LỮ PHÚC MODE */}
                {isTuTru && (
                  <>
                    {/* 5. Cột Đại Vận */}
                    {(() => {
                      const curLuck = baziData.cycles[baziData.selectedLuckIdx] || baziData.cycles[0];
                      return (
                        <ExtraPillarCard
                          badge="ĐẠI VẬN"
                          title={`${curLuck?.age}t - ${curLuck?.year}`}
                          stem={curLuck?.stem || ''}
                          branch={curLuck?.branch || ''}
                          tenGod={curLuck?.tenGod || ''}
                          napAm={curLuck?.napAm || ''}
                          changSheng={curLuck?.changSheng || ''}
                          getStemBranchColor={getStemBranchColor}
                          baziFontSize={effectiveBaziFontSize}
                        />
                      );
                    })()}

                    {/* 6. Cột Lưu Niên */}
                    {(() => {
                      const curAnnual = baziData.annuals.find(a => a.year === baziData.yearToViewMonthly) || baziData.annuals[0];
                      return (
                        <ExtraPillarCard
                          badge="LƯU NIÊN"
                          title={`${curAnnual?.year}`}
                          stem={curAnnual?.stem || ''}
                          branch={curAnnual?.branch || ''}
                          tenGod={curAnnual?.tenGod || ''}
                          napAm={curAnnual?.napAm || ''}
                          changSheng=""
                          getStemBranchColor={getStemBranchColor}
                          baziFontSize={effectiveBaziFontSize}
                        />
                      );
                    })()}

                    {/* 7. Cột Tiểu Vận */}
                    {(() => {
                      const curTieuVan = baziData.tieuVans.find(tv => tv.year === baziData.yearToViewMonthly) || baziData.tieuVans[0];
                      const tvTenGod = curTieuVan ? getTenGod(baziData.pillars.day.stem, curTieuVan.stem, true) : '';
                      return (
                        <ExtraPillarCard
                          badge="TIỂU VẬN"
                          title={`${curTieuVan?.age} tuổi`}
                          stem={curTieuVan?.stem || ''}
                          branch={curTieuVan?.branch || ''}
                          tenGod={tvTenGod}
                          napAm={curTieuVan?.napAm || ''}
                          changSheng=""
                          getStemBranchColor={getStemBranchColor}
                          baziFontSize={effectiveBaziFontSize}
                        />
                      );
                    })()}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* LOWER SECTIONS: Đại Vận > Lưu Niên > Tiểu Vận > 12 Tháng (WHITE THEME) */}
          <div className="mt-5 space-y-4">
            {/* 1. ĐẠI VẬN TIMELINE */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
                  ĐẠI VẬN (10 NĂM)
                </span>
                <span className="text-[11px] text-slate-500">
                  Nhấp vào một đại vận để xem chi tiết lưu niên & tiểu vận
                </span>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 overflow-x-auto no-scrollbar">
                {baziData.cycles.map((cyc, idx) => {
                  const isSelected = idx === baziData.selectedLuckIdx;
                  return (
                    <div
                      key={`luck-${idx}`}
                      onClick={() => {
                        setSelectedCycle(idx);
                        setSelectedAnnualYear(null);
                      }}
                      className={`p-2 rounded-lg text-center cursor-pointer transition border ${
                        isSelected
                          ? 'bg-amber-100 border-2 border-amber-500 text-amber-950 font-bold shadow-sm scale-105'
                          : 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-800 shadow-2xs'
                      }`}
                    >
                      <div className="text-[10px] text-slate-500">{cyc.age} - {cyc.age + 9}t</div>
                      <div className="text-xs font-black text-amber-700 my-0.5">{cyc.tenGod}</div>
                      <div className="text-sm font-black flex items-center justify-center gap-1">
                        <span style={{ color: getStemBranchColor(cyc.stem) }}>{cyc.stem}</span>
                        <span style={{ color: getStemBranchColor(cyc.branch) }}>{cyc.branch}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{cyc.year}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. LƯU NIÊN (ANNUAL YEARS) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                  LƯU NIÊN
                </span>
                <span className="text-[11px] text-slate-500">
                  Năm đang chọn: {baziData.yearToViewMonthly}
                </span>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 overflow-x-auto no-scrollbar">
                {baziData.annuals.map((ann, idx) => {
                  const isSelected = ann.year === baziData.yearToViewMonthly;
                  const isCurrent = ann.year === new Date().getFullYear();
                  return (
                    <div
                      key={`annual-${idx}`}
                      onClick={() => setSelectedAnnualYear(ann.year)}
                      className={`p-2 rounded-lg text-center cursor-pointer transition border relative ${
                        isSelected
                          ? 'bg-emerald-100 border-2 border-emerald-600 text-emerald-950 font-bold shadow-sm scale-105'
                          : 'bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-slate-800 shadow-2xs'
                      }`}
                    >
                      {isCurrent && (
                        <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-red-600 text-white text-[8px] font-black rounded-full shadow">
                          Hiện tại
                        </span>
                      )}
                      <div className="text-xs font-black text-slate-900">{ann.year}</div>
                      <div className="text-[10px] text-emerald-700 font-bold my-0.5">{ann.tenGod}</div>
                      <div className="text-xs font-black flex items-center justify-center gap-1">
                        <span style={{ color: getStemBranchColor(ann.stem) }}>{ann.stem}</span>
                        <span style={{ color: getStemBranchColor(ann.branch) }}>{ann.branch}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate">{ann.napAm}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. TIỂU VẬN (CALCULATED BY HOUR PILLAR METHOD) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-indigo-800 tracking-wider">
                  TIỂU VẬN (KHỞI TỪ TRỤ GIỜ)
                </span>
                <span className="text-[11px] text-slate-500">
                  Dương Nam / Âm Nữ thuận; Âm Nam / Dương Nữ nghịch
                </span>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 overflow-x-auto no-scrollbar">
                {baziData.tieuVans.map((tv, idx) => {
                  const isSelected = tv.year === baziData.yearToViewMonthly;
                  const tvTenGod = getTenGod(baziData.pillars.day.stem, tv.stem, true);
                  return (
                    <div
                      key={`tieuvan-${idx}`}
                      className={`p-2 rounded-lg text-center border transition ${
                        isSelected
                          ? 'bg-indigo-100 border-2 border-indigo-600 text-indigo-950 font-bold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                      }`}
                    >
                      <div className="text-[10px] text-slate-500">{tv.age} tuổi</div>
                      <div className="text-[10px] text-indigo-700 font-bold my-0.5">{tvTenGod}</div>
                      <div className="text-xs font-black flex items-center justify-center gap-1">
                        <span style={{ color: getStemBranchColor(tv.stem) }}>{tv.stem}</span>
                        <span style={{ color: getStemBranchColor(tv.branch) }}>{tv.branch}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate">{tv.napAm}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. 12 THÁNG NGUYỆT LỆNH */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
                  12 THÁNG NGUYỆT LỆNH (NĂM {baziData.yearToViewMonthly})
                </span>
                <span className="text-[11px] text-slate-500">
                  Tiết khí và Can Chi 12 tháng theo Ngũ Hổ Độn
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-12 gap-1.5 overflow-x-auto no-scrollbar">
                {baziData.monthlyLuck.map((m, idx) => {
                  const mTenGod = getTenGod(baziData.pillars.day.stem, m.stem, true);
                  return (
                    <div
                      key={`month-${idx}`}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-center shadow-2xs"
                    >
                      <div className="text-[10px] font-bold text-slate-600">{m.monthName}</div>
                      <div className="text-[10px] text-amber-700 font-bold">{mTenGod}</div>
                      <div className="text-xs font-black flex items-center justify-center gap-0.5 my-0.5">
                        <span style={{ color: getStemBranchColor(m.stem) }}>{m.stem}</span>
                        <span style={{ color: getStemBranchColor(m.branch) }}>{m.branch}</span>
                      </div>
                      <div className="text-[9px] text-slate-500 truncate">{m.solarTermName}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: KHO LƯU TRỮ MỆNH BÀN (WHITE THEME) */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-amber-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase">
                  Kho Lưu Trữ Mệnh Bàn
                </h2>
                <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  {savedCharts.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsArchiveModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Search & List */}
            <div className="p-4 border-b border-slate-200 flex items-center gap-2 bg-slate-50">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={archiveSearchTerm}
                  onChange={e => setArchiveSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm theo tên hoặc ngày sinh..."
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>
              <select
                value={archiveSortBy}
                onChange={e => setArchiveSortBy(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none shadow-2xs"
              >
                <option value="date_desc">Mới lưu nhất</option>
                <option value="date_asc">Cũ lưu nhất</option>
                <option value="name_asc">Tên (A - Z)</option>
                <option value="name_desc">Tên (Z - A)</option>
              </select>
            </div>

            {/* Saved Charts List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {savedCharts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  Chưa có lá số nào được lưu vào kho lưu trữ.
                </div>
              ) : (
                savedCharts
                  .filter(c =>
                    c.name.toLowerCase().includes(archiveSearchTerm.toLowerCase()) ||
                    c.date.includes(archiveSearchTerm)
                  )
                  .map(chart => (
                    <div
                      key={chart.id}
                      onClick={() => loadSavedChart(chart)}
                      className="bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-400 p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition shadow-2xs"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900 truncate">
                            {chart.name}
                          </span>
                          <span className={`px-2 py-0.2 text-[10px] font-bold rounded ${chart.gender === 'male' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'}`}>
                            {chart.gender === 'male' ? 'Nam' : 'Nữ'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                          <span>{chart.date} {chart.time}</span>
                          <span className="text-slate-300">•</span>
                          <span>Lưu lúc: {chart.savedAt}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => openNoteEditor(chart, e)}
                          title="Ghi chú 6 chủ đề"
                          className="p-2 rounded-lg bg-white border border-slate-300 hover:bg-amber-100 text-slate-700 hover:text-amber-900 transition shadow-2xs"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => deleteSavedChart(chart.id, e)}
                          title="Xóa lá số"
                          className="p-2 rounded-lg bg-white border border-slate-300 hover:bg-red-100 text-slate-700 hover:text-red-700 transition shadow-2xs"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: GHI CHÚ 6 CHỦ ĐỀ CHO LÁ SỐ (WHITE THEME) */}
      {editingNoteChart && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Ghi Chú Mệnh Bàn: {editingNoteChart.name}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Phân loại 6 chủ đề (Mệnh, Nhân Mạch, Sự nghiệp, Tình cảm, Sức khoẻ, Vận trình)
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingNoteChart(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Topic Tabs */}
            <div className="p-3 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-50">
              <button
                type="button"
                onClick={() => setActiveNoteTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  activeNoteTab === 'all'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                Tất cả (6 mục)
              </button>
              {NOTE_TOPICS.map(topic => (
                <button
                  type="button"
                  key={topic.id}
                  onClick={() => setActiveNoteTab(topic.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    activeNoteTab === topic.id
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <topic.icon className="w-3.5 h-3.5" />
                  <span>{topic.label}</span>
                </button>
              ))}
            </div>

            {/* Note Editor Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {NOTE_TOPICS.filter(t => activeNoteTab === 'all' || activeNoteTab === t.id).map(topic => (
                <div key={topic.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <topic.icon className={`w-4 h-4 ${topic.color}`} />
                      <span className="font-black text-sm text-slate-900">{topic.label}</span>
                    </div>

                    {/* Format tools */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => applyTextFormatting(topic.id, 'bold')}
                        className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 shadow-2xs"
                        title="In đậm (**văn bản**)"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyTextFormatting(topic.id, 'italic')}
                        className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 shadow-2xs"
                        title="In nghiêng (*văn bản*)"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyTextFormatting(topic.id, 'list')}
                        className="p-1 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 shadow-2xs"
                        title="Danh sách dấu chấm (•)"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    id={`note-textarea-${topic.id}`}
                    value={topicNotes[topic.id] || ''}
                    onChange={e => setTopicNotes({ ...topicNotes, [topic.id]: e.target.value })}
                    placeholder={topic.placeholder}
                    rows={3}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono shadow-2xs"
                  />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50">
              <button
                type="button"
                onClick={() => setEditingNoteChart(null)}
                className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={saveChartNotes}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-black text-white shadow-sm"
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK PICKER DIALOG (Năm, Tháng, Ngày, Giờ) */}
      {quickPickerType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 uppercase">
                {quickPickerType === 'year' && 'Chọn Năm Sinh'}
                {quickPickerType === 'month' && 'Chọn Tháng Sinh'}
                {quickPickerType === 'day' && 'Chọn Ngày Sinh'}
                {quickPickerType === 'hour' && 'Chọn Giờ Sinh'}
              </h3>
              <button
                type="button"
                onClick={() => setQuickPickerType(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form controls */}
            <div className="space-y-3">
              {quickPickerType === 'year' && (
                <div className="space-y-2">
                  <label className="text-xs text-slate-600 font-bold">Năm Dương Lịch (1900 - 2100):</label>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={inputData.date.split('-')[0]}
                    onChange={e => {
                      const parts = inputData.date.split('-');
                      parts[0] = e.target.value;
                      setInputData(prev => ({ ...prev, date: parts.join('-') }));
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-900"
                  />
                </div>
              )}

              {quickPickerType === 'month' && (
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        const parts = inputData.date.split('-');
                        parts[1] = m.toString().padStart(2, '0');
                        setInputData(prev => ({ ...prev, date: parts.join('-') }));
                        setQuickPickerType(null);
                      }}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs transition"
                    >
                      Tháng {m}
                    </button>
                  ))}
                </div>
              )}

              {quickPickerType === 'day' && (
                <div className="grid grid-cols-7 gap-1.5 max-h-60 overflow-y-auto">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        const parts = inputData.date.split('-');
                        parts[2] = d.toString().padStart(2, '0');
                        setInputData(prev => ({ ...prev, date: parts.join('-') }));
                        setQuickPickerType(null);
                      }}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs transition"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}

              {quickPickerType === 'hour' && (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Tý (23h - 01h)', time: '23:30' },
                    { label: 'Sửu (01h - 03h)', time: '02:00' },
                    { label: 'Dần (03h - 05h)', time: '04:00' },
                    { label: 'Mão (05h - 07h)', time: '06:00' },
                    { label: 'Thìn (07h - 09h)', time: '08:00' },
                    { label: 'Tỵ (09h - 11h)', time: '10:00' },
                    { label: 'Ngọ (11h - 13h)', time: '12:00' },
                    { label: 'Mùi (13h - 15h)', time: '13:00' },
                    { label: 'Thân (15h - 17h)', time: '16:00' },
                    { label: 'Dậu (17h - 19h)', time: '18:00' },
                    { label: 'Tuất (19h - 21h)', time: '20:00' },
                    { label: 'Hợi (21h - 23h)', time: '22:00' },
                  ].map(h => (
                    <button
                      key={h.label}
                      type="button"
                      onClick={() => {
                        setInputData(prev => ({ ...prev, time: h.time }));
                        setQuickPickerType(null);
                      }}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs transition text-center"
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQuickPickerType(null)}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 font-black text-white text-xs shadow-sm"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMIZER DRAWER */}
      {isCustomizerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white border-l border-slate-200 w-full max-w-sm h-full p-5 flex flex-col overflow-y-auto shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-slate-900 uppercase">Tùy Chỉnh Giao Diện</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomizerOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Màu nền khung lá số:</label>
                <div className="grid grid-cols-4 gap-2">
                  {['#ffffff', '#f8fafc', '#fefce8', '#0f172a'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateDesignConfig({ chartBgColor: color })}
                      style={{ backgroundColor: color }}
                      className={`h-8 rounded-lg border ${designConfig.chartBgColor === color ? 'border-amber-500 ring-2 ring-amber-400/50' : 'border-slate-300'}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Cỡ chữ Can Chi Bát Tự:</label>
                <input
                  type="range"
                  min="26"
                  max="44"
                  value={designConfig.baziFontSize}
                  onChange={e => updateDesignConfig({ baziFontSize: Number(e.target.value) })}
                  className="w-full accent-amber-600"
                />
                <span className="text-slate-500 font-mono">{designConfig.baziFontSize}px</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  safeStorage.removeItem('bazi_empirical_design_config');
                  setDesignConfig({
                    chartBgColor: '#ffffff',
                    cardBgColor: '#ffffff',
                    accentColor: '#d97706',
                    goldBorderColor: '#b45309',
                    fontFamily: 'Inter',
                    baziFontSize: 34,
                    cycleFontSize: 16,
                  });
                  showToast('Đã khôi phục thiết kế mặc định!');
                }}
                className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition text-xs"
              >
                Khôi phục mặc định
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const isSpecialStar = (star: string) => 
  star === "Dịch Mã" || star === "Không Vong" || star === "Đào Hoa" || star === "Kiếp Sát" || 
  star === "Tai Sát" || star === "Hoa Cái" || star === "Tướng Tinh" || star === "Văn Xương" || star === "Quý Nhân" || 
  star === "Thiên Hỷ" || star === "Cô Thần" || star === "Quả Tú" || star === "Khôi Cương" || 
  star === "Học Đường" || star === "Tứ Phế" || star === "Thiên Y" || star === "Thiên La" || star === "Địa Võng" ||
  star === "Dương Nhẫn" || star === "Lộc Thần" || star === "Âm Dương Lệch";

// Sub-component: 1 Natal Pillar Card
function PillarCard({
  label,
  pillar,
  isDayMaster = false,
  getStemBranchColor,
  baziFontSize
}: {
  label: string;
  pillar: any;
  isDayMaster?: boolean;
  getStemBranchColor: (c: string) => string;
  baziFontSize: number;
}) {
  return (
    <div className={`p-3 sm:p-4 flex flex-col justify-between text-center ${isDayMaster ? 'bg-amber-50/20' : 'bg-white'}`}>
      {/* 1. Header Label & Ten God */}
      <div className="flex flex-col items-center justify-start h-14">
        <div className="text-[10px] sm:text-xs font-bold uppercase text-slate-500 tracking-wider">
          {label}
        </div>
        <div className="text-[10px] text-transparent select-none leading-tight mt-0.5">
          &nbsp;
        </div>
        <div className="mt-1 h-6 flex items-center justify-center">
          <span
            className={`text-xs sm:text-sm font-black uppercase tracking-wider px-2 py-0.5 rounded ${
              isDayMaster
                ? 'text-amber-800 bg-amber-100/90 border border-amber-300'
                : 'text-slate-800'
            }`}
          >
            {isDayMaster ? 'NHẬT CHỦ' : pillar.tenGod}
          </span>
        </div>
      </div>

      {/* 2. Main Can Chi typography */}
      <div className="my-3 space-y-1.5 flex flex-col items-center justify-center">
        <div
          className="font-black leading-none select-none tracking-tight"
          style={{
            fontSize: `${baziFontSize}px`,
            color: getStemBranchColor(pillar.stem)
          }}
        >
          {pillar.stem.toUpperCase()}
        </div>
        <div
          className="font-black leading-none select-none tracking-tight"
          style={{
            fontSize: `${baziFontSize}px`,
            color: getStemBranchColor(pillar.branch)
          }}
        >
          {pillar.branch.toUpperCase()}
        </div>
      </div>

      {/* 3. Hidden Stems (Tàng Can) */}
      <div className="mt-2 pt-2 border-t border-slate-200">
        <div className="flex items-center justify-center gap-1.5 flex-wrap min-h-6">
          {pillar.hiddenStems.map((h: any, idx: number) => (
            <span
              key={idx}
              className="text-xs font-black px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200/80 shadow-2xs"
              style={{ color: getStemBranchColor(h.stem) }}
              title={h.tenGod}
            >
              {h.stem}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Shen Sha Stars (Thần Sát) */}
      <div className="mt-2 min-h-12 flex items-center justify-center flex-wrap gap-1 content-center">
        {pillar.stars.slice(0, 3).map((star: string, idx: number) => (
          <span
            key={idx}
            className={`text-[9.5px] px-1.5 py-0.5 rounded border font-medium leading-tight ${
              isSpecialStar(star)
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {star}
          </span>
        ))}
      </div>

      {/* 5. Chang Sheng & Nap Am */}
      <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] h-12 flex flex-col justify-center space-y-0.5">
        <div className="text-amber-800 font-bold">{pillar.changSheng}</div>
        <div className="text-slate-600 truncate font-medium">{pillar.napAm}</div>
      </div>
    </div>
  );
}

// Sub-component: Extra Pillar Card in 7-Column Lữ Phúc Mode
function ExtraPillarCard({
  badge,
  title,
  stem,
  branch,
  tenGod,
  napAm,
  changSheng,
  getStemBranchColor,
  baziFontSize
}: {
  badge: string;
  title: string;
  stem: string;
  branch: string;
  tenGod: string;
  napAm: string;
  changSheng: string;
  getStemBranchColor: (c: string) => string;
  baziFontSize: number;
}) {
  return (
    <div className="p-3 sm:p-4 flex flex-col justify-between text-center bg-indigo-50/20">
      {/* 1. Header Label & Ten God */}
      <div className="flex flex-col items-center justify-start h-14">
        <div className="text-[10px] sm:text-xs font-black uppercase text-indigo-700 tracking-wider">
          {badge}
        </div>
        <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5 truncate max-w-full">
          {title}
        </div>
        <div className="mt-1 h-6 flex items-center justify-center">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-indigo-950 bg-indigo-100/70 border border-indigo-200 rounded px-2 py-0.5">
            {tenGod}
          </span>
        </div>
      </div>

      {/* 2. Main Can Chi typography */}
      <div className="my-3 space-y-1.5 flex flex-col items-center justify-center">
        <div
          className="font-black leading-none select-none tracking-tight"
          style={{
            fontSize: `${baziFontSize}px`,
            color: getStemBranchColor(stem)
          }}
        >
          {stem.toUpperCase()}
        </div>
        <div
          className="font-black leading-none select-none tracking-tight"
          style={{
            fontSize: `${baziFontSize}px`,
            color: getStemBranchColor(branch)
          }}
        >
          {branch.toUpperCase()}
        </div>
      </div>

      {/* 3. Can Chi Text Badge */}
      <div className="mt-2 pt-2 border-t border-slate-200">
        <div className="flex items-center justify-center min-h-6">
          <span className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded shadow-2xs">
            {stem} {branch}
          </span>
        </div>
      </div>

      {/* 4. Chang Sheng */}
      <div className="mt-2 min-h-12 flex items-center justify-center flex-wrap gap-1 content-center">
        {changSheng ? (
          <span className="text-[10px] px-2 py-0.5 rounded border border-indigo-200 bg-indigo-50/70 text-indigo-900 font-semibold">
            {changSheng}
          </span>
        ) : (
          <span className="text-xs text-slate-400 font-bold">-</span>
        )}
      </div>

      {/* 5. Footer: Badge & Nap Am */}
      <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] h-12 flex flex-col justify-center space-y-0.5">
        <div className="text-indigo-700 font-bold">{badge}</div>
        <div className="text-slate-600 truncate font-medium">{napAm}</div>
      </div>
    </div>
  );
}
