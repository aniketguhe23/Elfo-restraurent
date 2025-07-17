"use client"

import { useState } from "react"
import { Settings, Plus, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/hooks/use-auth"

export default function ProfilePage() {
  const { restaurant } = useAuth()
  const [profileData, setProfileData] = useState({
    firstName: restaurant?.name?.split(" ")[0] || "Harry",
    lastName: restaurant?.name?.split(" ")[1] || "Potter",
    phone: restaurant?.phone || "+91 8975643245",
    email: restaurant?.email || "ElfosPizzas@gmail.com",
    newPassword: "",
    confirmPassword: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveBasicInfo = () => {
    // Handle save basic information
    console.log("Saving basic info:", profileData)
  }

  const handleSavePassword = () => {
    // Handle save password
    console.log("Saving password")
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="flex h-16 items-center px-4 gap-4">
            <User className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
        </header>

        <div className="p-4 max-w-4xl mx-auto w-full">
          <div className="mb-8">
            <div className="relative h-48 bg-gray-200 rounded-lg mb-4">
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-gray-400 text-white text-2xl">HP</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 rounded-full bg-black hover:bg-gray-800 w-8 h-8"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Full Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Harry"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">&nbsp;</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Potter"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                      <span className="text-sm">🇮🇳</span>
                    </div>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="rounded-l-none"
                      placeholder="+91 8975643245"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="ElfosPizzas@gmail.com"
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveBasicInfo} className="bg-blue-500 hover:bg-blue-600">
                    Save changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => handleInputChange("newPassword", e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSavePassword} className="bg-blue-500 hover:bg-blue-600">
                    Save changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
