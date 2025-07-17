"use client"

import { MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="flex h-16 items-center px-4 gap-4">
            <MessageSquare className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Chat</h1>
          </div>
        </header>

        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardContent className="p-6 flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">Chat Feature</h2>
                <p className="text-muted-foreground">Chat functionality will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
