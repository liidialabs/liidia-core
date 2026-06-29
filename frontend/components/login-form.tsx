"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SlideConfirm } from "@/components/slide-confirm"
import { VerticalStepper, type VerticalStep } from "@/components/vertical-stepper"
import { Check } from "lucide-react"
import { CardSwitcher } from '@/components/card-switcher' 

const STEPS = ["To", "Amount", "Send"] as const

const PHONE_RECIPIENTS = [
  { id: "1", label: "0711222132", provider: "Safaricom (MPesa)" },
  { id: "2", label: "0733444556", provider: "Airtel Money" },
  { id: "3", label: "0777888990", provider: "Safaricom (MPesa)" },
  { id: "4", label: "0712345678", provider: "Equitel" },
]

const CRYPTO_RECIPIENTS = [
  { id: "5", label: "0x742d...Bc4e9", provider: "USDC (Base)" },
  { id: "6", label: "0x8Ba1...cAc13", provider: "USDT (Arbitrum)" },
  { id: "7", label: "EPjFW...apC86", provider: "USDC (Solana)" },
  { id: "8", label: "DSgdv...gMWM", provider: "SOL (Solana)" },
]

const PROGRESS_STEPS: VerticalStep[] = [
  { label: "Validating recipient" },
  { label: "Sending transaction" },
  { label: "Confirming on-chain", detail: "Waiting for block confirmation" },
]

const sliceAddress = (address: string) =>
  `${address.slice(0, 4)}...${address.slice(-3)}`

