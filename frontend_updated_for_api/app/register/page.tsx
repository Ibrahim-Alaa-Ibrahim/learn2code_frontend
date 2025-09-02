"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Code, Eye, EyeOff, ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"

interface Child {
  id: string
  name: string
  age: number
  avatar: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"

async function registerRequest({
                                 name,
                                 email,
                                 password,
                               }: {
  name: string
  email: string
  password: string
}) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Register failed (${res.status})`)
  }
  return res.json() // { id, name, email }
}

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [parentData, setParentData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [children, setChildren] = useState<Child[]>([])
  const [newChild, setNewChild] = useState({ name: "", age: "" })
  const [agree, setAgree] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const avatars = ["🦸", "🧙", "🐱", "🐶", "🦄", "🐸", "🦊", "🐼", "🦁", "🐯", "🐨", "🐰"]

  const addChild = () => {
    if (newChild.name && newChild.age) {
      const child: Child = {
        id: Date.now().toString(),
        name: newChild.name,
        age: Number.parseInt(newChild.age),
        avatar: avatars[Math.floor(Math.random() * avatars.length)],
      }
      setChildren((prev) => [...prev, child])
      setNewChild({ name: "", age: "" })
    }
  }

  const removeChild = (id: string) => {
    setChildren((prev) => prev.filter((child) => child.id !== id))
  }

  const updateChildAvatar = (id: string, avatar: string) => {
    setChildren((prev) => prev.map((c) => (c.id === id ? { ...c, avatar } : c)))
  }

  const validateStep1 = () => {
    if (!parentData.firstName.trim() || !parentData.lastName.trim()) return "Please enter your first and last name."
    if (!parentData.email.trim()) return "Please enter your email."
    if (!parentData.password) return "Please enter a password."
    if (parentData.password !== parentData.confirmPassword) return "Passwords do not match."
    if (!agree) return "You must agree to the Terms and Privacy Policy."
    return null
  }

  const handleContinue = () => {
    const msg = validateStep1()
    if (msg) {
      setError(msg)
      return
    }
    setError(null)
    setStep(2)
  }

  const handleCreateAccount = async () => {
    if (children.length === 0) {
      setError("Please add at least one child profile.")
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const fullName = `${parentData.firstName.trim()} ${parentData.lastName.trim()}`
      await registerRequest({
        name: fullName,
        email: parentData.email.trim(),
        password: parentData.password,
      })
      setSuccess("Account created! Redirecting to sign in…")
      // If you later add a children endpoint, you can POST children here after successful registration.
      setTimeout(() => router.push("/login?registered=1"), 800)
    } catch (e: any) {
      setError(e.message || "Something went wrong while creating your account.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Back to Home */}
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-fun rounded-2xl flex items-center justify-center">
                  <Code className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-heading font-bold text-gray-900">
                {step === 1 ? "Create Your Account" : "Add Your Children"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {step === 1
                    ? "Join thousands of families learning to code together"
                    : "Set up profiles for your young coders"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">{error}</div>
              )}
              {success && (
                  <div className="p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm">
                    {success}
                  </div>
              )}

              {step === 1 ? (
                  // Parent Registration Form
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                          First Name
                        </Label>
                        <Input
                            id="firstName"
                            placeholder="John"
                            value={parentData.firstName}
                            onChange={(e) => setParentData({ ...parentData, firstName: e.target.value })}
                            className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                          Last Name
                        </Label>
                        <Input
                            id="lastName"
                            placeholder="Doe"
                            value={parentData.lastName}
                            onChange={(e) => setParentData({ ...parentData, lastName: e.target.value })}
                            className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <Input
                          id="email"
                          type="email"
                          placeholder="parent@example.com"
                          value={parentData.email}
                          onChange={(e) => setParentData({ ...parentData, email: e.target.value })}
                          className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            value={parentData.password}
                            onChange={(e) => setParentData({ ...parentData, password: e.target.value })}
                            className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={parentData.confirmPassword}
                            onChange={(e) => setParentData({ ...parentData, confirmPassword: e.target.value })}
                            className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                      <input
                          type="checkbox"
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={agree}
                          onChange={(e) => setAgree(e.target.checked)}
                          id="agree"
                      />
                      <div className="text-sm text-gray-700">
                        <label htmlFor="agree">
                          I agree to the{" "}
                          <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                            Privacy Policy
                          </Link>
                          . I understand that Learn2Code is designed for children and includes parental controls.
                        </label>
                      </div>
                    </div>

                    <Button
                        onClick={handleContinue}
                        disabled={submitting}
                        className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-6"
                    >
                      Continue to Add Children
                    </Button>
                  </div>
              ) : (
                  // Children Setup Form
                  <div className="space-y-6">
                    {/* Add New Child */}
                    <div className="p-6 bg-gray-50 rounded-xl space-y-4">
                      <h3 className="font-heading font-semibold text-gray-900">Add a Child</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="childName" className="text-sm font-medium text-gray-700">
                            Child's Name
                          </Label>
                          <Input
                              id="childName"
                              placeholder="Emma"
                              value={newChild.name}
                              onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
                              className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="childAge" className="text-sm font-medium text-gray-700">
                            Age
                          </Label>
                          <Select value={newChild.age} onValueChange={(value) => setNewChild({ ...newChild, age: value })}>
                            <SelectTrigger className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Select age" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => i + 6).map((age) => (
                                  <SelectItem key={age} value={age.toString()}>
                                    {age} years old
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end">
                          <Button onClick={addChild} className="w-full rounded-xl bg-green-600 hover:bg-green-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Child
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Children List */}
                    {children.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="font-heading font-semibold text-gray-900">Your Children</h3>
                          {children.map((child) => (
                              <div key={child.id} className="p-4 border border-gray-200 rounded-xl bg-white">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="text-3xl">{child.avatar}</div>
                                    <div>
                                      <p className="font-medium text-gray-900">{child.name}</p>
                                      <p className="text-sm text-gray-500">{child.age} years old</p>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className={`${
                                            child.age <= 9
                                                ? "bg-yellow-100 text-yellow-800"
                                                : child.age <= 13
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-green-100 text-green-800"
                                        }`}
                                    >
                                      {child.age <= 9 ? "Little Coder" : child.age <= 13 ? "Code Explorer" : "Future Developer"}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                      {avatars.slice(0, 6).map((avatar) => (
                                          <button
                                              key={avatar}
                                              onClick={() => updateChildAvatar(child.id, avatar)}
                                              className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm hover:bg-gray-50 ${
                                                  child.avatar === avatar ? "border-blue-500 bg-blue-50" : "border-gray-200"
                                              }`}
                                          >
                                            {avatar}
                                          </button>
                                      ))}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeChild(child.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                          ))}
                        </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                          variant="outline"
                          onClick={() => setStep(1)}
                          className="flex-1 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Back
                      </Button>
                      <Button
                          disabled={children.length === 0 || submitting}
                          onClick={handleCreateAccount}
                          className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {submitting ? "Creating..." : "Create Account"}
                      </Button>
                    </div>
                  </div>
              )}

              {step === 1 && (
                  <>
                    <Separator className="my-6" />
                    <div className="text-center">
                      <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  </>
              )}
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Safe & Secure</p>
                <p>
                  Your data is protected with enterprise-grade security. Two-factor authentication will be enabled for
                  your account to keep your family safe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
