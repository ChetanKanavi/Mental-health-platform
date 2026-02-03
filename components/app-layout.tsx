"use client"

import React from "react"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/" || pathname === "/login" || pathname === "/signup"

  return (
    <>
      <Navigation />
      <main className={isAuthPage ? "" : "pt-14 md:pt-16"}>
        {children}
      </main>
    </>
  )
}
