"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface MoodEntry {
  id: string
  mood: number
  journal: string
  date: string
}

const moodOptions = [
  { value: 1, label: "Very Low", color: "bg-chart-4" },
  { value: 2, label: "Low", color: "bg-chart-3" },
  { value: 3, label: "Okay", color: "bg-accent" },
  { value: 4, label: "Good", color: "bg-chart-2" },
  { value: 5, label: "Great", color: "bg-chart-1" },
]

export default function MoodTrackerPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [journalEntry, setJournalEntry] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([])

  useEffect(() => {
    // Load existing entries from localStorage
    const stored = localStorage.getItem("moodEntries")
    if (stored) {
      setRecentEntries(JSON.parse(stored))
    }
  }, [])

  const handleSave = async () => {
    if (selectedMood === null) return

    setIsSaving(true)

    // Create new entry
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      journal: journalEntry.trim(),
      date: new Date().toISOString(),
    }

    // Save to localStorage (in production, this would be a database)
    const updatedEntries = [newEntry, ...recentEntries].slice(0, 30) // Keep last 30 entries
    localStorage.setItem("moodEntries", JSON.stringify(updatedEntries))
    setRecentEntries(updatedEntries)

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500))

    setIsSaving(false)
    setShowSuccess(true)
    setSelectedMood(null)
    setJournalEntry("")

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const getMoodLabel = (value: number) => {
    return moodOptions.find(m => m.value === value)?.label || ""
  }

  const getMoodColor = (value: number) => {
    return moodOptions.find(m => m.value === value)?.color || "bg-muted"
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-14 md:pt-16">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Mood Tracker
            </h1>
            <p className="mt-2 text-muted-foreground">
              {"How are you feeling right now? Take a moment to check in with yourself."}
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-chart-1/10 border border-chart-1/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-chart-1/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-chart-1" />
              </div>
              <p className="text-foreground font-medium">{"Mood logged successfully!"}</p>
            </div>
          )}

          {/* Mood Selection Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">{"How's your mood?"}</CardTitle>
              <CardDescription>
                Select the option that best describes how {"you're"} feeling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                      selectedMood === mood.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full transition-transform",
                      mood.color,
                      selectedMood === mood.value && "scale-110"
                    )} />
                    <span className={cn(
                      "text-xs font-medium",
                      selectedMood === mood.value ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Journal Entry Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Journal Entry</CardTitle>
              <CardDescription>
                Optional: Write about what {"you're"} experiencing or thinking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="journal" className="sr-only">Journal entry</Label>
                <Textarea
                  id="journal"
                  placeholder="What's on your mind today? You can write about anything..."
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  className="min-h-[120px] bg-input resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {journalEntry.length} characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={selectedMood === null || isSaving}
            className="w-full"
            size="lg"
          >
            {isSaving ? "Saving..." : "Save Mood Entry"}
          </Button>

          {/* Recent Entries */}
          {recentEntries.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Entries</h2>
              <div className="space-y-3">
                {recentEntries.slice(0, 5).map((entry) => (
                  <Card key={entry.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full shrink-0",
                          getMoodColor(entry.mood)
                        )} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-foreground">
                              {getMoodLabel(entry.mood)}
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {formatDate(entry.date)}
                            </span>
                          </div>
                          {entry.journal && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {entry.journal}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
