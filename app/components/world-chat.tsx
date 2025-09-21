"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
        <>
          {/* Floating Input Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
            className="fixed bottom-6 right-4 w-80 z-50"
          >
            <div className="relative">
              <form onSubmit={handleSendMessage} 
                    className="bg-white/10 backdrop-blur-xl rounded-full border border-white/20 p-3 flex items-center gap-3 shadow-2xl"
                    style={{ backdropFilter: 'blur(40px)' }}>
                <MessageSquare className="h-5 w-5 text-white/60 flex-shrink-0" />
                <input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-white placeholder:text-white/50 border-0 outline-none text-sm"
                  disabled={!currentUser || isLoading}
                  maxLength={500}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && inputMessage.trim()) {
                      handleSendMessage(e)
                    }
                  }}
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500/50 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors"
                  disabled={!currentUser || isLoading || !inputMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              
              {/* Close button positioned outside
              <button
                onClick={onClose}
                className="absolute -top-1 -right-1 bg-white/20 hover:bg-white/30 text-white rounded-full w-6 h-6 flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <X className="h-3 w-3" />
              </button> */}
            </div>
          </motion.div>

          {/* Floating Chat Container with Username Header */}
          <div className="fixed bottom-20 right-4 w-80 z-30">

            {/* Chat bubbles area */}
            <div className="h-[320px] pointer-events-none">
              {/* Scrollable messages area with custom thin scrollbar */}
              <div className="h-full pointer-events-auto overflow-y-auto pr-1" 
                   style={{
                     scrollbarWidth: 'thin',
                     scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent'
                   }}>
                <style jsx global>{`
                  .thin-scrollbar::-webkit-scrollbar {
                    width: 3px;
                  }
                  .thin-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .thin-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 2px;
                  }
                  .thin-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                  }
                `}</style>
                <div className="p-2 space-y-2 thin-scrollbar" style={{ height: 'fit-content' }}>
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-center"
                    >
                      <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 text-center border border-white/20 shadow-xl"
                           style={{ backdropFilter: 'blur(40px)' }}>
                        <span className="text-white/60 text-sm">Loading messages...</span>
                      </div>
                    </motion.div>
                  ) : messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-center"
                    >
                      <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 text-center border border-white/20 shadow-xl"
                           style={{ backdropFilter: 'blur(40px)' }}>
                        <p className="text-white/60 text-sm">No messages yet.</p>
                        <p className="text-white/40 text-xs mt-1">Be the first to say hello! 👋</p>
                      </div>
                    </motion.div>
                  ) : (
                    messages.map((msg, index) => (
                      <motion.div
                        key={msg.$id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 25,
                          delay: index * 0.05 
                        }}
                        className={`flex ${msg.senderId === currentUser?.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className="relative max-w-[85%] rounded-2xl px-4 py-3 shadow-xl border"
                          style={{
                            background: msg.senderId === currentUser?.id 
                              ? 'rgba(59, 130, 246, 0.4)' 
                              : 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(40px)',
                            border: msg.senderId === currentUser?.id 
                              ? '1px solid rgba(59, 130, 246, 0.3)' 
                              : '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          {msg.senderId !== currentUser?.id && (
                            <div className="text-xs font-medium mb-1 text-white/70">
                              {msg.senderName}
                            </div>
                          )}
                          <div className="text-white text-sm leading-relaxed">
                            {msg.messageContent}
                          </div>
                          <div className={`text-xs mt-1 text-right ${
                            msg.senderId === currentUser?.id ? "text-blue-200/70" : "text-white/50"
                          }`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { 
                              hour: "2-digit", 
                              minute: "2-digit" 
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Subtle natural fade overlays */}
              <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none z-10"
                   style={{ 
                     background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.02) 50%, rgba(0,0,0,0.01) 75%, transparent 100%)'
                   }} />
              <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10"
                   style={{ 
                     background: 'linear-gradient(0deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.02) 50%, rgba(0,0,0,0.01) 75%, transparent 100%)'
                   }} />
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}