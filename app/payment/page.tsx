import React from "react"
import Link from "next/link"
import { headers } from "next/headers"
import { ShieldCheck, ArrowLeft, Sparkles, Check, Globe2 } from "lucide-react"
import { auth } from "@/lib/auth"
import PaymentButton from "@/components/PaymentButton"
import { toast } from "@/components/ui/toast"

type Currency = "BDT" | "USD"

const USD_RATE = 127.6665
const USD_PRICE = 20.0
const BDT_PRICE = 2553.33

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Resolve searchParams on the server
  const params = await searchParams
  const currency: Currency = params?.currency === "USD" ? "USD" : "BDT"

  // Fetch user session on the server side
  let session = null
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    })
  } catch (error) {
    console.error("Failed to load session on payment page:", error)
  }

  // Format display price based on server-selected currency
  const formattedPrice =
    currency === "BDT"
      ? `BDT ${BDT_PRICE.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `$${USD_PRICE.toFixed(2)}`

  const { canceled } = await searchParams

  if (canceled) {
    toast.add({
  title: "Order canceled",
  description: "continue to shop around and check out when you're ready",
})
  }
  return (
    <div className="min-h-screen bg-muted/20 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        {/* Top Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Jobs
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-xs backdrop-blur">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>256-Bit Encrypted Checkout</span>
          </div>
        </div>

        {/* Main Payment Card */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
            {/* Plan Header */}
            <div className="flex items-center justify-between border-b border-border pb-5">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Hireloop Pro Plan
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Access to all features
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                PRO
              </span>
            </div>

            {/* Currency Selector */}
            <div className="border-b border-border py-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Choose Currency:
                </label>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Globe2 className="size-3 text-primary" />
                  <span>1 USD = {USD_RATE.toFixed(4)} BDT</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/payment?currency=BDT"
                  scroll={false}
                  className={`flex items-center justify-between rounded-xl border p-2.5 text-left transition-all ${
                    currency === "BDT"
                      ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/30"
                      : "border-border bg-background text-muted-foreground hover:border-foreground/20"
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      BDT
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ৳2,553.33
                    </div>
                  </div>
                  <div
                    className={`flex size-4 items-center justify-center rounded-full border ${
                      currency === "BDT"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {currency === "BDT" && (
                      <div className="size-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </Link>

                <Link
                  href="/payment?currency=USD"
                  scroll={false}
                  className={`flex items-center justify-between rounded-xl border p-2.5 text-left transition-all ${
                    currency === "USD"
                      ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/30"
                      : "border-border bg-background text-muted-foreground hover:border-foreground/20"
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      USD ($)
                    </div>
                    <div className="text-xs text-muted-foreground">$20.00</div>
                  </div>
                  <div
                    className={`flex size-4 items-center justify-center rounded-full border ${
                      currency === "USD"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40"
                    }`}
                  >
                    {currency === "USD" && (
                      <div className="size-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </Link>
              </div>
            </div>

            {/* Price Display */}
            <div className="border-b border-border py-5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {formattedPrice}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  / billed monthly
                </span>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="border-b border-border py-5">
              <p className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                What&apos;s included in Pro:
              </p>
              <ul className="space-y-2.5 text-sm text-foreground/90">
                {[
                  "Unlimited job applications across all sectors",
                  "AI Resume Matcher & instant scoring feedback",
                  "Direct messaging with hiring recruiters",
                  "Top applicant spotlight & Pro candidate badge",
                  "Priority 24/7 dedicated customer support",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cost Summary Breakdown */}
            <div className="space-y-2 pt-4 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formattedPrice}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax / VAT (0%)</span>
                <span>{currency === "BDT" ? "BDT 0.00" : "$0.00"}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
                <span>Total Due Today</span>
                <span className="text-primary">{formattedPrice}</span>
              </div>

              {/* Payment Button directly under Total Due Today */}

              <form action="/api/checkout_sessions" method="POST">
      <section>
                              <PaymentButton
                formattedPrice={formattedPrice}
                currency={currency}
                userEmail={session?.user?.email}
              />
      </section>
    </form>
            </div>
          </div>

          {/* Money-Back Guarantee Card */}
          <div className="space-y-1.5 rounded-xl border border-border/80 bg-muted/40 p-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>14-Day Money-Back Guarantee</span>
            </div>
            <p>
              Try Hireloop Pro risk-free. If you are not completely satisfied,
              contact us within 14 days for a full hassle-free refund.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
