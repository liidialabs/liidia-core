"use client";

import { useMemo } from "react";
import { cx, cn, sortCx } from "@/lib/utils";
import { SolanaIcon } from "./icons";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import type { BorrowToken } from '../../lib/api'

const styles = sortCx({
    // Normal
    transparent: {
        root: "bg-black/10 bg-linear-to-br from-white/30 to-transparent backdrop-blur-[6px] before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
        company: "text-white",
        footerText: "text-white",
        paypassIcon: "text-white",
        cardTypeRoot: "bg-white/10",
    },
    "transparent-gradient": {
        root: "bg-black/10 bg-linear-to-br from-white/30 to-transparent backdrop-blur-[6px] before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
        company: "text-white",
        footerText: "text-white",
        paypassIcon: "text-white",
        cardTypeRoot: "bg-white/10",
    },
    "brand-dark": {
        root: "bg-linear-to-tr from-brand-900 to-brand-700 before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
        company: "text-white",
        footerText: "text-white",
        paypassIcon: "text-white",
        cardTypeRoot: "bg-white/10",
    },
    "brand-light": {
        root: "bg-brand-100 before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-black/10 before:ring-inset",
        company: "text-neutral-700",
        footerText: "text-neutral-700",
        paypassIcon: "text-white",
        cardTypeRoot: "bg-white",
    },
    "gray-dark": {
        root: "bg-linear-to-tr from-neutral-900 to-neutral-700 before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
        company: "text-white",
        footerText: "text-white",
        paypassIcon: "text-white",
        cardTypeRoot: "bg-white/10",
    },
    "gray-light": {
        root: "bg-neutral-100 before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-black/10 before:ring-inset",
        company: "text-neutral-700",
        footerText: "text-neutral-700",
        paypassIcon: "text-neutral-400",
        cardTypeRoot: "bg-white",
    },
    "green": {
        root: "bg-linear-to-tr from-emerald-900 to-emerald-600 before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
        company: "text-white",
        footerText: "text-white",
        paypassIcon: "text-white",
        cardTypeRoot: "bg-white/10",
    },

    // Strip
    "transparent-strip": {
        root: "bg-linear-to-br from-white/30 to-transparent backdrop-blur-[6px] before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
        company: "text-white",
        footerText: "text-white",
        paypassIcon: "text-white",
        cardTypeRoot: "bg-white/10",
    },
    "gray-strip": {
        root: "bg-neutral-100 before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
        company: "text-neutral-700",
        footerText: "text-white",
        paypassIcon: "text-neutral-400",
        cardTypeRoot: "bg-white/10",
    },
    "gradient-strip": {
        root: "bg-linear-to-b from-[#A5C0EE] to-[#FBC5EC] before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
        company: "text-white",
        footerText: "text-white",
        paypassIcon: "text-white",
        cardTypeRoot: "bg-white/10",
    },
    "salmon-strip": {
        root: "bg-[#F4D9D0] before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
        company: "text-neutral-700",
        footerText: "text-white",
        paypassIcon: "text-white",
        cardTypeRoot: "bg-white/10",
    },

    // Vertical strip
    "gray-strip-vertical": {
        root: "bg-linear-to-br from-white/30 to-transparent before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
        company: "text-white",
        footerText: "text-white",
        paypassIcon: "text-neutral-400",
        cardTypeRoot: "bg-white/10",
    },
    "gradient-strip-vertical": {
        root: "bg-linear-to-b from-[#FBC2EB] to-[#A18CD1] before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
        company: "text-white",
        footerText: "text-white",
        paypassIcon: "text-white",
        cardTypeRoot: "bg-white/10",
    },
    "salmon-strip-vertical": {
        root: "bg-[#F4D9D0] before:pointer-events-none before:absolute before:inset-0 before:z-1 before:rounded-[inherit] before:mask-linear-135 before:mask-linear-to-white/20 before:ring-1 before:ring-white/30 before:ring-inset",
        company: "text-white",
        footerText: "text-white",
        paypassIcon: "text-white",
        cardTypeRoot: "bg-white/10",
    },
});

const _NORMAL_TYPES = ["transparent", "transparent-gradient", "brand-dark", "brand-light", "gray-dark", "gray-light"] as const;
const STRIP_TYPES = ["transparent-strip", "gray-strip", "gradient-strip", "salmon-strip"] as const;
const VERTICAL_STRIP_TYPES = ["gray-strip-vertical", "gradient-strip-vertical", "salmon-strip-vertical"] as const;


type CreditCardType = (typeof _NORMAL_TYPES)[number] | (typeof STRIP_TYPES)[number] | (typeof VERTICAL_STRIP_TYPES)[number];



const TOKEN_COLORS: Record<string, string> = {
  USDC: '#2775CA',
  USDT: '#26A17B',
  USDS: '#1A1A1A',
  USDG: '#2D8CF0',
};

function TokenIcon({ symbol, className }: { symbol: string; className?: string }) {
  const bg = TOKEN_COLORS[symbol] ?? '#6366F1';
  const initials = symbol.slice(0, 2);
  return (
    <div
      className={cn("flex items-center justify-center rounded-full text-[8px] font-bold text-white shrink-0", className)}
      style={{ background: bg }}
    >
      {initials}
    </div>
  );
}

