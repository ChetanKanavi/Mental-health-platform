"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { 
  BookOpen, Phone, Heart, Brain, Sun, Moon, Zap, Users, 
  Sparkles, Clock, MessageCircle, Leaf, Music, Dumbbell,
  Coffee, PenLine, Shield, Target, Smile, Eye
} from "lucide-react"
import { cn } from "@/lib/utils"

const resourceCategories = {
  stress: {
    id: "stress",
    title: "Stress & Anxiety",
    description: "Techniques to manage stress and reduce anxiety symptoms",
    icon: Zap,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    sections: [
      {
        title: "Breathing Techniques",
        icon: Sun,
        items: [
          {
            name: "4-7-8 Breathing",
            description: "Inhale for 4 counts, hold for 7, exhale slowly for 8. This activates your parasympathetic nervous system.",
            steps: ["Find a comfortable seated position", "Inhale quietly through your nose for 4 seconds", "Hold your breath for 7 seconds", "Exhale completely through your mouth for 8 seconds", "Repeat 3-4 times"]
          },
          {
            name: "Box Breathing",
            description: "Equal counts create balance and calm. Used by Navy SEALs for stress management.",
            steps: ["Inhale for 4 counts", "Hold for 4 counts", "Exhale for 4 counts", "Hold empty for 4 counts", "Repeat 4-6 cycles"]
          },
          {
            name: "Diaphragmatic Breathing",
            description: "Deep belly breathing that reduces cortisol and promotes relaxation.",
            steps: ["Place one hand on chest, one on belly", "Breathe in slowly through nose, feeling belly rise", "Chest should remain relatively still", "Exhale slowly through pursed lips", "Practice for 5-10 minutes daily"]
          }
        ]
      },
      {
        title: "Grounding Exercises",
        icon: Leaf,
        items: [
          {
            name: "5-4-3-2-1 Technique",
            description: "Engage all your senses to anchor yourself in the present moment.",
            steps: ["Name 5 things you can see", "Name 4 things you can touch", "Name 3 things you can hear", "Name 2 things you can smell", "Name 1 thing you can taste"]
          },
          {
            name: "Body Scan",
            description: "Progressive awareness of physical sensations to release tension.",
            steps: ["Lie down or sit comfortably", "Close your eyes and take deep breaths", "Focus attention on your toes, notice any sensations", "Slowly move attention up through each body part", "Release tension as you go, taking 10-20 minutes"]
          },
          {
            name: "Cold Water Reset",
            description: "Quick technique to interrupt anxiety spirals.",
            steps: ["Hold ice cubes in your hands", "Or splash cold water on your face", "Focus on the sensation", "Take slow breaths", "Notice the shift in your nervous system"]
          }
        ]
      },
      {
        title: "Lifestyle Adjustments",
        icon: Coffee,
        items: [
          {
            name: "Reduce Caffeine Intake",
            description: "Caffeine can exacerbate anxiety symptoms.",
            steps: ["Limit to 1-2 cups of coffee before noon", "Switch to herbal teas in the afternoon", "Avoid energy drinks", "Notice how your body responds to changes"]
          },
          {
            name: "Regular Exercise",
            description: "Physical activity naturally reduces stress hormones.",
            steps: ["Aim for 30 minutes of moderate activity daily", "Walking, swimming, or yoga are great options", "Exercise outdoors when possible", "Find activities you genuinely enjoy"]
          }
        ]
      }
    ]
  },
  depression: {
    id: "depression",
    title: "Depression",
    description: "Strategies to support mood and emotional well-being",
    icon: Heart,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    sections: [
      {
        title: "Behavioral Activation",
        icon: Target,
        items: [
          {
            name: "Activity Scheduling",
            description: "Plan small, achievable activities to build momentum.",
            steps: ["Start with one small activity per day", "Choose things that used to bring joy", "Set specific times for activities", "Celebrate completing them, no matter how small", "Gradually increase activities over time"]
          },
          {
            name: "Pleasant Events List",
            description: "Create a personal menu of mood-boosting activities.",
            steps: ["List 20 activities you might enjoy", "Include simple things like a warm bath or tea", "Add social activities and solo ones", "Refer to this list when feeling low", "Try one activity even if motivation is low"]
          },
          {
            name: "Opposite Action",
            description: "Do the opposite of what depression tells you to do.",
            steps: ["Notice urges to isolate or avoid", "Identify the opposite behavior", "Take small steps toward that action", "Observe how you feel afterward", "Repeat with compassion for yourself"]
          }
        ]
      },
      {
        title: "Thought Management",
        icon: Brain,
        items: [
          {
            name: "Thought Records",
            description: "Challenge negative thought patterns systematically.",
            steps: ["Write down the negative thought", "Identify the emotion and intensity (0-100)", "List evidence for and against the thought", "Create a more balanced alternative thought", "Re-rate the emotion intensity"]
          },
          {
            name: "Self-Compassion Practice",
            description: "Treat yourself with the kindness you would offer a friend.",
            steps: ["Acknowledge your suffering without judgment", "Remind yourself suffering is part of being human", "Place your hand on your heart", "Speak kindly to yourself", "Ask: What do I need right now?"]
          }
        ]
      },
      {
        title: "Connection & Support",
        icon: Users,
        items: [
          {
            name: "Reach Out Plan",
            description: "Prepare for times when connecting feels hard.",
            steps: ["List 3-5 people you can contact", "Include various levels (close friend, acquaintance)", "Prepare simple messages you can send", "Remember: reaching out is strength, not burden", "Start with low-pressure contact like texting"]
          },
          {
            name: "Support Groups",
            description: "Connect with others who understand your experience.",
            steps: ["Search for local or online support groups", "Try a few different groups to find the right fit", "Participate at your own pace", "Listening is valuable participation too", "Consider peer support apps"]
          }
        ]
      }
    ]
  },
  sleep: {
    id: "sleep",
    title: "Sleep Quality",
    description: "Improve your rest and nighttime routine",
    icon: Moon,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    sections: [
      {
        title: "Sleep Hygiene Basics",
        icon: Clock,
        items: [
          {
            name: "Consistent Schedule",
            description: "Your body clock thrives on regularity.",
            steps: ["Wake up at the same time every day (even weekends)", "Set a consistent bedtime", "Avoid sleeping in more than 1 hour", "Expose yourself to morning light", "Create bedtime and wake-up rituals"]
          },
          {
            name: "Bedroom Environment",
            description: "Optimize your sleep space for rest.",
            steps: ["Keep room temperature cool (65-68°F / 18-20°C)", "Make the room as dark as possible", "Use white noise if needed", "Reserve bed for sleep and intimacy only", "Remove electronics from the bedroom"]
          },
          {
            name: "Screen Curfew",
            description: "Blue light disrupts melatonin production.",
            steps: ["Stop screens 1-2 hours before bed", "Use night mode if you must use devices", "Try reading a physical book instead", "Keep phone outside bedroom", "Avoid stimulating content before bed"]
          }
        ]
      },
      {
        title: "Wind-Down Routine",
        icon: Sparkles,
        items: [
          {
            name: "Relaxation Sequence",
            description: "Signal to your body that it is time to sleep.",
            steps: ["Dim lights 2 hours before bed", "Take a warm bath or shower", "Practice gentle stretching or yoga", "Listen to calming music", "Do a body scan meditation in bed"]
          },
          {
            name: "Worry Dump",
            description: "Clear your mind before sleep.",
            steps: ["Set aside 15 minutes before bed", "Write down all worries and to-dos", "Note one small action for each if possible", "Close the notebook and set it aside", "Remind yourself: these will wait until morning"]
          }
        ]
      },
      {
        title: "When You Cannot Sleep",
        icon: Eye,
        items: [
          {
            name: "20-Minute Rule",
            description: "Avoid associating bed with wakefulness.",
            steps: ["If not asleep in 20 minutes, get up", "Go to another room", "Do something boring and relaxing", "Return to bed when sleepy", "Repeat if needed - no clock watching"]
          },
          {
            name: "Cognitive Shuffle",
            description: "Distract your mind from racing thoughts.",
            steps: ["Think of a random word (like BEACH)", "For each letter, visualize unrelated objects", "B: banana, bridge, button...", "Move slowly through letters", "The randomness promotes sleep"]
          }
        ]
      }
    ]
  },
  burnout: {
    id: "burnout",
    title: "Burnout Recovery",
    description: "Restore energy and prevent exhaustion",
    icon: Zap,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    sections: [
      {
        title: "Immediate Relief",
        icon: Shield,
        items: [
          {
            name: "Permission to Rest",
            description: "Rest is productive - it is essential for recovery.",
            steps: ["Acknowledge that burnout is real and valid", "Give yourself permission to slow down", "Cancel non-essential commitments", "Schedule rest like you would meetings", "Start with 15 minutes of doing nothing"]
          },
          {
            name: "Energy Audit",
            description: "Identify what drains and restores you.",
            steps: ["List all your regular activities", "Mark each as draining, neutral, or energizing", "Look for patterns", "Reduce draining activities where possible", "Increase energizing ones, even slightly"]
          }
        ]
      },
      {
        title: "Boundary Setting",
        icon: Target,
        items: [
          {
            name: "Learn to Say No",
            description: "Protect your energy by declining strategically.",
            steps: ["Pause before saying yes to requests", "Ask: Do I have the capacity for this?", "Practice simple declining phrases", "Remember: No is a complete sentence", "Start small with low-stakes situations"]
          },
          {
            name: "Work Boundaries",
            description: "Create separation between work and personal time.",
            steps: ["Set a firm end time for work each day", "Create a shutdown ritual to end work", "Turn off work notifications outside hours", "Designate a work-free space at home", "Take your full lunch break away from desk"]
          }
        ]
      },
      {
        title: "Long-term Recovery",
        icon: Leaf,
        items: [
          {
            name: "Values Reconnection",
            description: "Burnout often means losing touch with what matters.",
            steps: ["Reflect on your core values", "Notice where your life aligns or misaligns", "Make one small change toward alignment", "Revisit your values regularly", "Let values guide decisions"]
          },
          {
            name: "Joy Reclamation",
            description: "Rediscover activities that bring genuine pleasure.",
            steps: ["Think back to childhood interests", "Try one hobby with no productivity goal", "Notice moments of flow or absorption", "Protect time for these activities", "Share joyful moments with others"]
          }
        ]
      }
    ]
  },
  social: {
    id: "social",
    title: "Social Wellbeing",
    description: "Build meaningful connections and reduce isolation",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50",
    sections: [
      {
        title: "Building Connections",
        icon: MessageCircle,
        items: [
          {
            name: "Start Small",
            description: "Meaningful connection does not require large gatherings.",
            steps: ["Text one person you have not talked to recently", "Have a 5-minute conversation with a neighbor", "Join an online community around an interest", "Attend one local event or class", "Focus on quality over quantity"]
          },
          {
            name: "Active Listening",
            description: "Deepen connections through genuine attention.",
            steps: ["Put away distractions during conversations", "Ask follow-up questions", "Reflect back what you heard", "Avoid planning your response while listening", "Show interest in their experiences"]
          }
        ]
      },
      {
        title: "Social Anxiety Management",
        icon: Shield,
        items: [
          {
            name: "Gradual Exposure",
            description: "Build social confidence step by step.",
            steps: ["List social situations from easy to hard", "Start with the easiest situation", "Practice until comfort increases", "Move to slightly harder situations", "Celebrate each step forward"]
          },
          {
            name: "Pre-Event Preparation",
            description: "Reduce anxiety before social situations.",
            steps: ["Prepare a few conversation topics", "Arrive early to settle in", "Identify an exit strategy if needed", "Focus on others rather than yourself", "Plan a reward for afterward"]
          }
        ]
      },
      {
        title: "Healthy Relationships",
        icon: Heart,
        items: [
          {
            name: "Nurturing Existing Bonds",
            description: "Strengthen the relationships you already have.",
            steps: ["Schedule regular check-ins with close people", "Express appreciation and gratitude", "Show up during difficult times", "Share vulnerably when appropriate", "Create traditions or rituals together"]
          },
          {
            name: "Setting Relationship Boundaries",
            description: "Protect your wellbeing in relationships.",
            steps: ["Identify what feels uncomfortable", "Communicate needs clearly and kindly", "Allow others to have their reactions", "Be consistent with boundaries", "Evaluate relationships that repeatedly cross boundaries"]
          }
        ]
      }
    ]
  },
  selfesteem: {
    id: "selfesteem",
    title: "Self-Esteem",
    description: "Build confidence and positive self-regard",
    icon: Sparkles,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    sections: [
      {
        title: "Self-Compassion",
        icon: Heart,
        items: [
          {
            name: "Inner Critic Awareness",
            description: "Notice and soften your self-critical voice.",
            steps: ["Notice when you are being self-critical", "Pause and acknowledge the criticism", "Ask: Would I say this to a friend?", "Reframe with a kinder perspective", "Practice daily for lasting change"]
          },
          {
            name: "Self-Compassion Break",
            description: "A quick practice for difficult moments.",
            steps: ["Acknowledge: This is a moment of suffering", "Remember: Suffering is part of life, I am not alone", "Offer yourself kindness: May I be kind to myself", "Place hand on heart if it feels supportive", "Take a few deep breaths"]
          }
        ]
      },
      {
        title: "Building Confidence",
        icon: Target,
        items: [
          {
            name: "Strength Inventory",
            description: "Recognize and build on your existing strengths.",
            steps: ["List 10 things you are good at", "Include small things and big things", "Ask trusted others for input", "Notice when you use these strengths", "Find new ways to apply them"]
          },
          {
            name: "Achievement Log",
            description: "Track wins to counteract negativity bias.",
            steps: ["Write down 3 accomplishments each day", "Include small wins like finishing a task", "Review weekly to see patterns", "Notice how it feels to acknowledge these", "Share achievements with supportive others"]
          }
        ]
      },
      {
        title: "Positive Self-Talk",
        icon: MessageCircle,
        items: [
          {
            name: "Affirmation Practice",
            description: "Rewire negative thought patterns with positive statements.",
            steps: ["Choose 3-5 affirmations that resonate", "Make them believable and present tense", "Repeat them morning and evening", "Write them where you will see them", "Notice resistance without judgment"]
          },
          {
            name: "Reframing Failures",
            description: "See setbacks as opportunities for growth.",
            steps: ["Notice when you label something as failure", "Ask: What can I learn from this?", "Identify one thing you did well", "Consider what you would do differently", "Remember: failure is part of growth"]
          }
        ]
      }
    ]
  }
}

