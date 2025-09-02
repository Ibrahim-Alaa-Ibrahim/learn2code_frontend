"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Code,
  ArrowLeft,
  Play,
  Clock,
  Users,
  Star,
  Award,
  BookOpen,
  CheckCircle,
  Heart,
  Share2,
  ShoppingCart,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
// Added cart functionality import
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

// Mock course data - in real app this would come from API/database
const courseData = {
  id: 1,
  title: "Python for Young Coders",
  description:
    "Learn Python programming through fun games and interactive projects designed specifically for kids aged 10-13",
  longDescription:
    "This comprehensive Python course introduces young learners to programming fundamentals through engaging, age-appropriate projects. Students will create games, animations, and interactive stories while building a solid foundation in Python programming concepts.",
  ageGroup: "10-13",
  difficulty: "Beginner",
  language: "Python",
  duration: "12 weeks",
  lessons: 36,
  students: 890,
  rating: 4.8,
  reviews: [
    {
      id: 1,
      name: "Sarah M.",
      avatar: "/parent-review.png",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "My 11-year-old son absolutely loves this course! Mr. Alex explains everything so clearly and the projects are really engaging. We can see real progress every week.",
      helpful: 23,
    },
    {
      id: 2,
      name: "David K.",
      avatar: "/parent-review.png",
      rating: 5,
      date: "1 month ago",
      comment:
        "Excellent course structure and pacing. My daughter went from knowing nothing about coding to building her own simple games. The instructor is fantastic with kids.",
      helpful: 18,
    },
    {
      id: 3,
      name: "Emma L.",
      avatar: "/parent-review.png",
      rating: 4,
      date: "1 month ago",
      comment:
        "Great course overall. The projects are fun and educational. My son sometimes needs help with the more advanced concepts, but the support is excellent.",
      helpful: 12,
    },
  ],
  price: 39.99,
  originalPrice: 59.99,
  instructor: {
    name: "Mr. Alex Thompson",
    bio: "Experienced educator with 8+ years teaching programming to children. Former software engineer at Google.",
    avatar: "/friendly-teacher.png",
    rating: 4.9,
    students: 2340,
    courses: 5,
  },
  category: "Programming",
  image: "/python-snake-coding-game-kids.png",
  videoUrl: "/video-player-python-course.png",
  color: "from-blue-500 to-indigo-600",
  skills: ["Python Basics", "Game Development", "Problem Solving", "Algorithms", "Debugging", "Project Building"],
  features: [
    "Interactive coding exercises",
    "Fun game-based projects",
    "Step-by-step video tutorials",
    "Live coding sessions",
    "Certificate of completion",
    "Parent progress reports",
  ],
  curriculum: [
    {
      week: 1,
      title: "Getting Started with Python",
      lessons: ["What is Programming?", "Setting Up Python", "Your First Program"],
      duration: "3 hours",
    },
    {
      week: 2,
      title: "Variables and Data Types",
      lessons: ["Understanding Variables", "Numbers and Strings", "Getting User Input"],
      duration: "3.5 hours",
    },
    {
      week: 3,
      title: "Making Decisions",
      lessons: ["If Statements", "Comparing Values", "Multiple Conditions"],
      duration: "4 hours",
    },
    {
      week: 4,
      title: "Loops and Repetition",
      lessons: ["For Loops", "While Loops", "Loop Challenges"],
      duration: "4 hours",
    },
    {
      week: 5,
      title: "Functions and Organization",
      lessons: ["Creating Functions", "Parameters and Returns", "Code Organization"],
      duration: "4.5 hours",
    },
    {
      week: 6,
      title: "Lists and Collections",
      lessons: ["Working with Lists", "List Methods", "Storing Data"],
      duration: "4 hours",
    },
  ],
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()
  // Added cart functionality
  const { state, dispatch } = useCart()
  const { isAuthenticated } = useAuth()

  const addToCart = () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: courseData.id,
        title: courseData.title,
        price: courseData.price,
        image: courseData.image,
        instructor: courseData.instructor.name,
        duration: courseData.duration,
      },
    })
  }

  const isInCart = state.items.some((item) => item.id === courseData.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/courses" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
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
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="bg-transparent relative" asChild>
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
            <Button variant="outline" size="sm" className="bg-transparent">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-green-100 text-green-800">{courseData.difficulty}</Badge>
                    <Badge variant="secondary">{courseData.language}</Badge>
                    <Badge variant="secondary">Ages {courseData.ageGroup}</Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">{courseData.title}</h1>
                  <p className="text-xl text-gray-600 mb-6">{courseData.description}</p>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{courseData.rating}</span>
                      <span>({courseData.reviews.length} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{courseData.students} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{courseData.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{courseData.lessons} lessons</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Preview */}
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 mb-8">
                <img
                  src={courseData.videoUrl || "/placeholder.svg"}
                  alt="Course preview"
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
                  >
                    <Play className="w-6 h-6 mr-2 text-white" />
                    <span className="text-white">Watch Preview</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Course Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What You'll Learn</CardTitle>
                    <CardDescription>Key skills and concepts covered in this course</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {courseData.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Features</CardTitle>
                    <CardDescription>What makes this course special</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {courseData.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{courseData.longDescription}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Curriculum</CardTitle>
                    <CardDescription>
                      {courseData.curriculum.length} weeks • {courseData.lessons} lessons
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {courseData.curriculum.map((week, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">
                            Week {week.week}: {week.title}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {week.duration}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {week.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="flex items-center gap-3 text-sm text-gray-600">
                              <Play className="w-4 h-4 text-blue-500" />
                              <span>{lesson}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Meet Your Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-6">
                      <img
                        src={courseData.instructor.avatar || "/placeholder.svg"}
                        alt={courseData.instructor.name}
                        className="w-20 h-20 rounded-2xl object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{courseData.instructor.name}</h3>
                        <p className="text-gray-600 mb-4">{courseData.instructor.bio}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{courseData.instructor.rating} rating</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{courseData.instructor.students} students</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>{courseData.instructor.courses} courses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                    <CardDescription>
                      {courseData.reviews.length} reviews • {courseData.rating} average rating
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {courseData.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start gap-4">
                          <img
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{review.name}</h4>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <p className="text-gray-700 mb-3">{review.comment}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <button className="hover:text-blue-600">Helpful ({review.helpful})</button>
                              <button className="hover:text-blue-600">Reply</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">${courseData.price}</span>
                    <span className="text-lg text-gray-500 line-through">${courseData.originalPrice}</span>
                  </div>
                  <p className="text-sm text-gray-600">per month • Cancel anytime</p>
                </div>

                <div className="space-y-4 mb-6">
                  <Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-6" asChild>
                    <Link href="/pricing">
                      <Play className="w-5 h-5 mr-2" />
                      Start Free Trial
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl bg-transparent py-6"
                    onClick={addToCart}
                    disabled={isInCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isInCart ? "Added to Cart" : "Add to Cart"}
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-600 mb-6">
                  <p>7-day free trial • No credit card required</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Parent progress reports</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>24/7 support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Skill Level</span>
                  <Badge className="bg-green-100 text-green-800">{courseData.difficulty}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium">{courseData.language}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Age Group</span>
                  <span className="font-medium">{courseData.ageGroup} years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{courseData.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Lessons</span>
                  <span className="font-medium">{courseData.lessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Certificate</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
