"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface Restaurant {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
}

interface AuthContextType {
  restaurant: Restaurant | null
  login: (restaurant: Restaurant) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for stored authentication data on mount
    const storedRestaurant = localStorage.getItem("restaurant")
    if (storedRestaurant) {
      try {
        setRestaurant(JSON.parse(storedRestaurant))
      } catch (error) {
        localStorage.removeItem("restaurant")
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      if (!restaurant && pathname !== "/login") {
        router.push("/login")
      } else if (restaurant && pathname === "/login") {
        router.push("/")
      }
    }
  }, [restaurant, isLoading, pathname, router])

  const login = (restaurantData: Restaurant) => {
    setRestaurant(restaurantData)
    localStorage.setItem("restaurant", JSON.stringify(restaurantData))
  }

  const logout = () => {
    setRestaurant(null)
    localStorage.removeItem("restaurant")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ restaurant, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