export function BorrowForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [paymentMethod, setPaymentMethod] = useState<"mobile" | "crypto">("mobile")
  const [step, setStep] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [amount, setAmount] = useState("")
  const [progressStep, setProgressStep] = useState(0)
  const [progressPct, setProgressPct] = useState(0)
  const [txDone, setTxDone] = useState(false)

  const recipients = paymentMethod === "mobile" ? PHONE_RECIPIENTS : CRYPTO_RECIPIENTS
  const selected = recipients.find((r) => r.id === selectedId)
  const currency = paymentMethod === "mobile" ? "KES" : "USDT"

  const handleNext = () => {
    if (step === 0 && selectedId) setStep(1)
  }

  const handleConfirm = useCallback(() => {
    setStep(2)
    setProgressStep(0)
    setProgressPct(0)
    setTxDone(false)

    setTimeout(() => {
      setProgressStep(1)
      setProgressPct(0)
    }, 1500)

    setTimeout(() => {
      setProgressStep(2)
      setProgressPct(0)
    }, 3000)

    let pct = 0
    const id = setInterval(() => {
      pct += 5
      setProgressPct(pct)
      if (pct >= 100) {
        clearInterval(id)
        setTxDone(true)
      }
    }, 80)
  }, [])

  const handleDone = () => {
    setStep(0)
    setSelectedId(null)
    setAmount("")
    setProgressStep(0)
    setProgressPct(0)
    setTxDone(false)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="flex flex-col items-center p-6">
          <CardSwitcher />
        </CardHeader>
        <CardContent className="">
          <div className="flex items-center bg-[#EBEBF0] border-[1.5px] border-[#E4E4E8] rounded-xl p-[3px] gap-0.5 mb-5">
            {(["mobile", "crypto"] as const).map((method) => (
              <button
                key={method}
                onClick={() => { setPaymentMethod(method); setSelectedId(null); }}
                className={cn(
                  "flex-1 cursor-pointer py-2 px-6 rounded-[9px] text-[13px] font-medium tracking-wide duration-100 transition-all",
                  paymentMethod === method
                    ? "bg-[#5271FF] text-white"
                    : "bg-transparent text-[#6B6B7A] hover:text-[#A0A0B0] hover:bg-white/[0.04]",
                )}
              >
                {method === "mobile" ? "Mobile Money" : "Crypto Card"}
              </button>
            ))}
          </div>
          <div className="flex flex-col">
            {/* Horizontal stepper */}
            <div className="flex items-center justify-center mb-5">
              {STEPS.map((label, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={cn(
                        "flex size-5 items-center font-bold justify-center rounded-full text-[10px] font-medium transition-all",
                        i < step && "bg-green-500 text-white",
                        i === step && "bg-[#6366F1] text-white ring-2 ring-[#5A5A6E]/20",
                        i > step && "border border-[#DDDDE6] bg-transparent text-[#9898A6]",
                      )}
                    >
                      {i < step ? <Check className="size-2.5" /> : i + 1}
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-medium",
                        i <= step ? "text-[#5271ff]" : "text-[#9898A6]",
                      )}
                    >
                      {label}
                    </span>
                  </div>

                  {i < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "w-12 h-px mb-4 mx-1",
                        i < step ? "bg-green-500" : "bg-[#DDDDE6]",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Content area (fixed height) */}
            <div className="h-80">
              {step === 0 && (
                <div className="grid grid-cols-2 gap-2 h-full content-start">
                  {recipients.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedId(r.id)}
                      className={cn(
                        "flex flex-col items-start p-3.5 cursor-pointer rounded-[14px] border-[1.5px] shadow-xs text-left transition-all",
                        selectedId === r.id
                          ? "border-[#5271FF]/50 bg-[#5271FF]/50"
                          : "border-[#E4E4E8] bg-[#F4F4F6] hover:scale-105",
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="size-1.5 rounded-full bg-gray-400" />
                        <span
                          className={cn(
                            "text-[11px] font-medium tracking-wide",
                            selectedId === r.id ? "text-[#5271ff]" : "text-[#6B6B7A]",
                          )}
                        >
                          {r.provider}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium tabular-nums tracking-tight",
                          selectedId === r.id ? "text-[#5271ff]" : "text-[#111118]/60",
                        )}
                      >
                        {sliceAddress(r.label)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-3">
                  {selected && (
                    <div className="flex items-center justify-between px-3.5 py-3 rounded-xl border-[#5271FF]/50 bg-[#5271FF]/50">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[13px] font-medium text-[#5271ff] tabular-nums">{selected.label}</p>
                        <p className="text-[11px] font-medium text-[#5271FF]">{selected.provider}</p>
                      </div>
                      <div className="size-2 rounded-full bg-[#5271FF]" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center h-14 px-3.5 bg-[#EBEBF0] border-[1.5px] border-[#E4E4E8] rounded-xl
                                    focus-within:border-[#5271FF] transition-colors">
                      <span className="text-[13px] font-medium text-[#5A5A6E] mr-2.5 flex-shrink-0">{currency}</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="flex-1 h-full bg-transparent border-none shadow-none focus-visible:ring-0
                                  text-[22px] font-medium text-[#E8E8F0] text-right tabular-nums placeholder:text-[#2E2E3A]
                                  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-1.5 mt-1.5 px-0.5">
                      <span className="text-[11px] text-[#3A3A4A]">Balance</span>
                      <span className="text-[11px] font-medium text-[#5271FF]">
                        {paymentMethod === "mobile" ? "1,240" : "2,350"} {currency}
                      </span>
                    </div>
                  </div>

                  <SlideConfirm
                    label={`Slide to send ${currency} ${amount || "0"} to ${selected?.label ?? "..."}`}
                    onConfirm={handleConfirm}
                    disabled={!amount || parseFloat(amount) <= 0}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="pt-2">
                  <VerticalStepper
                    steps={PROGRESS_STEPS}
                    currentStep={txDone ? 3 : progressStep}
                    progress={progressStep === 2 ? progressPct : undefined}
                  />
                  {txDone && (
                    <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                      <p className="text-sm font-medium text-green-500">Transaction complete</p>
                      <p className="text-xs text-[#8A8A92] mt-1">
                        {paymentMethod === "mobile"
                          ? `Sent ${currency}${amount} to ${selected?.label}`
                          : `Sent ${currency}${amount} to ${selected?.provider}`}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom button */}
            <div className="mt-4">
              {step === 0 && (
                <Button
                  className="w-full rounded-xl h-11 bg-[#5271ff] hover:bg-[#818CF8] text-white"
                  disabled={!selectedId}
                  onClick={handleNext}
                >
                  Next →
                </Button>
              )}
              {step === 2 && txDone && (
                <Button
                  className="w-full rounded-xl h-11"
                  variant="outline"
                  onClick={handleDone}
                >
                  Done
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
