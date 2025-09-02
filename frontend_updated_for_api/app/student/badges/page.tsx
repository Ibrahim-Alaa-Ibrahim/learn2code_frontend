"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Code, ArrowLeft, Search, Award, Star, Trophy, Crown } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const allBadges = [
  {
    id: 1,
    name: "First Steps",
    icon: "🚀",
    description: "Completed your first lesson",
    rarity: "common",
    earned: true,
    earnedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Code Warrior",
    icon: "⚔️",
    description: "Wrote 100 lines of code",
    rarity: "rare",
    earned: true,
    earnedDate: "2024-01-20",
  },
  {
    id: 3,
    name: "Bug Hunter",
    icon: "🐛",
    description: "Fixed 10 coding errors",
    rarity: "epic",
    earned: true,
    earnedDate: "2024-01-25",
  },
  {
    id: 4,
    name: "Creative Coder",
    icon: "🎨",
    description: "Built a colorful project",
    rarity: "rare",
    earned: true,
    earnedDate: "2024-02-01",
  },
  {
    id: 5,
    name: "Speed Demon",
    icon: "⚡",
    description: "Completed lesson in record time",
    rarity: "legendary",
    earned: true,
    earnedDate: "2024-02-05",
  },
  {
    id: 6,
    name: "Helper",
    icon: "🤝",
    description: "Helped a friend with coding",
    rarity: "common",
    earned: true,
    earnedDate: "2024-02-10",
  },
  { id: 7, name: "Night Owl", icon: "🦉", description: "Coded after 9 PM", rarity: "rare", earned: false },
  { id: 8, name: "Early Bird", icon: "🐦", description: "Coded before 7 AM", rarity: "rare", earned: false },
  { id: 9, name: "Perfectionist", icon: "💎", description: "Got 100% on 5 quizzes", rarity: "epic", earned: false },
  {
    id: 10,
    name: "Marathon Runner",
    icon: "🏃",
    description: "Coded for 3 hours straight",
    rarity: "legendary",
    earned: false,
  },
  {
    id: 11,
    name: "Team Player",
    icon: "👥",
    description: "Completed a group project",
    rarity: "common",
    earned: false,
  },
  { id: 12, name: "Innovator", icon: "💡", description: "Created an original project", rarity: "epic", earned: false },
]

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common":
      return "bg-gray-100 text-gray-800 border-gray-300"
    case "rare":
      return "bg-blue-100 text-blue-800 border-blue-300"
    case "epic":
      return "bg-purple-100 text-purple-800 border-purple-300"
    case "legendary":
      return "bg-yellow-100 text-yellow-800 border-yellow-300"
    default:
      return "bg-gray-100 text-gray-800 border-gray-300"
  }
}

const getRarityIcon = (rarity: string) => {
  switch (rarity) {
    case "common":
      return <Star className="w-4 h-4 text-gray-500" />
    case "rare":
      return <Award className="w-4 h-4 text-blue-500" />
    case "epic":
      return <Trophy className="w-4 h-4 text-purple-500" />
    case "legendary":
      return <Crown className="w-4 h-4 text-yellow-500" />
    default:
      return <Star className="w-4 h-4 text-gray-500" />
  }
}

export default function BadgesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRarity, setFilterRarity] = useState("all")
  const [filterEarned, setFilterEarned] = useState("all")

  const filteredBadges = allBadges.filter((badge) => {
    const matchesSearch =
      badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRarity = filterRarity === "all" || badge.rarity === filterRarity
    const matchesEarned =
      filterEarned === "all" ||
      (filterEarned === "earned" && badge.earned) ||
      (filterEarned === "unearned" && !badge.earned)

    return matchesSearch && matchesRarity && matchesEarned
  })

  const earnedCount = allBadges.filter((badge) => badge.earned).length
  const totalCount = allBadges.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/student/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
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
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Award className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Badge Collection</h1>
          <p className="text-xl text-gray-600 mb-6">Show off your coding achievements and unlock new badges!</p>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-heading font-bold text-purple-600">{earnedCount}</div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl font-heading font-bold text-gray-400">{totalCount - earnedCount}</div>
              <div className="text-sm text-gray-600">To Unlock</div>
            </div>
            <div className="w-px h-12 bg-gray-300" />
            <div className="text-center">
              <div className="text-3xl font-heading font-bold text-blue-600">
                {Math.round((earnedCount / totalCount) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search badges..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={filterRarity}
                  onChange={(e) => setFilterRarity(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Rarities</option>
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
                <select
                  value={filterEarned}
                  onChange={(e) => setFilterEarned(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Badges</option>
                  <option value="earned">Earned</option>
                  <option value="unearned">Not Earned</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBadges.map((badge) => (
            <Card
              key={badge.id}
              className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                badge.earned ? "bg-white" : "bg-gray-50 opacity-75"
              }`}
            >
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-4xl ${
                      badge.earned ? "bg-gradient-to-br from-yellow-400 to-orange-400" : "bg-gray-200"
                    }`}
                  >
                    {badge.earned ? badge.icon : "🔒"}
                  </div>
                  <div className="absolute -top-2 -right-2">{getRarityIcon(badge.rarity)}</div>
                </div>

                <h3 className={`font-heading font-bold mb-2 ${badge.earned ? "text-gray-900" : "text-gray-500"}`}>
                  {badge.name}
                </h3>

                <p className={`text-sm mb-4 ${badge.earned ? "text-gray-600" : "text-gray-400"}`}>
                  {badge.description}
                </p>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge className={`text-xs px-3 py-1 ${getRarityColor(badge.rarity)}`}>{badge.rarity}</Badge>
                  {badge.earned && <Badge className="bg-green-100 text-green-800 text-xs px-3 py-1">Earned</Badge>}
                </div>

                {badge.earned && badge.earnedDate && (
                  <p className="text-xs text-gray-500">Earned on {new Date(badge.earnedDate).toLocaleDateString()}</p>
                )}

                {!badge.earned && <p className="text-xs text-gray-400 italic">Keep coding to unlock this badge!</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBadges.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">No badges found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
