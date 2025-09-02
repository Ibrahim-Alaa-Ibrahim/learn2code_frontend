"use client"

import { apiFetch, getAuth } from "@/lib/api"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Code,
  Search,
  Filter,
  Clock,
  Users,
  Star,
  BookOpen,
  ChevronRight,
  Gamepad2,
  Palette,
  Smartphone,
  Brain,
} from "lucide-react"
import Link from "next/link"

const courses = [
  {
    id: 1,
    title: "Scratch Jr. Adventures",
    description: "Perfect introduction to coding for young minds using visual blocks",
    ageGroup: "6-9",
    difficulty: "Beginner",
    language: "Scratch Jr",
    duration: "8 weeks",
    lessons: 24,
    students: 1250,
    rating: 4.9,
    price: 29.99,
    instructor: "Ms. Sarah",
    category: "Visual Programming",
    image: "/colorful-blocks-coding-kids.png",
    color: "from-yellow-400 to-orange-500",
    icon: Gamepad2,
    skills: ["Problem Solving", "Logic", "Creativity", "Storytelling"],
    featured: true,
  },
  {
    id: 2,
    title: "Python for Young Coders",
    description: "Learn Python programming through fun games and interactive projects",
    ageGroup: "10-13",
    difficulty: "Beginner",
    language: "Python",
    duration: "12 weeks",
    lessons: 36,
    students: 890,
    rating: 4.8,
    price: 39.99,
    instructor: "Mr. Alex",
    category: "Programming",
    image: "/placeholder-ofziz.png",
    color: "from-blue-500 to-indigo-600",
    icon: Code,
    skills: ["Python Basics", "Game Development", "Problem Solving", "Algorithms"],
    featured: true,
  },
  {
    id: 3,
    title: "Web Design Magic",
    description: "Create beautiful websites with HTML, CSS, and basic JavaScript",
    ageGroup: "10-13",
    difficulty: "Beginner",
    language: "HTML/CSS",
    duration: "10 weeks",
    lessons: 30,
    students: 675,
    rating: 4.7,
    price: 34.99,
    instructor: "Ms. Emma",
    category: "Web Development",
    image: "/colorful-website-design.png",
    color: "from-purple-500 to-pink-500",
    icon: Palette,
    skills: ["HTML", "CSS", "Web Design", "Responsive Design"],
    featured: false,
  },
  {
    id: 4,
    title: "JavaScript Game Development",
    description: "Build interactive games and learn JavaScript fundamentals",
    ageGroup: "14-17",
    difficulty: "Intermediate",
    language: "JavaScript",
    duration: "14 weeks",
    lessons: 42,
    students: 445,
    rating: 4.9,
    price: 49.99,
    instructor: "Mr. David",
    category: "Game Development",
    image: "/javascript-game-development.png",
    color: "from-green-500 to-teal-600",
    icon: Gamepad2,
    skills: ["JavaScript", "Game Logic", "DOM Manipulation", "Event Handling"],
    featured: true,
  },
  {
    id: 5,
    title: "Mobile App Basics",
    description: "Introduction to mobile app development for teenagers",
    ageGroup: "14-17",
    difficulty: "Intermediate",
    language: "React Native",
    duration: "16 weeks",
    lessons: 48,
    students: 320,
    rating: 4.6,
    price: 59.99,
    instructor: "Ms. Lisa",
    category: "Mobile Development",
    image: "/mobile-app-development.png",
    color: "from-indigo-500 to-purple-600",
    icon: Smartphone,
    skills: ["React Native", "Mobile UI", "App Store", "User Experience"],
    featured: false,
  },
  {
    id: 6,
    title: "AI for Kids",
    description: "Explore artificial intelligence concepts through fun experiments",
    ageGroup: "10-13",
    difficulty: "Intermediate",
    language: "Python",
    duration: "8 weeks",
    lessons: 24,
    students: 280,
    rating: 4.8,
    price: 44.99,
    instructor: "Dr. Chen",
    category: "Artificial Intelligence",
    image: "/ai-robot-kids-learning.png",
    color: "from-cyan-500 to-blue-600",
    icon: Brain,
    skills: ["AI Concepts", "Machine Learning", "Data Analysis", "Python"],
    featured: false,
  },
]

const ageGroups = ["All Ages", "6-9", "10-13", "14-17"]
const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"]
const languages = ["All Languages", "Scratch Jr", "Python", "HTML/CSS", "JavaScript", "React Native"]
const categories = [
  "All Categories",
  "Visual Programming",
  "Programming",
  "Web Development",
  "Game Development",
  "Mobile Development",
  "Artificial Intelligence",
]

