"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface ProviderSelectProps {
  providers: string[]
  value: string
  onChange: (provider: string) => void
  placeholder?: string
  className?: string
}

export function ProviderSelect({
  providers,
  value,
  onChange,
  placeholder = "Select provider",
  className,
}: ProviderSelectProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => { setMounted(true) }, [])

  return (
    <div className={cn("relative", className)}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => providers.length > 0 && setOpen(!open)}
        className={cn(
          "flex items-center gap-2 w-full px-3.5 py-3 rounded-xl border-[1.5px] bg-[#EBEBF0] dark:bg-[#17171D] border-[#E4E4E8] dark:border-[#22222A] text-left",
          "focus:outline-none focus:border-[#5271FF] transition-colors cursor-pointer",
        )}
      >
        <span
          className={cn(
            "font-medium text-[13px]",
            value ? "text-[#111118] dark:text-[#E8E8F0]" : "text-[#6B6B7A] dark:text-[#5A5A6E]",
          )}
        >
          {value || placeholder}
        </span>
        <ChevronDown className="ml-auto size-4 text-[#6B6B7A]" />
      </button>

      {open && mounted && btnRef.current && (
        <PortalDropdown
          anchor={btnRef.current}
          onClose={() => setOpen(false)}
        >
          {providers.length === 0 && (
            <div className="px-3.5 py-3 text-[13px] text-[#6B6B7A]">No providers available</div>
          )}
          {providers.map((provider) => (
            <button
              key={provider}
              type="button"
              onClick={() => {
                onChange(provider)
                setOpen(false)
              }}
              className={cn(
                "flex items-center gap-2 w-full px-3.5 py-3 text-left cursor-pointer transition-colors hover:bg-[#F4F4F6] dark:hover:bg-[#22222A]",
                value === provider && "bg-[#5271FF]/10",
              )}
            >
              <span className="font-medium text-[13px] text-[#111118] dark:text-[#E8E8F0]">{provider}</span>
            </button>
          ))}
        </PortalDropdown>
      )}
    </div>
  )
}

function PortalDropdown({
  anchor,
  onClose,
  children,
}: {
  anchor: HTMLElement
  onClose: () => void
  children: React.ReactNode
}) {
  const [style, setStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    const rect = anchor.getBoundingClientRect()
    setStyle({
      position: 'fixed',
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    })
  }, [anchor])

  useEffect(() => {
    function handleScroll() { onClose() }
    window.addEventListener("scroll", handleScroll, true)
    return () => window.removeEventListener("scroll", handleScroll, true)
  }, [onClose])

  return createPortal(
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
        onClick={onClose}
      />
      <div
        style={style}
        className="rounded-xl border-[1.5px] border-[#E4E4E8] dark:border-[#22222A] bg-white dark:bg-[#17171D] shadow-lg overflow-hidden max-h-60 overflow-y-auto"
      >
        {children}
      </div>
    </>,
    document.body,
  )
}
