"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { BookOpen, Phone, Heart, Brain, Sun, Moon } from "lucide-react"

const resources = [
  {
    title: "Breathing Exercises",
    description: "Simple techniques to calm your mind and reduce anxiety in moments of stress.",
    icon: Sun,
    tips: [
      "4-7-8 Breathing: Inhale for 4 counts, hold for 7, exhale for 8",
      "Box Breathing: Equal counts of 4 for inhale, hold, exhale, hold",
      "Diaphragmatic breathing: Focus on belly expansion"
    ]
  },
  {
    title: "Mindfulness Practices",
    description: "Grounding techniques to help you stay present and centered.",
    icon: Brain,
    tips: [
      "5-4-3-2-1 Technique: Notice 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste",
      "Body scan meditation: Slowly focus attention on each part of your body",
      "Mindful walking: Pay attention to each step and your surroundings"
    ]
  },
  {
    title: "Journaling Prompts",
    description: "Reflective questions to help process emotions and gain clarity.",
    icon: BookOpen,
    tips: [
      "What am I grateful for today?",
      "What emotions did I experience and what triggered them?",
      "What would I tell a friend in my situation?"
    ]
  },
  {
    title: "Self-Care Ideas",
    description: "Simple activities to nurture your mental and emotional well-being.",
    icon: Heart,
    tips: [
      "Take a short walk in nature",
      "Listen to calming music or sounds",
      "Connect with a supportive friend or family member"
    ]
  },
  {
    title: "Sleep Hygiene",
    description: "Tips for better rest and improved mental health.",
    icon: Moon,
    tips: [
      "Keep a consistent sleep schedule",
      "Create a relaxing bedtime routine",
      "Limit screen time before bed"
    ]
  }
]

export default function ResourcesPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-14 md:pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Wellness Resources
            </h1>
            <p className="mt-2 text-muted-foreground">
              Helpful techniques and practices for your mental well-being journey.
            </p>
          </div>

          <div className="grid gap-6">
            {resources.map((resource) => {
              const Icon = resource.icon
              return (
                <Card key={resource.title}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-foreground">{resource.title}</CardTitle>
                        <CardDescription className="mt-1">{resource.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resource.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>

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
