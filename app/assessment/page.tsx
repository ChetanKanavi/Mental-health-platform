"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const questions = [
  {
    id: 1,
    text: "Over the past two weeks, how often have you felt nervous, anxious, or on edge?",
  },
  {
    id: 2,
    text: "How often have you had trouble relaxing?",
  },
  {
    id: 3,
    text: "How often have you felt overwhelmed by your daily responsibilities?",
  },
  {
    id: 4,
    text: "How often have you had difficulty concentrating on tasks?",
  },
  {
    id: 5,
    text: "How often have you felt tired or had little energy?",
  },
  {
    id: 6,
    text: "How often have you had trouble falling or staying asleep?",
  },
  {
    id: 7,
    text: "How often have you felt down, depressed, or hopeless?",
  },
  {
    id: 8,
    text: "How often have you felt irritable or easily annoyed?",
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
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentAnswer = answers[questions[currentQuestion].id]
  const canGoNext = currentAnswer !== undefined
  const isLastQuestion = currentQuestion === questions.length - 1
  const allAnswered = questions.every(q => answers[q.id] !== undefined)

  const handleAnswer = (value: number) => {
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
    setIsSubmitting(true)
    
    // Calculate total score
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0)
    
    // Store results in sessionStorage for the results page
    sessionStorage.setItem("assessmentResults", JSON.stringify({
      answers,
      totalScore,
      maxScore: questions.length * 4,
      completedAt: new Date().toISOString()
    }))
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 500))
    
    router.push("/assessment/results")
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-14 md:pt-16">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Self-Assessment
            </h1>
            <p className="mt-2 text-muted-foreground">
              Answer each question honestly. There are no right or wrong answers.
            </p>
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
                {questions[currentQuestion].text}
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
          <div className="mt-8 flex justify-center gap-2">
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
