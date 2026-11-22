"use client"

import React, { useState } from "react"
import { Check, Copy } from "lucide-react"

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy to clipboard"}
            className="inline-flex size-6 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
        >
            {copied ? (
                <Check className="size-3 text-emerald-500 stroke-[3]" />
            ) : (
                <Copy className="size-3" />
            )}
        </button>
    )
}
