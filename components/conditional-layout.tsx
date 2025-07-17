"use client"

import type React from "react"
import { useAuth } from "@/hooks/use-auth"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Loader2 } from "lucide-react"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const { restaurant, isLoading } = useAuth()
  const pathname = usePathname()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // If user is authenticated and not on login page, show sidebar layout
  if (restaurant && pathname !== "/login") {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    )
  }

  // For login page or unauthenticated users, show full-width layout
  return <div className="min-h-screen">{children}</div>
}
