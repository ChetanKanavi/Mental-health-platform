"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { Navigation } from "@/components/navigation"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useFirebaseAuth } from "@/hooks/use-firebase-auth"
import { getUserMoodEntries } from "@/lib/firestore"

interface MoodEntry {
  id: string
  mood: number
  journal: string
  date: string
}

type ViewType = "weekly" | "monthly"

// Generate sample data for demo purposes
const generateSampleData = (): MoodEntry[] => {
  const entries: MoodEntry[] = []
  const now = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Generate realistic-looking mood patterns
    const baseValue = 3
    const variance = Math.sin(i / 3) * 1.5 + Math.random() - 0.5
    const mood = Math.max(1, Math.min(5, Math.round(baseValue + variance)))
    
    entries.push({
      id: `sample-${i}`,
      mood,
      journal: "",
      date: date.toISOString(),
    })
  }
  
  return entries
}

const moodLabels: Record<number, string> = {
  1: "Very Low",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Great",
}

// Compute colors in JavaScript since CSS variables don't work directly in Recharts
const CHART_COLORS = {
  primary: "#5A9A8F",
  secondary: "#7AADA3",
}

export default function AnalyticsPage() {
  const { user } = useFirebaseAuth()
  const [view, setView] = useState<ViewType>("weekly")
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [useSampleData, setUseSampleData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMoodData = async () => {
      setIsLoading(true)
      
      try {
        if (user) {
          // Fetch from Firebase
          const firestoreEntries = await getUserMoodEntries(user.uid, 90)
          if (firestoreEntries.length > 0) {
            const transformedEntries: MoodEntry[] = firestoreEntries.map((entry: Record<string, unknown>) => ({
              id: entry.id as string,
              mood: entry.mood as number,
              journal: entry.note as string || "",
              date: entry.date as string,
            }))
            setEntries(transformedEntries)
            setUseSampleData(false)
          } else {
            setUseSampleData(true)
            setEntries(generateSampleData())
          }
        } else {
          // Fallback to localStorage
          const stored = localStorage.getItem("moodEntries")
          if (stored) {
            const parsed = JSON.parse(stored) as MoodEntry[]
            if (parsed.length > 0) {
              setEntries(parsed)
              setUseSampleData(false)
            } else {
              setUseSampleData(true)
              setEntries(generateSampleData())
            }
          } else {
            setUseSampleData(true)
            setEntries(generateSampleData())
          }
        }
      } catch (error) {
        console.error("[v0] Error loading mood data:", error)
        setUseSampleData(true)
        setEntries(generateSampleData())
      } finally {
        setIsLoading(false)
      }
    }

    loadMoodData()
  }, [user])

  const chartData = useMemo(() => {
    const now = new Date()
    const daysToShow = view === "weekly" ? 7 : 30
    const data: { date: string; mood: number | null; label: string }[] = []

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      
      // Find entry for this date
      const entry = entries.find(e => 
        new Date(e.date).toISOString().split("T")[0] === dateStr
      )

      const label = view === "weekly" 
        ? date.toLocaleDateString("en-US", { weekday: "short" })
        : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

      data.push({
        date: dateStr,
        mood: entry?.mood || null,
        label,
      })
    }

    return data
  }, [entries, view])

  const stats = useMemo(() => {
    const validMoods = chartData.filter(d => d.mood !== null).map(d => d.mood as number)
    
    if (validMoods.length === 0) {
      return { average: 0, trend: "stable" as const, entriesCount: 0 }
    }

    const average = validMoods.reduce((a, b) => a + b, 0) / validMoods.length
    
    // Calculate trend (compare first half vs second half)
    const midpoint = Math.floor(validMoods.length / 2)
    const firstHalf = validMoods.slice(0, midpoint)
    const secondHalf = validMoods.slice(midpoint)
    
    const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : 0
    const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : 0
    
    let trend: "up" | "down" | "stable" = "stable"
    if (secondAvg - firstAvg > 0.3) trend = "up"
    else if (firstAvg - secondAvg > 0.3) trend = "down"

    return { average, trend, entriesCount: validMoods.length }
  }, [chartData])

  const TrendIcon = stats.trend === "up" ? TrendingUp : stats.trend === "down" ? TrendingDown : Minus
  const trendColor = stats.trend === "up" ? "text-chart-1" : stats.trend === "down" ? "text-chart-4" : "text-muted-foreground"

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-14 md:pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Mood Analytics
            </h1>
            <p className="mt-2 text-muted-foreground">
              View patterns in your mood over time to better understand yourself.
            </p>
          </div>

          {/* Sample Data Notice */}
          {useSampleData && (
            <div className="mb-6 p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Sample data:</span> {"You're"} viewing 
                example data. Start logging your mood to see your personal analytics.
              </p>
            </div>
          )}

          {/* View Toggle */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={view === "weekly" ? "default" : "outline"}
              onClick={() => setView("weekly")}
              size="sm"
            >
              Weekly
            </Button>
            <Button
              variant={view === "monthly" ? "default" : "outline"}
              onClick={() => setView("monthly")}
              size="sm"
            >
              Monthly
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Average Mood</p>
                <p className="text-2xl font-semibold text-foreground mt-1">
                  {stats.average.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {moodLabels[Math.round(stats.average)] || "N/A"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Trend</p>
                <div className="flex items-center gap-2 mt-1">
                  <TrendIcon className={cn("w-5 h-5", trendColor)} />
                  <span className="text-2xl font-semibold text-foreground capitalize">
                    {stats.trend}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.trend === "up" ? "Improving" : stats.trend === "down" ? "Declining" : "Stable"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Entries Logged</p>
                <p className="text-2xl font-semibold text-foreground mt-1">
                  {stats.entriesCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Past {view === "weekly" ? "7" : "30"} days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Line Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Mood Over Time</CardTitle>
              <CardDescription>
                Track how your mood changes throughout the {view === "weekly" ? "week" : "month"}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  mood: {
                    label: "Mood",
                    color: CHART_COLORS.primary,
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="label" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      domain={[1, 5]} 
                      ticks={[1, 2, 3, 4, 5]}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => moodLabels[value]?.charAt(0) || ""}
                    />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null
                        const value = payload[0]?.value as number
                        if (value === null || value === undefined) return null
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <p className="text-xs text-muted-foreground">{label}</p>
                            <p className="text-sm font-medium">{moodLabels[value] || value}</p>
                          </div>
                        )
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke={CHART_COLORS.primary}
                      strokeWidth={2}
                      dot={{ fill: CHART_COLORS.primary, strokeWidth: 0, r: 4 }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Daily Comparison</CardTitle>
              <CardDescription>
                Compare your daily mood levels at a glance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  mood: {
                    label: "Mood",
                    color: CHART_COLORS.secondary,
                  },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis 
                      dataKey="label" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      domain={[0, 5]} 
                      ticks={[1, 2, 3, 4, 5]}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null
                        const value = payload[0]?.value as number
                        if (value === null || value === undefined) return null
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <p className="text-xs text-muted-foreground">{label}</p>
                            <p className="text-sm font-medium">{moodLabels[value] || value}</p>
                          </div>
                        )
                      }}
                    />
                    <Bar 
                      dataKey="mood" 
                      fill={CHART_COLORS.secondary}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Insight */}
          <div className="mt-8 p-6 rounded-xl bg-card border border-border">
            <h3 className="font-medium text-foreground mb-2">Understanding Your Patterns</h3>
            <p className="text-muted-foreground text-sm">
              Regular mood tracking can help you identify patterns and triggers. Over time, {"you'll"} 
              gain insights into what affects your emotional well-being, empowering you to make 
              positive changes in your daily life.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
