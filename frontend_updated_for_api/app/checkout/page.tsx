"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";
const TAX_RATE = 0.13; // 13%

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { state, dispatch } = useCart();

  // mount-gate to avoid SSR/CSR mismatches
  const [mounted, setMounted] = useState(false);

  // billing form
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");

  // UX state
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // stable order id created on client only after mount
  const [orderId, setOrderId] = useState<string>("");

  // derive numbers from cart
  const subtotal = useMemo(
      () => state.items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0),
      [state.items]
  );
  const taxAmount = useMemo(() => +(subtotal * TAX_RATE).toFixed(2), [subtotal]);
  const totalAmount = useMemo(() => +(subtotal + taxAmount).toFixed(2), [subtotal, taxAmount]);

  useEffect(() => {
    setMounted(true);

    // Prefill from auth (client-side only)
    if (user) {
      setBillingName(prev => prev || user.name);
      setBillingEmail(prev => prev || user.email);
    }

    // Create a stable order id (or reuse prior one if present)
    try {
      const existing = localStorage.getItem("lastOrderId");
      if (existing) {
        setOrderId(existing);
      } else {
        const id = "LC" + Math.random().toString(36).slice(2, 11).toUpperCase();
        localStorage.setItem("lastOrderId", id);
        setOrderId(id);
      }
    } catch {
      // fallback (non-persistent)
      setOrderId("LC" + Math.random().toString(36).slice(2, 11).toUpperCase());
    }
  }, [user]);

  const onPay = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (state.items.length === 0) {
      setErrMsg("Your cart is empty.");
      return;
    }
    if (!billingName.trim() || !billingEmail.trim()) {
      setErrMsg("Please fill in billing name and email.");
      return;
    }

    setSubmitting(true);
    setErrMsg(null);

    try {
      const body = {
        courseIds: state.items.map(i => i.id as number),
        amount: +subtotal.toFixed(2),
        taxAmount,
        totalAmount,
        currency: "USD",
        method: "card",
        provider: "mock",
        providerTxnId: orderId,      // demo field
        status: "completed",
        receiptNumber: orderId,
        cardBrand: "visa",
        cardLast4: "4242",
        billingName,
        billingEmail,
        billingAddress: null as any
      };

      const res = await fetch(`${API_BASE}/api/payments/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": String(user.id), // <-- matches your controller
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        // try to surface backend message if any
        let message = `Checkout failed (${res.status})`;
        try {
          const j = await res.json();
          if (j?.message) message = j.message;
        } catch {}
        throw new Error(message);
      }

      // success
      try {
        localStorage.setItem("lastOrderId", orderId);
      } catch {}
      dispatch({ type: "CLEAR_CART" }); // matches your union type
      router.replace(`/confirmation?orderId=${encodeURIComponent(orderId)}&email=${encodeURIComponent(billingEmail)}`);
    } catch (e: any) {
      setErrMsg(e?.message || "Payment failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-500">Loading checkout…</div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: items + billing */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-1">Review your order</h2>
              <p className="text-sm text-gray-600 mb-6">Confirm items and enter your billing details</p>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {state.items.length === 0 ? (
                    <div className="text-gray-500 text-sm">Your cart is empty.</div>
                ) : (
                    state.items.map(it => (
                        <div
                            key={`${it.id}`}
                            className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{it.title}</p>
                            <p className="text-xs text-gray-500">Qty {it.quantity || 1}</p>
                          </div>
                          <div className="text-gray-900 font-semibold">${(it.price || 0).toFixed(2)}</div>
                        </div>
                    ))
                )}
              </div>

              {/* Billing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Billing name</label>
                  <input
                      className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      value={billingName}
                      onChange={e => setBillingName(e.target.value)}
                      placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Billing email</label>
                  <input
                      className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                      value={billingEmail}
                      onChange={e => setBillingEmail(e.target.value)}
                      placeholder="you@example.com"
                      type="email"
                  />
                </div>
              </div>

              {errMsg && (
                  <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {errMsg}
                  </div>
              )}

              <p className="mt-6 text-xs text-gray-500">
                By completing your purchase you agree to our{" "}
                <Link href="/terms" className="underline">Terms</Link> and{" "}
                <Link href="/privacy" className="underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>

          {/* Right: summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Payment</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tax ({Math.round(TAX_RATE * 100)}%)</span>
                  <span className="font-medium">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex items-center justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Button
                  className="w-full mt-6"
                  onClick={onPay}
                  disabled={submitting || state.items.length === 0}
              >
                {submitting ? "Processing…" : "Pay now"}
              </Button>

              <Button asChild variant="outline" className="w-full mt-3 bg-transparent">
                <Link href="/cart">Back to Cart</Link>
              </Button>

              <p className="mt-4 text-xs text-gray-500">
                Order ID: <span className="font-mono">{orderId || "…"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
