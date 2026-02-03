"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { 
  Heart, Wind, BookOpen, Coffee, Phone, ArrowRight, RotateCcw, 
  Moon, Users, Sparkles, Activity, Brain, Shield, Clock, ChevronRight,
  Target, Sun, Leaf, MessageCircle
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

interface Resource {
  title: string
  description: string
  steps: string[]
  duration: string
  icon: typeof Wind
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

// Resources mapped by assessment type
const resourcesByType: Record<string, Resource[]> = {
  "stress-anxiety": [
    {
      title: "4-7-8 Breathing Technique",
      description: "A calming breathing pattern that activates your parasympathetic nervous system.",
      steps: [
        "Exhale completely through your mouth",
        "Inhale quietly through your nose for 4 counts",
        "Hold your breath for 7 counts",
        "Exhale completely through your mouth for 8 counts",
        "Repeat this cycle 3-4 times"
      ],
      duration: "2-3 minutes",
      icon: Wind
    },
    {
      title: "Grounding: 5-4-3-2-1 Technique",
      description: "Use your senses to anchor yourself in the present moment during anxiety.",
      steps: [
        "Notice 5 things you can SEE around you",
        "Notice 4 things you can physically FEEL",
        "Notice 3 things you can HEAR",
        "Notice 2 things you can SMELL",
        "Notice 1 thing you can TASTE"
      ],
      duration: "3-5 minutes",
      icon: Brain
    },
    {
      title: "Progressive Muscle Relaxation",
      description: "Systematically tense and release muscle groups to reduce physical tension.",
      steps: [
        "Find a comfortable position, close your eyes",
        "Start with your feet - tense muscles for 5 seconds",
        "Release and notice the relaxation for 10 seconds",
        "Move up through legs, abdomen, arms, and face",
        "End with a full body scan"
      ],
      duration: "10-15 minutes",
      icon: Activity
    }
  ],
  "depression": [
    {
      title: "Behavioral Activation",
      description: "Gradually increase engagement in meaningful activities to improve mood.",
      steps: [
        "List activities you used to enjoy or might enjoy",
        "Rate each activity by difficulty (1-10)",
        "Start with easier activities (rated 1-3)",
        "Schedule one small activity daily",
        "Rate your mood before and after"
      ],
      duration: "Ongoing practice",
      icon: Sparkles
    },
    {
      title: "Gratitude Journaling",
      description: "Train your brain to notice positive aspects of life.",
      steps: [
        "Each evening, write down 3 things you are grateful for",
        "Be specific - not just people but what they did",
        "Include small things like a warm cup of tea",
        "Reflect on why each thing matters to you",
        "Review past entries when feeling low"
      ],
      duration: "5-10 minutes daily",
      icon: BookOpen
    },
    {
      title: "Morning Routine for Low Mood",
      description: "Structure your mornings to set a positive tone for the day.",
      steps: [
        "Wake at a consistent time each day",
        "Open curtains immediately for natural light",
        "Do 5 minutes of gentle stretching",
        "Eat a small, nutritious breakfast",
        "Identify one small goal for the day"
      ],
      duration: "20-30 minutes",
      icon: Sun
    }
  ],
  "sleep": [
    {
      title: "Sleep Hygiene Checklist",
      description: "Essential habits for better sleep quality.",
      steps: [
        "Keep a consistent sleep schedule, even on weekends",
        "Make your bedroom dark, quiet, and cool",
        "Remove electronics from the bedroom",
        "Avoid caffeine after 2 PM",
        "Limit alcohol - it disrupts sleep cycles"
      ],
      duration: "Ongoing practice",
      icon: Shield
    },
    {
      title: "Wind-Down Routine",
      description: "Signal to your body that it is time to prepare for sleep.",
      steps: [
        "Begin 1 hour before desired bedtime",
        "Dim lights throughout your home",
        "Stop using screens or use blue light filters",
        "Take a warm bath or shower",
        "Read a book or practice gentle stretching"
      ],
      duration: "60 minutes before bed",
      icon: Moon
    },
    {
      title: "Body Scan for Sleep",
      description: "A relaxation technique to release tension before sleep.",
      steps: [
        "Lie comfortably in bed, close your eyes",
        "Focus attention on your toes, notice any sensations",
        "Slowly move attention up through your body",
        "At each area, breathe and release tension",
        "If your mind wanders, gently return to the scan"
      ],
      duration: "10-20 minutes",
      icon: Activity
    }
  ],
  "burnout": [
    {
      title: "Energy Audit",
      description: "Identify what drains and restores your energy.",
      steps: [
        "For one week, note activities and energy levels",
        "Mark each activity as energizing or draining",
        "Look for patterns in times, people, and tasks",
        "Identify one draining activity to reduce",
        "Add one energizing activity to your week"
      ],
      duration: "1 week assessment",
      icon: Activity
    },
    {
      title: "Boundary Setting Practice",
      description: "Learn to say no and protect your time and energy.",
      steps: [
        "Identify areas where you feel overcommitted",
        "Practice: 'Let me check my schedule and get back to you'",
        "Use 'I' statements: 'I am not able to take this on'",
        "Start with low-stakes situations",
        "Remember: No is a complete sentence"
      ],
      duration: "Ongoing practice",
      icon: Shield
    },
    {
      title: "Micro-Recovery Breaks",
      description: "Short breaks throughout the day to prevent energy depletion.",
      steps: [
        "Set a timer for every 90 minutes of work",
        "Take a 5-10 minute break away from your desk",
        "Step outside for fresh air if possible",
        "Do some light stretching or walking",
        "Hydrate and have a healthy snack if needed"
      ],
      duration: "5-10 minutes every 90 minutes",
      icon: Coffee
    }
  ],
  "social": [
    {
      title: "Social Connection Plan",
      description: "Combat isolation by building supportive relationships.",
      steps: [
        "List people you feel comfortable reaching out to",
        "Schedule one small social interaction weekly",
        "Start small - a text, call, or brief visit",
        "Join a group activity or class",
        "Consider support groups for shared experiences"
      ],
      duration: "Ongoing practice",
      icon: Users
    },
    {
      title: "Conversation Starters",
      description: "Tips for initiating meaningful conversations.",
      steps: [
        "Ask open-ended questions (How, What, Why)",
        "Practice active listening - paraphrase what you heard",
        "Share something about yourself",
        "Show genuine curiosity about others",
        "Follow up on previous conversations"
      ],
      duration: "Use in conversations",
      icon: MessageCircle
    },
    {
      title: "Handling Social Anxiety",
      description: "Techniques for managing anxiety in social situations.",
      steps: [
        "Arrive early to adjust to the environment",
        "Have an 'out' - know it is okay to leave",
        "Focus on one person at a time",
        "Prepare a few conversation topics beforehand",
        "Challenge negative self-talk with evidence"
      ],
      duration: "Before and during events",
      icon: Shield
    }
  ],
  "self-esteem": [
    {
      title: "Self-Compassion Practice",
      description: "Treat yourself with kindness you would show a friend.",
      steps: [
        "Notice when you are being self-critical",
        "Ask: What would I say to a friend here?",
        "Place a hand on your heart and speak kindly",
        "Acknowledge that struggle is human",
        "Write yourself a compassionate letter"
      ],
      duration: "As needed",
      icon: Heart
    },
    {
      title: "Strengths Inventory",
      description: "Identify and leverage your unique strengths.",
      steps: [
        "List 5 things you do well",
        "Ask trusted friends what strengths they see",
        "Recall past successes and what you used",
        "Look for ways to use strengths more",
        "Celebrate when you succeed"
      ],
      duration: "30 minutes reflection",
      icon: Sparkles
    },
    {
      title: "Achievement Log",
      description: "Document accomplishments to build confidence.",
      steps: [
        "Each day, write 3 things you accomplished",
        "Include small wins (made the bed, sent an email)",
        "Note challenges you overcame",
        "Review weekly to see progress",
        "Use as evidence when self-doubt arises"
      ],
      duration: "5 minutes daily",
      icon: Target
    }
  ]
}

// Default resources for general use
const defaultResources: Resource[] = [
  {
    title: "Practice Deep Breathing",
    description: "Try the 4-7-8 technique: breathe in for 4 counts, hold for 7, exhale for 8.",
    steps: [
      "Find a comfortable position",
      "Breathe in for 4 counts",
      "Hold for 7 counts",
      "Exhale for 8 counts",
      "Repeat 3-4 times"
    ],
    duration: "2-3 minutes",
    icon: Wind
  },
  {
    title: "Start Journaling",
    description: "Write down your thoughts and feelings for 10 minutes each day.",
    steps: [
      "Set aside 10 minutes",
      "Write freely without judgment",
      "Include thoughts and feelings",
      "Note any patterns",
      "Review weekly"
    ],
    duration: "10 minutes daily",
    icon: BookOpen
  },
  {
    title: "Take Regular Breaks",
    description: "Step away from work every 90 minutes to rest and recharge.",
    steps: [
      "Set a timer for 90 minutes",
      "Take a 5-10 minute break",
      "Move away from your desk",
      "Do some light stretching",
      "Hydrate"
    ],
    duration: "5-10 minutes",
    icon: Coffee
  }
]

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<AssessmentResults | null>(null)
  const [level, setLevel] = useState<ResultLevel>("low")
  const [expandedResource, setExpandedResource] = useState<string | null>(null)

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
  
