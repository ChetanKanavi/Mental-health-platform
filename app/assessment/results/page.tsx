"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { 
  Heart, Wind, BookOpen, Coffee, Phone, ArrowRight, RotateCcw,
  Moon, Zap, Users, Smile, Brain, Shield, Target, Activity, ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

type ResultLevel = "low" | "moderate" | "high"

interface AssessmentResults {
  assessmentType?: string
  assessmentTitle?: string
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
    description: "Your responses suggest you may be experiencing significant challenges. We encourage you to reach out to a healthcare professional for support.",
  },
}

// Assessment-specific resources and suggestions
const assessmentResources = {
  "stress-anxiety": {
    category: "stress-anxiety",
    title: "Stress & Anxiety Resources",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    icon: Wind,
    suggestions: [
      {
        icon: Wind,
        title: "Practice Deep Breathing",
        description: "Try the 4-7-8 technique: breathe in for 4 counts, hold for 7, exhale for 8.",
      },
      {
        icon: Target,
        title: "Use Grounding Techniques",
        description: "The 5-4-3-2-1 method can help during moments of acute anxiety.",
      },
      {
        icon: Brain,
        title: "Schedule Worry Time",
        description: "Designate 15-20 minutes daily for worrying, then let go outside that time.",
      },
      {
        icon: Activity,
        title: "Move Your Body",
        description: "Regular exercise can be as effective as medication for mild anxiety.",
      },
    ],
    detailedResources: [
      { title: "Breathing Techniques", description: "4-7-8, box breathing, diaphragmatic breathing" },
      { title: "Grounding Exercises", description: "5-4-3-2-1 technique, body scan, cold water reset" },
      { title: "Cognitive Strategies", description: "Worry time, thought challenging, STOP technique" },
    ]
  },
  "depression": {
    category: "depression",
    title: "Depression Resources",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    icon: Heart,
    suggestions: [
      {
        icon: Activity,
        title: "Try Behavioral Activation",
        description: "Plan one small, achievable activity each day, even when motivation is low.",
      },
      {
        icon: Users,
        title: "Connect with Others",
        description: "Send one text or make one call each day, even if brief.",
      },
      {
        icon: Heart,
        title: "Practice Self-Compassion",
        description: "Treat yourself as you would treat a good friend going through a hard time.",
      },
      {
        icon: Coffee,
        title: "Start Small",
        description: "Use the 5-minute rule: commit to just 5 minutes of an activity.",
      },
    ],
    detailedResources: [
      { title: "Behavioral Activation", description: "Activity scheduling, 5-minute rule, pleasure and mastery" },
      { title: "Thought Patterns", description: "Catching negative thoughts, self-compassion, gratitude practice" },
      { title: "Social Connection", description: "Reaching out daily, support groups, setting boundaries" },
    ]
  },
  "sleep": {
    category: "sleep",
    title: "Sleep Quality Resources",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    icon: Moon,
    suggestions: [
      {
        icon: Moon,
        title: "Optimize Your Environment",
        description: "Keep your bedroom cool (60-67F), dark, and reserved for sleep only.",
      },
      {
        icon: Coffee,
        title: "Watch Your Caffeine",
        description: "Avoid caffeine after 2pm - it has a half-life of 5-6 hours.",
      },
      {
        icon: Shield,
        title: "Create a Wind-Down Routine",
        description: "Start relaxing 1 hour before bed. Dim lights and avoid screens.",
      },
      {
        icon: Activity,
        title: "Consistent Wake Time",
        description: "Wake at the same time every day, even weekends. This is key for sleep quality.",
      },
    ],
    detailedResources: [
      { title: "Sleep Environment", description: "Temperature control, darkness, bed association" },
      { title: "Sleep Schedule", description: "Consistent wake time, wind-down routine, avoid clock watching" },
      { title: "Pre-Sleep Practices", description: "Screen curfew, relaxation techniques, worry journal" },
    ]
  },
  "burnout": {
    category: "burnout",
    title: "Burnout Recovery Resources",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    icon: Zap,
    suggestions: [
      {
        icon: Shield,
        title: "Set Clear Boundaries",
        description: "Define work hours and communicate them. Turn off notifications after hours.",
      },
      {
        icon: Activity,
        title: "Take Strategic Breaks",
        description: "Use the Pomodoro technique: work 25 minutes, break for 5 minutes.",
      },
      {
        icon: Heart,
        title: "Prioritize True Rest",
        description: "Rest is not just sleep. Include activities that genuinely restore you.",
      },
      {
        icon: Brain,
        title: "Redefine Success",
        description: "Include well-being metrics alongside productivity. You are not your job.",
      },
    ],
    detailedResources: [
      { title: "Boundary Setting", description: "Work hours, saying no, digital boundaries" },
      { title: "Energy Management", description: "Energy audit, strategic breaks, peak hour protection" },
      { title: "Recovery Activities", description: "True rest, micro-recovery, vacation planning" },
    ]
  },
  "social-wellbeing": {
    category: "social-wellbeing",
    title: "Social Wellbeing Resources",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
    icon: Users,
    suggestions: [
      {
        icon: Users,
        title: "Initiate Contact",
        description: "Do not wait for others to reach out. Send the first text or suggest a meetup.",
      },
      {
        icon: BookOpen,
        title: "Practice Active Listening",
        description: "Give full attention, ask follow-up questions, reflect back what you heard.",
      },
      {
        icon: Shield,
        title: "Set Healthy Boundaries",
        description: "It is okay to say no, need space, or have different opinions in relationships.",
      },
      {
        icon: Target,
        title: "Start Small",
        description: "Begin with low-stakes interactions if social situations feel challenging.",
      },
    ],
    detailedResources: [
      { title: "Building Connections", description: "Quality over quantity, initiating contact, joining communities" },
      { title: "Communication Skills", description: "Active listening, expressing appreciation, difficult conversations" },
      { title: "Healthy Relationships", description: "Setting boundaries, addressing issues early, mutual support" },
    ]
  },
  "self-esteem": {
    category: "self-esteem",
    title: "Self-Esteem Resources",
    color: "text-primary",
    bgColor: "bg-primary/10",
    icon: Smile,
    suggestions: [
      {
        icon: Heart,
        title: "Practice Self-Compassion",
        description: "Treat yourself as you would treat a good friend. Notice your inner critic.",
      },
      {
        icon: Target,
        title: "Celebrate Small Wins",
        description: "Keep a done list alongside your to-do list. Acknowledge accomplishments.",
      },
      {
        icon: Brain,
        title: "Adopt a Growth Mindset",
        description: "See challenges as opportunities. Say 'I cannot do this yet' not 'I cannot do this.'",
      },
      {
        icon: Shield,
        title: "Define Your Own Success",
        description: "What does a good life mean to you? Not what others say it should be.",
      },
    ],
    detailedResources: [
      { title: "Self-Compassion", description: "Kind self-talk, common humanity, mindful awareness" },
      { title: "Building Confidence", description: "Celebrating wins, growth mindset, taking action despite fear" },
      { title: "Values and Identity", description: "Identifying values, stop comparing, defining your own success" },
    ]
  }
}

