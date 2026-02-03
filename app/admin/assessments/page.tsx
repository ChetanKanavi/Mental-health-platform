"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Leaf, 
  ArrowLeft, 
  Plus, 
  Pencil, 
  Trash2,
  GripVertical,
  Save
} from "lucide-react"

interface Question {
  id: number
  text: string
}

const defaultQuestions: Question[] = [
  { id: 1, text: "Over the past two weeks, how often have you felt nervous, anxious, or on edge?" },
  { id: 2, text: "How often have you had trouble relaxing?" },
  { id: 3, text: "How often have you felt overwhelmed by your daily responsibilities?" },
  { id: 4, text: "How often have you had difficulty concentrating on tasks?" },
  { id: 5, text: "How often have you felt tired or had little energy?" },
  { id: 6, text: "How often have you had trouble falling or staying asleep?" },
  { id: 7, text: "How often have you felt down, depressed, or hopeless?" },
  { id: 8, text: "How often have you felt irritable or easily annoyed?" },
]

const defaultAnswerOptions = [
  { value: 1, label: "Not at all" },
  { value: 2, label: "Several days" },
  { value: 3, label: "More than half the days" },
  { value: 4, label: "Nearly every day" },
]

export default function AdminAssessmentsPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions)
  const [answerOptions, setAnswerOptions] = useState(defaultAnswerOptions)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [newQuestionText, setNewQuestionText] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth")
    if (auth !== "true") {
      router.push("/admin/login")
    } else {
      setIsAuthorized(true)
      // Load saved questions if available
      const savedQuestions = sessionStorage.getItem("adminQuestions")
      if (savedQuestions) {
        setQuestions(JSON.parse(savedQuestions))
      }
      const savedAnswers = sessionStorage.getItem("adminAnswerOptions")
      if (savedAnswers) {
        setAnswerOptions(JSON.parse(savedAnswers))
      }
    }
  }, [router])

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return
    const newQuestion: Question = {
      id: Math.max(...questions.map(q => q.id), 0) + 1,
      text: newQuestionText.trim()
    }
    setQuestions([...questions, newQuestion])
    setNewQuestionText("")
    setIsAddDialogOpen(false)
  }

  const handleEditQuestion = () => {
    if (!editingQuestion || !editingQuestion.text.trim()) return
    setQuestions(questions.map(q => 
      q.id === editingQuestion.id ? editingQuestion : q
    ))
    setEditingQuestion(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const handleUpdateAnswerOption = (index: number, label: string) => {
    const updated = [...answerOptions]
    updated[index] = { ...updated[index], label }
    setAnswerOptions(updated)
  }

  const handleSaveAll = async () => {
    setIsSaving(true)
    // Save to sessionStorage (in production, this would be an API call)
    sessionStorage.setItem("adminQuestions", JSON.stringify(questions))
    sessionStorage.setItem("adminAnswerOptions", JSON.stringify(answerOptions))
    await new Promise(resolve => setTimeout(resolve, 500))
    setSaveMessage("Changes saved successfully!")
    setIsSaving(false)
    setTimeout(() => setSaveMessage(""), 3000)
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Checking authorization...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">MindfulMe</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                Admin
              </span>
            </Link>
          </div>
          <Button onClick={handleSaveAll} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          href="/admin/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {saveMessage && (
          <div className="mb-6 p-3 rounded-lg bg-primary/10 text-primary text-sm">
            {saveMessage}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Assessment Questions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Edit, add, or remove self-assessment questions.
          </p>
        </div>

        {/* Answer Options Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Answer Options</CardTitle>
            <CardDescription>
              Configure the Likert scale options that apply to all questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {answerOptions.map((option, index) => (
                <div key={option.value} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                    {option.value}
                  </span>
                  <Input
                    value={option.label}
                    onChange={(e) => handleUpdateAnswerOption(index, e.target.value)}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">Questions</CardTitle>
              <CardDescription>
                {questions.length} questions in the assessment
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Question</DialogTitle>
                  <DialogDescription>
                    Enter the question text. It will be added to the end of the assessment.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-question">Question Text</Label>
                    <Textarea
                      id="new-question"
                      placeholder="Enter your question here..."
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-transparent">
                    Cancel
                  </Button>
                  <Button onClick={handleAddQuestion}>Add Question</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div 
                  key={question.id}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GripVertical className="w-4 h-4 cursor-grab" />
                    <span className="text-sm font-medium w-6">{index + 1}.</span>
                  </div>
                  <p className="flex-1 text-sm text-foreground">{question.text}</p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingQuestion(question)
                        setIsEditDialogOpen(true)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
              <DialogDescription>
                Update the question text below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-question">Question Text</Label>
                <Textarea
                  id="edit-question"
                  value={editingQuestion?.text || ""}
                  onChange={(e) => setEditingQuestion(prev => 
                    prev ? { ...prev, text: e.target.value } : null
                  )}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleEditQuestion}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
