"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { restaurant, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!restaurant) {
    return null // Will redirect to login via useAuth hook
  }

  return <>{children}</>
}