interface CreditCardProps {
    company?: string;
    availableAmountUsd?: string;
    type?: CreditCardType;
    className?: string;
    width?: number;
    logoSrc?: string;
    borrowToken: BorrowToken;
    rate: string
}

const sliceAddress = (address: string) =>
  `${address.slice(0, 6)}......${address.slice(-6)}`

const calculateScale = (desiredWidth: number, originalWidth: number, originalHeight: number) => {
    // Calculate the scale factor
    const scale = desiredWidth / originalWidth;

    // Calculate the new dimensions
    const scaledWidth = originalWidth * scale;
    const scaledHeight = originalHeight * scale;

    return {
        scale: scale.toFixed(4), // Scale rounded to 4 decimal places
        scaledWidth: scaledWidth.toFixed(2), // Width rounded to 2 decimal places
        scaledHeight: scaledHeight.toFixed(2), // Height rounded to 2 decimal places
    };
};

export const CreditCard = ({
    company = "Untitled.",
    availableAmountUsd = "0.00",
    type = "brand-dark",
    className,
    width,
    logoSrc,
    borrowToken,
    rate,
}: CreditCardProps) => {
    const originalWidth = 316;
    const originalHeight = 190;

    const { primaryWallet } = useDynamicContext();
    const connectedUser = primaryWallet ? primaryWallet?.address as string : '000000000000000000000000000000000000000000000000000000'

    const { scale, scaledWidth, scaledHeight } = useMemo(() => {
        if (!width)
            return {
                scale: 1,
                scaledWidth: originalWidth,
                scaledHeight: originalHeight,
            };

        return calculateScale(width, originalWidth, originalHeight);
    }, [width]);

    return (
        <div
            style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
            }}
            className={cx("relative flex", className)}
        >
            <div
                style={{
                    transform: `scale(${scale})`,
                    width: `${originalWidth}px`,
                    height: `${originalHeight}px`,
                }}
                className={cx("absolute top-0 left-0 flex origin-top-left flex-col justify-between overflow-hidden rounded-2xl p-4", styles[type].root)}
            >
                {/* Horizontal strip */}
                {STRIP_TYPES.includes(type as (typeof STRIP_TYPES)[number]) && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-1/2 bg-neutral-800"></div>
                )}
                {/* Vertical stripe */}
                {VERTICAL_STRIP_TYPES.includes(type as (typeof VERTICAL_STRIP_TYPES)[number]) && (
                    <div className="pointer-events-none absolute inset-y-0 right-22 left-0 z-0 bg-neutral-800"></div>
                )}
                {/* Gradient diffusor */}
                {type === "transparent-gradient" && (
                    <div className="absolute -top-4 -left-4 grid grid-cols-2 blur-3xl">
                        <div className="size-20 rounded-tl-full bg-pink-500 opacity-30 mix-blend-normal" />
                        <div className="size-20 rounded-tr-full bg-orange-500 opacity-50 mix-blend-normal" />
                        <div className="size-20 rounded-bl-full bg-blue-500 opacity-30 mix-blend-normal" />
                        <div className="bg-green-500 size-20 rounded-br-full opacity-30 mix-blend-normal" />
                    </div>
                )}

                <div className="relative flex items-start justify-between px-1 pt-1">
                    <div className={cx("flex items-center gap-1.5", styles[type].company)}>
                        {logoSrc && <img src={logoSrc} alt="" className="size-8 shrink-0 rounded-full" />}
                        <span className="text-md leading-[normal] font-semibold">{company}</span>
                    </div>

                    {/* <img src="/liidia-transp.png" alt="" className="h-10" /> */}
                </div>

                <div className="relative flex items-end justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                            <TokenIcon symbol={borrowToken.symbol} className="size-4" />
                            <p
                                style={{
                                    wordBreak: "break-word",
                                }}
                                className={cx("my-0 text-xs leading-snug font-semibold tracking-[0.6px] uppercase", styles[type].footerText)}
                            >
                                {borrowToken?.name}
                            </p>
                            <p
                                style={{
                                    wordBreak: "break-word",
                                }}
                                className={cx("my-0 text-xs leading-snug font-semibold tracking-[0.6px] uppercase font-mono", styles[type].footerText)}
                            >
                                {rate}
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p
                                style={{
                                    wordBreak: "break-word",
                                }}
                                className={cx("text-xs leading-snug font-semibold tracking-[0.6px] uppercase", styles[type].footerText)}
                            >
                                Available:
                            </p>
                            <p
                                className={cx(
                                    "text-right text-xs leading-[normal] font-semibold tracking-[0.6px] tabular-nums font-mono",
                                    styles[type].footerText,
                                )}
                            >
                                ${availableAmountUsd}
                            </p>
                        </div>
                        <div className={cx("text-md leading-[normal] font-semibold tracking-[1px] tabular-nums font-mono", styles[type].footerText)}>
                            {sliceAddress(connectedUser)}

                            {/* This is just a placeholder to always keep the space for card number even if there's no card number yet. */}
                            <span className="pointer-events-none invisible inline-block w-0 max-w-0 opacity-0">1</span>
                        </div>
                    </div>

                    <div className={cx("flex h-8 w-11.5 shrink-0 items-center justify-center rounded", styles[type].cardTypeRoot)}>
                        <SolanaIcon className="text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};