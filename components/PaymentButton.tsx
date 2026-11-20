"use client"

import React, { useState } from "react"
import { Lock, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/toast"

interface PaymentButtonProps {
    formattedPrice: string
    currency: "BDT" | "USD"
    userEmail?: string
}

export default function PaymentButton({
    formattedPrice,
    currency,
    userEmail,
}: PaymentButtonProps) {
    const [isProcessing, setIsProcessing] = useState(false)



    return (
        <div className="pt-4">
            <button
                type="submit" role="link"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md transition-all disabled:opacity-50 active:scale-[0.99] cursor-pointer"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Redirecting to Stripe...</span>
                    </>
                ) : (
                    <>
                        <Lock className="size-4" />
                        <span>Pay {formattedPrice}</span>
                    </>
                )}
            </button>
            <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
                Guaranteed safe & secure checkout powered by Stripe.
            </p>
        </div>
    )
}
