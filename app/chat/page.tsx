"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import socket from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Plus, Send, Bot, User } from "lucide-react";
import ProjectApiList from "../api/ProjectApiList";

interface ChatSession {
  user_id: string;
  name: string;
  last_message: string;
  last_message_time: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "restaurant";
  content: string;
}

export default function ChatApp() {
  const {
    apigetChatsRestConversations,
    apigetChatsRestMessages,
    apipostChatsRestMessages,
  } = ProjectApiList();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChat, setActiveChat] = useState<string>("default");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [restaurants_no, setResturant_no] = useState<any>("");
  const [restaurantLoading, setRestaurantLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("restaurant");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed?.restaurants_no) {
          setResturant_no(parsed.restaurants_no);
        }
      }
    } catch (error) {
      console.error("Error parsing localStorage restaurant:", error);
    } finally {
      setRestaurantLoading(false);
    }
  }, []);

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("join_room", { userID, restaurants_no });
    });

    socket.on("message_received", (data: any) => {
      if (data.sender_id !== userID) {
        const msg: ChatMessage = {
          id: data._id,
          role: "restaurant",
          content: data.message,
        };
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchConversations();
    fetchMessages();
  }, [userID, restaurants_no]);

  const fetchConversations = async () => {
    const res = await axios.get(
      `${apigetChatsRestConversations}/${restaurants_no}`
    );
    const data = res.data.data;
    setChatSessions(data);
  };

  const fetchMessages = async () => {
    const res = await axios.get(
      `${apigetChatsRestMessages}?userId=${userID}&restaurantId=${restaurants_no}`
    );
    const data = res.data.data;

    const formatted: ChatMessage[] = data.map((msg: any) => ({
      id: msg._id,
      role: msg.sender_type === "user" ? "user" : "restaurant",
      content: msg.message,
    }));
    setMessages(formatted);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const payload = {
      sender_type: "restaurant",
      sender_id: restaurants_no,
      receiver_type: "user",
      receiver_id: userID,
      message: input,
    };

    try {
      const res = await axios.post(apipostChatsRestMessages, payload);
      socket.emit("send_message", res.data);
      fetchMessages();
    } catch (err) {
      console.error("Sending failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {chatSessions.map((chat) => (
              <Card
                key={chat.user_id}
                className={`mb-2 cursor-pointer w-[300px] ${
                  activeChat === chat.user_id
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : ""
                }`}
                onClick={() => {
                  setActiveChat(chat.user_id),
                    setUserID(chat.user_id),
                    setUserName(chat.name);
                }}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <MessageCircle className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 truncate">
                        {chat.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {chat.last_message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {chat.last_message_time.split(" ")[0]}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Right */}
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
              <h2 className="font-semibold text-gray-900">{userName}</h2>
              {/* <p className="text-sm text-gray-500">Online</p> */}
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center text-center text-gray-500 py-20">
                <MessageCircle className="w-10 h-10 mb-4 text-gray-400" />
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Select a user to start chatting
                </p>
              </div>
            ) : (
              <>
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "restaurant"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {/* Show avatar for user (left side) */}
                    {message.role === "user" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === "restaurant"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>

                    {/* Show avatar for restaurant (right side) */}
                    {message.role === "restaurant" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        {/* Input Box */}
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
  );
}
