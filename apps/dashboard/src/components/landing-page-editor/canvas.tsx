'use client';

import { useRef, useCallback, type ReactNode } from 'react';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export const DEVICE_WIDTHS: Record<DeviceMode, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

interface CanvasProps {
  children: ReactNode;
  device: DeviceMode;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function Canvas({ children, device, zoom, onZoomChange }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = DEVICE_WIDTHS[device];
  const scale = zoom / 100;

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -5 : 5;
        onZoomChange(Math.min(150, Math.max(50, zoom + delta)));
      }
    },
    [zoom, onZoomChange],
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto relative"
      onWheel={handleWheel}
      style={{
        backgroundColor: '#f0f0f0',
        backgroundImage: 'radial-gradient(circle, #d0d0d0 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="flex justify-center py-8 px-4" style={{ minHeight: '100%' }}>
        <div
          className="bg-white shadow-2xl rounded-lg overflow-hidden transition-[width] duration-300 origin-top"
          style={{
            width: `${width}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Browser chrome */}
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-400 text-center truncate">
                yourstore.baazarify.com
              </div>
            </div>
          </div>
          {/* Page content */}
          <div className="min-h-[400px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
