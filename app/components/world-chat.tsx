"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { databases, account, DATABASE_ID, COLLECTION_ID_MESSAGES } from "@/lib/appwrite"
import { client } from "@/lib/appwrite"
import { ID, Query } from "appwrite"

interface Message {
  $id: string
  senderName: string
  messageContent: string
  timestamp: string
  senderId: string
}

interface WorldChatProps {
  isOpen: boolean
  onClose: () => void
}

export default function WorldChat({ isOpen, onClose }: WorldChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Authenticate anonymous user or get current user
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const user = await account.get()
        setCurrentUser({ id: user.$id, name: user.name || "Anonymous" })
      } catch (error) {
        // If no user is logged in, create an anonymous session
        try {
          const newSession = await account.createAnonymousSession()
          const user = await account.get() // Get user details after creating session
          setCurrentUser({ id: user.$id, name: user.name || `Guest-${user.$id.substring(0, 4)}` })
        } catch (anonError) {
          console.error("Failed to create anonymous session:", anonError)
        }
      } finally {
        setIsLoading(false)
      }
    }
    authenticateUser()
  }, [])

  // Fetch initial messages and subscribe to real-time updates
  useEffect(() => {
    if (!currentUser) return

    const fetchMessages = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID_MESSAGES,
          [Query.orderDesc("timestamp"), Query.limit(50)], // Fetch latest 50 messages
        )
        // @ts-nocheck
        setMessages(response.documents.reverse() as Message[]) // Reverse to show oldest first
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }

    fetchMessages()

    // Subscribe to real-time updates using client.subscribe()
    // Replace the existing subscription code (lines 76-87) with:
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      (response) => {
        if (response.events.includes("databases.*.collections.*.documents.*.create")) {
          const newMessage = response.payload as Message;
          setMessages((prevMessages) => {
            // Check if message already exists to prevent duplicates
            if (!prevMessages.find(msg => msg.$id === newMessage.$id)) {
              return [...prevMessages, newMessage];
            }
            return prevMessages;
          });
        }
      }
    );

    return () => {
      unsubscribe() // Clean up subscription on unmount
    }
  }, [currentUser]) // Re-run when currentUser changes

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || !currentUser) return

    try {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, ID.unique(), {
        senderId: 5446767,
        senderName: "Justine",
        messageContent: [inputMessage.trim()],
        timestamp: new Date().toISOString(),
      })
      setInputMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 right-4 w-80 h-[400px] ios-glass-card rounded-2xl flex flex-col z-50"
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> World Chat
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:bg-white/20 w-8 h-8 rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              <div className="text-white/60 text-center mt-8">Loading messages...</div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.$id}
                    className={`flex ${msg.senderId === currentUser?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-2 rounded-lg max-w-[75%] ${
                        msg.senderId === currentUser?.id ? "bg-blue-500 text-white" : "bg-white/10 text-white"
                      }`}
                    >
                      <p className="text-xs font-bold mb-1">
                        {msg.senderId === currentUser?.id ? "You" : msg.senderName}
                      </p>
                      <p className="text-sm">{msg.messageContent}</p>
                      <p className="text-white/60 text-xs mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30"
              disabled={!currentUser}
            />
            <Button
              type="submit"
              size="icon"
              className="bg-white/20 hover:bg-white/30 text-white"
              disabled={!currentUser}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
