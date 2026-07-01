"use client"

import { useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { getRecipients, getCountryProviders, createRecipient, updateRecipient, deleteRecipient, type Recipient } from "@/lib/api"
import { CountrySelect } from "./country-select"
import { ProviderSelect } from "./provider-select"
import { Plus, Pencil, Trash2 } from "lucide-react"

const sliceNumber = (address: string) =>
  `${address.slice(0, 4)}...${address.slice(-3)}`

interface RecipientSelectProps {
  walletAddress: string | undefined
  onSelect: (recipient: {
    label: string
    provider: string
    type: "mobile"
    phoneNumber?: string
    countryCode?: string
  }) => void
  className?: string
}

export function RecipientSelect({ walletAddress, onSelect, className }: RecipientSelectProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [editRecipient, setEditRecipient] = useState<Recipient | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    recipient: Recipient
    anchorRect: DOMRect
  } | null>(null)

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const longPressed = useRef(false)

  useEffect(() => {
    if (!walletAddress) return
    getRecipients(walletAddress).then(setRecipients).catch(() => {})
  }, [walletAddress])

  const mobileRecipients = recipients.filter((r) => r.type === "mobile")

  const handleSelectSaved = (r: Recipient) => {
    if (longPressed.current) {
      longPressed.current = false
      return
    }
    onSelect({
      label: r.label || r.phoneNumber!,
      provider: r.provider,
      type: "mobile",
      phoneNumber: r.phoneNumber ?? undefined,
      countryCode: r.countryCode ?? undefined,
    })
  }

  const handleCardPointerDown = (e: React.PointerEvent, r: Recipient) => {
    const target = e.currentTarget
    longPressed.current = false
    longPressTimer.current = setTimeout(() => {
      longPressed.current = true
      setContextMenu({ recipient: r, anchorRect: target.getBoundingClientRect() })
    }, 500)
  }

  const handleCardPointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = undefined
    }
  }

  const handleEdit = () => {
    if (!contextMenu) return
    setEditRecipient(contextMenu.recipient)
    setShowAdd(true)
    setContextMenu(null)
  }

  const handleDelete = async () => {
    if (!contextMenu) return
    const r = contextMenu.recipient
    try {
      await deleteRecipient(r.id)
      setContextMenu(null)
      setRecipients((prev) => prev.filter((x) => x.id !== r.id))
    } catch {
      setContextMenu(null)
    }
  }

  const handleSaveNew = (r: Recipient) => {
    setRecipients((prev) => [r, ...prev])
    setShowAdd(false)
    handleSelectSaved(r)
  }

  const handleSaveEdit = (r: Recipient) => {
    setRecipients((prev) => prev.map((x) => (x.id === r.id ? r : x)))
    setShowAdd(false)
    setEditRecipient(null)
    handleSelectSaved(r)
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {!showAdd && mobileRecipients.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-6">
          <p className="text-[13px] font-medium text-[#6B6B7A]">
            No saved phone numbers
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5271FF] text-white text-[13px] font-medium cursor-pointer hover:scale-105 transition-all"
          >
            <Plus className="size-4" />
            Add phone number
          </button>
        </div>
      )}

      {!showAdd && mobileRecipients.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {mobileRecipients.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelectSaved(r)}
                onPointerDown={(e) => handleCardPointerDown(e, r)}
                onPointerUp={handleCardPointerUp}
                onPointerLeave={handleCardPointerUp}
                onPointerCancel={handleCardPointerUp}
                className="flex flex-col items-start p-3.5 cursor-pointer rounded-[14px] border-[1.5px] shadow-xs text-left transition-all border-[#E4E4E8] bg-[#F4F4F6] hover:scale-105 dark:border-[#22222A] dark:bg-[#1A1A22]"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="size-2 bg-[#5271ff]/80 rounded-full"/>
                  <span className="text-[11px] font-medium tracking-wide text-[#6B6B7A] dark:text-[#8A8A92]">
                    {r.provider}
                  </span>
                </div>
                <span className="text-sm font-semibold tabular-nums tracking-tight text-[#111118]/60 dark:text-[#E8E8F0]/60">
                  {sliceNumber(r.phoneNumber ?? "")}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-[1.5px] border-dashed border-[#E4E4E8] dark:border-[#22222A] text-[13px] font-medium text-[#6B6B7A] cursor-pointer hover:border-[#5271FF] hover:text-[#5271FF] transition-all"
          >
            <Plus className="size-4" />
            Add new phone number
          </button>
        </>
      )}

      {showAdd && (
        <AddRecipientForm
          walletAddress={walletAddress}
          editRecipient={editRecipient}
          onSave={editRecipient ? handleSaveEdit : handleSaveNew}
          onCancel={() => {
            setShowAdd(false)
            setEditRecipient(null)
          }}
        />
      )}

      {contextMenu && (
        <ContextMenu
          anchorRect={contextMenu.anchorRect}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  )
}

