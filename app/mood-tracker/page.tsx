"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface MoodEntry {
  id: string
  mood: number
  emotions: string[]
  triggers: string[]
  journal: string
  date: string
}

const moodOptions = [
  { value: 1, label: "Very Low", emoji: "😔", color: "bg-chart-4", borderColor: "border-chart-4" },
  { value: 2, label: "Low", emoji: "😕", color: "bg-chart-3", borderColor: "border-chart-3" },
  { value: 3, label: "Okay", emoji: "😐", color: "bg-accent", borderColor: "border-accent" },
  { value: 4, label: "Good", emoji: "🙂", color: "bg-chart-2", borderColor: "border-chart-2" },
  { value: 5, label: "Great", emoji: "😊", color: "bg-chart-1", borderColor: "border-chart-1" },
]

const emotionOptions = [
  { label: "Happy", icon: "😊" },
  { label: "Calm", icon: "😌" },
  { label: "Excited", icon: "🤩" },
  { label: "Grateful", icon: "🙏" },
  { label: "Confident", icon: "💪" },
  { label: "Hopeful", icon: "✨" },
  { label: "Anxious", icon: "😰" },
  { label: "Sad", icon: "😢" },
  { label: "Stressed", icon: "😫" },
  { label: "Angry", icon: "😠" },
  { label: "Tired", icon: "😴" },
  { label: "Lonely", icon: "🥺" },
  { label: "Overwhelmed", icon: "🤯" },
  { label: "Frustrated", icon: "😤" },
  { label: "Bored", icon: "😑" },
]

const triggerOptions = [
  { label: "Work", icon: "💼" },
  { label: "Family", icon: "👨‍👩‍👧" },
  { label: "Friends", icon: "👥" },
  { label: "Relationship", icon: "💕" },
  { label: "Health", icon: "🏥" },
  { label: "Exercise", icon: "🏃" },
  { label: "Sleep", icon: "🛏️" },
  { label: "Food", icon: "🍽️" },
  { label: "Weather", icon: "🌤️" },
  { label: "Money", icon: "💰" },
  { label: "News", icon: "📰" },
  { label: "Social Media", icon: "📱" },
  { label: "Hobbies", icon: "🎨" },
  { label: "Nature", icon: "🌳" },
  { label: "Music", icon: "🎵" },
  { label: "Other", icon: "📝" },
]

type Step = "mood" | "emotions" | "triggers" | "journal"

const steps: Step[] = ["mood", "emotions", "triggers", "journal"]

