"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Heart, Wind, BookOpen, Coffee, Phone, ArrowRight, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

type ResultLevel = "low" | "moderate" | "high"

interface AssessmentResults {
  totalScore: number
  maxScore: number
  completedAt: string
}

const levelConfig = {
  low: {
    label: "Low",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    borderColor: "border-chart-1/30",
    description: "Your responses suggest you are managing well. Continue practicing self-care and maintaining healthy habits.",
  },
  moderate: {
    label: "Moderate",
    color: "text-accent-foreground",
    bgColor: "bg-accent/20",
    borderColor: "border-accent/30",
    description: "Your responses indicate some areas that may benefit from attention. Consider incorporating more self-care practices into your routine.",
  },
  high: {
    label: "Elevated",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/30",
    description: "Your responses suggest you may be experiencing significant stress. We encourage you to reach out to a healthcare professional for support.",
  },
}

const selfCaresuggestions = [
  {
    icon: Wind,
    title: "Practice Deep Breathing",
    description: "Try the 4-7-8 technique: breathe in for 4 counts, hold for 7, exhale for 8.",
  },
  {
    icon: BookOpen,
    title: "Start Journaling",
    description: "Write down your thoughts and feelings for 10 minutes each day.",
  },
  {
    icon: Coffee,
    title: "Take Regular Breaks",
    description: "Step away from work every 90 minutes to rest and recharge.",
  },
  {
    icon: Heart,
    title: "Connect with Others",
    description: "Reach out to a friend, family member, or support group.",
  },
]

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<AssessmentResults | null>(null)
  const [level, setLevel] = useState<ResultLevel>("low")

  useEffect(() => {
    const storedResults = sessionStorage.getItem("assessmentResults")
    if (storedResults) {
      const parsed = JSON.parse(storedResults) as AssessmentResults
      setResults(parsed)
      
      // Determine level based on score percentage
      const percentage = (parsed.totalScore / parsed.maxScore) * 100
      if (percentage <= 40) {
        setLevel("low")
      } else if (percentage <= 70) {
        setLevel("moderate")
      } else {
        setLevel("high")
      }
    } else {
      // No results, redirect to assessment
      router.push("/assessment")
    }
  }, [router])

  if (!results) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background pt-14 md:pt-16 flex items-center justify-center">
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </>
    )
  }

  const config = levelConfig[level]

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-14 md:pt-16">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Your Results
            </h1>
            <p className="mt-2 text-muted-foreground">
              {"Here's"} a summary of your self-assessment. Remember, this is for self-awareness only.
            </p>
          </div>

          {/* Result Card */}
          <Card className={cn("mb-8", config.borderColor)}>
            <CardHeader className="text-center pb-4">
              <div className={cn(
                "w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center",
                config.bgColor
              )}>
                <span className={cn("text-3xl font-bold", config.color)}>
                  {config.label}
                </span>
              </div>
              <CardTitle className="text-xl text-foreground">
                Stress & Anxiety Level: {config.label}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {config.description}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Self-Care Suggestions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Suggestions for Self-Care
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {selfCaresuggestions.map((suggestion) => {
                const Icon = suggestion.icon
                return (
                  <Card key={suggestion.title}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground text-sm">
                            {suggestion.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {suggestion.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Crisis Support - Only show for high level */}
          {level === "high" && (
            <Card className="mb-8 border-primary/30 bg-primary/5">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground">Support is Available</CardTitle>
                    <CardDescription className="mt-1">
                      If {"you're"} struggling, please know that help is available and reaching out is a sign of strength.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">National Suicide Prevention Lifeline:</strong> 988 (US)
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Crisis Text Line:</strong> Text HOME to 741741 (US)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/assessment" className="flex-1">
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <RotateCcw className="w-4 h-4" />
                Retake Assessment
              </Button>
            </Link>
            <Link href="/mood-tracker" className="flex-1">
              <Button className="w-full gap-2">
                Log Your Mood
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="mt-8 text-xs text-muted-foreground text-center">
            This assessment is not a diagnostic tool and should not replace professional medical advice. 
            If you have concerns about your mental health, please consult a qualified healthcare provider.
          </p>
        </div>
      </div>
    </>
  )
}
