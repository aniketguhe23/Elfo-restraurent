"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Plus, Send, Bot, User } from "lucide-react"

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: string
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function ChatApp() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "General Chat",
      lastMessage: "Hello! How can I help you today?",
      timestamp: "2 min ago",
    },
    {
      id: "2",
      title: "Project Discussion",
      lastMessage: "Let me help you with that code...",
      timestamp: "1 hour ago",
    },
    {
      id: "3",
      title: "Quick Questions",
      lastMessage: "That makes sense, thank you!",
      timestamp: "3 hours ago",
    },
  ])
  const [activeChat, setActiveChat] = useState("1")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!res.ok) throw new Error("Failed to get AI response")

      const data = await res.json()
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + "_ai",
        role: "assistant",
        content: data.reply,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      lastMessage: "Start a new conversation...",
      timestamp: "now",
    }
    setChatSessions([newChat, ...chatSessions])
    setActiveChat(newChat.id)
    setMessages([])
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
            </div>
            <Button onClick={createNewChat} size="sm" variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {chatSessions.map((chat) => (
              <Card
                key={chat.id}
                className={`mb-2 cursor-pointer transition-colors hover:bg-gray-50 ${
                  activeChat === chat.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setActiveChat(chat.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <MessageCircle className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 truncate">{chat.title}</h3>
                      <p className="text-xs text-gray-500 truncate mt-1">{chat.lastMessage}</p>
                      <p className="text-xs text-gray-400 mt-1">{chat.timestamp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Side - Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-green-100 text-green-600">
                <Bot className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900">Almaash Alam</h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chat Feature</h3>
                <p className="text-gray-500">Start a conversation</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