export default function MoodTrackerPage() {
  const [currentStep, setCurrentStep] = useState<Step>("mood")
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [journalEntry, setJournalEntry] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([])

  const currentStepIndex = steps.indexOf(currentStep)

  useEffect(() => {
    const stored = localStorage.getItem("moodEntries")
    if (stored) {
      setRecentEntries(JSON.parse(stored))
    }
  }, [])

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    )
  }

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev =>
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    )
  }

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex])
    }
  }

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex])
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case "mood":
        return selectedMood !== null
      case "emotions":
        return selectedEmotions.length > 0
      case "triggers":
        return true // Optional
      case "journal":
        return true // Optional
      default:
        return false
    }
  }

  const handleSave = async () => {
    if (selectedMood === null) return

    setIsSaving(true)

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      emotions: selectedEmotions,
      triggers: selectedTriggers,
      journal: journalEntry.trim(),
      date: new Date().toISOString(),
    }

    const updatedEntries = [newEntry, ...recentEntries].slice(0, 30)
    localStorage.setItem("moodEntries", JSON.stringify(updatedEntries))
    setRecentEntries(updatedEntries)

    await new Promise(resolve => setTimeout(resolve, 500))

    setIsSaving(false)
    setShowSuccess(true)
    
    // Reset form
    setSelectedMood(null)
    setSelectedEmotions([])
    setSelectedTriggers([])
    setJournalEntry("")
    setCurrentStep("mood")

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

  const getMoodOption = (value: number) => {
    return moodOptions.find(m => m.value === value)
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case "mood":
        return "How are you feeling?"
      case "emotions":
        return "What emotions are you experiencing?"
      case "triggers":
        return "What made you feel this way?"
      case "journal":
        return "Anything else on your mind?"
      default:
        return ""
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case "mood":
        return "Select the option that best describes your overall mood right now."
      case "emotions":
        return "Choose all the emotions that apply to how you're feeling."
      case "triggers":
        return "Select what may have contributed to your mood today. (Optional)"
      case "journal":
        return "Write freely about your thoughts and feelings. (Optional)"
      default:
        return ""
    }
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-14 md:pt-16">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Mood Tracker
            </h1>
            <p className="mt-2 text-muted-foreground">
              {"Take a moment to check in with yourself."}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span className="text-sm text-muted-foreground capitalize">
                {currentStep}
              </span>
            </div>
            <div className="flex gap-2">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    index <= currentStepIndex ? "bg-primary" : "bg-border"
                  )}
                />
              ))}
            </div>
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

          {/* Step Content */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">{getStepTitle()}</CardTitle>
              <CardDescription>{getStepDescription()}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Mood Selection */}
              {currentStep === "mood" && (
                <div className="flex flex-col gap-3">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                        selectedMood === mood.value
                          ? `${mood.borderColor} bg-primary/5`
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <span className="text-3xl">{mood.emoji}</span>
                      <div className="flex-1">
                        <span className={cn(
                          "font-medium",
                          selectedMood === mood.value ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {mood.label}
                        </span>
                      </div>
                      {selectedMood === mood.value && (
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", mood.color)}>
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Emotions Selection */}
              {currentStep === "emotions" && (
                <div className="grid grid-cols-3 gap-2">
                  {emotionOptions.map((emotion) => (
                    <button
                      key={emotion.label}
                      onClick={() => toggleEmotion(emotion.label)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                        selectedEmotions.includes(emotion.label)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <span className="text-2xl">{emotion.icon}</span>
                      <span className={cn(
                        "text-xs font-medium",
                        selectedEmotions.includes(emotion.label) ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {emotion.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Triggers Selection */}
              {currentStep === "triggers" && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {triggerOptions.map((trigger) => (
                    <button
                      key={trigger.label}
                      onClick={() => toggleTrigger(trigger.label)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                        selectedTriggers.includes(trigger.label)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <span className="text-2xl">{trigger.icon}</span>
                      <span className={cn(
                        "text-xs font-medium text-center",
                        selectedTriggers.includes(trigger.label) ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {trigger.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 4: Journal Entry */}
              {currentStep === "journal" && (
                <div className="space-y-4">
                  {/* Summary of selections */}
                  <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Mood:</span>
                      {selectedMood && (
                        <span className="text-sm font-medium text-foreground">
                          {getMoodOption(selectedMood)?.emoji} {getMoodOption(selectedMood)?.label}
                        </span>
                      )}
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-muted-foreground shrink-0">Emotions:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedEmotions.map(e => (
                          <span key={e} className="text-xs bg-primary/10 text-foreground px-2 py-0.5 rounded-full">
                            {emotionOptions.find(opt => opt.label === e)?.icon} {e}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedTriggers.length > 0 && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm text-muted-foreground shrink-0">Triggers:</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedTriggers.map(t => (
                            <span key={t} className="text-xs bg-accent/30 text-foreground px-2 py-0.5 rounded-full">
                              {triggerOptions.find(opt => opt.label === t)?.icon} {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="journal" className="sr-only">Journal entry</Label>
                    <Textarea
                      id="journal"
                      placeholder="Write about your thoughts, what happened today, or anything else you'd like to remember..."
                      value={journalEntry}
                      onChange={(e) => setJournalEntry(e.target.value)}
                      className="min-h-[120px] bg-input resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {journalEntry.length} characters
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {currentStepIndex > 0 && (
              <Button
                onClick={goToPrevStep}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            
            <div className="flex-1" />
            
            {currentStep !== "journal" ? (
              <Button
                onClick={goToNextStep}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={selectedMood === null || isSaving}
                className="px-8"
              >
                {isSaving ? "Saving..." : "Save Entry"}
              </Button>
            )}
          </div>

          {/* Skip button for optional steps */}
          {(currentStep === "triggers" || currentStep === "journal") && (
            <div className="mt-3 text-center">
              <button
                onClick={currentStep === "journal" ? handleSave : goToNextStep}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {currentStep === "journal" ? "Skip and save" : "Skip this step"}
              </button>
            </div>
          )}

          {/* Recent Entries */}
          {recentEntries.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Entries</h2>
              <div className="space-y-3">
                {recentEntries.slice(0, 5).map((entry) => {
                  const moodOpt = getMoodOption(entry.mood)
                  return (
                    <Card key={entry.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{moodOpt?.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-foreground">
                                {moodOpt?.label}
                              </span>
                              <span className="text-xs text-muted-foreground shrink-0">
                                {formatDate(entry.date)}
                              </span>
                            </div>
                            {entry.emotions && entry.emotions.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {entry.emotions.slice(0, 4).map(e => (
                                  <span key={e} className="text-xs bg-primary/10 text-muted-foreground px-2 py-0.5 rounded-full">
                                    {e}
                                  </span>
                                ))}
                                {entry.emotions.length > 4 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{entry.emotions.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}
                            {entry.journal && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {entry.journal}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
