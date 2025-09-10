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
import { Input } from "@/components/ui/input"
import {
  Code,
  BookOpen,
  Trophy,
  Calendar,
  Star,
  Play,
  Users,
  Search,
  ChevronRight,
  ShoppingCart,
} from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"

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

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const { state, dispatch } = useCart()

  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [allCourses, setAllCourses] = useState<any[]>([])
  const [showAllCourses, setShowAllCourses] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleLogout = () => {
    logout()
    window.location.href = "http://localhost:8080"
  }

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    let alive = true
    async function run() {
      try {
        const catalog = await api<any[]>("/api/courses")
        if (!alive) return
        setAllCourses(catalog)

        if (isAuthenticated && user?.id) {
          const myCourses = await api<any[]>("/api/me/courses", user.id)
          if (!alive) return
          setEnrolledCourses(myCourses)
        } else {
          setEnrolledCourses([])
        }
      } catch (e) {
        console.error(e)
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

  const userStats = {
    name: user?.name ?? "there",
    email: user?.email ?? "",
    level: 1,
    xp: enrolledCourses.length * 100,
    streak: 0,
    badges: 0,
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Image src="/ntg-logo.png" alt="NTG Clarity Networks Inc." width={120} height={40} className="h-8 w-auto" />
                <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                  <div className="w-10 h-10 bg-gradient-fun rounded-xl flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-heading font-bold text-gray-900">Learn2Code</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setShowAllCourses((v) => !v)}>
                  {showAllCourses ? "Hide Courses" : "Browse Courses"}
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/student/dashboard">Student View</Link>
                </Button>
                {/* NEW Parent View button */}
                <Button variant="outline" asChild>
                  <Link href="/parent/dashboard">Parent View</Link>
                </Button>
                <Button variant="outline" className="relative bg-transparent" asChild>
                  <Link href="/cart">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                    {state.itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {state.itemCount}
                    </span>
                    )}
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <Image
                    src={"/student-avatar.png"}
                    alt={userStats.name}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {userStats.level}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900 mb-1">
                  Welcome back, {userStats.name}! 🎉
                </h1>
                {userStats.email && <p className="text-gray-600">{userStats.email}</p>}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">XP Points</p>
                      <p className="text-2xl font-bold">{userStats.xp.toLocaleString()}</p>
                    </div>
                    <Star className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Day Streak</p>
                      <p className="text-2xl font-bold">{userStats.streak}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Badges Earned</p>
                      <p className="text-2xl font-bold">{userStats.badges}</p>
                    </div>
                    <Trophy className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Courses</p>
                      <p className="text-2xl font-bold">{enrolledCourses.length}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Browse All Courses */}
          {showAllCourses && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-heading font-bold text-gray-900">Browse All Courses</h2>
                  <Button variant="outline" onClick={() => setShowAllCourses(false)}>
                    Hide Courses
                  </Button>
                </div>

                <Card className="border-0 shadow-lg mb-6">
                  <CardContent className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                          placeholder="Search courses..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                              <span className="text-gray-500 text-sm">/month</span>
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
              </div>
          )}

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
                          {course.difficulty && (
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-white/90 text-gray-700 hover:bg-white">{course.difficulty}</Badge>
                              </div>
                          )}
                          {course.ageGroup && (
                              <div className="absolute top-4 right-4">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                  {course.ageGroup} years
                                </Badge>
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

                            {typeof course.progress === "number" && (
                                <div className="mb-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Progress</span>
                                    <span className="text-sm text-gray-500">
                              {course.completedLessons ?? 0}/{course.totalLessons ?? 0} lessons
                            </span>
                                  </div>
                                  <Progress value={course.progress} className="h-2" />
                                  <p className="text-xs text-gray-500 mt-1">{course.progress}% complete</p>
                                </div>
                            )}

                            {course.nextLesson && (
                                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                                  <p className="text-xs text-blue-600 font-medium mb-1">Next Lesson:</p>
                                  <p className="text-sm text-blue-800 font-medium">{course.nextLesson}</p>
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

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  Achievements
                </CardTitle>
                <CardDescription className="text-yellow-100">Check out your badges and certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" asChild>
                  <Link href="/student/badges">View All Badges</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-400 to-pink-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  Receipts
                </CardTitle>
                <CardDescription className="text-purple-100">View your payment history and receipts</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" asChild>
                  <Link href="/receipts">View Receipts</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Daily Challenge
                </CardTitle>
                <CardDescription className="text-green-100">Complete today's coding challenge</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary">Start Challenge</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
