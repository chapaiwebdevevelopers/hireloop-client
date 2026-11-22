import React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { paymentVerify } from "@/lib/actions/payments"

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { buttonVariants } from "@/components/ui/button"
import CopyButton from "@/components/CopyButton"

import {
    CheckCircle2,
    Sparkles,
    ArrowRight,
    CreditCard,
    Calendar,
    Mail,
    FileText,
    ShieldCheck,
    ExternalLink,
    Briefcase,
    AlertCircle,
    User,
    Check,
} from "lucide-react"

interface SuccessPaymentPageProps {
    searchParams: Promise<{
        session_id?: string
        payment_intent?: string
    }>
}

function formatStripeAmount(amount?: number | null, currency?: string | null) {
    if (typeof amount !== "number") return null
    const curr = (currency || "usd").toUpperCase()
    const formatted = (amount / 100).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
    if (curr === "USD") return `$${formatted}`
    if (curr === "BDT") return `BDT ${formatted}`
    return `${curr} ${formatted}`
}

function formatDate(timestamp?: number | null) {
    if (!timestamp) return new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

const SuccessPaymentPage = async ({ searchParams }: SuccessPaymentPageProps) => {
    const { session_id, payment_intent: directPaymentIntentId } = await searchParams

    // Fallback UI when neither session_id nor payment_intent is present
    if (!session_id && !directPaymentIntentId) {
        return (
            <div className="min-h-screen bg-muted/20 py-12 px-4 flex items-center justify-center">
                <Card className="max-w-md w-full text-center">
                    <CardHeader>
                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mb-2">
                            <AlertCircle className="size-6" />
                        </div>
                        <CardTitle className="text-xl">No Payment Reference Found</CardTitle>
                        <CardDescription>
                            We couldn&apos;t detect a valid payment session in the link. If you have already completed checkout, your account will be updated automatically.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center gap-3">
                        <Link href="/payment" className={buttonVariants({ variant: "outline" })}>
                            View Pricing
                        </Link>
                        <Link href="/dashboard" className={buttonVariants({ variant: "default" })}>
                            Go to Dashboard
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    let session: Stripe.Checkout.Session | null = null
    let paymentIntent: Stripe.PaymentIntent | null = null

    try {
        if (session_id) {
            session = await stripe.checkout.sessions.retrieve(session_id, {
                expand: [
                    "line_items",
                    "payment_intent",
                    "payment_intent.payment_method",
                    "payment_intent.latest_charge",
                ],
            })

            if (typeof session.payment_intent === "object" && session.payment_intent !== null) {
                paymentIntent = session.payment_intent as Stripe.PaymentIntent
            }
        } else if (directPaymentIntentId) {
            paymentIntent = await stripe.paymentIntents.retrieve(directPaymentIntentId, {
                expand: ["payment_method", "latest_charge"],
            })
        }
    } catch (err) {
        console.error("Error retrieving Stripe details:", err)
    }

    // Redirect to home or payment if the session is still open/incomplete
    if (session && session.status === "open") {
        return redirect("/payment")
    }

    // Trigger backend DB verification when session is complete
    if (session_id && session?.status === "complete" && session?.payment_status === "paid") {
        try {
            const dbResult = await paymentVerify(session_id)
            console.log("Payment verified in DB:", dbResult)
        } catch (error) {
            console.error("Failed to verify payment with DB endpoint:", error)
        }
    }

    // Extract useful fields from payment_intent and session
    const paymentIntentId = paymentIntent?.id || (typeof session?.payment_intent === "string" ? session.payment_intent : null)
    const paymentStatus = paymentIntent?.status || session?.payment_status || "succeeded"
    const amountTotal = paymentIntent?.amount ?? session?.amount_total ?? null
    const currency = paymentIntent?.currency ?? session?.currency ?? "usd"
    const formattedAmount = formatStripeAmount(amountTotal, currency)
    const customerEmail = session?.customer_details?.email || session?.customer_email || "Customer"
    const customerName = session?.customer_details?.name || null
    const createdAt = paymentIntent?.created ?? session?.created ?? null

    // Extract Card Details if payment_method was expanded
    let cardBrand: string | null = null
    let cardLast4: string | null = null
    if (paymentIntent && typeof paymentIntent.payment_method === "object" && paymentIntent.payment_method !== null) {
        const pm = paymentIntent.payment_method as Stripe.PaymentMethod
        if (pm.card) {
            cardBrand = pm.card.brand.toUpperCase()
            cardLast4 = pm.card.last4
        }
    }

    // Extract Stripe Receipt URL if available
    let receiptUrl: string | null = null
    if (paymentIntent && typeof paymentIntent.latest_charge === "object" && paymentIntent.latest_charge !== null) {
        const charge = paymentIntent.latest_charge as Stripe.Charge
        receiptUrl = charge.receipt_url || null
    }

    const planTitle = session?.line_items?.data?.[0]?.description || session?.metadata?.planName || "Hireloop Pro Plan"

    return (
        <div className="min-h-screen bg-muted/20 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl space-y-6">
                {/* Header Success Confirmation */}
                <div className="text-center space-y-3">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/5">
                        <CheckCircle2 className="size-9 stroke-[2.2]" />
                    </div>
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5">
                            <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2.5 py-0.5 text-xs">
                                <ShieldCheck className="size-3.5" />
                                Payment Succeeded
                            </Badge>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                            Welcome to Hireloop Pro!
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Your payment was processed successfully. A confirmation receipt will be sent to{" "}
                            <span className="font-semibold text-foreground">{customerEmail}</span>.
                        </p>
                    </div>
                </div>

                {/* Transaction & Receipt Card */}
                <Card className="shadow-xs overflow-hidden">
                    <CardHeader className="border-b border-border bg-muted/30 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Sparkles className="size-4.5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-bold text-foreground">
                                        {planTitle}
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Monthly Subscription • Full Access Unlocked
                                    </CardDescription>
                                </div>
                            </div>
                            {formattedAmount && (
                                <div className="text-right">
                                    <span className="text-lg font-extrabold text-foreground">
                                        {formattedAmount}
                                    </span>
                                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                                        Total Paid
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="pt-5 space-y-4 text-sm">
                        {/* Summary breakdown row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {/* Payment Intent ID */}
                            {paymentIntentId && (
                                <div className="rounded-xl border border-border bg-background p-3 space-y-1">
                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                        <FileText className="size-3 text-primary" />
                                        Payment Intent
                                    </span>
                                    <div className="flex items-center justify-between gap-2">
                                        <code className="text-xs font-mono font-medium text-foreground truncate max-w-[190px]">
                                            {paymentIntentId}
                                        </code>
                                        <CopyButton text={paymentIntentId} />
                                    </div>
                                </div>
                            )}

                            {/* Payment Status */}
                            <div className="rounded-xl border border-border bg-background p-3 space-y-1">
                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                    <ShieldCheck className="size-3 text-emerald-500" />
                                    Transaction Status
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="inline-block size-2 rounded-full bg-emerald-500" />
                                    <span className="text-xs font-semibold capitalize text-foreground">
                                        {paymentStatus === "succeeded" || paymentStatus === "paid" ? "Paid & Verified" : paymentStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Customer Email */}
                            <div className="rounded-xl border border-border bg-background p-3 space-y-1">
                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                    <Mail className="size-3 text-primary" />
                                    Billed To
                                </span>
                                <p className="text-xs font-medium text-foreground truncate">
                                    {customerName ? `${customerName} (${customerEmail})` : customerEmail}
                                </p>
                            </div>

                            {/* Payment Method / Card */}
                            <div className="rounded-xl border border-border bg-background p-3 space-y-1">
                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                    <CreditCard className="size-3 text-primary" />
                                    Payment Method
                                </span>
                                <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                                    {cardBrand ? (
                                        <>
                                            <span className="font-bold">{cardBrand}</span>
                                            <span>•••• {cardLast4}</span>
                                        </>
                                    ) : (
                                        <span>Stripe Secure Card</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Date & Session info */}
                        <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="size-3.5 text-muted-foreground" />
                                {formatDate(createdAt)}
                            </span>
                            {session_id && (
                                <span className="font-mono text-[11px] text-muted-foreground/80">
                                    Ref: {session_id.slice(0, 14)}...
                                </span>
                            )}
                        </div>

                        <Separator />

                        {/* Unlocked Benefits list */}
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                                What is now active on your account:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground/90">
                                {[
                                    "Unlimited job applications",
                                    "Direct recruiter messaging",
                                    "AI Resume Matcher & Score",
                                    "Pro candidate profile spotlight",
                                ].map((perk, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                            <Check className="size-2.5 stroke-[3]" />
                                        </div>
                                        <span>{perk}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/30 border-t border-border p-4">
                        {receiptUrl ? (
                            <a
                                href={receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={buttonVariants({ variant: "outline", size: "sm", className: "w-full sm:w-auto gap-1.5 text-xs" })}
                            >
                                <ExternalLink className="size-3.5" />
                                View Stripe Receipt
                            </a>
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                Receipt sent to your email
                            </span>
                        )}

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Link
                                href="/jobs"
                                className={buttonVariants({ variant: "outline", size: "sm", className: "flex-1 sm:flex-initial text-xs gap-1.5" })}
                            >
                                <Briefcase className="size-3.5" />
                                Browse Jobs
                            </Link>
                            <Link
                                href="/dashboard"
                                className={buttonVariants({ variant: "default", size: "sm", className: "flex-1 sm:flex-initial text-xs gap-1.5" })}
                            >
                                Dashboard
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </div>
                    </CardFooter>
                </Card>

                {/* Support Note */}
                <p className="text-center text-xs text-muted-foreground">
                    Need help with your invoice or account? Contact our team at{" "}
                    <a
                        href="mailto:Chapaiwebdevelopers@gmail.com"
                        className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                    >
                        Chapaiwebdevelopers@gmail.com
                    </a>
                </p>
            </div>
        </div>
    )
}

export default SuccessPaymentPage
