import Image from "next/image";
import { BorrowForm } from "@/components/login-form"
import { CirclePower, ReceiptTextIcon } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="inline-flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="flex items-center justify-center rounded-md">
              <Image src={'/liidia.png'} alt="Liidia Logo" width={12} height={12} className="w-6 h-6 rounded-md" />
            </div>
            liidia
          </a>
          <div className="flex items-center justify-center space-x-2 cursor-pointer rounded-md dark:text-primary-foreground">
            <ReceiptTextIcon className="size-6" />
            <CirclePower className="size-6" />
            <ModeToggle />
          </div>
        </div>
        <BorrowForm />
      </div>
    </div>
  );
}
