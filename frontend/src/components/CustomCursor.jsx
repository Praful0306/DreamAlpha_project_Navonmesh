import React, { useState, useEffect, useRef } from 'react';

export default function CustomCursor() {
    const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
    const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);
    const requestRef = useRef();

    useEffect(() => {
        const onMouseMove = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };

        const updateRing = () => {
            setRingPos(prev => {
                const dx = cursorPos.x - prev.x;
                const dy = cursorPos.y - prev.y;
                return {
                    x: prev.x + dx * 0.15,
                    y: prev.y + dy * 0.15
                };
            });
            requestRef.current = requestAnimationFrame(updateRing);
        };

        window.addEventListener('mousemove', onMouseMove);
        requestRef.current = requestAnimationFrame(updateRing);

        const handleMouseOver = (e) => {
            const isClickable = e.target.closest('a, button, input, textarea, select, [role="button"]');
            setIsHovering(!!isClickable);
        };
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(requestRef.current);
        };
    }, [cursorPos.x, cursorPos.y]);

    // Only render on devices with fine pointer (not touch devices)
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed z-[9999] inset-0">
            <div className="custom-cursor-dot" style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }} />
            <div className={`custom-cursor-ring ${isHovering ? 'hovering' : ''}`} style={{ left: `${ringPos.x}px`, top: `${ringPos.y}px` }} />
        </div>
    );
}
