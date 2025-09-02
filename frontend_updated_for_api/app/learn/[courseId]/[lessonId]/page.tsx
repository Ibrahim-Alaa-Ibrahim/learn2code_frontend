"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Code,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Maximize,
  CheckCircle,
  Star,
  Trophy,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Target,
  Zap,
} from "lucide-react"
import Link from "next/link"

// Mock data for the learning environment
const courseData = {
  id: 1,
  title: "Python for Young Coders",
  currentLesson: 3,
  totalLessons: 36,
  progress: 25,
}

const lessonData = {
  id: 3,
  title: "Variables and Data Types",
  description: "Learn how to store and use different types of information in your programs",
  duration: "12:45",
  videoUrl: "/python-lesson-variables.mp4",
  type: "video", // video, coding, quiz
  xpReward: 50,
  completed: false,
}

const playlist = [
  { id: 1, title: "What is Programming?", duration: "8:30", completed: true, type: "video" },
  { id: 2, title: "Setting Up Python", duration: "10:15", completed: true, type: "video" },
  { id: 3, title: "Variables and Data Types", duration: "12:45", completed: false, type: "video", current: true },
  { id: 4, title: "Your First Variable", duration: "5:00", completed: false, type: "coding" },
  { id: 5, title: "Variables Quiz", duration: "3:00", completed: false, type: "quiz" },
  { id: 6, title: "Working with Numbers", duration: "9:20", completed: false, type: "video" },
  { id: 7, title: "String Adventures", duration: "11:10", completed: false, type: "video" },
  { id: 8, title: "Practice: Name Game", duration: "8:00", completed: false, type: "coding" },
]

const quizData = {
  question: "What do we use variables for in programming?",
  options: [
    "To store information that we can use later",
    "To make the computer run faster",
    "To change the color of the screen",
    "To turn the computer on and off",
  ],
  correctAnswer: 0,
  explanation: "Great job! Variables are like containers that hold information we want to use in our programs.",
}

const codingChallenge = {
  title: "Create Your First Variable",
  description: "Let's create a variable to store your name and print it out!",
  startingCode: `# Create a variable called 'my_name' and store your name in it
# Then print it out using print()

`,
  solution: `# Create a variable called 'my_name' and store your name in it
my_name = "Emma"

# Then print it out using print()
print(my_name)`,
  hint: "Remember to put your name in quotes and use the = sign to store it in the variable!",
}

