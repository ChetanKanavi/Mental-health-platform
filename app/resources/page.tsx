"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, Phone, Heart, Brain, Sun, Moon, Wind, Coffee, 
  Users, Sparkles, AlertCircle, Lightbulb, Target, Clock,
  Smile, Activity, Leaf, MessageCircle, Shield, Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

const resourceCategories = {
  "stress-anxiety": {
    title: "Stress & Anxiety",
    description: "Techniques and strategies to manage stress and reduce anxiety",
    icon: Wind,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    resources: [
      {
        title: "Breathing Techniques",
        icon: Wind,
        tips: [
          { title: "4-7-8 Breathing", description: "Inhale for 4 counts through your nose, hold for 7 counts, exhale slowly through your mouth for 8 counts. Repeat 3-4 times." },
          { title: "Box Breathing", description: "Breathe in for 4 counts, hold for 4 counts, exhale for 4 counts, hold for 4 counts. Used by Navy SEALs for stress management." },
          { title: "Diaphragmatic Breathing", description: "Place one hand on your chest and one on your belly. Breathe so only your belly rises. This activates your parasympathetic nervous system." },
        ]
      },
      {
        title: "Grounding Exercises",
        icon: Target,
        tips: [
          { title: "5-4-3-2-1 Technique", description: "Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. Great for panic attacks." },
          { title: "Body Scan", description: "Starting from your toes, slowly move attention up through your body, noticing sensations without judgment." },
          { title: "Cold Water Reset", description: "Splash cold water on your face or hold ice cubes. This activates the dive reflex and slows your heart rate." },
        ]
      },
      {
        title: "Cognitive Strategies",
        icon: Brain,
        tips: [
          { title: "Worry Time", description: "Schedule 15-20 minutes daily for worrying. Outside this time, write worries down to address later." },
          { title: "Thought Challenging", description: "Ask yourself: Is this thought based on facts? What would I tell a friend thinking this? What is the worst that could realistically happen?" },
          { title: "STOP Technique", description: "Stop what you are doing, Take a breath, Observe your thoughts and feelings, Proceed mindfully." },
        ]
      },
      {
        title: "Lifestyle Adjustments",
        icon: Leaf,
        tips: [
          { title: "Limit Caffeine", description: "Reduce coffee, tea, and energy drinks, especially after 2pm. Caffeine can amplify anxiety symptoms." },
          { title: "Regular Exercise", description: "30 minutes of moderate exercise most days can be as effective as medication for mild anxiety." },
          { title: "Nature Exposure", description: "Spend at least 20 minutes in nature daily. Even viewing nature scenes can lower cortisol levels." },
        ]
      }
    ]
  },
  "depression": {
    title: "Depression",
    description: "Resources and strategies for managing low mood and depression",
    icon: Heart,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    resources: [
      {
        title: "Behavioral Activation",
        icon: Activity,
        tips: [
          { title: "Activity Scheduling", description: "Plan one small, achievable activity each day. Start with activities that used to bring you joy, even if they do not feel appealing now." },
          { title: "The 5-Minute Rule", description: "Commit to doing something for just 5 minutes. Often, starting is the hardest part, and you may continue once you begin." },
          { title: "Pleasure and Mastery", description: "Balance activities that give you pleasure with those that give you a sense of accomplishment." },
        ]
      },
      {
        title: "Thought Patterns",
        icon: Lightbulb,
        tips: [
          { title: "Catch Negative Thoughts", description: "Notice when you are thinking in absolutes like 'always', 'never', 'everyone'. These rarely reflect reality." },
          { title: "Self-Compassion", description: "Treat yourself as you would treat a good friend. Ask: Would I say this to someone I love?" },
          { title: "Gratitude Practice", description: "Write down 3 specific things you are grateful for each day. Be detailed about why each matters to you." },
        ]
      },
      {
        title: "Social Connection",
        icon: Users,
        tips: [
          { title: "Reach Out Daily", description: "Send one text or make one call each day, even if brief. Connection does not require deep conversation." },
          { title: "Support Groups", description: "Consider joining a depression support group, online or in-person. Shared experiences reduce isolation." },
          { title: "Set Boundaries", description: "It is okay to limit time with people who drain your energy. Protect your mental resources." },
        ]
      },
      {
        title: "Physical Self-Care",
        icon: Sun,
        tips: [
          { title: "Morning Light Exposure", description: "Get 15-30 minutes of natural light within an hour of waking. This helps regulate your circadian rhythm." },
          { title: "Gentle Movement", description: "Even a 10-minute walk can boost mood. Focus on movement, not exercise intensity." },
          { title: "Nutrition Basics", description: "Eat regular meals with protein and vegetables. Omega-3s (found in fish, walnuts) may support mood." },
        ]
      }
    ]
  },
  "sleep": {
    title: "Sleep Quality",
    description: "Tips and techniques for better rest and improved sleep hygiene",
    icon: Moon,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    resources: [
      {
        title: "Sleep Environment",
        icon: Moon,
        tips: [
          { title: "Temperature Control", description: "Keep your bedroom between 60-67F (15-19C). A cool room promotes deeper sleep." },
          { title: "Darkness Matters", description: "Use blackout curtains or an eye mask. Even small amounts of light can disrupt melatonin production." },
          { title: "Reserve Bed for Sleep", description: "Avoid working, watching TV, or scrolling in bed. Your brain should associate bed with sleep only." },
        ]
      },
      {
        title: "Sleep Schedule",
        icon: Clock,
        tips: [
          { title: "Consistent Wake Time", description: "Wake at the same time every day, even weekends. This is more important than a consistent bedtime." },
          { title: "Wind-Down Routine", description: "Start relaxing 1 hour before bed. Dim lights, avoid screens, do calming activities." },
          { title: "Avoid Clock Watching", description: "Turn clocks away from view. Checking the time increases anxiety about sleep." },
        ]
      },
      {
        title: "Pre-Sleep Practices",
        icon: Sparkles,
        tips: [
          { title: "Screen Curfew", description: "Stop using phones and computers 1-2 hours before bed. Blue light suppresses melatonin." },
          { title: "Relaxation Techniques", description: "Try progressive muscle relaxation: tense each muscle group for 5 seconds, then release." },
          { title: "Worry Journal", description: "Write down tomorrow's to-dos and worries before bed. This clears your mind for sleep." },
        ]
      },
      {
        title: "Daytime Habits",
        icon: Sun,
        tips: [
          { title: "Morning Sunlight", description: "Get bright light exposure within 30 minutes of waking to set your circadian rhythm." },
          { title: "Caffeine Cutoff", description: "Avoid caffeine after 2pm. It has a half-life of 5-6 hours and can fragment sleep." },
          { title: "Exercise Timing", description: "Regular exercise improves sleep, but finish workouts at least 3 hours before bedtime." },
        ]
      }
    ]
  },
  "burnout": {
    title: "Burnout",
    description: "Recovery strategies for exhaustion and work-related stress",
    icon: Zap,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    resources: [
      {
        title: "Boundary Setting",
        icon: Shield,
        tips: [
          { title: "Define Work Hours", description: "Set clear start and end times for work. Communicate these boundaries to colleagues and stick to them." },
          { title: "Learn to Say No", description: "Practice saying: 'I do not have capacity for that right now.' You do not need to over-explain." },
          { title: "Digital Boundaries", description: "Turn off work notifications after hours. Consider separate devices for work and personal use." },
        ]
      },
      {
        title: "Energy Management",
        icon: Activity,
        tips: [
          { title: "Energy Audit", description: "Track what activities drain vs. energize you for a week. Minimize drains, maximize energizers." },
          { title: "Strategic Breaks", description: "Take a 5-minute break every 25 minutes (Pomodoro technique). Step away from your desk." },
          { title: "Protect Your Peak Hours", description: "Identify when you have most energy and reserve that time for your most important work." },
        ]
      },
      {
        title: "Recovery Activities",
        icon: Leaf,
        tips: [
          { title: "True Rest", description: "Rest is not just sleep. Include activities that restore you: nature, hobbies, social connection, or solitude." },
          { title: "Micro-Recovery", description: "Add small pleasures throughout the day: a good coffee, a short walk, music you enjoy." },
          { title: "Vacation Planning", description: "Take time off before you need it desperately. Even long weekends can help prevent burnout." },
        ]
      },
      {
        title: "Mindset Shifts",
        icon: Brain,
        tips: [
          { title: "Redefine Success", description: "Success is not just productivity. Include well-being metrics: How rested do I feel? Am I present with loved ones?" },
          { title: "Let Go of Perfectionism", description: "Done is better than perfect. Ask: What is good enough for this task?" },
          { title: "Separate Identity from Work", description: "You are not your job. Cultivate interests and relationships outside of work." },
        ]
      }
    ]
  },
  "social-wellbeing": {
    title: "Social Wellbeing",
    description: "Building and maintaining healthy relationships and social connections",
    icon: Users,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
    resources: [
      {
        title: "Building Connections",
        icon: Users,
        tips: [
          { title: "Quality Over Quantity", description: "Focus on deepening a few relationships rather than maintaining many superficial ones." },
          { title: "Initiate Contact", description: "Do not wait for others to reach out. Send the first text, suggest the coffee date." },
          { title: "Join Communities", description: "Find groups aligned with your interests: book clubs, sports teams, volunteer organizations, online communities." },
        ]
      },
      {
        title: "Communication Skills",
        icon: MessageCircle,
        tips: [
          { title: "Active Listening", description: "Give full attention, ask follow-up questions, reflect back what you heard before responding." },
          { title: "Express Appreciation", description: "Tell people specifically what you value about them. Be genuine and detailed." },
          { title: "Difficult Conversations", description: "Use 'I' statements: 'I feel... when... because...' Avoid blame and stay curious about their perspective." },
        ]
      },
      {
        title: "Managing Social Anxiety",
        icon: Shield,
        tips: [
          { title: "Start Small", description: "Begin with low-stakes interactions: brief chats with cashiers, neighbors, or colleagues." },
          { title: "Focus Outward", description: "Shift attention from how you appear to being genuinely curious about the other person." },
          { title: "Prepare and Practice", description: "Have a few conversation topics ready. It is okay to prepare for social situations." },
        ]
      },
      {
        title: "Healthy Relationships",
        icon: Heart,
        tips: [
          { title: "Set Boundaries", description: "Healthy relationships include boundaries. It is okay to say no, need space, or have different opinions." },
          { title: "Address Issues Early", description: "Small resentments grow. Address concerns when they are small and manageable." },
          { title: "Mutual Support", description: "Relationships should be reciprocal. Notice if you are always giving or always receiving." },
        ]
      }
    ]
  },
  "self-esteem": {
    title: "Self-Esteem",
    description: "Building confidence and a healthy sense of self-worth",
    icon: Smile,
    color: "text-primary",
    bgColor: "bg-primary/10",
    resources: [
      {
        title: "Self-Compassion",
        icon: Heart,
        tips: [
          { title: "Kind Self-Talk", description: "Notice your inner critic. When it speaks, respond as you would to a friend in pain." },
          { title: "Common Humanity", description: "Remember that struggling is part of being human. You are not alone in your difficulties." },
          { title: "Mindful Awareness", description: "Acknowledge painful feelings without over-identifying with them. 'I notice I am feeling inadequate' vs 'I am inadequate.'" },
        ]
      },
      {
        title: "Building Confidence",
        icon: Target,
        tips: [
          { title: "Celebrate Small Wins", description: "Acknowledge your accomplishments, no matter how small. Keep a 'done' list alongside your to-do list." },
          { title: "Growth Mindset", description: "See challenges as opportunities to grow, not tests of your worth. 'I cannot do this yet' not 'I cannot do this.'" },
          { title: "Take Action Despite Fear", description: "Confidence comes from doing, not waiting until you feel ready. Start before you feel confident." },
        ]
      },
      {
        title: "Values and Identity",
        icon: Sparkles,
        tips: [
          { title: "Identify Your Values", description: "What matters most to you? Living aligned with your values builds authentic self-esteem." },
          { title: "Stop Comparing", description: "Compare yourself to your past self, not others. Others' highlight reels are not comparable to your behind-the-scenes." },
          { title: "Define Your Own Success", description: "What does a good life mean to you? Not what society, family, or social media says it should be." },
        ]
      },
      {
        title: "Self-Care Practices",
        icon: Leaf,
        tips: [
          { title: "Treat Yourself Well", description: "Self-esteem is built through action. Eat well, exercise, rest. These signal that you are worth caring for." },
          { title: "Set and Keep Promises to Yourself", description: "When you say you will do something, do it. Self-trust builds self-esteem." },
          { title: "Limit Negative Inputs", description: "Unfollow accounts that make you feel bad. Limit time with people who put you down." },
        ]
      }
    ]
  }
}

