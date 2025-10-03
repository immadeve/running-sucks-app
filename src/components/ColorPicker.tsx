import React, { useRef, useCallback } from 'react';

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ currentColor, onColorChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [canvasSize, setCanvasSize] = React.useState({ width: 200, height: 200 });

  // Convert hex color to HSV for positioning
  const hexToHsv = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    if (diff !== 0) {
      if (max === r) h = ((g - b) / diff) % 6;
      else if (max === g) h = (b - r) / diff + 2;
      else h = (r - g) / diff + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    const s = max === 0 ? 0 : diff / max;
    const v = max;

    return { h, s: s * 100, v: v * 100 };
  };

  // Convert HSV to hex
  const hsvToHex = (h: number, s: number, v: number) => {
    s /= 100;
    v /= 100;

    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r = 0,
      g = 0,
      b = 0;
    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (h >= 300 && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
      .toString(16)
      .padStart(2, '0')}`;
  };

  // Draw the color ring on canvas
  const drawColorPalette = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) / 2 - 2;
    const innerRadius = outerRadius * 0.6; // Ring thickness

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw color ring
    for (let angle = 0; angle < 360; angle += 1) {
      const hue = angle;

      // Draw radial gradient from inner to outer radius for saturation
      for (let r = innerRadius; r <= outerRadius; r += 1) {
        const saturation = 80 + ((r - innerRadius) / (outerRadius - innerRadius)) * 20; // 80% to 100%
        const brightness = 100; // Always full brightness

        const color = hsvToHex(hue, saturation, brightness);
        ctx.fillStyle = color;

        // Calculate position
        const radian = (angle * Math.PI) / 180;
        const x = centerX + Math.cos(radian) * r;
        const y = centerY + Math.sin(radian) * r;

        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }, []);

  // Get pointer position based on current color
  const getPointerPosition = () => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const { h, s, v } = hexToHsv(currentColor);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(canvas.width, canvas.height) / 2 - 2;
    const innerRadius = outerRadius * 0.6;

    // Map saturation (80-100%) to radius (inner to outer)
    const radius = innerRadius + ((s - 80) / 20) * (outerRadius - innerRadius);

    // Convert hue to angle
    const angle = (h * Math.PI) / 180;

    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    return { x, y };
  };

  // Get color from canvas coordinates
  const getColorFromCoordinates = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(canvas.width, canvas.height) / 2 - 2;
    const innerRadius = outerRadius * 0.6;

    // Calculate distance from center and angle
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if click is within the ring
    if (distance < innerRadius || distance > outerRadius) {
      return null; // Outside the ring
    }

    // Calculate angle (hue)
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360; // Normalize to 0-360

    // Calculate saturation based on distance from inner radius
    const saturation = 80 + ((distance - innerRadius) / (outerRadius - innerRadius)) * 20;
    const brightness = 100; // Always full brightness

    return hsvToHex(angle, saturation, brightness);
  };

  // Handle mouse down on color palette
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newColor = getColorFromCoordinates(x, y);
    if (newColor) {
      onColorChange(newColor);
    }
  };

  // Handle mouse move on color palette
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newColor = getColorFromCoordinates(x, y);
    if (newColor) {
      onColorChange(newColor);
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle click on color palette (for backward compatibility)
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) return; // Don't handle click if we were dragging

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newColor = getColorFromCoordinates(x, y);
    if (newColor) {
      onColorChange(newColor);
    }
  };

  // Update canvas size based on container (square for ring)
  React.useEffect(() => {
    const updateCanvasSize = () => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const size = Math.min(Math.floor(rect.width), 200); // Square, max 200px
        const newSize = { width: size, height: size };
        setCanvasSize(newSize);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Initialize canvas when component mounts or size changes
  React.useEffect(() => {
    drawColorPalette();
  }, [drawColorPalette, canvasSize]);

  // Add global mouse up listener to handle mouse up outside canvas
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mouseleave', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseUp);
    };
  }, [isDragging]);

  const pointerPosition = getPointerPosition();

  return (
    <div
      ref={containerRef}
      className="color-picker-container"
      style={{
        position: 'relative',
        width: '200px',
        height: '200px',
        margin: '0 auto',
        border: '2px solid #333',
        borderRadius: '50%',
        overflow: 'hidden',
        cursor: 'crosshair',
      }}>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />

      {/* Color pointer */}
      <div
        className="color-pointer"
        style={{
          position: 'absolute',
          left: `${pointerPosition.x}px`,
          top: `${pointerPosition.y}px`,
          width: '12px',
          height: '12px',
          border: '2px solid white',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.5)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />
    </div>
  );
};
