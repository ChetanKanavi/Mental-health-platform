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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Leaf, 
  ArrowLeft, 
  Plus, 
  Pencil, 
  Trash2,
  Save,
  X
} from "lucide-react"

interface Resource {
  id: number
  title: string
  description: string
  tips: string[]
}

const defaultResources: Resource[] = [
  {
    id: 1,
    title: "Breathing Exercises",
    description: "Simple techniques to calm your mind and reduce anxiety in moments of stress.",
    tips: [
      "4-7-8 Breathing: Inhale for 4 counts, hold for 7, exhale for 8",
      "Box Breathing: Equal counts of 4 for inhale, hold, exhale, hold",
      "Diaphragmatic breathing: Focus on belly expansion"
    ]
  },
  {
    id: 2,
    title: "Mindfulness Practices",
    description: "Grounding techniques to help you stay present and centered.",
    tips: [
      "5-4-3-2-1 Technique: Notice 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste",
      "Body scan meditation: Slowly focus attention on each part of your body",
      "Mindful walking: Pay attention to each step and your surroundings"
    ]
  },
  {
    id: 3,
    title: "Journaling Prompts",
    description: "Reflective questions to help process emotions and gain clarity.",
    tips: [
      "What am I grateful for today?",
      "What emotions did I experience and what triggered them?",
      "What would I tell a friend in my situation?"
    ]
  },
  {
    id: 4,
    title: "Self-Care Ideas",
    description: "Simple activities to nurture your mental and emotional well-being.",
    tips: [
      "Take a short walk in nature",
      "Listen to calming music or sounds",
      "Connect with a supportive friend or family member"
    ]
  },
  {
    id: 5,
    title: "Sleep Hygiene",
    description: "Tips for better rest and improved mental health.",
    tips: [
      "Keep a consistent sleep schedule",
      "Create a relaxing bedtime routine",
      "Limit screen time before bed"
    ]
  }
]

export default function AdminResourcesPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [resources, setResources] = useState<Resource[]>(defaultResources)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  
  const [newResource, setNewResource] = useState<Omit<Resource, "id">>({
    title: "",
    description: "",
    tips: [""]
  })

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth")
    if (auth !== "true") {
      router.push("/admin/login")
    } else {
      setIsAuthorized(true)
      const savedResources = sessionStorage.getItem("adminResources")
      if (savedResources) {
        setResources(JSON.parse(savedResources))
      }
    }
  }, [router])

  const handleAddResource = () => {
    if (!newResource.title.trim() || !newResource.description.trim()) return
    const resource: Resource = {
      id: Math.max(...resources.map(r => r.id), 0) + 1,
      title: newResource.title.trim(),
      description: newResource.description.trim(),
      tips: newResource.tips.filter(t => t.trim())
    }
    setResources([...resources, resource])
    setNewResource({ title: "", description: "", tips: [""] })
    setIsAddDialogOpen(false)
  }

  const handleEditResource = () => {
    if (!editingResource) return
    setResources(resources.map(r => 
      r.id === editingResource.id ? editingResource : r
    ))
    setEditingResource(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteResource = (id: number) => {
    setResources(resources.filter(r => r.id !== id))
  }

  const handleAddTip = (isNew: boolean) => {
    if (isNew) {
      setNewResource(prev => ({ ...prev, tips: [...prev.tips, ""] }))
    } else if (editingResource) {
      setEditingResource(prev => prev ? { ...prev, tips: [...prev.tips, ""] } : null)
    }
  }

  const handleUpdateTip = (index: number, value: string, isNew: boolean) => {
    if (isNew) {
      const updated = [...newResource.tips]
      updated[index] = value
      setNewResource(prev => ({ ...prev, tips: updated }))
    } else if (editingResource) {
      const updated = [...editingResource.tips]
      updated[index] = value
      setEditingResource(prev => prev ? { ...prev, tips: updated } : null)
    }
  }

  const handleRemoveTip = (index: number, isNew: boolean) => {
    if (isNew) {
      setNewResource(prev => ({ 
        ...prev, 
        tips: prev.tips.filter((_, i) => i !== index) 
      }))
    } else if (editingResource) {
      setEditingResource(prev => prev ? { 
        ...prev, 
        tips: prev.tips.filter((_, i) => i !== index) 
      } : null)
    }
  }

  const handleSaveAll = async () => {
    setIsSaving(true)
    sessionStorage.setItem("adminResources", JSON.stringify(resources))
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

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Wellness Resources
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage tips, techniques, and educational content.
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Resource Category</DialogTitle>
                <DialogDescription>
                  Create a new category with tips and techniques.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-title">Title</Label>
                  <Input
                    id="new-title"
                    value={newResource.title}
                    onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Stress Management"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-desc">Description</Label>
                  <Textarea
                    id="new-desc"
                    value={newResource.description}
                    onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this category..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tips / Techniques</Label>
                  <div className="space-y-2">
                    {newResource.tips.map((tip, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={tip}
                          onChange={(e) => handleUpdateTip(index, e.target.value, true)}
                          placeholder="Enter a tip..."
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveTip(index, true)}
                          className="shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddTip(true)}
                    className="gap-2 bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                    Add Tip
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-transparent">
                  Cancel
                </Button>
                <Button onClick={handleAddResource}>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Resources List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Resource Categories</CardTitle>
            <CardDescription>
              {resources.length} categories with {resources.reduce((acc, r) => acc + r.tips.length, 0)} total tips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {resources.map((resource) => (
                <AccordionItem key={resource.id} value={`resource-${resource.id}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <span className="font-medium text-foreground">{resource.title}</span>
                      <span className="text-xs text-muted-foreground">
                        ({resource.tips.length} tips)
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                      <ul className="space-y-2">
                        {resource.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingResource(resource)
                            setIsEditDialogOpen(true)
                          }}
                          className="gap-2 bg-transparent"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteResource(resource.id)}
                          className="gap-2 text-destructive hover:text-destructive bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Resource Category</DialogTitle>
              <DialogDescription>
                Update the category details and tips.
              </DialogDescription>
            </DialogHeader>
            {editingResource && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingResource.title}
                    onChange={(e) => setEditingResource(prev => 
                      prev ? { ...prev, title: e.target.value } : null
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-desc">Description</Label>
                  <Textarea
                    id="edit-desc"
                    value={editingResource.description}
                    onChange={(e) => setEditingResource(prev => 
                      prev ? { ...prev, description: e.target.value } : null
                    )}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tips / Techniques</Label>
                  <div className="space-y-2">
                    {editingResource.tips.map((tip, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={tip}
                          onChange={(e) => handleUpdateTip(index, e.target.value, false)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveTip(index, false)}
                          className="shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddTip(false)}
                    className="gap-2 bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                    Add Tip
                  </Button>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleEditResource}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