function ContextMenu({
  anchorRect,
  onEdit,
  onDelete,
  onClose,
}: {
  anchorRect: DOMRect
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }} onClick={onClose} />
      <div
        style={{
          position: 'fixed',
          top: anchorRect.bottom + 4,
          left: anchorRect.left,
          minWidth: 120,
          zIndex: 9999,
        }}
        className="rounded-xl border-[1.5px] border-[#E4E4E8] dark:border-[#22222A] bg-white dark:bg-[#17171D] shadow-lg overflow-hidden"
      >
        <button
          onClick={onEdit}
          className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-[13px] font-medium text-[#111118] dark:text-[#E8E8F0] cursor-pointer transition-colors hover:bg-[#F4F4F6] dark:hover:bg-[#22222A]"
        >
          <Pencil className="size-3.5" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-[13px] font-medium text-red-500 cursor-pointer transition-colors hover:bg-[#F4F4F6] dark:hover:bg-[#22222A]"
        >
          <Trash2 className="size-3.5" />
          Delete
        </button>
      </div>
    </>,
    document.body,
  )
}

function AddRecipientForm({
  walletAddress,
  editRecipient,
  onSave,
  onCancel,
}: {
  walletAddress: string | undefined
  editRecipient: Recipient | null
  onSave: (r: Recipient) => void
  onCancel: () => void
}) {
  const [countryCode, setCountryCode] = useState(editRecipient?.countryCode ?? "")
  const [providers, setProviders] = useState<string[]>([])
  const [provider, setProvider] = useState(editRecipient?.provider ?? "")
  const [phoneNumber, setPhoneNumber] = useState(editRecipient?.phoneNumber ?? "")
  const [saving, setSaving] = useState(false)

  const handleCountryChange = async (country: { code: string }) => {
    setCountryCode(country.code)
    setProvider("")
    try {
      const prods = await getCountryProviders(country.code)
      setProviders(prods)
    } catch {
      setProviders([])
    }
  }

  const handleSave = async () => {
    if (!walletAddress) return
    setSaving(true)
    try {
      const baseBody = {
        type: "mobile" as const,
        provider,
        phoneNumber,
        countryCode,
        label: phoneNumber,
      }
      const saved = editRecipient
        ? await updateRecipient(editRecipient.id, baseBody)
        : await createRecipient({ ...baseBody, walletAddress })
      onSave(saved)
    } catch {
      setSaving(false)
    }
  }

  const canSave = countryCode && provider && phoneNumber.length >= 5

  return (
    <div className="flex flex-col gap-3">
      <CountrySelect value={countryCode} onChange={handleCountryChange} />
      {providers.length > 0 && (
        <ProviderSelect
          providers={providers}
          value={provider}
          onChange={setProvider}
          placeholder="Select provider"
        />
      )}
      {provider && (
        <div className="bg-[#EBEBF0] dark:bg-[#17171D] px-3.5 border-[1.5px] border-[#E4E4E8] dark:border-[#22222A] rounded-xl focus-within:border-[#5271FF] transition-colors">
          <input
            type="tel"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="bg-transparent border-none outline-none w-full h-12 text-[15px] font-semibold text-[#111118] dark:text-[#E8E8F0] placeholder:text-[#C4C4CE] dark:placeholder:text-[#2E2E3A]"
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border-[1.5px] border-[#E4E4E8] dark:border-[#22222A] text-[13px] font-medium text-[#6B6B7A] cursor-pointer hover:bg-[#F4F4F6] dark:hover:bg-[#22222A] transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          className="flex-1 py-2.5 rounded-xl bg-[#5271FF] text-white text-[13px] font-medium cursor-pointer hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {saving ? "Saving..." : editRecipient ? "Save Changes" : "Save & Select"}
        </button>
      </div>
    </div>
  )
}