export default function ResourcesPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const [activeCategory, setActiveCategory] = useState(
    categoryParam && resourceCategories[categoryParam as keyof typeof resourceCategories] 
      ? categoryParam 
      : "stress-anxiety"
  )

  const categories = Object.entries(resourceCategories)
  const currentCategory = resourceCategories[activeCategory as keyof typeof resourceCategories]

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
              {categories.map(([key, category]) => {
                const Icon = category.icon
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                      "data-[state=active]:border-primary data-[state=active]:bg-primary/10",
                      "data-[state=inactive]:border-border data-[state=inactive]:bg-card"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{category.title}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {categories.map(([key, category]) => (
              <TabsContent key={key} value={key} className="mt-6">
                {/* Category Header */}
                <Card className={cn("mb-6", category.bgColor)}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        "bg-background"
                      )}>
                        <category.icon className={cn("w-6 h-6", category.color)} />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-foreground">{category.title}</CardTitle>
                        <CardDescription className="mt-1">{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Resources Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  {category.resources.map((resource) => {
                    const ResourceIcon = resource.icon
                    return (
                      <Card key={resource.title}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              category.bgColor
                            )}>
                              <ResourceIcon className={cn("w-5 h-5", category.color)} />
                            </div>
                            <CardTitle className="text-lg text-foreground">{resource.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-4">
                            {resource.tips.map((tip, index) => (
                              <li key={index}>
                                <h4 className="font-medium text-foreground text-sm flex items-center gap-2">
                                  <span className={cn(
                                    "w-5 h-5 rounded-full flex items-center justify-center text-xs",
                                    category.bgColor, category.color
                                  )}>
                                    {index + 1}
                                  </span>
                                  {tip.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1 ml-7">
                                  {tip.description}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* General Wellness Tips */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Quick Daily Practices
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Sun, title: "Morning Light", desc: "Get 15 min of sunlight after waking" },
                { icon: Wind, title: "Deep Breaths", desc: "Take 3 slow breaths when stressed" },
                { icon: Activity, title: "Move Daily", desc: "Even 10 minutes of walking helps" },
                { icon: Moon, title: "Wind Down", desc: "Start relaxing 1 hour before bed" },
              ].map((practice) => (
                <Card key={practice.title} className="bg-secondary/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <practice.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-foreground text-sm">{practice.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{practice.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">National Suicide Prevention Lifeline:</strong> 988 (US)
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Crisis Text Line:</strong> Text HOME to 741741 (US)
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">SAMHSA Helpline:</strong> 1-800-662-4357
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">International Resources:</strong>{" "}
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
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="mt-8 p-4 rounded-lg bg-muted/50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Important:</strong> These resources are for educational and self-help purposes only. 
                They are not a substitute for professional mental health treatment. If you are experiencing severe symptoms, 
                please consult with a qualified healthcare provider.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
