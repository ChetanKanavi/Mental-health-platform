"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, Heart, BarChart3, ArrowRight, Info, LogOut } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { useFirebaseAuth } from "@/hooks/use-firebase-auth"
import { useRouter } from "next/navigation"
import { getUserProfile, getUserMoodEntries } from "@/lib/firestore"

interface MoodLog {
  id: string
  mood: number
  date: string
  note?: string
}

const moodEmojis: Record<number, string> = {
  1: "😢",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😄",
}

const moodLabels: Record<number, string> = {
  1: "Very Bad",
  2: "Bad",
  3: "Neutral",
  4: "Good",
  5: "Excellent",
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useFirebaseAuth()
  const [firstName, setFirstName] = useState("Friend")
  const [isLoading, setIsLoading] = useState(true)
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([])

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          // Load user profile
          const profile = await getUserProfile(user.uid)
          if (profile && profile.firstName) {
            setFirstName(profile.firstName)
          } else {
            setFirstName(user.displayName || user.email?.split("@")[0] || "Friend")
          }

          // Load recent mood entries
          const entries = await getUserMoodEntries(user.uid, 7)
          const transformedLogs: MoodLog[] = entries
            .sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
              const dateA = new Date(a.date as string).getTime()
              const dateB = new Date(b.date as string).getTime()
              return dateB - dateA
            })
            .slice(0, 5)
            .map((entry: Record<string, unknown>) => ({
              id: entry.id as string,
              mood: entry.mood as number,
              date: entry.date as string,
              note: entry.note as string,
            }))
          setMoodLogs(transformedLogs)
        } catch (error) {
          console.error("[v0] Error loading user data:", error)
          setFirstName(user.email?.split("@")[0] || "Friend")
        }
      } else {
        // Redirect to login if not authenticated
        router.push("/login")
      }
      setIsLoading(false)
    }

    loadUserData()
  }, [user, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("[v0] Error logging out:", error)
    }
  }

  // Get IST time (UTC+5:30)
  const now = new Date()
  const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000) - (now.getTimezoneOffset() * 60 * 1000))
  const currentHourIST = istTime.getHours()
  
  let greeting = "Good morning"
  if (currentHourIST >= 12 && currentHourIST < 17) {
    greeting = "Good afternoon"
  } else if (currentHourIST >= 17) {
    greeting = "Good evening"
  }

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background pt-14 md:pt-16 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-14 md:pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Welcome Section with Logout */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                {greeting}, {firstName}
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          <div>
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
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Mood Logs</h2>
            <Card>
              {moodLogs.length > 0 ? (
                <CardContent className="py-4">
                  <div className="space-y-3">
                    {moodLogs.map((log) => {
                      const logDate = new Date(log.date)
                      const formattedDate = logDate.toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })
                      const formattedTime = logDate.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      
                      return (
                        <div key={log.id} className="p-3 rounded-lg bg-secondary/30 border border-border flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl">{moodEmojis[log.mood]}</span>
                              <div>
                                <p className="font-medium text-sm text-foreground">{moodLabels[log.mood]}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formattedDate} at {formattedTime}
                                </p>
                              </div>
                            </div>
                            {log.note && (
                              <p className="text-xs text-muted-foreground mt-2 pl-10 italic">
                                "{log.note}"
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <Link href="/analytics" className="block mt-4">
                    <Button variant="outline" className="w-full" size="sm">
                      View all mood history
                    </Button>
                  </Link>
                </CardContent>
              ) : (
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    {"You haven't logged any moods yet. Start tracking to see your history here."}
                  </p>
                  <Link href="/mood-tracker">
                    <Button className="mt-4" variant="outline">
                      Log your first mood
                    </Button>
                  </Link>
                </CardContent>
              )}
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