  // Get resources based on assessment type, fallback to default
  const suggestedResources = results.assessmentType 
    ? resourcesByType[results.assessmentType] || defaultResources
    : defaultResources

  // Get category name for resources link
  const categoryId = results.assessmentType || "stress-anxiety"

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
              Here is a summary of your self-assessment. Remember, this is for self-awareness only.
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

          {/* Personalized Resources */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Recommended Resources for You
              </h2>
              <Link href={`/resources?tab=${categoryId}`}>
                <Button variant="ghost" size="sm" className="text-primary gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Based on your {results.assessmentTitle || "assessment"} results, these techniques may help:
            </p>
            
            <div className="space-y-4">
              {suggestedResources.map((resource) => {
                const Icon = resource.icon
                const isExpanded = expandedResource === resource.title
                return (
                  <Card 
                    key={resource.title}
                    className={isExpanded ? "border-primary/30" : ""}
                  >
                    <CardHeader 
                      className="cursor-pointer py-4"
                      onClick={() => setExpandedResource(isExpanded ? null : resource.title)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-foreground text-sm">
                                {resource.title}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                {resource.description}
                              </p>
                            </div>
                            <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                          </div>
                          <Badge variant="secondary" className="mt-2 text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {resource.duration}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    {isExpanded && (
                      <CardContent className="pt-0 pb-4">
                        <div className="pl-12">
                          <h4 className="font-medium text-xs text-foreground mb-2">How to Practice:</h4>
                          <ol className="space-y-1.5">
                            {resource.steps.map((step, index) => (
                              <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-medium text-primary">
                                  {index + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </CardContent>
                    )}
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
