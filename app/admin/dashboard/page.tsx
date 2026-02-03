"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Leaf, 
  ClipboardList, 
  BookOpen, 
  Users, 
  BarChart3, 
  LogOut,
  Settings,
  FileEdit
} from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth")
    if (auth !== "true") {
      router.push("/admin/login")
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth")
    router.push("/admin/login")
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Checking authorization...</p>
      </div>
    )
  }

  const adminSections = [
    {
      title: "Assessment Questions",
      description: "Edit, add, or remove self-assessment questions and answer options",
      icon: ClipboardList,
      href: "/admin/assessments",
      stats: "8 questions"
    },
    {
      title: "Wellness Resources",
      description: "Manage tips, techniques, and educational content",
      icon: BookOpen,
      href: "/admin/resources",
      stats: "5 categories"
    },
    {
      title: "Mood Options",
      description: "Configure mood levels, emotions, and trigger categories",
      icon: FileEdit,
      href: "/admin/mood-settings",
      stats: "15 emotions, 12 triggers"
    },
    {
      title: "User Analytics",
      description: "View platform usage statistics and trends",
      icon: BarChart3,
      href: "/admin/analytics",
      stats: "Dashboard"
    },
    {
      title: "User Management",
      description: "View and manage registered users",
      icon: Users,
      href: "/admin/users",
      stats: "Manage users"
    },
    {
      title: "Platform Settings",
      description: "Configure app settings, disclaimers, and crisis resources",
      icon: Settings,
      href: "/admin/settings",
      stats: "General settings"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">MindfulMe</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              Admin
            </span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage platform content, settings, and view analytics.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-semibold text-foreground">8</p>
              <p className="text-sm text-muted-foreground">Assessment Questions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-semibold text-foreground">5</p>
              <p className="text-sm text-muted-foreground">Resource Categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-semibold text-foreground">15</p>
              <p className="text-sm text-muted-foreground">Emotion Options</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-semibold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">Trigger Categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.title} href={section.href}>
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-xs text-muted-foreground">{section.stats}</span>
                    </div>
                    <CardTitle className="text-lg text-foreground">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
