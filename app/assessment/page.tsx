"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { ArrowLeft, ArrowRight, Brain, CloudRain, Moon, Zap, Users, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const assessmentTypes = [
  {
    id: "stress-anxiety",
    title: "Stress & Anxiety",
    description: "Evaluate your current stress levels and anxiety symptoms",
    icon: Zap,
    duration: "3-5 min",
    questions: [
      { id: 1, text: "Over the past two weeks, how often have you felt nervous, anxious, or on edge?" },
      { id: 2, text: "How often have you had trouble relaxing?" },
      { id: 3, text: "How often have you been easily annoyed or irritable?" },
      { id: 4, text: "How often have you felt afraid, as if something awful might happen?" },
      { id: 5, text: "How often have you had difficulty concentrating due to worry?" },
      { id: 6, text: "How often have you experienced physical symptoms of anxiety (racing heart, sweating)?" },
      { id: 7, text: "How often have you felt overwhelmed by your responsibilities?" },
    ],
  },
  {
    id: "depression",
    title: "Depression",
    description: "Assess symptoms related to mood and depression",
    icon: CloudRain,
    duration: "3-5 min",
    questions: [
      { id: 1, text: "Over the past two weeks, how often have you felt down, depressed, or hopeless?" },
      { id: 2, text: "How often have you had little interest or pleasure in doing things?" },
      { id: 3, text: "How often have you felt tired or had little energy?" },
      { id: 4, text: "How often have you felt bad about yourself or felt like a failure?" },
      { id: 5, text: "How often have you had trouble concentrating on things?" },
      { id: 6, text: "How often have you had thoughts that you would be better off not being here?" },
      { id: 7, text: "How often have you felt isolated or disconnected from others?" },
    ],
  },
  {
    id: "sleep-quality",
    title: "Sleep Quality",
    description: "Understand your sleep patterns and quality",
    icon: Moon,
    duration: "2-3 min",
    questions: [
      { id: 1, text: "Over the past two weeks, how often have you had trouble falling asleep?" },
      { id: 2, text: "How often have you woken up in the middle of the night or early morning?" },
      { id: 3, text: "How often have you felt unrested after a full night's sleep?" },
      { id: 4, text: "How often have you felt sleepy during the day?" },
      { id: 5, text: "How often have you relied on caffeine or other substances to stay awake?" },
      { id: 6, text: "How often have worrying thoughts kept you awake?" },
    ],
  },
  {
    id: "burnout",
    title: "Burnout",
    description: "Check for signs of work-related exhaustion",
    icon: Brain,
    duration: "3-4 min",
    questions: [
      { id: 1, text: "How often do you feel emotionally drained from your work or responsibilities?" },
      { id: 2, text: "How often do you feel used up at the end of the day?" },
      { id: 3, text: "How often do you feel fatigued when you get up and face another day?" },
      { id: 4, text: "How often do you feel like you're not making a meaningful contribution?" },
      { id: 5, text: "How often do you feel cynical or detached about your work?" },
      { id: 6, text: "How often do you struggle to feel motivated to complete tasks?" },
      { id: 7, text: "How often do you find yourself dreading going to work?" },
    ],
  },
  {
    id: "social-wellbeing",
    title: "Social Wellbeing",
    description: "Evaluate your social connections and support",
    icon: Users,
    duration: "2-3 min",
    questions: [
      { id: 1, text: "How often do you feel lonely or isolated?" },
      { id: 2, text: "How often do you feel you lack companionship?" },
      { id: 3, text: "How often do you feel left out?" },
      { id: 4, text: "How often do you feel that there are people you can talk to?" },
      { id: 5, text: "How often do you feel that there are people who understand you?" },
      { id: 6, text: "How often do you feel supported by friends or family?" },
    ],
  },
  {
    id: "self-esteem",
    title: "Self-Esteem",
    description: "Assess your self-worth and confidence levels",
    icon: Heart,
    duration: "2-3 min",
    questions: [
      { id: 1, text: "How often do you feel that you have a number of good qualities?" },
      { id: 2, text: "How often do you feel that you are a person of worth?" },
      { id: 3, text: "How often do you feel that you are able to do things as well as others?" },
      { id: 4, text: "How often do you take a positive attitude toward yourself?" },
      { id: 5, text: "How often do you feel satisfied with yourself?" },
      { id: 6, text: "How often do you feel confident in your abilities?" },
    ],
  },
]

