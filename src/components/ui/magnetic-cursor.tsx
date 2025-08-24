"use client";

import { useEffect, useRef } from 'react';

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const updateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      
      cursor.style.left = `${cursorX - 10}px`;
      cursor.style.top = `${cursorY - 10}px`;
      
      trail.style.left = `${cursorX - 4}px`;
      trail.style.top = `${cursorY - 4}px`;
      
      requestAnimationFrame(updateCursor);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseEnter = () => {
      cursor.style.transform = 'scale(1.5)';
      cursor.style.borderColor = 'hsl(var(--primary))';
    };

    const handleMouseLeave = () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.borderColor = 'hsl(var(--primary) / 0.5)';
    };

    // Add magnetic effect to interactive elements
    const magneticElements = document.querySelectorAll('.magnetic, button, a, [role="button"]');
    
    magneticElements.forEach((element) => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    document.addEventListener('mousemove', handleMouseMove);
    updateCursor();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      magneticElements.forEach((element) => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="fixed w-5 h-5 pointer-events-none z-[9999] border border-primary/50 rounded-full mix-blend-difference transition-transform duration-200"
        style={{ backdropFilter: 'invert(1)' }}
      />
      
      {/* Cursor trail */}
      <div
        ref={trailRef}
        className="fixed w-2 h-2 pointer-events-none z-[9998] bg-primary/60 rounded-full"
        style={{
          transition: 'transform 0.15s ease-out',
        }}
      />
    </>
  );
}