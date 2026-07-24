"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function DraggableFab({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const [position, setPosition] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const isDraggingRef = React.useRef(false);
  const startPosRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragDistRef = React.useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isDraggingRef.current = true;
    dragDistRef.current = 0;
    startPosRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const newX = e.clientX - startPosRef.current.x;
    const newY = e.clientY - startPosRef.current.y;

    const deltaX = newX - position.x;
    const deltaY = newY - position.y;
    dragDistRef.current += Math.abs(deltaX) + Math.abs(deltaY);

    if (dragDistRef.current > 4) {
      setPosition({ x: newX, y: newY });
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    // Only prevent default navigation if the user actually dragged the element
    if (dragDistRef.current > 8) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClickCapture={handleClickCapture}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: "none",
      }}
      className={cn(
        "cursor-grab active:cursor-grabbing select-none transition-shadow inline-block",
        className,
      )}
    >
      {children}
    </div>
  );
}
