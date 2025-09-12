"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Code, User, Calendar, CreditCard, Bell, Settings, TrendingUp, Award,
  BookOpen, Download, Eye, ChevronRight, AlertCircle, CheckCircle, Users, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, API_BASE } from "@/lib/api";

const FRONTEND_ORIGIN =
  process.env.NEXT_PUBLIC_FRONTEND_ORIGIN ?? "http://localhost:3000";

type Payment = {
  id: number;
  amount: number;
  currency: string;
  taxAmount: number;
  totalAmount: number;
  method: string;
  provider: string;
  status: string;
  receiptNumber: string;
  cardBrand?: string;
  cardLast4?: string;
  billingName: string;
  billingEmail: string;
  createdAt: string;
};

type ChildCard = {
  id: number; name: string; age: number; avatar: string; level: number; totalXP: number;
  coursesEnrolled: number; coursesCompleted: number; badgesEarned: number; weeklyProgress: number;
  lastActive: string; currentStreak: number;
  courses: Array<{ name: string; progress: number; timeSpent: string; lastLesson: string; status: "in-progress"|"completed"; certificate?: boolean; }>;
};

const childrenSeed: ChildCard[] = [
  { id: 1, name: "Emma", age: 8, avatar: "🦸", level: 12, totalXP: 2450, coursesEnrolled: 2, coursesCompleted: 1,
    badgesEarned: 15, weeklyProgress: 85, lastActive: "2024-01-15", currentStreak: 7,
    courses: [
      { name: "Python Adventures", progress: 65, timeSpent: "12h 30m", lastLesson: "Creating Your First Game", status: "in-progress" },
      { name: "Scratch Basics",   progress: 100, timeSpent: "8h 15m",  lastLesson: "Final Project",           status: "completed", certificate: true },
    ],
  },
  { id: 2, name: "Alex", age: 12, avatar: "🧙", level: 18, totalXP: 3890, coursesEnrolled: 3, coursesCompleted: 2,
    badgesEarned: 23, weeklyProgress: 92, lastActive: "2024-01-14", currentStreak: 12,
    courses: [
      { name: "Web Design Magic",       progress: 45, timeSpent: "15h 20m", lastLesson: "CSS Animations",        status: "in-progress" },
      { name: "JavaScript Fundamentals",progress: 100, timeSpent: "22h 45m", lastLesson: "Building a Calculator", status: "completed", certificate: true },
      { name: "Python Basics",          progress: 100, timeSpent: "18h 30m", lastLesson: "Final Project",         status: "completed", certificate: true },
    ],
  },
];

