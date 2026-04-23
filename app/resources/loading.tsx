import { Navigation } from "@/components/navigation"

export default function ResourcesLoading() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background pt-14 md:pt-16 flex items-center justify-center">
        <p className="text-muted-foreground">Loading resources...</p>
      </div>
    </>
  )
}
