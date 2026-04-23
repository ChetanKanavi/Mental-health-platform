"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { BookOpen, Phone, Heart, Brain, Sun, Moon, Zap, Users, Lightbulb, Check, Cloud } from "lucide-react"
import { cn } from "@/lib/utils"

const resourceCategories = [
  {
    id: "stress-anxiety",
    name: "Stress & Anxiety",
    icon: Zap,
    description: "Practical techniques to manage stress and reduce anxiety symptoms",
    resources: [
      {
        title: "Breathing Exercises",
        tips: [
          "4-7-8 Breathing: Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times.",
          "Box Breathing: Inhale for 4, hold for 4, exhale for 4, hold for 4. Repeat 5 times.",
          "Diaphragmatic breathing: Place hand on belly, ensure belly expands not chest when breathing.",
          "Progressive Muscle Relaxation: Tense and relax muscle groups from toes to head."
        ]
      },
      {
        title: "Stress Management",
        tips: [
          "Time Management: Break tasks into smaller chunks, prioritize daily goals.",
          "Physical Activity: 30 minutes of walking, yoga, or any movement you enjoy.",
          "Limit Caffeine & Sugar: These can increase anxiety symptoms.",
          "Schedule Worry Time: Dedicate 15 minutes to worry, then redirect thoughts."
        ]
      },
      {
        title: "Immediate Relief Techniques",
        tips: [
          "Grounding (5-4-3-2-1): Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.",
          "Cold Water: Splash face with cold water or hold ice cubes to activate calming response.",
          "Intense Exercise: 20 minutes of intense activity can reduce adrenaline.",
          "Safe Space: Create a calm corner with comfortable seating, calming colors, and soothing objects."
        ]
      }
    ]
  },
  {
    id: "depression",
    name: "Depression",
    icon: Cloud,
    description: "Resources for managing depressive symptoms and building resilience",
    resources: [
      {
        title: "Behavioral Activation",
        tips: [
          "Start Small: Choose one activity today, even if just 5 minutes of movement.",
          "Daily Schedule: Create a simple routine with meals, activity, and rest times.",
          "Social Connection: Reach out to one person, even if just a text message.",
          "Activity Tracking: Log activities and mood to identify patterns of improvement."
        ]
      },
      {
        title: "Thought Work",
        tips: [
          "Identify Negative Patterns: Write down recurring negative thoughts.",
          "Challenge Thoughts: Ask 'Is this thought true?' 'What evidence do I have?'",
          "Realistic Thinking: Replace catastrophic thoughts with balanced alternatives.",
          "Gratitude Practice: Write 3 small things you're grateful for each day."
        ]
      },
      {
        title: "Self-Compassion",
        tips: [
          "Speak to Yourself as a Friend: Would you say this to someone you care about?",
          "Normalize Struggles: Depression is an illness, not a personal failure.",
          "Self-Care Basics: Ensure adequate sleep, nutrition, and hydration.",
          "Celebrate Small Wins: Acknowledge any effort, no matter how small."
        ]
      }
    ]
  },
  {
    id: "sleep",
    name: "Sleep Quality",
    icon: Moon,
    description: "Evidence-based strategies for better sleep and rest",
    resources: [
      {
        title: "Sleep Hygiene Fundamentals",
        tips: [
          "Consistent Schedule: Go to bed and wake up at the same time daily, even weekends.",
          "Dark & Cool Environment: Keep bedroom dark (use blackout curtains), cool (65-68°F), and quiet.",
          "Screen Curfew: No screens 1 hour before bed; blue light disrupts melatonin.",
          "Comfortable Bedding: Invest in good pillows and quality sheets."
        ]
      },
      {
        title: "Pre-Sleep Routine",
        tips: [
          "Warm Bath or Shower: 90 minutes before bed can improve sleep quality.",
          "Relaxation Techniques: Progressive muscle relaxation or body scan meditation (10-15 min).",
          "Light Reading: Choose calming, non-stimulating content.",
          "Herbal Tea: Chamomile, valerian root, or passionflower can support sleep."
        ]
      },
      {
        title: "Daytime Habits for Better Sleep",
        tips: [
          "Morning Sunlight: Get 15-30 minutes of natural light exposure in the morning.",
          "Exercise Timing: Exercise in morning or afternoon, not 3 hours before bed.",
          "Limit Naps: Keep daytime naps under 20 minutes, before 3 PM.",
          "Caffeine Cutoff: No caffeine after 2 PM; alcohol can disrupt sleep quality."
        ]
      }
    ]
  },
  {
    id: "burnout",
    name: "Burnout",
    icon: Heart,
    description: "Strategies to prevent and recover from professional and personal burnout",
    resources: [
      {
        title: "Work-Life Balance",
        tips: [
          "Set Boundaries: Define work hours and stick to them; communicate limits to others.",
          "Take Breaks: Step away every 90 minutes; use vacation days and weekends fully.",
          "Delegate Tasks: You don't have to do everything; distribute responsibilities.",
          "Leave Work at Work: Create a transition ritual (change clothes, short walk, music)."
        ]
      },
      {
        title: "Energy Management",
        tips: [
          "Identify Drains: What activities, people, or tasks deplete your energy most?",
          "Prioritize Recovery: Schedule downtime like any important appointment.",
          "Find Meaning: Connect with the purpose behind your work or responsibilities.",
          "Celebrate Progress: Acknowledge what you've accomplished, not just what remains."
        ]
      },
      {
        title: "Sustainable Practices",
        tips: [
          "Hobby Time: Dedicate time to activities you enjoy outside of obligations.",
          "Social Support: Spend quality time with people who energize you.",
          "Professional Help: Consider therapy or coaching to develop coping strategies.",
          "Reassess Goals: Are your goals realistic? Can they be adjusted or delegated?"
        ]
      }
    ]
  },
  {
    id: "social",
    name: "Social Wellbeing",
    icon: Users,
    description: "Building meaningful connections and social resilience",
    resources: [
      {
        title: "Building Connections",
        tips: [
          "Quality over Quantity: Focus on deeper relationships with fewer people.",
          "Reach Out First: Send a text, call, or invite someone to coffee.",
          "Active Listening: Listen without planning your response; show genuine interest.",
          "Community Groups: Join clubs, classes, or groups around your interests."
        ]
      },
      {
        title: "Communication Skills",
        tips: [
          "Express Needs Clearly: Use 'I' statements; share what you need without blame.",
          "Practice Empathy: Try to understand others' perspectives and feelings.",
          "Boundaries: It's okay to say no; respect your energy limits.",
          "Resolve Conflict: Address issues early; seek understanding rather than being right."
        ]
      },
      {
        title: "Support Systems",
        tips: [
          "Identify Your Circle: Who are the people you can rely on?",
          "Vulnerability: Share your struggles with trusted people; asking for help is strength.",
          "Support Others: Helping others strengthens relationships and sense of purpose.",
          "Professional Support: Consider support groups or therapy for deeper issues."
        ]
      }
    ]
  },
  {
    id: "self-esteem",
    name: "Self-Esteem",
    icon: Lightbulb,
    description: "Techniques to build confidence and develop a healthier self-image",
    resources: [
      {
        title: "Self-Worth Building",
        tips: [
          "Identify Strengths: List 5 things you're good at; review this list regularly.",
          "Past Successes: Recall moments when you overcame challenges or achieved goals.",
          "Self-Affirmations: Use positive statements like 'I am capable' or 'I am worthy.'",
          "Limit Comparisons: Unfollow social media that triggers negative comparisons."
        ]
      },
      {
        title: "Challenge Negative Self-Talk",
        tips: [
          "Notice the Voice: What does your inner critic say? When does it appear?",
          "Question It: Is this thought based on facts or assumptions?",
          "Reframe: Replace 'I'm a failure' with 'This was a learning experience.'",
          "Practice Kindness: Treat yourself like you'd treat a good friend."
        ]
      },
      {
        title: "Actions that Build Confidence",
        tips: [
          "Try New Things: Small challenges build confidence (new hobby, skill, etc.).",
          "Maintain Appearance: Dress in ways that make you feel good about yourself.",
          "Set & Achieve Goals: Small, realistic goals build momentum and self-trust.",
          "Help Others: Contributing to others boosts sense of purpose and worth."
        ]
      }
    ]
  }
]