// Default suggestions for general wellness
const defaultSuggestions = [
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
  const assessmentType = results.assessmentType || "stress-anxiety"
  const resourceData = assessmentResources[assessmentType as keyof typeof assessmentResources] || assessmentResources["stress-anxiety"]
  const suggestions = resourceData?.suggestions || defaultSuggestions
  const ResourceIcon = resourceData?.icon || Wind

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-14 md:pt-16">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Your Results
            </h1>
            <p className="mt-2 text-muted-foreground">
              Here is a summary of your {results.assessmentTitle || "self-assessment"}. Remember, this is for self-awareness only.
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
                {results.assessmentTitle || "Assessment"} Level: {config.label}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {config.description}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Recommended Resources Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Recommended for You
              </h2>
              <Link 
                href={`/resources?category=${resourceData.category}`}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all resources
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            
            {/* Resource Category Card */}
            <Card className={cn("mb-4", resourceData.bgColor)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center bg-background"
                  )}>
                    <ResourceIcon className={cn("w-5 h-5", resourceData.color)} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{resourceData.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on your {results.assessmentTitle || "assessment"} results
                    </p>
                  </div>
                  <Link href={`/resources?category=${resourceData.category}`}>
                    <Button variant="outline" size="sm" className="bg-background">
                      Explore
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Resource Topics */}
            <div className="grid gap-3 sm:grid-cols-3 mb-6">
              {resourceData.detailedResources.map((resource) => (
                <Link 
                  key={resource.title}
                  href={`/resources?category=${resourceData.category}`}
                  className="block"
                >
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardContent className="p-3">
                      <h4 className="font-medium text-foreground text-sm">{resource.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Quick Tips to Try Today
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {suggestions.map((suggestion) => {
                const Icon = suggestion.icon
                return (
                  <Card key={suggestion.title}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                          resourceData.bgColor
                        )}>
                          <Icon className={cn("w-4 h-4", resourceData.color)} />
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

          {/* Additional Support for elevated results */}
          {(level === "moderate" || level === "high") && (
            <Card className="mb-8 border-secondary bg-secondary/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-foreground">Additional Support Options</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    Consider speaking with a mental health professional for personalized guidance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    Track your mood daily to identify patterns and triggers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    Explore our detailed self-help resources for evidence-based techniques
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}

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
                      If you are struggling, please know that help is available and reaching out is a sign of strength.
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
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">SAMHSA Helpline:</strong> 1-800-662-4357
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
                Take Another Assessment
              </Button>
            </Link>
            <Link href={`/resources?category=${resourceData.category}`} className="flex-1">
              <Button className="w-full gap-2">
                Explore Resources
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Secondary Actions */}
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/mood-tracker" className="text-sm text-primary hover:underline">
              Log your mood
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/dashboard" className="text-sm text-primary hover:underline">
              Go to dashboard
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
