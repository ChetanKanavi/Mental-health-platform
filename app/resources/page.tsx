"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { 
  BookOpen, Phone, Heart, Brain, Sun, Moon, Wind, 
  Activity, Users, Sparkles, Coffee, Leaf, MessageCircle,
  Clock, Target, Shield, Smile, ChevronRight
} from "lucide-react"
import Link from "next/link"

const resourceCategories = [
  {
    id: "stress-anxiety",
    title: "Stress & Anxiety",
    icon: Wind,
    description: "Techniques to manage stress and reduce anxiety symptoms",
    color: "bg-blue-500/10 text-blue-600",
    resources: [
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
        title: "Progressive Muscle Relaxation",
        description: "Systematically tense and release muscle groups to reduce physical tension.",
        steps: [
          "Find a comfortable position, close your eyes",
          "Start with your feet - tense muscles for 5 seconds",
          "Release and notice the relaxation for 10 seconds",
          "Move up through legs, abdomen, arms, and face",
          "End with a full body scan, releasing any remaining tension"
        ],
        duration: "10-15 minutes",
        icon: Activity
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
        title: "Worry Time Scheduling",
        description: "Contain anxious thoughts by scheduling dedicated time to address worries.",
        steps: [
          "Set aside 15-20 minutes daily as worry time",
          "When worries arise, note them and postpone to worry time",
          "During worry time, review your list",
          "For each worry, ask: Can I do something about this?",
          "If yes, plan action. If no, practice letting go."
        ],
        duration: "15-20 minutes daily",
        icon: Clock
      }
    ]
  },
  {
    id: "depression",
    title: "Depression",
    icon: Heart,
    description: "Strategies to lift mood and combat depressive symptoms",
    color: "bg-rose-500/10 text-rose-600",
    resources: [
      {
        title: "Behavioral Activation",
        description: "Gradually increase engagement in meaningful activities to improve mood.",
        steps: [
          "List activities you used to enjoy or might enjoy",
          "Rate each activity by difficulty (1-10)",
          "Start with easier activities (rated 1-3)",
          "Schedule one small activity daily",
          "After completing, rate your mood before and after"
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
        title: "Social Connection Plan",
        description: "Combat isolation by building and maintaining supportive relationships.",
        steps: [
          "List people you feel comfortable reaching out to",
          "Schedule one small social interaction weekly",
          "Start small - a text, call, or brief visit",
          "Join a group activity or class that interests you",
          "Consider support groups for shared experiences"
        ],
        duration: "Ongoing practice",
        icon: Users
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
    ]
  },
  {
    id: "sleep",
    title: "Sleep Quality",
    icon: Moon,
    description: "Improve your sleep hygiene and rest better",
    color: "bg-indigo-500/10 text-indigo-600",
    resources: [
      {
        title: "Sleep Hygiene Checklist",
        description: "Essential habits for better sleep quality.",
        steps: [
          "Keep a consistent sleep schedule, even on weekends",
          "Make your bedroom dark, quiet, and cool (65-68 degrees F)",
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
          "If your mind wanders, gently return to the body scan"
        ],
        duration: "10-20 minutes",
        icon: Activity
      },
      {
        title: "Cognitive Shuffle",
        description: "A technique to quiet racing thoughts and fall asleep.",
        steps: [
          "Think of a random word (like 'apple')",
          "Visualize things starting with A (ant, airplane...)",
          "When you run out, move to the next letter",
          "Picture each item vividly but briefly",
          "The randomness helps disengage your thinking mind"
        ],
        duration: "Until you fall asleep",
        icon: Brain
      }
    ]
  },
  {
    id: "burnout",
    title: "Burnout",
    icon: Coffee,
    description: "Recover from exhaustion and prevent future burnout",
    color: "bg-amber-500/10 text-amber-600",
    resources: [
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
          "Practice saying: 'Let me check my schedule and get back to you'",
          "Use 'I' statements: 'I am not able to take this on right now'",
          "Start with low-stakes situations to build confidence",
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
      },
      {
        title: "Values Realignment",
        description: "Reconnect with what matters most to prevent future burnout.",
        steps: [
          "Write down your top 5 life values",
          "Rate how well your current life reflects each (1-10)",
          "Identify the biggest gaps",
          "Choose one small change aligned with a neglected value",
          "Schedule time weekly for this value-aligned activity"
        ],
        duration: "30 minutes reflection",
        icon: Target
      }
    ]
  },
  {
    id: "social",
    title: "Social Wellbeing",
    icon: Users,
    description: "Build and maintain meaningful connections",
    color: "bg-green-500/10 text-green-600",
    resources: [
      {
        title: "Conversation Starters",
        description: "Tips for initiating and maintaining meaningful conversations.",
        steps: [
          "Ask open-ended questions (How, What, Why)",
          "Practice active listening - paraphrase what you heard",
          "Share something about yourself to build reciprocity",
          "Show genuine curiosity about others' experiences",
          "Follow up on previous conversations"
        ],
        duration: "Use in conversations",
        icon: MessageCircle
      },
      {
        title: "Social Battery Management",
        description: "Balance social interaction with needed alone time.",
        steps: [
          "Know your social capacity - introvert or extrovert?",
          "Schedule recovery time after intense social events",
          "It is okay to leave events early when drained",
          "Choose quality interactions over quantity",
          "Communicate your needs to close friends/family"
        ],
        duration: "Ongoing awareness",
        icon: Activity
      },
      {
        title: "Deepening Existing Relationships",
        description: "Move beyond surface-level connections.",
        steps: [
          "Choose 2-3 relationships to invest in",
          "Schedule regular one-on-one time",
          "Share vulnerably and ask deeper questions",
          "Remember important dates and follow up on their life",
          "Be present - put away phones during conversations"
        ],
        duration: "Ongoing practice",
        icon: Heart
      },
      {
        title: "Handling Social Anxiety",
        description: "Techniques for managing anxiety in social situations.",
        steps: [
          "Arrive early to adjust to the environment",
          "Have an 'out' - know it is okay to leave",
          "Focus on one person at a time, not the whole room",
          "Prepare a few conversation topics beforehand",
          "Challenge negative self-talk with evidence"
        ],
        duration: "Before and during social events",
        icon: Shield
      }
    ]
  },
  {
    id: "self-esteem",
    title: "Self-Esteem",
    icon: Sparkles,
    description: "Build confidence and positive self-regard",
    color: "bg-purple-500/10 text-purple-600",
    resources: [
      {
        title: "Self-Compassion Practice",
        description: "Treat yourself with the kindness you would show a friend.",
        steps: [
          "Notice when you are being self-critical",
          "Ask: What would I say to a friend in this situation?",
          "Place a hand on your heart and speak kindly",
          "Acknowledge that struggle is part of being human",
          "Write yourself a compassionate letter"
        ],
        duration: "As needed",
        icon: Heart
      },
      {
        title: "Strengths Inventory",
        description: "Identify and leverage your unique strengths.",
        steps: [
          "List 5 things you do well (any area of life)",
          "Ask trusted friends what they see as your strengths",
          "Recall past successes and what strengths you used",
          "Look for ways to use strengths more often",
          "Celebrate when you use a strength successfully"
        ],
        duration: "30 minutes reflection",
        icon: Sparkles
      },
      {
        title: "Challenging Negative Self-Talk",
        description: "Identify and reframe unhelpful thought patterns.",
        steps: [
          "Notice the negative thought (I am such a failure)",
          "Ask: Is this thought true? What is the evidence?",
          "Consider alternative perspectives",
          "Reframe: 'I made a mistake, but I can learn from it'",
          "Practice regularly - this rewires your brain over time"
        ],
        duration: "As thoughts arise",
        icon: Brain
      },
      {
        title: "Achievement Log",
        description: "Document your accomplishments to build confidence.",
        steps: [
          "Each day, write down 3 things you accomplished",
          "Include small wins (made the bed, sent that email)",
          "Note challenges you overcame",
          "Review weekly to see your progress",
          "Use this evidence when self-doubt arises"
        ],
        duration: "5 minutes daily",
        icon: Target
      }
    ]
  }
]