export default function LearningEnvironment({
  params,
}: {
  params: { courseId: string; lessonId: string }
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(765) // 12:45 in seconds
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false)
  const [code, setCode] = useState(codingChallenge.startingCode)
  const [showHint, setShowHint] = useState(false)
  const [lessonType, setLessonType] = useState<"video" | "coding" | "quiz">("video")

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleLessonComplete = () => {
    setShowBadgeAnimation(true)
    setTimeout(() => setShowBadgeAnimation(false), 3000)
  }

  const handleQuizSubmit = () => {
    if (selectedAnswer === quizData.correctAnswer) {
      handleLessonComplete()
    }
  }

  const runCode = () => {
    // Simulate code execution
    console.log("Running code:", code)
    if (code.includes("my_name") && code.includes("print")) {
      handleLessonComplete()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/student/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <ArrowLeft className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <div className="w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-fun rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-heading font-bold text-gray-900">{courseData.title}</span>
                <div className="text-sm text-gray-600">
                  Lesson {courseData.currentLesson} of {courseData.totalLessons}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{courseData.progress}% Complete</div>
              <Progress value={courseData.progress} className="w-32 h-2" />
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
              <Star className="w-4 h-4" />+{lessonData.xpReward} XP
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Learning Area */}
        <div className="flex-1 flex flex-col">
          {/* Lesson Header */}
          <div className="p-6 bg-white border-b">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">{lessonData.title}</h1>
                <p className="text-gray-600 mb-4">{lessonData.description}</p>
                <div className="flex items-center gap-4">
                  <Badge
                    className={`${
                      lessonType === "video"
                        ? "bg-blue-100 text-blue-800"
                        : lessonType === "coding"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {lessonType === "video" ? "Video Lesson" : lessonType === "coding" ? "Coding Practice" : "Quiz"}
                  </Badge>
                  <span className="text-sm text-gray-500">{lessonData.duration}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setLessonType("video")}
                  className={lessonType === "video" ? "bg-blue-50 border-blue-200" : "bg-transparent"}
                >
                  Video
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLessonType("coding")}
                  className={lessonType === "coding" ? "bg-green-50 border-green-200" : "bg-transparent"}
                >
                  Code
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLessonType("quiz")}
                  className={lessonType === "quiz" ? "bg-purple-50 border-purple-200" : "bg-transparent"}
                >
                  Quiz
                </Button>
              </div>
            </div>
          </div>

          {/* Learning Content */}
          <div className="flex-1 p-6">
            {lessonType === "video" && (
              <div className="space-y-6">
                {/* Video Player */}
                <div className="relative bg-gray-900 rounded-2xl overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src="/python-lesson-video-player.png"
                      alt="Video lesson"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Video Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="text-white hover:bg-white/20"
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <SkipBack className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <SkipForward className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 mx-4">
                          <Progress value={(currentTime / duration) * 100} className="h-2 bg-white/20" />
                        </div>
                        <span className="text-white text-sm">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <Volume2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                          <Maximize className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Key Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Variables are like containers that store information</li>
                      <li>• We can store different types of data: numbers, text, and more</li>
                      <li>• Use the = sign to put information into a variable</li>
                      <li>• Variable names should be descriptive and easy to understand</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {lessonType === "coding" && (
              <div className="grid lg:grid-cols-2 gap-6 h-full">
                {/* Instructions */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-500" />
                        {codingChallenge.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{codingChallenge.description}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowHint(!showHint)}
                          className="bg-transparent"
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          {showHint ? "Hide Hint" : "Show Hint"}
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Reset Code
                        </Button>
                      </div>
                      {showHint && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-yellow-800 text-sm">{codingChallenge.hint}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Output</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[100px]">
                        <div className="text-gray-500">$ python my_program.py</div>
                        {code.includes("print") && code.includes("my_name") && <div>Emma</div>}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Code Editor */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Code Editor</h3>
                    <Button onClick={runCode} className="bg-green-600 hover:bg-green-700">
                      <Play className="w-4 h-4 mr-2" />
                      Run Code
                    </Button>
                  </div>
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <div className="bg-gray-800 px-4 py-2 text-gray-300 text-sm">my_program.py</div>
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-80 bg-gray-900 text-green-400 p-4 font-mono text-sm resize-none focus:outline-none"
                      placeholder="Write your Python code here..."
                    />
                  </div>
                </div>
              </div>
            )}

            {lessonType === "quiz" && (
              <div className="max-w-2xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-purple-500" />
                      Quick Quiz
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900">{quizData.question}</h3>
                      <div className="space-y-3">
                        {quizData.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedAnswer(index)}
                            className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                              selectedAnswer === index
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  selectedAnswer === index ? "border-blue-500 bg-blue-500" : "border-gray-300"
                                }`}
                              >
                                {selectedAnswer === index && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                              <span className="text-gray-900">{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      <Button
                        onClick={handleQuizSubmit}
                        disabled={selectedAnswer === null}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Submit Answer
                      </Button>
                      {selectedAnswer === quizData.correctAnswer && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="font-semibold text-green-900">Correct!</span>
                          </div>
                          <p className="text-green-800">{quizData.explanation}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="p-6 bg-white border-t">
            <div className="flex items-center justify-between">
              <Button variant="outline" className="bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Lesson
              </Button>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Lesson Progress</div>
                <Progress value={75} className="w-48 h-2" />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleLessonComplete}>
                Complete Lesson
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Playlist Sidebar */}
        <div className="w-80 bg-white border-l flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-heading font-semibold text-gray-900 mb-2">Course Playlist</h2>
            <div className="text-sm text-gray-600">
              {playlist.filter((l) => l.completed).length} of {playlist.length} lessons completed
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {playlist.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  lesson.current ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {lesson.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : lesson.current ? (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Play className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-medium mb-1 ${
                        lesson.current ? "text-blue-900" : lesson.completed ? "text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {lesson.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge
                        variant="secondary"
                        className={`${
                          lesson.type === "video"
                            ? "bg-blue-100 text-blue-800"
                            : lesson.type === "coding"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {lesson.type}
                      </Badge>
                      <span className="text-gray-500">{lesson.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badge Animation Modal */}
      {showBadgeAnimation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">Awesome Work!</h3>
            <p className="text-gray-600 mb-4">You earned the "Quick Learner" badge!</p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-gray-900">+{lessonData.xpReward} XP</span>
            </div>
            <Button
              onClick={() => setShowBadgeAnimation(false)}
              className="bg-blue-600 hover:bg-blue-700 rounded-full px-8"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
