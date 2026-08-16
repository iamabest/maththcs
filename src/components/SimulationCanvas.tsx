import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface SimulationCanvasProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  onReset?: () => void;
}

export function SimulationCanvas({
  children,
  cameraPosition = [0, 5, 12],
  fov = 50,
  onReset,
}: SimulationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: isFullscreen ? '100vh' : '460px',
        maxHeight: isFullscreen ? 'none' : '520px',
        backgroundColor: '#f8fafc',
        border: '1px solid var(--color-border)',
        borderRadius: isFullscreen ? '0' : 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 12px rgba(0, 0, 0, 0.02)',
      }}
    >
      <Canvas
        camera={{ position: cameraPosition, fov }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[10, 15, 10]} intensity={1.4} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <pointLight position={[0, 10, 0]} intensity={0.6} />
        {children}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxDistance={35}
          minDistance={2}
        />
      </Canvas>

      {/* Viewport Control Strip */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          display: 'flex',
          gap: 6,
          zIndex: 10,
        }}
      >
        {onReset && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={onReset}
            title="Đặt lại thông số mô hình"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}
          >
            Đặt lại
          </button>
        )}
        <button
          className="btn btn-secondary btn-sm"
          onClick={toggleFullscreen}
          title="Toàn màn hình"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          }}
        >
          {isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
        </button>
      </div>

      {/* Coordinate system hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          color: 'var(--color-text-muted)',
          pointerEvents: 'none',
          letterSpacing: '0.04em',
        }}
      >
        XOAY: Chuột trái | PHÓNG TO/THU NHỎ: Cuộn chuột
      </div>
    </div>
  );
}
