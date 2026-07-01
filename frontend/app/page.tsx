"use client"

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import Image from "next/image";
import { BorrowForm } from "@/components/BorrowForm"
import { CirclePower, ReceiptTextIcon } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";

export default function Home() {
  const { primaryWallet } = useDynamicContext();
  const isConnected = !!primaryWallet;
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="inline-flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="flex items-center justify-center">
              <Image src={'/liidia-t.png'} alt="Liidia Logo" width={12} height={12} className="w-8 h-8 rounded-md" />
            </div>
            liidia
          </a>
          <div className="flex items-center justify-center space-x-2 dark:text-primary-foreground">
            <ReceiptTextIcon className="size-6 cursor-pointer" />

            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <CirclePower
                  className={cn(
                    "size-6 cursor-pointer transition-colors",
                    isConnected ? "text-green-500" : "text-red-500"
                  )}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="p-2">
                <DynamicWidget />
              </DropdownMenuContent>
            </DropdownMenu>

            <ModeToggle />
          </div>
        </div>
        <BorrowForm />
      </div>
    </div>
  );
}
