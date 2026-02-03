import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Heart, BarChart3, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">MindfulMe</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-16">
        <section className="px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight text-balance">
              Your journey to better mental wellness starts here
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              A calm, supportive space for self-reflection, mood tracking, and personal growth. 
              Understand yourself better, one day at a time.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start your journey
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-16 bg-card">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-foreground mb-12">
              Tools for your well-being
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Mood Tracking</h3>
                <p className="text-muted-foreground">
                  Log your daily emotions and journal your thoughts in a private, secure space.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Self-Assessment</h3>
                <p className="text-muted-foreground">
                  Take gentle assessments to understand your stress and anxiety levels better.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Private & Secure</h3>
                <p className="text-muted-foreground">
                  Your data is yours alone. We prioritize your privacy and never share your information.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Important:</strong> MindfulMe is designed for self-awareness 
              and personal reflection only. It does not provide medical diagnoses or treatment recommendations. 
              If you are experiencing a mental health crisis, please reach out to a qualified healthcare 
              professional or contact a crisis helpline in your area.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">MindfulMe</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Created with care for your well-being.
          </p>
        </div>
      </footer>
    </div>
  )
}
