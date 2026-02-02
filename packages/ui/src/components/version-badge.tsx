'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, GripVertical, Info } from 'lucide-react';

interface VersionBadgeProps {
  version?: string;
  buildTime?: string;
  storageKey?: string;
}

interface Position {
  x: number;
  y: number;
}

const STORAGE_KEY_POSITION = 'version-badge-position';
const STORAGE_KEY_HIDDEN = 'version-badge-hidden';

export function VersionBadge({
  version = 'dev',
  buildTime,
  storageKey = '',
}: VersionBadgeProps) {
  const [isHidden, setIsHidden] = useState(true);
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showRestoreHint, setShowRestoreHint] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const positionKey = `${STORAGE_KEY_POSITION}${storageKey ? `-${storageKey}` : ''}`;
  const hiddenKey = `${STORAGE_KEY_HIDDEN}${storageKey ? `-${storageKey}` : ''}`;

  useEffect(() => {
    try {
      const savedHidden = localStorage.getItem(hiddenKey);
      const savedPosition = localStorage.getItem(positionKey);
      
      if (savedHidden !== null) {
        setIsHidden(savedHidden === 'true');
      } else {
        setIsHidden(false);
      }
      
      if (savedPosition) {
        setPosition(JSON.parse(savedPosition));
      }
    } catch {
      setIsHidden(false);
    }
  }, [hiddenKey, positionKey]);

  const handleClose = useCallback(() => {
    setShowRestoreHint(true);
    // Show hint for 3 seconds before hiding
    setTimeout(() => {
      setIsHidden(true);
      setShowRestoreHint(false);
      try {
        localStorage.setItem(hiddenKey, 'true');
      } catch {}
    }, 2500);
  }, [hiddenKey]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
    };
    e.preventDefault();
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      
      const deltaX = dragRef.current.startX - e.clientX;
      const deltaY = dragRef.current.startY - e.clientY;
      
      const newX = Math.max(0, dragRef.current.startPosX + deltaX);
      const newY = Math.max(0, dragRef.current.startPosY + deltaY);
      
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
      
      try {
        localStorage.setItem(positionKey, JSON.stringify(position));
      } catch {}
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position, positionKey]);

  // Keyboard shortcut to restore
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        setIsHidden(false);
        setShowRestoreHint(false);
        try {
          localStorage.setItem(hiddenKey, 'false');
        } catch {}
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hiddenKey]);

  if (isHidden) return null;

  // Show restore hint when closing
  if (showRestoreHint) {
    return (
      <div
        style={{
          position: 'fixed',
          right: position.x,
          bottom: position.y,
          zIndex: 9999,
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-500/90 text-white text-xs font-medium backdrop-blur-sm shadow-lg animate-pulse"
      >
        <Info className="w-4 h-4" />
        <span>按 <kbd className="px-1 py-0.5 bg-white/20 rounded text-[10px]">Ctrl+Shift+V</kbd> 可重新显示</span>
      </div>
    );
  }

  return (
    <div
      ref={badgeRef}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        right: position.x,
        bottom: position.y,
        zIndex: 9999,
      }}
      className={`
        flex items-center gap-1.5 px-2 py-1 rounded-md
        bg-black/70 text-white text-xs font-mono
        backdrop-blur-sm shadow-lg
        cursor-move select-none
        transition-opacity duration-200
        ${isDragging ? 'opacity-90' : isHovered ? 'opacity-100' : 'opacity-50'}
      `}
    >
      <GripVertical className="w-3 h-3 opacity-50" />
      <span className="font-semibold">{version}</span>
      {buildTime && isHovered && (
        <span className="text-white/60 text-[10px]">
          {new Date(buildTime).toLocaleString()}
        </span>
      )}
      <button
        onClick={handleClose}
        className="ml-1 p-0.5 rounded hover:bg-white/20 transition-colors"
        title="关闭 (Ctrl+Shift+V 重新显示)"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
