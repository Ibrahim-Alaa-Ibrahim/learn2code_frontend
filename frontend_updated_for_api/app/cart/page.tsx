"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { Code, ArrowLeft, Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { state, dispatch } = useCart()

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Courses</span>
              </Link>
              <div className="w-px h-6 bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-fun rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-heading font-bold text-gray-900">Learn2Code</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-xl text-gray-600 mb-8">Looks like you haven't added any courses to your cart yet.</p>
          <Button className="rounded-full bg-blue-600 hover:bg-blue-700 px-8 py-6" asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Courses</span>
            </Link>
            <div className="w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-fun rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-gray-900">Learn2Code</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-heading font-bold text-gray-900">Shopping Cart</h1>
              <Button variant="outline" onClick={clearCart} className="text-red-600 hover:text-red-700 bg-transparent">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            <div className="space-y-4">
              {state.items.map((item) => (
                <Card key={item.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-2">Instructor: {item.instructor}</p>
                        <p className="text-sm text-gray-500 mb-4">Duration: {item.duration}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-semibold text-lg">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 p-0 h-auto"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-0 shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Items ({state.itemCount})</span>
                  <span className="font-semibold">${state.total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${state.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-6" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl bg-transparent" asChild>
                    <Link href="/dashboard">Continue Shopping</Link>
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-600 pt-4">
                  <p>🔒 Secure checkout with 256-bit SSL encryption</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
