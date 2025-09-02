"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Users, Clock, Gift } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    id: "free-trial",
    name: "Free Trial",
    price: "$0",
    period: "7 days",
    description: "Perfect for trying out our platform",
    features: ["Access to 2 beginner courses", "Basic progress tracking", "Community support", "Mobile app access"],
    icon: Gift,
    color: "bg-green-500",
    popular: false,
    buttonText: "Start Free Trial",
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    price: "$19.99",
    period: "per month",
    description: "Great for getting started",
    features: [
      "Access to all courses",
      "Progress tracking & badges",
      "Parent dashboard",
      "Email support",
      "Downloadable certificates",
      "Mobile app access",
    ],
    icon: Clock,
    color: "bg-blue-500",
    popular: false,
    buttonText: "Choose Monthly",
  },
  {
    id: "quarterly",
    name: "Quarterly Plan",
    price: "$49.99",
    period: "per 3 months",
    originalPrice: "$59.97",
    description: "Save 17% with quarterly billing",
    features: [
      "Everything in Monthly",
      "Priority email support",
      "1-on-1 instructor session",
      "Advanced coding projects",
      "Early access to new courses",
    ],
    icon: Star,
    color: "bg-purple-500",
    popular: true,
    buttonText: "Choose Quarterly",
  },
  {
    id: "annual",
    name: "Annual Plan",
    price: "$159.99",
    period: "per year",
    originalPrice: "$239.88",
    description: "Best value - Save 33%!",
    features: [
      "Everything in Quarterly",
      "Phone & video support",
      "Monthly 1-on-1 sessions",
      "Custom learning path",
      "Exclusive workshops",
      "Physical certificate mailing",
    ],
    icon: Star,
    color: "bg-yellow-500",
    popular: false,
    buttonText: "Choose Annual",
  },
  {
    id: "family",
    name: "Family Plan",
    price: "$29.99",
    period: "per month",
    description: "Perfect for multiple children",
    features: [
      "Up to 4 child profiles",
      "All Monthly plan features",
      "Family progress dashboard",
      "Sibling challenges & competitions",
      "Bulk certificate downloads",
      "Family coding projects",
    ],
    icon: Users,
    color: "bg-pink-500",
    popular: false,
    buttonText: "Choose Family",
  },
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L2C</span>
              </div>
              <span className="font-fredoka font-bold text-2xl text-gray-800">Learn2Code</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="font-fredoka font-bold text-4xl md:text-5xl text-gray-800 mb-4">
            Choose Your Learning Adventure!
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Start your child's coding journey with our fun, interactive courses designed for every age and skill level.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-lg ${billingCycle === "monthly" ? "text-gray-800 font-semibold" : "text-gray-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === "annual" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-lg ${billingCycle === "annual" ? "text-gray-800 font-semibold" : "text-gray-500"}`}>
              Annual
            </span>
            {billingCycle === "annual" && (
              <Badge className="bg-green-100 text-green-800 border-green-200">Save 33%</Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
          {plans.map((plan) => {
            const IconComponent = plan.icon
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${plan.popular ? "ring-2 ring-purple-500 shadow-lg" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <CardHeader className={`text-center ${plan.popular ? "pt-12" : "pt-6"}`}>
                  <div className={`w-16 h-16 ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="font-fredoka text-2xl text-gray-800">{plan.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-3xl font-bold text-gray-800">{plan.price}</span>
                      <span className="text-gray-500">/{plan.period}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">{plan.originalPrice}</div>
                    )}
                  </div>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter>
                  <Link href={`/checkout?plan=${plan.id}`} className="w-full">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="font-fredoka font-bold text-3xl text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time from your parent dashboard. No questions asked.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">What ages are supported?</h3>
              <p className="text-gray-600">
                Our courses are designed for children ages 6-17, with age-appropriate content and difficulty levels.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee if you're not completely satisfied with our platform.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Is there a family discount?</h3>
              <p className="text-gray-600">
                Yes! Our Family Plan supports up to 4 children and includes special family features at a discounted
                rate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