export default function ParentDashboard() {
  const { user, logout } = useAuth();
  const displayName = user?.name ?? "Parent";
  const userEmail   = user?.email ?? "";

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const handleSignOut = () => {
    logout();
    window.location.href = FRONTEND_ORIGIN;
  };

  useEffect(() => {
    if (!user?.id) return;
    let alive = true;
    (async () => {
      setLoadingPayments(true);
      try {
        const data = await apiFetch<Payment[]>("/api/payments/me", { userId: user.id });
        if (!alive) return;
        setPayments(Array.isArray(data) ? data : []);
      } catch {
        if (alive) setPayments([]);
      } finally {
        if (alive) setLoadingPayments(false);
      }
    })();
    return () => { alive = false; };
  }, [user?.id]);

  const latest = useMemo(() => {
    if (!payments.length) return null;
    return [...payments].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0];
  }, [payments]);

  const planLabel = latest ? `${latest.provider?.toUpperCase()} • ${latest.method}` : "Family Plan";
  const planAmountMonthly = latest ? latest.totalAmount : 29.99;
  const nextBillingDate = latest ? new Date(latest.createdAt) : null;
  if (nextBillingDate) nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  const unreadNotifications = 2;
  const [selectedChild, setSelectedChild] = useState(childrenSeed[0]);

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-fun rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-heading font-bold text-gray-900">Learn2Code</span>
              <Badge className="ml-2 bg-blue-100 text-blue-800">Parent Portal</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="relative bg-transparent">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                {unreadNotifications > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{displayName}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {displayName.split(" ")[0]}!</h1>
            <p className="text-gray-600">Track your children's coding progress and manage your account</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="progress">Progress</TabsTrigger>
                  <TabsTrigger value="certificates">Certificates</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>

                {/* Overview (demo children) */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card><CardContent className="p-6 text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold text-gray-900">{childrenSeed.length}</div>
                      <div className="text-sm text-gray-600">Children</div>
                    </CardContent></Card>
                    <Card><CardContent className="p-6 text-center">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold text-gray-900">
                        {childrenSeed.reduce((s,c)=>s+c.coursesEnrolled,0)}
                      </div>
                      <div className="text-sm text-gray-600">Active Courses</div>
                    </CardContent></Card>
                    <Card><CardContent className="p-6 text-center">
                      <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <div className="text-2xl font-bold text-gray-900">
                        {childrenSeed.reduce((s,c)=>s+c.badgesEarned,0)}
                      </div>
                      <div className="text-sm text-gray-600">Badges Earned</div>
                    </CardContent></Card>
                    <Card><CardContent className="p-6 text-center">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                      <div className="text-2xl font-bold text-gray-900">
                        {Math.round(childrenSeed.reduce((s,c)=>s+c.weeklyProgress,0)/childrenSeed.length)}%
                      </div>
                      <div className="text-sm text-gray-600">Avg. Weekly Progress</div>
                    </CardContent></Card>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Your Children</h3>
                    {childrenSeed.map((child) => (
                        <Card key={child.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-2xl">
                                {child.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h4 className="text-lg font-semibold text-gray-900">{child.name}</h4>
                                    <p className="text-gray-600">{child.age} years old • Level {child.level}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                      <span>Last active: {new Date(child.lastActive).toLocaleDateString()}</span>
                                      <span>{child.currentStreak} day streak</span>
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedChild(child)} className="bg-transparent">
                                    View Details <ChevronRight className="w-4 h-4 ml-1" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <div className="text-lg font-semibold text-blue-600">{child.coursesEnrolled}</div>
                                    <div className="text-xs text-blue-700">Courses Enrolled</div>
                                  </div>
                                  <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <div className="text-lg font-semibold text-green-600">{child.badgesEarned}</div>
                                    <div className="text-xs text-green-700">Badges Earned</div>
                                  </div>
                                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                                    <div className="text-lg font-semibold text-purple-600">{child.totalXP}</div>
                                    <div className="text-xs text-purple-700">Total XP</div>
                                  </div>
                                </div>

                                <div className="mt-4">
                                  <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-600">Weekly Progress</span>
                                    <span className="font-semibold text-gray-900">{child.weeklyProgress}%</span>
                                  </div>
                                  <Progress value={child.weeklyProgress} className="h-2" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Progress (demo) */}
                <TabsContent value="progress" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Select Child</CardTitle>
                      <CardDescription>View detailed progress for each child</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4">
                        {childrenSeed.map((child) => (
                            <Button
                                key={child.id}
                                variant={selectedChild.id === child.id ? "default" : "outline"}
                                onClick={() => setSelectedChild(child)}
                                className="flex items-center gap-2"
                            >
                              <span className="text-lg">{child.avatar}</span>
                              {child.name}
                            </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">{selectedChild.avatar}</span>
                        {selectedChild.name}'s Progress
                      </CardTitle>
                      <CardDescription>
                        Level {selectedChild.level} • {selectedChild.totalXP} XP • {selectedChild.currentStreak} day streak
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Course Progress</h4>
                        <div className="space-y-4">
                          {selectedChild.courses.map((course, idx) => (
                              <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h5 className="font-medium text-gray-900">{course.name}</h5>
                                    <p className="text-sm text-gray-600">Last lesson: {course.lastLesson}</p>
                                    <p className="text-sm text-gray-500">Time spent: {course.timeSpent}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={course.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                                      {course.status === "completed" ? "Completed" : "In Progress"}
                                    </Badge>
                                    {course.certificate && (
                                        <Button size="sm" variant="outline" className="bg-transparent">
                                          <Download className="w-4 h-4 mr-1" /> Certificate
                                        </Button>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-sm mb-2">
                                  <span className="text-gray-600">Progress</span>
                                  <span className="font-semibold text-gray-900">{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                              </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Billing (uses latest payment) */}
                <TabsContent value="billing" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription Details</CardTitle>
                      <CardDescription>Manage your Learn2Code subscription</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4">Current Plan</h4>
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-blue-900">{planLabel}</span>
                              <Badge className="bg-green-100 text-green-800">{latest ? latest.status : "Active"}</Badge>
                            </div>
                            <p className="text-sm text-blue-700 mb-3">
                              {userEmail ? <>Billed to <span className="font-medium">{userEmail}</span></> : "Recent payment details"}
                            </p>
                            <div className="text-2xl font-bold text-blue-900">${planAmountMonthly.toFixed(2)}/month</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4">Billing Information</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Next billing date:</span>
                              <span className="font-medium text-gray-900">
                              {latest && nextBillingDate ? nextBillingDate.toLocaleDateString() : "—"}
                            </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Payment method:</span>
                              <span className="font-medium text-gray-900">
                              {latest?.cardBrand ? `${latest.cardBrand.toUpperCase()} •••• ${latest.cardLast4 ?? "••••"}` : "—"}
                            </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Auto-renewal:</span>
                              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 mt-6">
                        <Button variant="outline" className="bg-transparent">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Update Payment Method
                        </Button>
                        <Button asChild variant="outline" className="bg-transparent">
                          <Link href="/receipts">
                            <Calendar className="w-4 h-4 mr-2" />
                            View Payment History
                          </Link>
                        </Button>
                        <Button variant="outline" className="bg-transparent">Change Plan</Button>
                      </div>

                      {loadingPayments && <p className="text-sm text-gray-500 mt-4">Loading latest payment…</p>}
                      {!loadingPayments && !latest && <p className="text-sm text-gray-500 mt-4">No payments found yet.</p>}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="w-5 h-5 text-blue-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg border bg-blue-50 border-blue-200">
                    <div className="flex items-start gap-3">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">Welcome, {displayName.split(" ")[0]}!</p>
                        <p className="text-xs text-gray-600 mb-1">Your account is ready.</p>
                        <p className="text-xs text-gray-500">Just now</p>
                      </div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                    View All Notifications
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/dashboard"><BookOpen className="w-4 h-4 mr-2" /> Browse Courses</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/receipts"><Calendar className="w-4 h-4 mr-2" /> View Receipts</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/parent/settings"><Settings className="w-4 h-4 mr-2" /> Account Settings</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/support"><AlertCircle className="w-4 h-4 mr-2" /> Get Support</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 mb-1">Safe Learning Environment</h4>
                      <p className="text-sm text-green-800">
                        Your children are learning in a secure, monitored environment with age-appropriate content and parental controls.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
}