export default function ResourcesPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const [activeCategory, setActiveCategory] = useState(categoryParam || "stress")
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const categories = Object.values(resourceCategories)
  const currentCategory = resourceCategories[activeCategory as keyof typeof resourceCategories] || resourceCategories.stress

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
              Evidence-based techniques and strategies for your mental well-being journey.
            </p>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
            <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                      "data-[state=active]:border-primary data-[state=active]:bg-primary/10",
                      "data-[state=inactive]:border-border data-[state=inactive]:bg-card"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{cat.title}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {categories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id} className="mt-6">
                {/* Category Header */}
                <Card className={cn("mb-6", cat.bgColor)}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-card")}>
                        <cat.icon className={cn("w-6 h-6", cat.color)} />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-foreground">{cat.title}</CardTitle>
                        <CardDescription>{cat.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Sections */}
                <div className="space-y-8">
                  {cat.sections.map((section) => {
                    const SectionIcon = section.icon
                    return (
                      <div key={section.title}>
                        <div className="flex items-center gap-2 mb-4">
                          <SectionIcon className="w-5 h-5 text-primary" />
                          <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                        </div>
                        <div className="grid gap-4">
                          {section.items.map((item) => {
                            const isExpanded = expandedItem === `${cat.id}-${item.name}`
                            return (
                              <Card key={item.name} className="overflow-hidden">
                                <CardHeader 
                                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                                  onClick={() => setExpandedItem(isExpanded ? null : `${cat.id}-${item.name}`)}
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <CardTitle className="text-base text-foreground">{item.name}</CardTitle>
                                      <CardDescription className="mt-1">{item.description}</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" className="shrink-0 bg-transparent">
                                      {isExpanded ? "Hide Steps" : "View Steps"}
                                    </Button>
                                  </div>
                                </CardHeader>
                                {isExpanded && (
                                  <CardContent className="border-t bg-muted/30 pt-4">
                                    <ol className="space-y-2">
                                      {item.steps.map((step, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm">
                                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-medium">
                                            {idx + 1}
                                          </span>
                                          <span className="text-muted-foreground pt-0.5">{step}</span>
                                        </li>
                                      ))}
                                    </ol>
                                  </CardContent>
                                )}
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Quick Reference */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">Universal Wellness Tips</CardTitle>
                  <CardDescription>Daily habits that support overall mental health</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: Sun, tip: "Get 15+ minutes of sunlight daily" },
                  { icon: Dumbbell, tip: "Move your body for 30 minutes" },
                  { icon: Moon, tip: "Aim for 7-9 hours of sleep" },
                  { icon: Music, tip: "Listen to music that lifts your mood" },
                  { icon: Users, tip: "Connect with someone you care about" },
                  { icon: PenLine, tip: "Write 3 things you are grateful for" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <item.icon className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground">{item.tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                    If you are in crisis or need to talk to someone right away, help is available 24/7.
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
