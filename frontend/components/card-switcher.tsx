"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { CreditCard } from "./credit-card/credit-card"

const CARDS = [
  { type: "gray-dark" as const, company: "kamino", logoSrc: "/kamino.png" },
  { type: "green" as const, company: "jupiter lend", logoSrc: "/jupiter-lend.png" },
] as const

const CARD_W = 320

export function CardSwitcher() {
  const [index, setIndex] = useState(0)

  const prev = () => setIndex((i) => (i - 1 + CARDS.length) % CARDS.length)
  const next = () => setIndex((i) => (i + 1) % CARDS.length)

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={prev}
        className="flex items-center justify-center size-6 shrink-0 rounded-full bg-[#F4F4F6] border border-[#E4E4E8]
                   text-[#8A8A92] hover:scale-105 cursor-pointer transition-all"
        aria-label="Previous card"
      >
        <ChevronLeft className="size-3" />
      </button>

      <div className="relative overflow-hidden rounded-2xl" style={{ width: CARD_W, height: Math.round(CARD_W * 190 / 316) }}>
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(${-index * CARD_W}px)` }}
        >
          {CARDS.map((card) => (
            <div key={card.type} className="flex-shrink-0" style={{ width: CARD_W }}>
              <CreditCard type={card.type} width={CARD_W} company={card.company} logoSrc={card.logoSrc} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={next}
        className="flex items-center justify-center size-6 shrink-0 rounded-full bg-[#F4F4F6] border border-[#E4E4E8]
                   text-[#8A8A92] hover:scale-105 cursor-pointer transition-all"
        aria-label="Next card"
      >
        <ChevronRight className="size-3" />
      </button>
    </div>
  )
}