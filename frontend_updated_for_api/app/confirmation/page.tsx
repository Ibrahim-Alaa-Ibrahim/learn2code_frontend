"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, CreditCard, Mail, ArrowRight } from "lucide-react"

type Payment = {
  id: number
  amount: number
  taxAmount: number
  totalAmount: number
  currency: string
  method: string
  provider: string
  status: string
  billingName: string
  billingEmail: string
  cardBrand?: string
  cardLast4?: string
  createdAt: string
  receiptNumber: string
}

type CheckoutResp = { paymentId: number; receiptNumber: string }

export default function ConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const { state, dispatch } = useCart()

  const [mounted, setMounted] = useState(false)
  const [submitting, setSubmitting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [payment, setPayment] = useState<Payment | null>(null)

  const urlEmail = searchParams.get("email") || undefined
  const email = useMemo(() => user?.email || urlEmail || "user@example.com", [user?.email, urlEmail])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    if (!isAuthenticated || !user) {
      router.replace("/login"); return;
    }
    if (state.items.length === 0) {
      router.replace("/dashboard"); return;
    }

    let alive = true
    ;(async () => {
      setSubmitting(true)
      setError(null)
      try {
        // compute totals on client (replace with server calc if you have it)
        const subtotal = state.items.reduce((s: number, it: any) => s + Number(it.price || 0), 0)
        const tax = 0
        const total = subtotal + tax

        const body = {
          courseIds: state.items.map((i: any) => i.id),
          amount: subtotal,
          taxAmount: tax,
          totalAmount: total,
          currency: "USD",
          method: "card",
          provider: "mock",
          providerTxnId: "",
          status: "completed",
          receiptNumber: "RCPT-" + Math.random().toString(36).slice(2, 10).toUpperCase(),
          cardBrand: "visa",
          cardLast4: "4242",
          billingName: user.name,
          billingEmail: email,
          billingAddress: {},
        };

        const resp = await apiFetch<CheckoutResp>("/api/payments/checkout", {
          method: "POST",
          body,
          userId: user.id,
        });

        // Find the freshly-created payment from /api/payments/me
        const payments = await apiFetch<Payment[]>("/api/payments/me", { userId: user.id });
        const match = payments.find(p => p.receiptNumber === resp.receiptNumber) || null;
        if (!alive) return;
        setPayment(match);

        // clear cart with your reducer's real action
        dispatch({ type: "CLEAR_CART" });

        // persist receipt id for later
        try { localStorage.setItem("lastOrderId", resp.receiptNumber) } catch {}
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Payment could not be completed");
      } finally {
        if (alive) setSubmitting(false);
      }
    })();

    return () => { alive = false }
  }, [mounted, isAuthenticated, user, state.items, dispatch, router, email])

  const handleDownloadReceipt = () => {
    if (!payment) return
    const p = payment
    const lines = [
      "Learn2Code Receipt",
      `Receipt #: ${p.receiptNumber}`,
      `Date: ${new Date(p.createdAt).toLocaleString()}`,
      `Method: ${(p.cardBrand?.toUpperCase() || p.method)}${p.cardLast4 ? ` •••• ${p.cardLast4}` : ""}`,
      `Subtotal: ${p.currency} ${p.amount.toFixed(2)}`,
      `Tax: ${p.currency} ${p.taxAmount.toFixed(2)}`,
      `Total: ${p.currency} ${p.totalAmount.toFixed(2)}`,
      `Billed to: ${p.billingName} <${p.billingEmail}>`,
      "",
      "Thank you for your purchase!",
    ].join("\n")

    const blob = new Blob([lines + "\n"], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Learn2Code-Receipt-${p.receiptNumber}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  if (!mounted || submitting) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
          <div className="text-gray-600">Finalizing your order…</div>
        </div>
    )
  }

  if (error || !payment) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 px-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <CardTitle>Payment failed</CardTitle>
              <CardDescription>{error || "We couldn't find your receipt yet."}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button variant="outline" asChild><Link href="/cart">Back to Cart</Link></Button>
              <Button asChild><Link href="/dashboard">Go to Dashboard</Link></Button>
            </CardContent>
          </Card>
        </div>
    )
  }

  const amountLabel = `${payment.currency} ${payment.totalAmount.toFixed(2)}`
  const orderDate = new Date(payment.createdAt).toLocaleDateString()

  return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L2C</span>
              </div>
              <span className="font-fredoka font-bold text-2xl text-gray-800">Learn2Code</span>
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="font-fredoka font-bold text-4xl md:text-5xl text-gray-800 mb-4">
              Thank you for your purchase! 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              A confirmation has been sent to <span className="font-medium">{email}</span>.
            </p>
            <Badge className="bg-green-100 text-green-800 border-green-200 text-lg px-4 py-2">
              Receipt #{payment.receiptNumber}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle className="font-fredoka text-2xl text-gray-800 flex items-center space-x-2">
                  <CreditCard className="w-6 h-6" />
                  <span>Order Details</span>
                </CardTitle>
                <CardDescription>Your purchase information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                  {payment.currency} {payment.amount.toFixed(2)}
                </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">
                  {payment.currency} {payment.taxAmount.toFixed(2)}
                </span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-gray-600">Total Paid</span>
                  <span className="font-semibold text-green-600">{amountLabel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-semibold">{orderDate}</span>
                </div>

                <Button onClick={handleDownloadReceipt} variant="outline" className="w-full mt-2 flex items-center gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Download Receipt
                </Button>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="font-fredoka text-2xl text-gray-800 flex items-center space-x-2">
                  <Mail className="w-6 h-6" />
                  <span>What’s Next?</span>
                </CardTitle>
                <CardDescription>Jump right back into learning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/dashboard">
                  <Button className="w-full">Go to My Courses</Button>
                </Link>
                <div className="text-sm text-gray-600">
                  Your purchase has been saved to your account. You can find the receipt any time in{" "}
                  <Link href="/receipts" className="text-blue-600 underline">Receipts</Link>.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3 flex items-center gap-2">
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/receipts">
              <Button variant="outline" className="text-lg px-8 py-3 bg-transparent">
                View Receipts
              </Button>
            </Link>
          </div>
        </div>
      </div>
  )
}
