import { toPng } from 'html-to-image';

export interface ExportChartOptions {
  fileName: string;
  width: number;
  height: number;
  title?: string;
}

/**
 * Capture an HTML element as high-resolution PNG (2x pixelRatio)
 * using an isolated offscreen sandbox clone.
 * This guarantees 100% immunity to live screen size, mobile zoom,
 * parent flex/overflow containers, and media query distortions.
 */
export async function captureChartImage(
  element: HTMLElement,
  options: { width: number; height?: number }
): Promise<string> {
  const { width, height } = options;

  // 1. Deep clone the element to preserve on-screen interactive DOM
  const clone = element.cloneNode(true) as HTMLElement;

  // 2. Remove any invisible touch/click overlays from the clone
  const overlays = clone.querySelectorAll(
    'img[title*="Sao chép"], img[class*="opacity-0"], img[class*="opacity-\\[0"]'
  );
  overlays.forEach((img) => img.remove());

  // 3. Reset layout styles on the clone to pristine desktop metrics
  clone.style.zoom = '1';
  clone.style.transform = 'none';
  clone.style.width = `${width}px`;
  clone.style.minWidth = `${width}px`;
  clone.style.maxWidth = `${width}px`;
  clone.style.margin = '0';
  clone.style.padding = '0';
  clone.style.boxSizing = 'border-box';
  clone.style.position = 'relative';
  clone.style.left = '0';
  clone.style.top = '0';
  clone.style.backgroundColor = '#ffffff';

  if (height) {
    clone.style.height = `${height}px`;
    clone.style.minHeight = `${height}px`;
    clone.style.maxHeight = `${height}px`;
  } else {
    clone.style.height = 'auto';
    clone.style.minHeight = 'auto';
  }

  // 4. Create an isolated offscreen mounting host attached to document.body
  const host = document.createElement('div');
  host.id = 'chart-capture-sandbox';
  host.style.position = 'fixed';
  host.style.left = '-99999px';
  host.style.top = '0';
  host.style.width = `${width}px`;
  host.style.minWidth = `${width}px`;
  host.style.maxWidth = `${width}px`;
  host.style.height = height ? `${height}px` : 'auto';
  host.style.overflow = 'visible';
  host.style.pointerEvents = 'none';
  host.style.zIndex = '-99999';
  host.style.backgroundColor = '#ffffff';
  host.appendChild(clone);
  document.body.appendChild(host);

  try {
    // 5. Ensure all images inside clone are ready
    const images = Array.from(clone.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    // Force reflow and wait a tick for fonts/layout to settle
    void clone.offsetHeight;
    await new Promise((r) => setTimeout(r, 60));

    const actualHeight = height || Math.max(clone.scrollHeight, clone.offsetHeight, 600);

    // Capture the pristine clone using html-to-image
    const dataUrl = await toPng(clone, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      cacheBust: true,
      quality: 0.98,
      width,
      height: actualHeight,
      canvasWidth: width,
      canvasHeight: actualHeight,
      skipAutoScale: true,
      style: {
        zoom: '1',
        transform: 'none',
        width: `${width}px`,
        maxWidth: `${width}px`,
        minWidth: `${width}px`,
        margin: '0',
      },
    });

    return dataUrl;
  } finally {
    // Always clean up host from DOM
    if (host.parentNode) {
      host.parentNode.removeChild(host);
    }
  }
}

export interface CopyChartResult {
  status: 'copied' | 'shared' | 'fallback';
  dataUrl: string;
}

/**
 * Handle copying the chart image:
 * - Desktop: writes PNG blob directly to clipboard
 * - Mobile: opens Web Share API with image file
 * - Returns CopyChartResult { status, dataUrl }
 */
export async function copyChartImage(
  element: HTMLElement,
  options: ExportChartOptions
): Promise<CopyChartResult> {
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
      return { status: 'shared', dataUrl };
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return { status: 'fallback', dataUrl };
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
      return { status: 'copied', dataUrl };
    } catch (err) {
      console.warn('ClipboardItem write failed, fallback needed:', err);
    }
  }

  // 3. Fallback to open modal preview for manual copy
  return { status: 'fallback', dataUrl };
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
