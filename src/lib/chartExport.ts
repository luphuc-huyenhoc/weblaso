import { toPng } from 'html-to-image';

export interface ExportChartOptions {
  fileName: string;
  width: number;
  height: number;
  title?: string;
}

/**
 * Capture an HTML element as high-resolution PNG (2x pixelRatio)
 * with robust style restoration to avoid any clipping, zoom distortion or color shift.
 */
export async function captureChartImage(
  element: HTMLElement,
  options: { width: number; height?: number }
): Promise<string> {
  const { width, height } = options;

  // Save current inline styles
  const prevZoom = element.style.zoom;
  const prevWidth = element.style.width;
  const prevHeight = element.style.height;
  const prevTransform = element.style.transform;
  const prevMaxWidth = element.style.maxWidth;

  try {
    // Force standard 1:1 scale and exact pixel dimensions during capture
    element.style.zoom = '1';
    element.style.transform = 'none';
    element.style.width = `${width}px`;
    element.style.maxWidth = `${width}px`;
    if (height) {
      element.style.height = `${height}px`;
    }

    // Capture using html-to-image
    const dataUrl = await toPng(element, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      cacheBust: true,
      quality: 0.98,
      width,
      height: height || undefined,
    });

    return dataUrl;
  } finally {
    // Always restore original styles
    element.style.zoom = prevZoom;
    element.style.transform = prevTransform;
    element.style.width = prevWidth;
    element.style.height = prevHeight;
    element.style.maxWidth = prevMaxWidth;
  }
}

/**
 * Handle copying the chart image:
 * - Desktop: writes PNG blob directly to clipboard
 * - Mobile: opens Web Share API with image file
 * - Returns 'copied' | 'shared' | 'fallback'
 */
export async function copyChartImage(
  element: HTMLElement,
  options: ExportChartOptions
): Promise<'copied' | 'shared' | 'fallback'> {
  const dataUrl = await captureChartImage(element, {
    width: options.width,
    height: options.height,
  });

  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File([blob], `${options.fileName}.png`, { type: 'image/png' });

  // 1. Mobile Web Share API support (iOS Safari, Android Chrome)
  if (
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        files: [file],
        title: options.title || options.fileName,
        text: options.title || 'Lá số Bát Tự Lữ Phúc',
      });
      return 'shared';
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return 'fallback';
      }
    }
  }

  // 2. Desktop ClipboardItem support
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.write === 'function'
  ) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      return 'copied';
    } catch (err) {
      console.warn('ClipboardItem write failed, fallback needed:', err);
    }
  }

  // 3. Fallback to open modal preview for manual copy
  return 'fallback';
}

/**
 * Handle direct PNG file download
 */
export async function downloadChartImage(
  element: HTMLElement,
  options: ExportChartOptions
): Promise<void> {
  const dataUrl = await captureChartImage(element, {
    width: options.width,
    height: options.height,
  });

  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = `${options.fileName}.png`;
  link.href = blobUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}
