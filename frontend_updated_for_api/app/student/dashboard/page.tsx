"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Code,
  BookOpen,
  Star,
  Play,
  Users,
  Search,
  ChevronRight,
  ShoppingCart,
} from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"

// small helper that always sets JSON + X-User-Id header (if userId provided)
async function api<T>(path: string, userId?: number, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
      ...(userId ? { "X-User-Id": String(userId) } : {}),
    },
    cache: "no-store",
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => "")
    throw new Error(msg || `Request failed (${res.status})`)
  }
  return res.json()
}

export default function StudentDashboard() {
  const { user, isAuthenticated } = useAuth()
  const { state, dispatch } = useCart()

  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [allCourses, setAllCourses] = useState<any[]>([])
  const [showAllCourses, setShowAllCourses] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    let alive = true
    async function run() {
      try {
        // 1) catalog for browsing
        const catalog = await api<any[]>("/api/courses")
        if (!alive) return
        setAllCourses(catalog)

        // 2) user’s enrolled courses
        if (isAuthenticated && user?.id) {
          const myCourses = await api<any[]>("/api/me/courses", user.id)
          if (!alive) return
          setEnrolledCourses(myCourses)
        } else {
          setEnrolledCourses([])
        }
      } catch (e) {
        console.error("Dashboard load failed:", e)
        setAllCourses([])
        setEnrolledCourses([])
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [isAuthenticated, user?.id])

  const filteredCourses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return allCourses
    return allCourses.filter(
        (c) =>
            c.title?.toLowerCase().includes(term) ||
            c.description?.toLowerCase().includes(term)
    )
  }, [allCourses, searchTerm])

  const addToCart = (course: any) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: course.id,
        title: course.title,
        price: course.price,
        image: course.imageUrl,
        instructor: course.instructor ?? "Learn2Code",
        duration: course.duration ?? "12 weeks",
      },
    })
  }

  if (!mounted || loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-fun rounded-xl flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
    )
  }

  const studentName = user?.name ?? "there"
  const studentEmail = user?.email ?? ""
  const progressCount = enrolledCourses.length // simple deterministic stat

  return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-fun rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold text-gray-900">Learn2Code</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="rounded-full bg-transparent" asChild>
                <Link href="/parent/dashboard">Parent View</Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                  {/* simple avatar placeholder */}
                  <span role="img" aria-label="avatar">🧑‍💻</span>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-heading font-bold text-gray-900 mb-1">
                  Welcome back, {studentName}!
                </h1>
                {studentEmail && <p className="text-gray-600">{studentEmail}</p>}
              </div>
            </div>

            {/* Small stats (deterministic) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Courses</p>
                      <p className="text-2xl font-bold">{enrolledCourses.length}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Progress Items</p>
                      <p className="text-2xl font-bold">{progressCount}</p>
                    </div>
                    <Star className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">XP (demo)</p>
                      <p className="text-2xl font-bold">{enrolledCourses.length * 100}</p>
                    </div>
                    <Star className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Browse All Courses (in-page) */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-gray-900">Browse Courses</h2>
              <Button variant="outline" onClick={() => setShowAllCourses((v) => !v)}>
                {showAllCourses ? "Hide" : "Show"}
              </Button>
            </div>

            {showAllCourses && (
                <>
                  <Card className="border-0 shadow-lg mb-6">
                    <CardContent className="p-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <Card key={course.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                          <div className="relative overflow-hidden rounded-t-lg">
                            <img
                                src={course.imageUrl || "/placeholder.svg"}
                                alt={course.title}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">{course.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{course.description}</p>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addToCart(course)}
                                    disabled={state.items.some((item) => item.id === course.id)}
                                >
                                  <ShoppingCart className="w-4 h-4 mr-1" />
                                  {state.items.some((item) => item.id === course.id) ? "Added" : "Add"}
                                </Button>
                                <Button size="sm" asChild>
                                  <Link href={`/courses/${course.id}`}>
                                    View
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
                </>
            )}
          </div>

          {/* My Courses */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-gray-900">My Courses</h2>
              <Button variant="outline" onClick={() => setShowAllCourses(true)}>
                <BookOpen className="w-4 h-4 mr-2" />
                Browse More Courses
              </Button>
            </div>

            {enrolledCourses.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-600 mb-6">Start your coding journey by enrolling in your first course!</p>
                    <Button onClick={() => setShowAllCourses(true)}>Browse Courses</Button>
                  </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((course) => (
                      <Card
                          key={course.id}
                          className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm"
                      >
                        <div className="relative overflow-hidden rounded-t-lg">
                          <Image
                              src={course.imageUrl || "/placeholder.svg"}
                              alt={course.title}
                              width={400}
                              height={200}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Optional: difficulty/age badges if your API returns them */}
                          {course.difficulty && (
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-white/90 text-gray-700 hover:bg-white">{course.difficulty}</Badge>
                              </div>
                          )}
                        </div>

                        <CardContent className="p-6">
                          <div className="mb-4">
                            <h3 className="text-xl font-heading font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {course.title}
                            </h3>
                            {course.description && <p className="text-gray-600 text-sm mb-3">{course.description}</p>}

                            {course.instructor && (
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                  <Users className="w-4 h-4" />
                                  <span>{course.instructor}</span>
                                </div>
                            )}
                          </div>

                          <Button asChild className="w-full bg-gradient-fun hover:opacity-90 text-white">
                            <Link href={`/learn/${course.id}/1`}>
                              <Play className="w-4 h-4 mr-2" />
                              Continue Learning
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
  )
}
