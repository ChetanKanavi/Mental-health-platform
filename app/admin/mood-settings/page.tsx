"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Leaf, 
  ArrowLeft, 
  Plus, 
  Trash2,
  Save
} from "lucide-react"

interface MoodLevel {
  level: number
  emoji: string
  label: string
}

interface Emotion {
  id: number
  name: string
}

interface Trigger {
  id: number
  name: string
}

const defaultMoodLevels: MoodLevel[] = [
  { level: 1, emoji: "😢", label: "Very Low" },
  { level: 2, emoji: "😔", label: "Low" },
  { level: 3, emoji: "😐", label: "Neutral" },
  { level: 4, emoji: "🙂", label: "Good" },
  { level: 5, emoji: "😊", label: "Great" },
]

const defaultEmotions: Emotion[] = [
  { id: 1, name: "Happy" },
  { id: 2, name: "Calm" },
  { id: 3, name: "Excited" },
  { id: 4, name: "Grateful" },
  { id: 5, name: "Hopeful" },
  { id: 6, name: "Anxious" },
  { id: 7, name: "Stressed" },
  { id: 8, name: "Sad" },
  { id: 9, name: "Frustrated" },
  { id: 10, name: "Overwhelmed" },
  { id: 11, name: "Tired" },
  { id: 12, name: "Lonely" },
  { id: 13, name: "Irritable" },
  { id: 14, name: "Confused" },
  { id: 15, name: "Numb" },
]

const defaultTriggers: Trigger[] = [
  { id: 1, name: "Work" },
  { id: 2, name: "Relationships" },
  { id: 3, name: "Family" },
  { id: 4, name: "Health" },
  { id: 5, name: "Finances" },
  { id: 6, name: "Sleep" },
  { id: 7, name: "Weather" },
  { id: 8, name: "News/Media" },
  { id: 9, name: "Social Media" },
  { id: 10, name: "Exercise" },
  { id: 11, name: "Food/Diet" },
  { id: 12, name: "Hobbies" },
]

