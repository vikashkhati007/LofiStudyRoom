"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, X, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { databases, client, DATABASE_ID, COLLECTION_ID_MESSAGES } from "@/lib/appwrite"
import { ID, Query } from "appwrite"

interface Message {
  $id: string
  senderName: string
  messageContent: string
  timestamp: string
  senderId: string // Ensure this is string
}

interface WorldChatProps {
  isOpen: boolean
  onClose: () => void
  onNewMessage?: (message: Message) => void
}

// Fun adjectives and nouns for generating usernames
const adjectives = [
  "Chill", "Cozy", "Dreamy", "Mellow", "Peaceful", "Serene", "Calm", "Zen", "Smooth", "Soft",
  "Warm", "Cool", "Misty", "Cloudy", "Starry", "Lunar", "Solar", "Ocean", "Forest", "Mountain"
]

const nouns = [
  "Panda", "Cat", "Fox", "Owl", "Bear", "Wolf", "Deer", "Rabbit", "Turtle", "Dolphin",
  "Leaf", "Cloud", "Star", "Moon", "Wave", "Breeze", "Rain", "Snow", "Fire", "Stone"
]

const generateUsername = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const number = Math.floor(Math.random() * 999) + 1
  return `${adjective}${noun}${number}`
}

const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export default function WorldChat({ isOpen, onClose, onNewMessage }: WorldChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const processedMessageIds = useRef<Set<string>>(new Set()) // Track processed messages

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Initialize user (get from localStorage or create new)
  useEffect(() => {
    const initializeUser = () => {
      try {
        const storedUser = localStorage.getItem('lofi_chat_user')
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setCurrentUser(userData)
        } else {
          const newUser = {
            id: generateUserId(),
            name: generateUsername()
          }
          localStorage.setItem('lofi_chat_user', JSON.stringify(newUser))
          setCurrentUser(newUser)
        }
      } catch (error) {
        console.error("Error initializing user:", error)
        // Fallback if localStorage fails
        const fallbackUser = {
          id: generateUserId(),
          name: generateUsername()
        }
        setCurrentUser(fallbackUser)
      } finally {
        setIsLoading(false)
      }
    }

    initializeUser()
  }, [])

  // Generate new username
  const regenerateUsername = () => {
    if (!currentUser) return
    
    const newUser = {
      ...currentUser,
      name: generateUsername()
    }
    
    try {
      localStorage.setItem('lofi_chat_user', JSON.stringify(newUser))
      setCurrentUser(newUser)
    } catch (error) {
      console.error("Error saving new username:", error)
      setCurrentUser(newUser) // Still update in memory even if localStorage fails
    }
  }

  // Fetch initial messages and subscribe to real-time updates
  useEffect(() => {
    if (!currentUser) return

    const fetchMessages = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID_MESSAGES,
          [Query.orderDesc("timestamp"), Query.limit(50)] // Fetch latest 50 messages
        )
      {/* @ts-ignore */}
        const initialMessages = response.documents.reverse() as Message[]
        setMessages(initialMessages)
        
        // Mark initial messages as processed to avoid duplicate notifications
        initialMessages.forEach(msg => {
          processedMessageIds.current.add(msg.$id)
        })
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }

    fetchMessages()

    // Subscribe to real-time updates
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      (response) => {
        if (response.events.includes("databases.*.collections.*.documents.*.create")) {
          const newMessage = response.payload as Message
          
          // Check if we've already processed this message
          if (processedMessageIds.current.has(newMessage.$id)) {
            console.log("Duplicate message detected, skipping:", newMessage.$id)
            return
          }
          
          // Mark message as processed
          processedMessageIds.current.add(newMessage.$id)
          
          setMessages((prevMessages) => {
            // Double-check for duplicates in the messages array
            if (prevMessages.find(msg => msg.$id === newMessage.$id)) {
              console.log("Message already exists in array, skipping:", newMessage.$id)
              return prevMessages
            }
            
            // Only trigger notification callback for messages from other users
             if (newMessage.senderId !== currentUser.id && onNewMessage) {
              console.log("Triggering notification for message:", newMessage.$id, "from:", newMessage.senderName)
              onNewMessage(newMessage)
            }
            
            return [...prevMessages, newMessage]
          })
        }
      }
    )

    return () => {
      unsubscribe() // Clean up subscription on unmount
    }
  }, [currentUser, onNewMessage])

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || !currentUser) return

    try {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, ID.unique(), {
        senderId: currentUser.id, // Remove parseInt to keep it as string
        senderName: currentUser.name,
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
          className="fixed bottom-10 right-4 w-80 h-[400px] ios-glass-card rounded-2xl flex flex-col z-50"
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

          {/* User info bar */}
          <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
            <span className="text-white/80 text-sm">You: {currentUser?.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:bg-white/20 w-6 h-6 rounded-full"
              onClick={regenerateUsername}
              title="Generate new username"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              <div className="text-white/60 text-center mt-8">Loading messages...</div>
            ) : (
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="text-white/60 text-center mt-8">
                    <p>No messages yet.</p>
                    <p className="text-xs mt-1">Be the first to say hello! 👋</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.$id}
                      className={`flex ${msg.senderId === currentUser?.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`p-2 rounded-lg max-w-[75%] ${
                          msg.senderId === currentUser?.id 
                            ? "bg-blue-500/80 text-white" 
                            : "bg-white/10 text-white"
                        }`}
                      >
                        <p className="text-xs font-bold mb-1 opacity-80">
                          {msg.senderId === currentUser?.id ? "You" : msg.senderName}
                        </p>
                        <p className="text-sm">{msg.messageContent}</p>
                        <p className="text-white/60 text-xs mt-1 text-right">
                          {new Date(msg.timestamp).toLocaleTimeString([], { 
                            hour: "2-digit", 
                            minute: "2-digit" 
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
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
              disabled={!currentUser || isLoading}
              maxLength={500}
            />
            <Button
              type="submit"
              size="icon"
              className="bg-white/20 hover:bg-white/30 text-white"
              disabled={!currentUser || isLoading || !inputMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
