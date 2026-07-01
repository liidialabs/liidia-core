"use client"

import { useState, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { SlideConfirm } from "@/components/slide-confirm"
import { VerticalStepper, type VerticalStep } from "@/components/vertical-stepper"
import { RecipientSelect } from "@/components/recipient-select"
import { CardSwitcher } from "@/components/card-switcher"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { Check } from "lucide-react"
import {
  BORROW_TOKENS,
  type BorrowToken,
  getKaminoObligations,
  getKaminoRates,
  getFxRates,
  kaminoBorrow,
} from "@/lib/api"
import { Transaction, VersionedTransaction, Connection } from "@solana/web3.js"

const STEPS = ["To", "Amount", "Send"] as const

const PROGRESS_STEPS: VerticalStep[] = [
  { label: "Validating recipient" },
  { label: "Sending transaction" },
  { label: "Confirming on-chain", detail: "Waiting for block confirmation" },
]

const COUNTRY_CURRENCIES: Record<string, { code: string; symbol: string; defaultMax: number }> = {
  KE: { code: 'KES', symbol: 'KSh', defaultMax: 100_000 },
  NG: { code: 'NGN', symbol: '₦',   defaultMax: 500_000 },
  GH: { code: 'GHS', symbol: 'GH₵', defaultMax: 10_000 },
  TZ: { code: 'TZS', symbol: 'TSh', defaultMax: 500_000 },
  UG: { code: 'UGX', symbol: 'USh', defaultMax: 1_000_000 },
  ZA: { code: 'ZAR', symbol: 'R',   defaultMax: 10_000 },
  RW: { code: 'RWF', symbol: 'FRw', defaultMax: 200_000 },
  ET: { code: 'ETB', symbol: 'Br',  defaultMax: 10_000 },
}

const sliceAddress = (address: string) =>
  `${address.slice(0, 4)}...${address.slice(-3)}`

interface SelectedRecipient {
  label: string
  provider: string
  type: "mobile"
  phoneNumber?: string
  countryCode?: string
}

function base64ToBytes(base64: string): Uint8Array {
  const bin = atob(base64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

export function BorrowForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { primaryWallet } = useDynamicContext()
  const walletAddress = primaryWallet?.address

  const [selected, setSelected] = useState<SelectedRecipient | null>(null)
  const [step, setStep] = useState(0)
  const [amount, setAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState<BorrowToken>(
    () => BORROW_TOKENS.find((t) => t.symbol === "USDT") ?? BORROW_TOKENS[0],
  )
  const [error, setError] = useState<string | null>(null)
  const [borrowing, setBorrowing] = useState(false)
  const [progressStep, setProgressStep] = useState(0)
  const [progressPct, setProgressPct] = useState(0)
  const [txDone, setTxDone] = useState(false)
  const [obligations, setObligations] = useState<import("@/lib/api").KaminoObligation[]>([])
  const [rates, setRates] = useState<Record<string, { borrowApy: number }>>({})
  const [borrowableAmount, setBorrowableAmount] = useState(0)
  const [fxRates, setFxRates] = useState<Record<string, number> | null>(null)

  const cc = selected?.countryCode ? COUNTRY_CURRENCIES[selected.countryCode] : null
  const currencyLabel = cc?.code ?? selectedToken.symbol
  const currencySymbol = cc?.symbol ?? ""
  const usdRate = cc && fxRates?.[cc.code] ? 1 / fxRates[cc.code] : null

  useEffect(() => {
    if (!walletAddress) return
    getKaminoObligations(walletAddress).then(setObligations).catch(() => setObligations([]))
    getKaminoRates().then(setRates).catch(() => setRates({}))
    getFxRates().then(setFxRates).catch(() => setFxRates(null))
  }, [walletAddress])

  useEffect(() => {
    if (obligations.length === 0) {
      setBorrowableAmount(0)
      return
    }
    const ob = obligations[0]
    if (ob.maxBorrowable != null) {
      setBorrowableAmount(ob.maxBorrowable)
    } else {
      const available = ob.collateralValue * 0.8 - ob.borrowValue
      setBorrowableAmount(Math.max(0, available))
    }
  }, [obligations])

  const cycleToken = useCallback(() => {
    setSelectedToken((prev) => {
      const idx = BORROW_TOKENS.findIndex((t) => t.symbol === prev.symbol)
      return BORROW_TOKENS[(idx + 1) % BORROW_TOKENS.length]
    })
  }, [])

  const entered = parseFloat(amount) || 0
  const maxDisplay = cc && usdRate != null
    ? Math.min(borrowableAmount / usdRate, cc.defaultMax)
    : borrowableAmount
  const usdEquivalent = cc && usdRate != null ? entered * usdRate : entered

  const handleSelectRecipient = (r: SelectedRecipient) => {
    setSelected(r)
    setStep(1)
    setError(null)
  }

  const handleBack = () => {
    if (step === 1) {
      setStep(0)
      setError(null)
    }
  }

  const handleConfirm = useCallback(async () => {
    if (!walletAddress || !primaryWallet) return
    setError(null)
    setBorrowing(true)
    setStep(2)
    setProgressStep(0)
    setProgressPct(0)
    setTxDone(false)

    try {
      const kaminoOb = await getKaminoObligations(walletAddress)
      if (kaminoOb.length === 0) {
        throw new Error("No borrow position found")
      }

      const borrowAmount = usdRate != null ? (parseFloat(amount) * usdRate).toFixed(6) : amount
      const res = await kaminoBorrow(walletAddress, selectedToken.symbol, borrowAmount)
      const txBase64 = res.transaction

      setProgressStep(1)

      const txBytes = base64ToBytes(txBase64)
      let tx: Transaction | VersionedTransaction
      try {
        tx = VersionedTransaction.deserialize(txBytes)
      } catch {
        tx = Transaction.from(txBytes)
      }

      const signedTx = await (primaryWallet.connector as any).signTransaction(tx)
      const signed = signedTx ?? tx

      const connection = new Connection("https://api.mainnet-beta.solana.com")
      const rawTx = "serialize" in signed ? (signed as VersionedTransaction).serialize() : (signed as Transaction).serialize({ requireAllSignatures: false, verifySignatures: false })
      const sig = await connection.sendRawTransaction(rawTx, { skipPreflight: true })

      setProgressStep(2)
      setProgressPct(20)

      const confirmation = await connection.confirmTransaction(sig, "confirmed")
      if (confirmation.value.err) {
        throw new Error(`Transaction failed`)
      }

      setProgressPct(100)
      setTxDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setStep(1)
    } finally {
      setBorrowing(false)
    }
  }, [walletAddress, primaryWallet, selectedToken, amount, usdRate])

  const handleDone = () => {
    setStep(0)
    setSelected(null)
    setAmount("")
    setProgressStep(0)
    setProgressPct(0)
    setTxDone(false)
    setError(null)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="flex flex-col items-center p-6">
          <CardSwitcher
            borrowToken={selectedToken}
            onCycleToken={cycleToken}
            borrowableAmount={borrowableAmount}
            rates={rates}
          />
        </CardHeader>
        <CardContent className="">
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

          {/* Content area */}
          <div className="min-h-48">
            {step === 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-[13px] font-semibold text-[#1E293B] dark:text-[#E8E8F0]">Select destination</p>
                <RecipientSelect
                  walletAddress={walletAddress}
                  onSelect={handleSelectRecipient}
                />
              </div>
            )}

            {step === 1 && selected && (
              <div className="flex flex-col gap-3">
                {error && (
                  <div className="px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="text-[12px] font-medium text-red-500">{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-between px-3.5 py-3 rounded-xl border-[#5271FF]/50 bg-[#5271FF]/30">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[16px] font-bold text-[#5271ff] tabular-nums">
                      {sliceAddress(selected.phoneNumber ?? "")}
                    </p>
                    <p className="text-[12px] font-medium text-[#1E293B]/80">{selected.provider}</p>
                  </div>
                  <div className="size-2 rounded-full bg-[#5271FF]" />
                </div>

                <div className="bg-[#EBEBF0] dark:bg-[#17171D] px-3.5 border-[1.5px] border-[#E4E4E8] dark:border-[#22222A] rounded-xl focus-within:border-[#5271FF] transition-colors">
                  <div className="flex items-center h-16">
                    <span className="text-3xl font-bold text-[#6B6B7A] dark:text-[#5A5A6E] mr-2.5 flex-shrink-0">
                      {currencySymbol || currencyLabel}
                    </span>
                    <input
                      type="text"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-transparent border-none outline-none w-full
                                text-3xl font-bold text-[#5271ff] dark:text-[#E8E8F0] tabular-nums
                                placeholder:text-[#C4C4CE] dark:placeholder:text-[#2E2E3A]"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-1 mt-1 p-1">
                    <div className="flex items-center gap-0.5">
                      <span className="text-xs font-medium text-[#6B6B7A] dark:text-[#3A3A4A]">$</span>
                      <span className="text-xs font-bold text-[#6B6B7A] dark:text-[#5A5A6E]">
                        {usdEquivalent.toFixed(2)}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setAmount(maxDisplay.toFixed(cc ? 2 : 6))}
                        className="text-[11px] font-medium text-[#6B6B7A] dark:text-[#5A5A6E] bg-[#DDDDE6] dark:bg-[#2A2A30] px-2 py-0.5 rounded-full cursor-pointer hover:bg-[#CCCCD6] dark:hover:bg-[#3A3A4A] transition-colors"
                        type="button"
                      >
                        MAX
                      </button>
                      <span className="text-xs font-semibold text-[#111118] dark:text-[#E8E8F0]">
                        {currencySymbol || currencyLabel} {maxDisplay.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <SlideConfirm
                  label={`Slide to send ${currencyLabel} ${amount || "0"} to ${sliceAddress(selected.label)}`}
                  onConfirm={handleConfirm}
                  disabled={!amount || parseFloat(amount) <= 0 || borrowing}
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
                      {selected && (
                        <>
                          Sent {currencyLabel}{amount} to {sliceAddress(selected.label)}
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom button */}
          <div className="mt-4">
            {step === 0 && (
              <p className="text-[11px] text-center text-[#6B6B7A] dark:text-[#5A5A6E]">
                Select or add a recipient to continue
              </p>
            )}
            {step === 1 && (
              <Button
                className="w-full rounded-xl h-11 bg-[#5271ff] cursor-pointer hover:scale-105 text-white"
                onClick={handleBack}
              >
                ← Back
              </Button>
            )}
            {step === 2 && txDone && (
              <Button
                className="w-full rounded-xl h-11 bg-[#5271ff] cursor-pointer hover:scale-105 text-white"
                onClick={handleDone}
              >
                Done
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}