export default function CoursesPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAge, setSelectedAge] = useState("All Ages")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels")
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const ageParam = searchParams.get("age")
    if (ageParam && ageGroups.includes(ageParam)) {
      setSelectedAge(ageParam)
    }
  }, [searchParams])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAge = selectedAge === "All Ages" || course.ageGroup === selectedAge
    const matchesDifficulty = selectedDifficulty === "All Levels" || course.difficulty === selectedDifficulty
    const matchesLanguage = selectedLanguage === "All Languages" || course.language === selectedLanguage
    const matchesCategory = selectedCategory === "All Categories" || course.category === selectedCategory

    return matchesSearch && matchesAge && matchesDifficulty && matchesLanguage && matchesCategory
  })

  const featuredCourses = courses.filter((course) => course.featured)

  
  async function loadCoursesFromApi(){
    try{
      setLoading(true);
      const items = await apiFetch<any[]>(`/api/courses`);
      if(Array.isArray(items) && items.length){
        setCourses(items.map((c:any, idx:number)=>({
          id: c.id ?? idx,
          title: c.title || c.name || `Course ${idx+1}`,
          description: c.description || "",
          image: c.image || "/colorful-website-design.png",
          progress: 0,
          totalLessons: c.totalLessons || 0,
          completedLessons: 0,
          nextLesson: "",
          instructor: c.instructor?.name || "Instructor",
          difficulty: c.difficulty || "Beginner",
          ageGroup: c.ageGroup || "10-13",
        })));
      }
    }catch(e:any){
      setApiError(e.message || "Failed to load courses");
    }finally{ setLoading(false); }
  }

  
  async function handleBuy(courseId:number){
    try{
      const auth = getAuth();
      const userId = auth?.user?.id || auth?.id;
      if(!userId) throw new Error("Please sign in first");
      const body = { userId, courseId };
      try{
        await apiFetch(`/api/purchase`, { method: "POST", body });
      }catch{
        await apiFetch(`/api/enrollments`, { method: "POST", body });
      }
      alert("Purchase successful! You can find it under My Courses.");
    }catch(e:any){ alert(e.message || "Could not complete purchase"); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/ntg-logo.png" alt="NTG Clarity Networks Inc." className="h-8 w-auto" />
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <div className="w-10 h-10 bg-gradient-fun rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold text-gray-900">Learn2Code</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link href="/courses" className="text-blue-600 font-medium">
              Courses
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 font-medium">
              About
            </Link>
            <Button variant="outline" className="rounded-full bg-transparent" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/register">Start Free Trial</Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Coding Courses
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover age-appropriate programming courses designed to make learning fun and engaging for every young
            coder
          </p>
        </div>

        {/* Featured Courses */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Featured Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-400 text-yellow-900 font-semibold">Featured</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${course.color} rounded-xl flex items-center justify-center`}
                    >
                      <course.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Ages {course.ageGroup}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                      <span className="text-gray-500 text-sm">/month</span>
                    </div>
                    <Button className="rounded-full bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href={`/courses/${course.id}`}>
                        View Course
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-12"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden rounded-xl bg-transparent"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <div className={`flex flex-col lg:flex-row gap-4 ${showFilters ? "block" : "hidden lg:flex"}`}>
                <Select value={selectedAge} onValueChange={setSelectedAge}>
                  <SelectTrigger className="w-full lg:w-40 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Age Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageGroups.map((age) => (
                      <SelectItem key={age} value={age}>
                        {age}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-full lg:w-40 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-full lg:w-40 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full lg:w-40 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-heading font-bold text-gray-900">All Courses ({filteredCourses.length})</h2>
            <div className="text-sm text-gray-600">
              Showing {filteredCourses.length} of {courses.length} courses
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    className={`${
                      course.difficulty === "Beginner"
                        ? "bg-green-100 text-green-800"
                        : course.difficulty === "Intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {course.difficulty}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${course.color} rounded-xl flex items-center justify-center`}
                  >
                    <course.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {course.language}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {course.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Ages {course.ageGroup}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                  <Button className="rounded-full bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href={`/courses/${course.id}`}>
                      View Course
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters to find the perfect course</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedAge("All Ages")
                setSelectedDifficulty("All Levels")
                setSelectedLanguage("All Languages")
                setSelectedCategory("All Categories")
              }}
              className="rounded-full bg-transparent"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
