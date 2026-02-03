"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Leaf, 
  ArrowLeft, 
  Users,
  ClipboardList,
  TrendingUp,
  Calendar
} from "lucide-react"

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth")
    if (auth !== "true") {
      router.push("/admin/login")
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Checking authorization...</p>
      </div>
    )
  }

  const stats = [
    { label: "Total Users", value: "1,247", change: "+12%", icon: Users },
    { label: "Assessments Completed", value: "3,892", change: "+18%", icon: ClipboardList },
    { label: "Mood Entries", value: "12,456", change: "+24%", icon: TrendingUp },
    { label: "Active This Week", value: "892", change: "+8%", icon: Calendar },
  ]

  const recentActivity = [
    { type: "assessment", user: "user***@email.com", time: "2 mins ago" },
    { type: "mood", user: "user***@email.com", time: "5 mins ago" },
    { type: "signup", user: "new***@email.com", time: "12 mins ago" },
    { type: "mood", user: "user***@email.com", time: "15 mins ago" },
    { type: "assessment", user: "user***@email.com", time: "23 mins ago" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">MindfulMe</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              Admin
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Link 
          href="/admin/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Platform Analytics
          </h1>
          <p className="mt-2 text-muted-foreground">
            View usage statistics and trends across the platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-primary font-medium">{stat.change} from last month</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Recent Activity</CardTitle>
              <CardDescription>Latest user actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === "assessment" ? "bg-primary" :
                        activity.type === "mood" ? "bg-accent" :
                        "bg-chart-2"
                      }`} />
                      <div>
                        <p className="text-sm text-foreground capitalize">{activity.type}</p>
                        <p className="text-xs text-muted-foreground">{activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Emotions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Top Emotions Logged</CardTitle>
              <CardDescription>Most frequently selected emotions this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { emotion: "Anxious", count: 1234, percent: 85 },
                  { emotion: "Stressed", count: 987, percent: 70 },
                  { emotion: "Tired", count: 876, percent: 62 },
                  { emotion: "Calm", count: 654, percent: 48 },
                  { emotion: "Happy", count: 543, percent: 40 },
                ].map((item) => (
                  <div key={item.emotion} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">{item.emotion}</span>
                      <span className="text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
