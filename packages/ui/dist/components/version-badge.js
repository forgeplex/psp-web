'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, GripVertical, Info, Copy, Check } from 'lucide-react';
const STORAGE_KEY_POSITION = 'version-badge-position';
const STORAGE_KEY_HIDDEN = 'version-badge-hidden';
export function VersionBadge({ version = 'dev', buildTime, storageKey = '', }) {
    const [isHidden, setIsHidden] = useState(true);
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showRestoreHint, setShowRestoreHint] = useState(false);
    const [copied, setCopied] = useState(false);
    const dragRef = useRef(null);
    const badgeRef = useRef(null);
    const positionKey = `${STORAGE_KEY_POSITION}${storageKey ? `-${storageKey}` : ''}`;
    const hiddenKey = `${STORAGE_KEY_HIDDEN}${storageKey ? `-${storageKey}` : ''}`;
    useEffect(() => {
        try {
            const savedHidden = localStorage.getItem(hiddenKey);
            const savedPosition = localStorage.getItem(positionKey);
            if (savedHidden !== null) {
                setIsHidden(savedHidden === 'true');
            }
            else {
                setIsHidden(false);
            }
            if (savedPosition) {
                setPosition(JSON.parse(savedPosition));
            }
        }
        catch {
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
            }
            catch { }
        }, 2500);
    }, [hiddenKey]);
    const handleMouseDown = useCallback((e) => {
        if (e.target.closest('button'))
            return;
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
        if (!isDragging)
            return;
        const handleMouseMove = (e) => {
            if (!dragRef.current)
                return;
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
            }
            catch { }
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
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
                e.preventDefault();
                setIsHidden(false);
                setShowRestoreHint(false);
                try {
                    localStorage.setItem(hiddenKey, 'false');
                }
                catch { }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [hiddenKey]);
    const handleCopy = useCallback(async () => {
        if (!version)
            return;
        try {
            await navigator.clipboard.writeText(version);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        }
        catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = version;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
            }
            catch { }
            document.body.removeChild(textarea);
        }
    }, [version]);
    if (isHidden)
        return null;
    // Show restore hint when closing
    if (showRestoreHint) {
        return (_jsxs("div", { style: {
                position: 'fixed',
                right: position.x,
                bottom: position.y,
                zIndex: 9999,
            }, className: "flex items-center gap-2 px-3 py-2 rounded-md bg-amber-500/90 text-white text-xs font-medium backdrop-blur-sm shadow-lg animate-pulse", children: [_jsx(Info, { className: "w-4 h-4" }), _jsxs("span", { children: ["\u6309 ", _jsx("kbd", { className: "px-1 py-0.5 bg-white/20 rounded text-[10px]", children: "Ctrl+Shift+V" }), " \u53EF\u91CD\u65B0\u663E\u793A"] })] }));
    }
    return (_jsxs("div", { ref: badgeRef, onMouseDown: handleMouseDown, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), style: {
            position: 'fixed',
            right: position.x,
            bottom: position.y,
            zIndex: 9999,
        }, className: `
        flex items-center gap-1.5 px-2 py-1 rounded-md
        bg-black/70 text-white text-xs font-mono
        backdrop-blur-sm shadow-lg
        cursor-move select-none
        transition-opacity duration-200
        ${isDragging ? 'opacity-90' : isHovered ? 'opacity-100' : 'opacity-50'}
      `, children: [_jsx(GripVertical, { className: "w-3 h-3 opacity-50" }), _jsx("button", { onClick: handleCopy, className: "font-semibold select-text cursor-pointer hover:text-white/90 transition-colors", title: "\u70B9\u51FB\u590D\u5236", children: version }), _jsx("button", { onClick: handleCopy, className: "p-0.5 rounded hover:bg-white/20 transition-colors", title: copied ? '已复制' : '复制', children: copied ? _jsx(Check, { className: "w-3 h-3" }) : _jsx(Copy, { className: "w-3 h-3" }) }), buildTime && isHovered && (_jsx("span", { className: "text-white/60 text-[10px]", children: new Date(buildTime).toLocaleString() })), _jsx("button", { onClick: handleClose, className: "ml-0.5 p-0.5 rounded hover:bg-white/20 transition-colors", title: "\u5173\u95ED (Ctrl+Shift+V \u91CD\u65B0\u663E\u793A)", children: _jsx(X, { className: "w-3 h-3" }) })] }));
}
//# sourceMappingURL=version-badge.js.map