"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Leaf, 
  ArrowLeft, 
  Save
} from "lucide-react"

interface PlatformSettings {
  siteName: string
  siteDescription: string
  disclaimerText: string
  crisisHotline: string
  crisisTextLine: string
  crisisWebsite: string
  enableAssessments: boolean
  enableMoodTracking: boolean
  enableResources: boolean
  enableAnalytics: boolean
}

const defaultSettings: PlatformSettings = {
  siteName: "MindfulMe",
  siteDescription: "A calm, supportive space for mental health self-awareness, mood tracking, and personal well-being.",
  disclaimerText: "This platform is for educational purposes only and is not a substitute for professional mental health care. If you are experiencing a mental health crisis, please seek immediate professional help.",
  crisisHotline: "988",
  crisisTextLine: "HOME to 741741",
  crisisWebsite: "https://www.iasp.info/resources/Crisis_Centres/",
  enableAssessments: true,
  enableMoodTracking: true,
  enableResources: true,
  enableAnalytics: true,
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth")
    if (auth !== "true") {
      router.push("/admin/login")
    } else {
      setIsAuthorized(true)
      const savedSettings = sessionStorage.getItem("adminPlatformSettings")
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    }
  }, [router])

  const handleSave = async () => {
    setIsSaving(true)
    sessionStorage.setItem("adminPlatformSettings", JSON.stringify(settings))
    await new Promise(resolve => setTimeout(resolve, 500))
    setSaveMessage("Settings saved successfully!")
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
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
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
            Platform Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure general app settings and crisis resources.
          </p>
        </div>

        {/* General Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">General Settings</CardTitle>
            <CardDescription>
              Basic platform information and branding.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disclaimerText">Disclaimer Text</Label>
              <Textarea
                id="disclaimerText"
                value={settings.disclaimerText}
                onChange={(e) => setSettings(prev => ({ ...prev, disclaimerText: e.target.value }))}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This disclaimer is shown on the dashboard and assessment results pages.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Crisis Resources */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Crisis Resources</CardTitle>
            <CardDescription>
              Emergency contact information displayed to users.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="crisisHotline">Crisis Hotline Number</Label>
              <Input
                id="crisisHotline"
                value={settings.crisisHotline}
                onChange={(e) => setSettings(prev => ({ ...prev, crisisHotline: e.target.value }))}
                placeholder="988"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crisisTextLine">Crisis Text Line</Label>
              <Input
                id="crisisTextLine"
                value={settings.crisisTextLine}
                onChange={(e) => setSettings(prev => ({ ...prev, crisisTextLine: e.target.value }))}
                placeholder="HOME to 741741"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crisisWebsite">Crisis Resources Website</Label>
              <Input
                id="crisisWebsite"
                value={settings.crisisWebsite}
                onChange={(e) => setSettings(prev => ({ ...prev, crisisWebsite: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Feature Toggles</CardTitle>
            <CardDescription>
              Enable or disable platform features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableAssessments">Self-Assessments</Label>
                <p className="text-xs text-muted-foreground">
                  Allow users to take self-assessment questionnaires.
                </p>
              </div>
              <Switch
                id="enableAssessments"
                checked={settings.enableAssessments}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAssessments: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableMoodTracking">Mood Tracking</Label>
                <p className="text-xs text-muted-foreground">
                  Allow users to log daily moods and emotions.
                </p>
              </div>
              <Switch
                id="enableMoodTracking"
                checked={settings.enableMoodTracking}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableMoodTracking: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableResources">Wellness Resources</Label>
                <p className="text-xs text-muted-foreground">
                  Show tips and educational content to users.
                </p>
              </div>
              <Switch
                id="enableResources"
                checked={settings.enableResources}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableResources: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableAnalytics">User Analytics</Label>
                <p className="text-xs text-muted-foreground">
                  Allow users to view their mood analytics and trends.
                </p>
              </div>
              <Switch
                id="enableAnalytics"
                checked={settings.enableAnalytics}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAnalytics: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
