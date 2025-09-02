"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { apiFetch } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Download, CreditCard, Calendar, DollarSign, FileText, ArrowLeft, Receipt } from "lucide-react"

type CourseLine = { id: number; title: string; price: number }

interface Payment {
  id: number
  amount: number
  currency: string
  taxAmount: number
  totalAmount: number
  method: string
  provider: string
  status: string
  receiptNumber: string
  cardBrand?: string
  cardLast4?: string
  billingName: string
  billingEmail: string
  createdAt: string
  courses?: CourseLine[]
}

export default function ReceiptsPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    let alive = true
    async function fetchPayments() {
      if (!user?.id) {
        setPayments([])
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const data = await apiFetch<Payment[]>("/api/payments/me", { userId: user.id })
        if (alive) setPayments(Array.isArray(data) ? data : [])
      } catch (e: any) {
        if (alive) setError(e?.message || "Failed to load receipts")
      } finally {
        if (alive) setLoading(false)
      }
    }
    fetchPayments()
    return () => { alive = false }
  }, [user?.id])

  const formatDate = (iso: string) =>
      new Date(iso).toLocaleString(undefined, {
        year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
      })

  const statusClass = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800"
      case "pending":   return "bg-yellow-100 text-yellow-800"
      case "failed":    return "bg-red-100 text-red-800"
      default:          return "bg-gray-100 text-gray-800"
    }
  }

  const downloadReceipt = (p: Payment) => {
    const body = [
      "Learn2Code Receipt",
      `Receipt #: ${p.receiptNumber}`,
      `Date: ${formatDate(p.createdAt)}`,
      `Method: ${p.cardBrand ? p.cardBrand.toUpperCase() : p.method}${p.cardLast4 ? " •••• " + p.cardLast4 : ""}`,
      `Subtotal: ${p.currency} ${p.amount.toFixed(2)}`,
      `Tax: ${p.currency} ${p.taxAmount.toFixed(2)}`,
      `Total: ${p.currency} ${p.totalAmount.toFixed(2)}`,
      `Billed to: ${p.billingName} <${p.billingEmail}>`,
      "",
      ...(p.courses?.length ? ["Courses:", ...p.courses.map(c => ` - ${c.title} (${p.currency} ${c.price.toFixed(2)})`)] : []),
      "",
      "Thank you for your purchase!",
    ].join("\n")

    const blob = new Blob([body], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Learn2Code-Receipt-${p.receiptNumber}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  if (!mounted || loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your receipts...</p>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-fun rounded-xl flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-heading font-bold text-gray-900">Learn2Code</span>
                </Link>
                <div className="h-8 w-px bg-gray-300" />
                <Image src="/ntg-logo.png" alt="NTG Clarity Networks" width={120} height={40} className="h-8 w-auto" />
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900">Payment Receipts</h1>
                <p className="text-gray-600">View and download your payment history</p>
              </div>
            </div>
          </div>

          {error && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <p className="text-red-600">⚠️ {error}</p>
                </CardContent>
              </Card>
          )}

          {/* Receipts List */}
          <div className="space-y-6">
            {payments.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No receipts found</h3>
                    <p className="text-gray-600 mb-4">You haven’t made any purchases yet.</p>
                    <Button asChild>
                      <Link href="/dashboard">Browse Courses</Link>
                    </Button>
                  </CardContent>
                </Card>
            ) : (
                payments.map((p) => (
                    <Card key={p.id} className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <Receipt className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">Receipt #{p.receiptNumber}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(p.createdAt)}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={statusClass(p.status)}>
                              {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                            </Badge>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                              {p.currency} {p.totalAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Payment Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">Payment Method:</span>
                              <span className="text-sm font-medium">
                          {(p.cardBrand?.toUpperCase() || p.method)}{p.cardLast4 ? ` •••• ${p.cardLast4}` : ""}
                        </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">Subtotal:</span>
                              <span className="text-sm font-medium">
                          {p.currency} {p.amount.toFixed(2)}
                        </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-4 h-4" />
                              <span className="text-sm text-gray-600">Tax:</span>
                              <span className="text-sm font-medium">
                          {p.currency} {p.taxAmount.toFixed(2)}
                        </span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Billing Information:</p>
                              <p className="text-sm font-medium">{p.billingName}</p>
                              <p className="text-sm text-gray-500">{p.billingEmail}</p>
                            </div>
                          </div>
                        </div>

                        {/* Purchased Courses */}
                        {!!p.courses?.length && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Purchased Courses:</h4>
                              <div className="space-y-2">
                                {p.courses.map((c) => (
                                    <div key={c.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                      <span className="font-medium text-gray-900">{c.title}</span>
                                      <span className="text-gray-600">
                              {p.currency} {c.price.toFixed(2)}
                            </span>
                                    </div>
                                ))}
                              </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t">
                          <Button variant="outline" size="sm" onClick={() => downloadReceipt(p)} className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Download Receipt
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                ))
            )}
          </div>
        </div>
      </div>
  )
}