interface ResourceCategory {
  id: string
  name: string
  icon: typeof Brain
  description: string
  resources: Array<{
    title: string
    tips: string[]
  }>
}

export default function ResourcesPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const [selectedCategory, setSelectedCategory] = useState<string>(
    resourceCategories.find(c => c.id === categoryParam)?.id || resourceCategories[0].id
  )

  useEffect(() => {
    if (categoryParam && resourceCategories.find(c => c.id === categoryParam)) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  const active = resourceCategories.find(c => c.id === selectedCategory)

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-14 md:pt-16">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Wellness Resources
            </h1>
            <p className="mt-2 text-muted-foreground">
              Comprehensive self-help resources tailored to different mental health concerns.
            </p>
          </div>

          {/* Category Selection */}
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {resourceCategories.map((category) => {
                const Icon = category.icon
                const isActive = category.id === selectedCategory
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:bg-muted"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium text-center line-clamp-2">
                      {category.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active Category Content */}
          {active && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">{active.name}</CardTitle>
                  <CardDescription>{active.description}</CardDescription>
                </CardHeader>
              </Card>

              {active.resources.map((resource, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {resource.tips.map((tip, tipIdx) => (
                        <li key={tipIdx} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            {tip}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Crisis Support */}
          <Card className="mt-8 border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">Need Immediate Support?</CardTitle>
                  <CardDescription className="mt-1">
                    If {"you're"} in crisis or need to talk to someone right away, help is available.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">National Suicide Prevention Lifeline:</strong> 988 (US)
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Crisis Text Line:</strong> Text HOME to 741741 (US)
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">International Association for Suicide Prevention:</strong>{" "}
                  <a 
                    href="https://www.iasp.info/resources/Crisis_Centres/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Find a crisis center
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
