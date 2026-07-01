"use client"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

interface SlideConfirmProps {
  label: string
  onConfirm: () => void
  disabled?: boolean
}

export function SlideConfirm({ label, onConfirm, disabled }: SlideConfirmProps) {
  const [progress, setProgress] = useState(0)
  const stateRef = useRef({ dragging: false, pct: 0 })
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  const getPct = (clientX: number) => {
    if (!trackRef.current) return 0
    const rect = trackRef.current.getBoundingClientRect()
    const usable = rect.width - 48
    const x = clientX - rect.left - 24
    return Math.min(100, Math.max(0, (x / usable) * 100))
  }

  const handleMove = (clientX: number) => {
    if (!stateRef.current.dragging) return
    const pct = getPct(clientX)
    stateRef.current.pct = pct
    setProgress(pct)
  }

  const handleEnd = () => {
    if (!stateRef.current.dragging) return
    stateRef.current.dragging = false
    if (stateRef.current.pct >= 90) onConfirm()
    stateRef.current.pct = 0
    setProgress(0)
  }

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      handleMove(e.touches[0].clientX)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", handleEnd)
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", handleEnd)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", handleEnd)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", handleEnd)
    }
  }, [onConfirm])

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return
    e.preventDefault()
    stateRef.current.dragging = true
    stateRef.current.pct = 0
  }

  const thumbLeft = `max(4px, min(calc(100% - 52px), calc(${progress}% - 20px)))`

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative h-13 w-full rounded-xl overflow-hidden select-none",
        "bg-[#EBEBF0] border-[1.5px] border-[#E4E4E8]",
        disabled && "opacity-35 pointer-events-none",
      )}
    >
      <div
        className="absolute inset-y-0 left-0 bg-[#5271FF] transition-[width] duration-[60ms]"
        style={{ width: `${progress}%` }}
      />

      <div className="absolute inset-0 flex items-center justify-center px-14 pointer-events-none">
        <span
          className={cn(
            "text-sm font-medium truncate transition-colors duration-150",
            progress > 50 ? "text-white/90" : "text-[#6B6B7A] dark:text-[#5A5A6E]/30",
          )}
        >
          {label}
        </span>
      </div>

      <div
        ref={thumbRef}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        className="absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center
                   size-10 rounded-lg bg-[#5271FF] border-[3px] border-[#5271ff]
                   cursor-grab active:cursor-grabbing touch-none"
        style={{ left: thumbLeft }}
      >
        <ArrowRight className="size-4 text-white" />
      </div>
    </div>
  )
}