const answerOptions = [
  { value: 1, label: "Not at all" },
  { value: 2, label: "Several days" },
  { value: 3, label: "More than half the days" },
  { value: 4, label: "Nearly every day" },
]

export default function AssessmentPage() {
  const router = useRouter()
  const [selectedAssessment, setSelectedAssessment] = useState<typeof assessmentTypes[0] | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const questions = selectedAssessment?.questions || []
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0
  const currentAnswer = questions[currentQuestion] ? answers[questions[currentQuestion].id] : undefined
  const canGoNext = currentAnswer !== undefined
  const isLastQuestion = currentQuestion === questions.length - 1
  const allAnswered = questions.every(q => answers[q.id] !== undefined)

  const handleSelectAssessment = (assessment: typeof assessmentTypes[0]) => {
    setSelectedAssessment(assessment)
    setCurrentQuestion(0)
    setAnswers({})
  }

  const handleBackToSelection = () => {
    setSelectedAssessment(null)
    setCurrentQuestion(0)
    setAnswers({})
  }

  const handleAnswer = (value: number) => {
    if (!questions[currentQuestion]) return
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!selectedAssessment) return
    setIsSubmitting(true)
    
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0)
    
    sessionStorage.setItem("assessmentResults", JSON.stringify({
      assessmentType: selectedAssessment.id,
      assessmentTitle: selectedAssessment.title,
      answers,
      totalScore,
      maxScore: questions.length * 4,
      completedAt: new Date().toISOString()
    }))
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    router.push("/assessment/results")
  }

  // Test Selection Screen
  if (!selectedAssessment) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background pt-14 md:pt-16">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                Self-Assessment
              </h1>
              <p className="mt-2 text-muted-foreground">
                Choose an assessment to learn more about your mental well-being. All assessments are confidential and for self-awareness purposes only.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
              {assessmentTypes && assessmentTypes.length > 0 ? (
                assessmentTypes.map((assessment) => {
                  const Icon = assessment.icon
                  return (
                    <button
                      key={assessment.id}
                      onClick={() => handleSelectAssessment(assessment)}
                      className="text-left"
                    >
                      <Card className="h-full cursor-pointer transition-all border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 group">
                        <CardHeader className="pb-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg text-foreground">
                            {assessment.title}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {assessment.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between text-sm mb-4">
                            <span className="text-muted-foreground">
                              {assessment.questions.length} questions
                            </span>
                            <span className="text-muted-foreground">
                              {assessment.duration}
                            </span>
                          </div>
                          <Button className="w-full gap-2" variant="outline">
                            Start Assessment
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </button>
                  )
                })
              ) : (
                <p className="text-muted-foreground col-span-full">No assessments available</p>
              )}
            </div>

            <p className="mt-8 text-xs text-muted-foreground text-center">
              These assessments are not diagnostic tools and should not replace professional medical advice. 
              If you have concerns about your mental health, please consult a qualified healthcare provider.
            </p>
          </div>
        </div>
      </>
    )
  }

  // Question Screen
  const Icon = selectedAssessment.icon

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-14 md:pt-16">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToSelection}
              className="gap-2 -ml-2 mb-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to assessments
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-foreground">
                  {selectedAssessment.title} Assessment
                </h1>
                <p className="text-sm text-muted-foreground">
                  Answer each question honestly. There are no right or wrong answers.
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground leading-relaxed">
                {questions[currentQuestion]?.text}
              </CardTitle>
              <CardDescription>
                Select the option that best describes your experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {answerOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={cn(
                      "w-full p-4 rounded-lg border text-left transition-all",
                      currentAnswer === option.value
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                        currentAnswer === option.value
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      )}>
                        {currentAnswer === option.value && (
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="gap-2 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? "Processing..." : "View Results"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canGoNext}
                className="gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Question Indicators */}
          <div className="mt-8 flex justify-center gap-2 flex-wrap">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-colors",
                  index === currentQuestion
                    ? "bg-primary"
                    : answers[q.id] !== undefined
                    ? "bg-primary/40"
                    : "bg-border"
                )}
                aria-label={`Go to question ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
