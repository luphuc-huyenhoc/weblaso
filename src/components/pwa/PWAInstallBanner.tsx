'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed app)
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // Check iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
    if (isIOSDevice && isSafari) {
      setIsIOS(true);
    }

    // Check localStorage dismissal
    const dismissedAt = localStorage.getItem('pwa_banner_dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 3) {
        return; // Don't show if dismissed within 3 days
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS and not dismissed, show banner after 2s
    if (isIOSDevice && isSafari) {
      const t = setTimeout(() => setShowBanner(true), 2500);
      return () => clearTimeout(t);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa_banner_dismissed', Date.now().toString());
  };

  if (isStandalone || !showBanner) return null;

  return (
    <>
      {/* Floating Bottom / Top Install Banner for Mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#27303f] text-white px-3.5 py-2.5 shadow-md flex items-center justify-between border-b border-amber-500/30 animate-in fade-in slide-in-from-top duration-300">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-amber-400/40 bg-[#f9f5ec]">
            <img src="/icon-192.png" alt="App Icon" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold truncate text-white leading-tight">
              Cài App Bát Tự Lữ Phúc
            </h4>
            <p className="text-[10px] text-amber-200/90 truncate">
              Mở nhanh toàn màn hình, mượt mà như app thật
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0 ml-2">
          <button
            onClick={handleInstallClick}
            className="px-2.5 py-1 bg-gradient-to-r from-[#c8860a] to-[#a36806] hover:from-[#b57708] hover:to-[#8c5703] text-white text-xs font-extrabold rounded-md shadow-xs flex items-center space-x-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cài đặt</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-white rounded transition"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Instruction Modal */}
      {showIOSModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-[#c8860a]" />
                <h3 className="font-extrabold text-sm text-gray-900">
                  Cài đặt trên iPhone / iPad
                </h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Để cài đặt ứng dụng <strong>Bát Tự Lữ Phúc</strong> lên màn hình chính thiết bị Apple:
            </p>

            <ol className="text-xs space-y-2.5 text-gray-700 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60">
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#c8860a]">1.</span>
                <span>
                  Nhấn vào nút <strong>Chia sẻ</strong> (biểu tượng <Share className="inline w-3.5 h-3.5 mx-0.5 text-blue-600" />) ở thanh dưới cùng Safari.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#c8860a]">2.</span>
                <span>
                  Cuộn xuống và chọn mục <strong>"Thêm vào Màn hình chính"</strong> (<PlusSquare className="inline w-3.5 h-3.5 mx-0.5 text-gray-800" /> <em>Add to Home Screen</em>).
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#c8860a]">3.</span>
                <span>
                  Nhấn <strong>"Thêm" (Add)</strong> ở góc trên bên phải.
                </span>
              </li>
            </ol>

            <div className="text-center pt-1">
              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2 bg-[#27303f] hover:bg-[#1a212b] text-white text-xs font-bold rounded-lg transition"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
