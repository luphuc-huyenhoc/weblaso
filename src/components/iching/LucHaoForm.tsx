import React, { useState } from 'react';
import { IchingLineInput } from '@/domain/iching';
import { LucHaoInputTable } from './LucHaoInputTable';
import { Loader2 } from 'lucide-react';

export interface LucHaoFormData {
  title: string;
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  lines: IchingLineInput[];
}

interface LucHaoFormProps {
  onSubmit: (data: LucHaoFormData) => void;
  loading?: boolean;
  initialValues?: Partial<LucHaoFormData>;
}

export function LucHaoForm({ onSubmit, loading = false, initialValues }: LucHaoFormProps) {
  const now = new Date();

  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [day, setDay] = useState(initialValues?.day ?? now.getDate());
  const [month, setMonth] = useState(initialValues?.month ?? (now.getMonth() + 1));
  const [year, setYear] = useState(initialValues?.year ?? now.getFullYear());
  const [hour, setHour] = useState(initialValues?.hour ?? now.getHours());
  const [minute, setMinute] = useState(initialValues?.minute ?? now.getMinutes());

  // Default lines: 6 static Yang or initial lines (index 0..5)
  const [lines, setLines] = useState<IchingLineInput[]>(
    initialValues?.lines ?? [
      { lineIndex: 0, polarity: 'Dương', movement: 'Tĩnh' },
      { lineIndex: 1, polarity: 'Dương', movement: 'Tĩnh' },
      { lineIndex: 2, polarity: 'Dương', movement: 'Tĩnh' },
      { lineIndex: 3, polarity: 'Dương', movement: 'Tĩnh' },
      { lineIndex: 4, polarity: 'Dương', movement: 'Tĩnh' },
      { lineIndex: 5, polarity: 'Dương', movement: 'Tĩnh' },
    ]
  );

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleLineChange = (
    domainIndex: number,
    polarity: 'Âm' | 'Dương',
    movement: 'Tĩnh' | 'Động'
  ) => {
    const updated = [...lines];
    updated[domainIndex] = {
      lineIndex: domainIndex,
      polarity,
      movement,
    };
    setLines(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Vui lòng nhập việc cần xem.');
      return;
    }
    setValidationError(null);

    onSubmit({
      title: title.trim(),
      day,
      month,
      year,
      hour,
      minute,
      lines,
    });
  };

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="w-full max-w-3xl mx-auto bg-white border border-gray-200 rounded shadow-xs p-4 sm:p-7 space-y-6">
      {/* Title Header matching reference */}
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-[#935f37] tracking-wide flex items-center justify-center space-x-3">
          <span className="inline-block w-7 h-0.5 bg-[#935f37]" />
          <span>Quẻ dịch</span>
          <span className="inline-block w-7 h-0.5 bg-[#935f37]" />
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">( An quẻ lục hào )</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-xs sm:text-sm">
        {/* 1. Việc cần xem */}
        <div className="space-y-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4 sm:space-y-0">
          <label htmlFor="Title" className="font-bold text-gray-700 sm:text-right">
            Việc cần xem <span className="text-red-500">*</span>
          </label>
          <div className="sm:col-span-3">
            <input
              id="Title"
              name="Title"
              type="text"
              maxLength={256}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Việc cần xem (tối đa 256 ký tự)"
              className={`w-full px-3 py-2 border rounded text-xs sm:text-sm focus:outline-hidden transition-colors ${
                validationError
                  ? 'border-red-500 focus:border-red-600 bg-red-50/20'
                  : 'border-gray-300 focus:border-[#3182ce]'
              }`}
            />
            {validationError && (
              <p className="text-[11px] text-red-600 mt-1 font-semibold">
                {validationError}
              </p>
            )}
          </div>
        </div>

        {/* 2. Ngày */}
        <div className="space-y-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4 sm:space-y-0">
          <label className="font-bold text-gray-700 sm:text-right">Ngày</label>
          <div className="sm:col-span-3 grid grid-cols-3 gap-2">
            <select
              id="SolarDay"
              value={day}
              onChange={(e) => setDay(parseInt(e.target.value, 10))}
              className="w-full px-2.5 py-2 border border-gray-300 rounded bg-white text-xs sm:text-sm focus:border-[#3182ce] focus:outline-hidden"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {pad(d)}
                </option>
              ))}
            </select>

            <select
              id="SolarMonth"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              className="w-full px-2.5 py-2 border border-gray-300 rounded bg-white text-xs sm:text-sm focus:border-[#3182ce] focus:outline-hidden"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {pad(m)}
                </option>
              ))}
            </select>

            <select
              id="SolarYear"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
              className="w-full px-2.5 py-2 border border-gray-300 rounded bg-white text-xs sm:text-sm focus:border-[#3182ce] focus:outline-hidden"
            >
              {Array.from({ length: 157 }, (_, i) => 1900 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Giờ */}
        <div className="space-y-1 sm:grid sm:grid-cols-4 sm:items-center sm:gap-4 sm:space-y-0">
          <label className="font-bold text-gray-700 sm:text-right">Giờ</label>
          <div className="sm:col-span-3 grid grid-cols-3 gap-2">
            <select
              id="Hour"
              value={hour}
              onChange={(e) => setHour(parseInt(e.target.value, 10))}
              className="w-full px-2.5 py-2 border border-gray-300 rounded bg-white text-xs sm:text-sm focus:border-[#3182ce] focus:outline-hidden"
            >
              {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                <option key={h} value={h}>
                  {pad(h)} giờ
                </option>
              ))}
            </select>

            <select
              id="Minutes"
              value={minute}
              onChange={(e) => setMinute(parseInt(e.target.value, 10))}
              className="w-full px-2.5 py-2 border border-gray-300 rounded bg-white text-xs sm:text-sm focus:border-[#3182ce] focus:outline-hidden"
            >
              {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                <option key={m} value={m}>
                  {pad(m)} phút
                </option>
              ))}
            </select>

            <div className="hidden sm:block" />
          </div>
        </div>

        {/* 4. Lục hào */}
        <div className="space-y-1 sm:grid sm:grid-cols-4 sm:items-start sm:gap-4 sm:space-y-0 pt-1">
          <label className="font-bold text-gray-700 sm:text-right pt-2">Lục hào</label>
          <div className="sm:col-span-3 border border-gray-200 rounded p-1 bg-white">
            <LucHaoInputTable lines={lines} onChange={handleLineChange} />
          </div>
        </div>

        {/* 5. Lập quẻ Button */}
        <div className="pt-3 text-center">
          <button
            type="submit"
            id="btnCreateLucHao"
            disabled={loading}
            className="w-full sm:w-auto min-w-[200px] px-8 py-2.5 bg-[#034687] hover:bg-[#023363] text-white font-extrabold uppercase tracking-wider rounded text-xs sm:text-sm transition-all shadow-xs disabled:opacity-50 inline-flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang an quẻ...</span>
              </>
            ) : (
              <span>LẬP QUẺ</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
