"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Code, Eye, EyeOff, ArrowLeft, User, Users } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context" // <-- use your AuthProvider

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"

type LoginResp = {
  token: string
  user: { id: number; name: string; email: string; role?: string }
}

async function loginRequest(email: string, password: string): Promise<LoginResp> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({} as any))
    throw new Error(err.message || (res.status === 401 ? "Invalid credentials" : `Login failed (${res.status})`))
  }
  return res.json()
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth() // <-- from context

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginType, setLoginType] = useState<"parent" | "student">("parent")
  const [remember, setRemember] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSubmitting(true)
    try {
      const { token, user } = await loginRequest(email.trim(), password)

      // map backend role -> your context's "type"
      const type = user.role?.toLowerCase() === "student" ? "student" : "parent"

      // persist via AuthProvider (it handles localStorage)
      login(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            type,
            role: user.role,
          },
          token
      )

      setSuccess("Signed in successfully. Redirecting…")

      // Optional: remember flag—if you want different storage behavior,
      // you can extend AuthProvider to respect `remember`.
      // For now, AuthProvider stores in localStorage by default.

      // route by role
      const next =
          type === "student" ? "/student/dashboard" :
              type === "parent"  ? "/dashboard"  : "/dashboard"

      setTimeout(() => router.push(next), 300)
    } catch (err: any) {
      setError(err.message || "Unable to sign in")
    } finally {
      setSubmitting(false)
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
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
                {loginType === "parent" ? "Welcome Back!" : "Hey There, Coder!"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {loginType === "parent"
                    ? "Sign in to manage your child's coding journey"
                    : "Sign in to continue your coding adventure"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                    onClick={() => setLoginType("parent")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        loginType === "parent" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  <Users className="w-4 h-4" />
                  Parent Login
                </button>
                <button
                    onClick={() => setLoginType("student")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        loginType === "student" ? "bg-white text-green-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  <User className="w-4 h-4" />
                  Student Login
                </button>
              </div>

              {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">{error}</div>
              )}
              {success && (
                  <div className="p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm">{success}</div>
              )}

              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    {loginType === "parent" ? "Email Address" : "Username or Email"}
                  </Label>
                  <Input
                      id="email"
                      type={loginType === "parent" ? "email" : "text"}
                      placeholder={loginType === "parent" ? "parent@example.com" : "your-username"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </Link>
                </div>

                <Button
                    type="submit"
                    disabled={submitting}
                    className={`w-full rounded-xl text-white py-6 ${
                        loginType === "parent" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                  {submitting ? "Signing in…" : loginType === "parent" ? "Sign In as Parent" : "Sign In as Student"}
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="text-center">
                <p className="text-gray-600">
                  {loginType === "parent" ? "Don't have an account? " : "Need a parent to create your account? "}
                  <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                    {loginType === "parent" ? "Create one for free" : "Ask your parent to sign up"}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                    loginType === "parent" ? "bg-yellow-400" : "bg-green-400"
                }`}
            >
              <span className="text-3xl">{loginType === "parent" ? "👋" : "🚀"}</span>
            </div>
            <p className="text-gray-600 font-heading">
              CodeBot says: "
              {loginType === "parent" ? "Welcome back, coding family!" : "Ready for another coding adventure?"}"
            </p>
          </div>
        </div>
      </div>
  )
}