const generalResources = [
  {
    title: "Mindful Breathing",
    icon: Leaf,
    description: "Simple techniques available anytime, anywhere"
  },
  {
    title: "Daily Check-in",
    icon: Smile,
    description: "Track your mood to understand patterns"
  },
  {
    title: "Professional Support",
    icon: MessageCircle,
    description: "When to consider seeking help"
  }
]

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [expandedResource, setExpandedResource] = useState<string | null>(null)

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-14 md:pt-16">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Self-Help Resources
            </h1>
            <p className="mt-2 text-muted-foreground">
              Evidence-based techniques and strategies organized by concern area.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {generalResources.map((resource) => {
              const Icon = resource.icon
              return (
                <Card key={resource.title} className="hover:border-primary/30 transition-colors cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm text-foreground">{resource.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Category Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 mb-6">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 text-sm"
              >
                All Resources
              </TabsTrigger>
              {resourceCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 text-sm"
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid gap-6">
                {resourceCategories.map((category) => {
                  const CategoryIcon = category.icon
                  return (
                    <Card key={category.id}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                              <CategoryIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-foreground">{category.title}</CardTitle>
                              <CardDescription>{category.description}</CardDescription>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setActiveTab(category.id)}
                            className="gap-1"
                          >
                            View All <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {category.resources.slice(0, 2).map((resource) => {
                            const ResourceIcon = resource.icon
                            return (
                              <div 
                                key={resource.title}
                                className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                                onClick={() => {
                                  setActiveTab(category.id)
                                  setExpandedResource(resource.title)
                                }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-md bg-background flex items-center justify-center shrink-0">
                                    <ResourceIcon className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm text-foreground">{resource.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{resource.description}</p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {resourceCategories.map((category) => {
              const CategoryIcon = category.icon
              return (
                <TabsContent key={category.id} value={category.id} className="mt-0">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${category.color}`}>
                        <CategoryIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">{category.title}</h2>
                        <p className="text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {category.resources.map((resource) => {
                      const ResourceIcon = resource.icon
                      const isExpanded = expandedResource === resource.title
                      return (
                        <Card 
                          key={resource.title}
                          className={isExpanded ? "border-primary/30" : ""}
                        >
                          <CardHeader 
                            className="cursor-pointer"
                            onClick={() => setExpandedResource(isExpanded ? null : resource.title)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                  <ResourceIcon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <CardTitle className="text-base text-foreground">{resource.title}</CardTitle>
                                  <CardDescription className="mt-1">{resource.description}</CardDescription>
                                  <Badge variant="secondary" className="mt-2 text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {resource.duration}
                                  </Badge>
                                </div>
                              </div>
                              <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                            </div>
                          </CardHeader>
                          {isExpanded && (
                            <CardContent className="pt-0">
                              <div className="pl-14">
                                <h4 className="font-medium text-sm text-foreground mb-3">How to Practice:</h4>
                                <ol className="space-y-2">
                                  {resource.steps.map((step, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-medium text-primary">
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

                  {/* Related Assessment CTA */}
                  <Card className="mt-6 border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">Take the {category.title} Assessment</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Understand where you are and get personalized suggestions.
                          </p>
                        </div>
                        <Link href="/assessment">
                          <Button size="sm" className="gap-2">
                            Start Assessment
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )
            })}
          </Tabs>

          {/* Crisis Support */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">Need Immediate Support?</CardTitle>
                  <CardDescription className="mt-1">
                    If you are in crisis or need to talk to someone right away, help is available.
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
