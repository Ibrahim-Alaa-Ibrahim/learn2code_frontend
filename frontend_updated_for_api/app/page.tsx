import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Play, Users, Award, ArrowRight, Code, Gamepad2, Trophy } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
              <a href="#courses" className="text-gray-600 hover:text-blue-600 font-medium">
                Courses
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 font-medium">
                How It Works
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium">
                Reviews
              </a>
              <Button variant="outline" className="rounded-full bg-transparent" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/register">Start Free Trial</Link>
              </Button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="mb-8">
              <Badge className="mb-4 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-full px-4 py-2">
                Ages 6-17 • Fun & Interactive
              </Badge>
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-gray-900 mb-6 leading-tight">
                Learn to Code,{" "}
                <span className="bg-gradient-to-r from-yellow-400 via-blue-500 to-green-500 bg-clip-text text-transparent">
                One Fun Step
              </span>{" "}
                at a Time!
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of kids learning programming through interactive games, fun projects, and step-by-step
                guidance from expert instructors.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6" asChild>
                <Link href="/register">
                  <Play className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-lg px-8 py-6 bg-transparent">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>10,000+ Happy Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.9/5 Parent Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Award Winning</span>
              </div>
            </div>
          </div>
        </section>

        {/* Course Highlights */}
        <section id="courses" className="py-20 px-4 bg-white/50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">Perfect Courses for Every Age</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our age-appropriate curriculum grows with your child, from visual programming to real coding languages.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Ages 6-9 */}
              <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-yellow-100 to-orange-100">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Gamepad2 className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-heading font-bold text-gray-900">Little Coders</CardTitle>
                  <CardDescription className="text-lg text-gray-600">Ages 6-9</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Start with drag-and-drop programming using Scratch Jr. Create animations, games, and interactive
                    stories!
                  </p>
                  <ul className="text-sm text-gray-600 mb-6 space-y-2">
                    <li>• Visual block programming</li>
                    <li>• Fun animations & games</li>
                    <li>• Problem-solving skills</li>
                    <li>• Creative storytelling</li>
                  </ul>
                  <Button className="w-full rounded-full bg-yellow-500 hover:bg-yellow-600" asChild>
                    <Link href="/courses?age=6-9">
                      See Courses
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Ages 10-13 */}
              <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-heading font-bold text-gray-900">Code Explorers</CardTitle>
                  <CardDescription className="text-lg text-gray-600">Ages 10-13</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Advance to Scratch and Python basics. Build games, websites, and learn fundamental programming
                    concepts.
                  </p>
                  <ul className="text-sm text-gray-600 mb-6 space-y-2">
                    <li>• Scratch programming</li>
                    <li>• Python fundamentals</li>
                    <li>• Game development</li>
                    <li>• Web design basics</li>
                  </ul>
                  <Button className="w-full rounded-full bg-blue-500 hover:bg-blue-600" asChild>
                    <Link href="/courses?age=10-13">
                      See Courses
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Ages 14-17 */}
              <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-green-100 to-emerald-100">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-heading font-bold text-gray-900">Future Developers</CardTitle>
                  <CardDescription className="text-lg text-gray-600">Ages 14-17</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Master real programming languages like JavaScript, Python, and Java. Build apps and prepare for tech
                    careers.
                  </p>
                  <ul className="text-sm text-gray-600 mb-6 space-y-2">
                    <li>• JavaScript & Python</li>
                    <li>• Mobile app development</li>
                    <li>• Data science basics</li>
                    <li>• Portfolio projects</li>
                  </ul>
                  <Button className="w-full rounded-full bg-green-500 hover:bg-green-600" asChild>
                    <Link href="/courses?age=14-17">
                      See Courses
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600">Simple steps to start your child's coding journey</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-heading font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-heading font-semibold text-gray-900 mb-4">Choose a Course</h3>
                <p className="text-gray-600 leading-relaxed">
                  Select the perfect course based on your child's age and interests. All courses include free trial
                  lessons.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-heading font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-heading font-semibold text-gray-900 mb-4">Learn & Play</h3>
                <p className="text-gray-600 leading-relaxed">
                  Interactive lessons, fun projects, and games make learning to code feel like playing. Progress at your
                  own pace.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-heading font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-heading font-semibold text-gray-900 mb-4">Earn Certificates</h3>
                <p className="text-gray-600 leading-relaxed">
                  Celebrate achievements with badges, certificates, and showcase projects. Build a portfolio of amazing
                  creations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 px-4 bg-white/50">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">What Parents & Kids Say</h2>
              <p className="text-xl text-gray-600">Join thousands of happy families learning together</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "My 8-year-old daughter loves the interactive lessons! She's created her own games and can't wait for
                    each new lesson. The progress tracking helps me see how much she's learning."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-pink-600 font-semibold">SM</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Sarah M.</p>
                      <p className="text-sm text-gray-500">Parent of Emma, age 8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "As a parent with no coding background, I was worried I couldn't help. But the platform is so
                    well-designed that my son is learning independently and teaching me too!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">MJ</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Michael J.</p>
                      <p className="text-sm text-gray-500">Parent of Alex, age 12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-green-600">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-heading font-bold text-white mb-6">Ready to Start the Adventure?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of kids already learning to code. Start with our free trial and see the magic happen!
            </p>
            <Button size="lg" className="rounded-full bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6" asChild>
              <Link href="/register">
                <Play className="w-5 h-5 mr-2" />
                Start Your Free Trial
              </Link>
            </Button>
            <p className="text-sm text-blue-200 mt-4">No credit card required • Cancel anytime • 7-day free trial</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-fun rounded-lg flex items-center justify-center">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-heading font-bold">Learn2Code</span>
                </div>
                <p className="text-gray-400 leading-relaxed">Making coding fun and accessible for kids worldwide.</p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Courses</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Ages 6-9
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Ages 10-13
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Ages 14-17
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Free Trial
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Parent Guide
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Safety
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Learn2Code. All rights reserved. Made with ❤️ for young coders.</p>
            </div>
          </div>
        </footer>
      </div>
  )
}
