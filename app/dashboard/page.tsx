"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, Heart, BarChart3, ArrowRight, Info } from "lucide-react"
import { Navigation } from "@/components/navigation"

// Simulated user data - in production this would come from auth/database
const user = {
  firstName: "Sarah",
}

export default function DashboardPage() {
  const currentHour = new Date().getHours()
  let greeting = "Good morning"
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon"
  } else if (currentHour >= 17) {
    greeting = "Good evening"
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-14 md:pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              {greeting}, {user.firstName}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {"How are you feeling today? Take a moment to check in with yourself."}
            </p>
          </div>

          {/* Disclaimer Banner */}
          <div className="mb-8 p-4 rounded-xl bg-secondary/50 border border-border flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Self-awareness tool:</span> This platform is 
              designed for personal reflection and does not provide medical diagnosis. If you need 
              professional support, please consult a healthcare provider.
            </p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/assessment" className="block">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg text-foreground">Take Self-Assessment</CardTitle>
                  <CardDescription>
                    Answer a few questions to understand your current stress and anxiety levels.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="p-0 h-auto text-primary group-hover:gap-3 transition-all">
                    Start assessment
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/mood-tracker" className="block">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center mb-2">
                    <Heart className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-lg text-foreground">{"Log Today's Mood"}</CardTitle>
                  <CardDescription>
                    Record how {"you're"} feeling right now and add optional journal notes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="p-0 h-auto text-primary group-hover:gap-3 transition-all">
                    Log mood
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/analytics" className="block">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-chart-2/20 flex items-center justify-center mb-2">
                    <BarChart3 className="w-6 h-6 text-chart-2" />
                  </div>
                  <CardTitle className="text-lg text-foreground">View Mood Trends</CardTitle>
                  <CardDescription>
                    See patterns in your mood over time with weekly and monthly views.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="p-0 h-auto text-primary group-hover:gap-3 transition-all">
                    View trends
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  {"You haven't logged any moods yet. Start tracking to see your history here."}
                </p>
                <Link href="/mood-tracker">
                  <Button className="mt-4 bg-transparent" variant="outline">
                    Log your first mood
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Daily Tip */}
          <div className="mt-8 p-6 rounded-xl bg-card border border-border">
            <h3 className="font-medium text-foreground mb-2">Daily Wellness Tip</h3>
            <p className="text-muted-foreground text-sm">
              Take a few deep breaths. Inhale slowly for 4 counts, hold for 4 counts, and exhale 
              for 4 counts. This simple breathing exercise can help reduce stress and bring you 
              back to the present moment.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
