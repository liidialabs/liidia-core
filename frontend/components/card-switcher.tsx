"use client"

import { cn } from "@/lib/utils"
import { CreditCard } from "./credit-card/credit-card"
import type { BorrowToken } from "@/lib/api"

interface CardSwitcherProps {
  borrowToken: BorrowToken
  onCycleToken: () => void
  borrowableAmount: number
  rates: Record<string, { borrowApy: number }>
}

const CARD_W = 320

export function CardSwitcher({ borrowToken, onCycleToken, borrowableAmount, rates }: CardSwitcherProps) {
  const apr = rates[borrowToken.symbol]?.borrowApy
  const rateDisplay = apr != null ? `${(apr * 100).toFixed(2)}%` : "—"

  return (
    <div className="flex items-center justify-center gap-1">
      <div className="relative overflow-hidden rounded-2xl" style={{ width: CARD_W, height: Math.round(CARD_W * 190 / 316) }}>
        <button
          onClick={onCycleToken}
          className="block w-full h-full cursor-pointer text-left"
          aria-label="Cycle borrow token"
          type="button"
        >
          <CreditCard
            type="gray-dark"
            width={CARD_W}
            company="kamino"
            logoSrc="/kamino.png"
            borrowToken={borrowToken}
            rate={rateDisplay}
            availableAmountUsd={borrowableAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          />
        </button>
      </div>
    </div>
  )
}