export default function AdminMoodSettingsPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [moodLevels, setMoodLevels] = useState<MoodLevel[]>(defaultMoodLevels)
  const [emotions, setEmotions] = useState<Emotion[]>(defaultEmotions)
  const [triggers, setTriggers] = useState<Trigger[]>(defaultTriggers)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  
  const [newEmotion, setNewEmotion] = useState("")
  const [newTrigger, setNewTrigger] = useState("")
  const [isEmotionDialogOpen, setIsEmotionDialogOpen] = useState(false)
  const [isTriggerDialogOpen, setIsTriggerDialogOpen] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth")
    if (auth !== "true") {
      router.push("/admin/login")
    } else {
      setIsAuthorized(true)
      const savedMoodLevels = sessionStorage.getItem("adminMoodLevels")
      const savedEmotions = sessionStorage.getItem("adminEmotions")
      const savedTriggers = sessionStorage.getItem("adminTriggers")
      if (savedMoodLevels) setMoodLevels(JSON.parse(savedMoodLevels))
      if (savedEmotions) setEmotions(JSON.parse(savedEmotions))
      if (savedTriggers) setTriggers(JSON.parse(savedTriggers))
    }
  }, [router])

  const handleUpdateMoodLevel = (level: number, field: "emoji" | "label", value: string) => {
    setMoodLevels(prev => prev.map(m => 
      m.level === level ? { ...m, [field]: value } : m
    ))
  }

  const handleAddEmotion = () => {
    if (!newEmotion.trim()) return
    const emotion: Emotion = {
      id: Math.max(...emotions.map(e => e.id), 0) + 1,
      name: newEmotion.trim()
    }
    setEmotions([...emotions, emotion])
    setNewEmotion("")
    setIsEmotionDialogOpen(false)
  }

  const handleDeleteEmotion = (id: number) => {
    setEmotions(emotions.filter(e => e.id !== id))
  }

  const handleAddTrigger = () => {
    if (!newTrigger.trim()) return
    const trigger: Trigger = {
      id: Math.max(...triggers.map(t => t.id), 0) + 1,
      name: newTrigger.trim()
    }
    setTriggers([...triggers, trigger])
    setNewTrigger("")
    setIsTriggerDialogOpen(false)
  }

  const handleDeleteTrigger = (id: number) => {
    setTriggers(triggers.filter(t => t.id !== id))
  }

  const handleSaveAll = async () => {
    setIsSaving(true)
    sessionStorage.setItem("adminMoodLevels", JSON.stringify(moodLevels))
    sessionStorage.setItem("adminEmotions", JSON.stringify(emotions))
    sessionStorage.setItem("adminTriggers", JSON.stringify(triggers))
    await new Promise(resolve => setTimeout(resolve, 500))
    setSaveMessage("Changes saved successfully!")
    setIsSaving(false)
    setTimeout(() => setSaveMessage(""), 3000)
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Checking authorization...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
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
          <Button onClick={handleSaveAll} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          href="/admin/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {saveMessage && (
          <div className="mb-6 p-3 rounded-lg bg-primary/10 text-primary text-sm">
            {saveMessage}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Mood Tracking Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure mood levels, emotions, and trigger categories.
          </p>
        </div>

        {/* Mood Levels */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Mood Levels</CardTitle>
            <CardDescription>
              Configure the 5-point mood scale with emojis and labels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {moodLevels.map((mood) => (
                <div key={mood.level} className="flex items-center gap-4">
                  <span className="w-8 text-center text-sm font-medium text-muted-foreground">
                    {mood.level}
                  </span>
                  <div className="w-24">
                    <Label htmlFor={`emoji-${mood.level}`} className="sr-only">Emoji</Label>
                    <Input
                      id={`emoji-${mood.level}`}
                      value={mood.emoji}
                      onChange={(e) => handleUpdateMoodLevel(mood.level, "emoji", e.target.value)}
                      className="text-center text-xl"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`label-${mood.level}`} className="sr-only">Label</Label>
                    <Input
                      id={`label-${mood.level}`}
                      value={mood.label}
                      onChange={(e) => handleUpdateMoodLevel(mood.level, "label", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emotions */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">Emotions</CardTitle>
              <CardDescription>
                {emotions.length} emotion options for users to select
              </CardDescription>
            </div>
            <Dialog open={isEmotionDialogOpen} onOpenChange={setIsEmotionDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Emotion
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Emotion</DialogTitle>
                  <DialogDescription>
                    Enter the name of the emotion to add.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-emotion">Emotion Name</Label>
                    <Input
                      id="new-emotion"
                      value={newEmotion}
                      onChange={(e) => setNewEmotion(e.target.value)}
                      placeholder="e.g., Content"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEmotionDialogOpen(false)} className="bg-transparent">
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmotion}>Add Emotion</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {emotions.map((emotion) => (
                <div
                  key={emotion.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm"
                >
                  <span className="text-foreground">{emotion.name}</span>
                  <button
                    onClick={() => handleDeleteEmotion(emotion.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Delete ${emotion.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Triggers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">Triggers / Causes</CardTitle>
              <CardDescription>
                {triggers.length} trigger options for users to select
              </CardDescription>
            </div>
            <Dialog open={isTriggerDialogOpen} onOpenChange={setIsTriggerDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Trigger
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Trigger</DialogTitle>
                  <DialogDescription>
                    Enter the name of the trigger category to add.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-trigger">Trigger Name</Label>
                    <Input
                      id="new-trigger"
                      value={newTrigger}
                      onChange={(e) => setNewTrigger(e.target.value)}
                      placeholder="e.g., Travel"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsTriggerDialogOpen(false)} className="bg-transparent">
                    Cancel
                  </Button>
                  <Button onClick={handleAddTrigger}>Add Trigger</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {triggers.map((trigger) => (
                <div
                  key={trigger.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm"
                >
                  <span className="text-foreground">{trigger.name}</span>
                  <button
                    onClick={() => handleDeleteTrigger(trigger.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Delete ${trigger.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
