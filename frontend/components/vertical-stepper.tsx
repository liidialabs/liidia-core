"use client"

import { cn } from "@/lib/utils"
import { Check, LoaderCircle } from "lucide-react"

export interface VerticalStep {
  label: string
  detail?: string
}

interface VerticalStepperProps {
  steps: VerticalStep[]
  currentStep: number
  progress?: number
}

export function VerticalStepper({ steps, currentStep, progress }: VerticalStepperProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const status = i < currentStep ? "completed" : i === currentStep ? "active" : "pending"

        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border-2",
                  status === "completed" && "border-green-500 bg-green-500",
                  status === "active" && "border-[#6366F1]",
                  status === "pending" && "border-[#2A2A30]",
                )}
              >
                {status === "completed" && <Check className="size-3.5 text-white" />}
                {status === "active" && (
                  <LoaderCircle className="size-3.5 text-[#6366F1] animate-spin" />
                )}
                {status === "pending" && <div className="size-2 rounded-full bg-[#2A2A30]" />}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-px flex-1 min-h-6",
                    i < currentStep ? "bg-green-500" : "bg-[#2A2A30]",
                  )}
                />
              )}
            </div>

            <div
              className={cn(
                "pb-6",
                status === "completed" && "text-green-500",
                status === "active" && "text-white",
                status === "pending" && "text-[#5A5A62]",
              )}
            >
              <p className="text-sm font-medium">{step.label}</p>
              {step.detail && (
                <p className="text-xs text-[#8A8A92] mt-0.5">{step.detail}</p>
              )}
              {status === "active" && progress !== undefined && (
                <div className="mt-2 h-1 w-40 rounded-full bg-[#1C1C21] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#6366F1] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
