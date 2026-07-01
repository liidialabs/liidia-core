"use client"

import { useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { getCountries, type Country } from "@/lib/api"
import { ChevronDown } from "lucide-react"

interface CountrySelectProps {
  value: string
  onChange: (country: Country) => void
  className?: string
}

export function CountrySelect({ value, onChange, className }: CountrySelectProps) {
  const [open, setOpen] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [mounted, setMounted] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    getCountries().then(setCountries).catch(() => {})
  }, [])

  const selected = countries.find((c) => c.code === value)

  return (
    <div className={cn("relative", className)}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 w-full px-3.5 py-3 rounded-xl border-[1.5px] bg-[#EBEBF0] dark:bg-[#17171D] border-[#E4E4E8] dark:border-[#22222A] text-left",
          "focus:outline-none focus:border-[#5271FF] transition-colors cursor-pointer",
        )}
      >
        {selected ? (
          <>
            <span className="text-lg">{selected.flag}</span>
            <span className="font-medium text-[13px] text-[#111118] dark:text-[#E8E8F0]">{selected.name}</span>
          </>
        ) : (
          <span className="font-medium text-[13px] text-[#6B6B7A] dark:text-[#5A5A6E]">Select country</span>
        )}
        <ChevronDown className="ml-auto size-4 text-[#6B6B7A]" />
      </button>

      {open && mounted && btnRef.current && (
        <PortalDropdown
          anchor={btnRef.current}
          onClose={() => setOpen(false)}
        >
          {countries.length === 0 && (
            <div className="px-3.5 py-3 text-[13px] text-[#6B6B7A]">Loading...</div>
          )}
          {countries.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => {
                onChange(country)
                setOpen(false)
              }}
              className={cn(
                "flex items-center gap-2 w-full px-3.5 py-3 text-left cursor-pointer transition-colors hover:bg-[#F4F4F6] dark:hover:bg-[#22222A]",
                value === country.code && "bg-[#5271FF]/10",
              )}
            >
              <span className="text-lg">{country.flag}</span>
              <span className="font-medium text-[13px] text-[#111118] dark:text-[#E8E8F0]">{country.name}</span>
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
