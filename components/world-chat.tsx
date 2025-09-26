"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, X } from 'lucide-react'
import { databases, client, DATABASE_ID, COLLECTION_ID_MESSAGES } from "@/lib/appwrite"
import { ID, Query } from "appwrite"
import { Message, WorldChatProps } from "@/lib/types"
import { generateUserId, generateUsername } from "@/lib/functions"

export default function WorldChat({ isOpen, onClose, onNewMessage }: WorldChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const processedMessageIds = useRef<Set<string>>(new Set()) // Track processed messages

  // Scroll to bottom of messages with smooth behavior
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end"
    })
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

  // Smooth scroll to bottom when messages update
  useEffect(() => {
    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      scrollToBottom()
    })
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
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Floating Input Bar with optimized animations */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  duration: 0.2,
                  ease: "easeOut"
                }
              },
              exit: { 
                opacity: 0, 
                y: 20, 
                scale: 0.95,
                transition: {
                  duration: 0.15,
                  ease: "easeIn"
                }
              }
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-6 right-4 w-80 z-50"
            style={{
              willChange: 'transform, opacity',
              transform: 'translateZ(0)' // Force GPU acceleration
            }}
          >
            <div className="relative">
              <form onSubmit={handleSendMessage} 
                    className="bg-white/10 backdrop-blur-xl rounded-full border border-white/20 p-3 flex items-center gap-3 shadow-2xl transition-all duration-150"
                    style={{ 
                      backdropFilter: 'blur(40px)',
                      willChange: 'transform'
                    }}>
                <MessageSquare className="h-5 w-5 text-white/60 flex-shrink-0" />
                <input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-white placeholder:text-white/50 border-0 outline-none text-sm transition-all duration-100"
                  disabled={!currentUser || isLoading}
                  maxLength={500}
                  style={{ willChange: 'contents' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && inputMessage.trim()) {
                      handleSendMessage(e)
                    }
                  }}
                />
                <motion.button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500/50 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0"
                  disabled={!currentUser || isLoading || !inputMessage.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  style={{ willChange: 'transform' }}
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Floating Chat Container with optimized performance */}
          <div className="fixed bottom-20 right-4 w-80 z-30">
            {/* Chat bubbles area */}
            <div className="h-[320px] pointer-events-none">
              {/* Scrollable messages area with hardware acceleration */}
              <div className="h-full pointer-events-auto overflow-y-auto pr-1 scroll-smooth" 
                   style={{
                     scrollbarWidth: 'thin',
                     scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
                     willChange: 'scroll-position',
                     transform: 'translateZ(0)' // Force GPU layer
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
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { 
                          opacity: 1, 
                          y: 0,
                          transition: {
                            duration: 0.15,
                            ease: "easeOut"
                          }
                        },
                        exit: { 
                          opacity: 0, 
                          y: 10,
                          transition: {
                            duration: 0.1,
                            ease: "easeOut"
                          }
                        }
                      }}
                      initial="hidden"
                      animate="visible"
                      className="flex justify-center"
                      style={{ willChange: 'transform, opacity' }}
                    >
                      <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 text-center border border-white/20 shadow-xl"
                           style={{ backdropFilter: 'blur(40px)' }}>
                        <span className="text-white/60 text-sm">Loading messages...</span>
                      </div>
                    </motion.div>
                  ) : messages.length === 0 ? (
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { 
                          opacity: 1, 
                          y: 0,
                          transition: {
                            duration: 0.15,
                            ease: "easeOut"
                          }
                        },
                        exit: { 
                          opacity: 0, 
                          y: 10,
                          transition: {
                            duration: 0.1,
                            ease: "easeOut"
                          }
                        }
                      }}
                      initial="hidden"
                      animate="visible"
                      className="flex justify-center"
                      style={{ willChange: 'transform, opacity' }}
                    >
                      <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 text-center border border-white/20 shadow-xl"
                           style={{ backdropFilter: 'blur(40px)' }}>
                        <p className="text-white/60 text-sm">No messages yet.</p>
                        <p className="text-white/40 text-xs mt-1">Be the first to say hello! 👋</p>
                      </div>
                    </motion.div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.$id}
                          variants={{
                            hidden: { 
                              opacity: 0, 
                              y: 15, 
                              scale: 0.95,
                              filter: "blur(4px)"
                            },
                            visible: { 
                              opacity: 1, 
                              y: 0, 
                              scale: 1,
                              filter: "blur(0px)",
                              transition: {
                                duration: 0.2,
                                ease: "easeOut"
                              }
                            }
                          }}
                          initial="hidden"
                          animate="visible"
                          layout
                          layoutId={msg.$id}
                          className={`flex ${msg.senderId === currentUser?.id ? "justify-end" : "justify-start"}`}
                          style={{ 
                            willChange: 'transform, opacity',
                            transform: 'translateZ(0)' // GPU acceleration
                          }}
                        >
                          <motion.div
                            className="relative max-w-[85%] rounded-2xl px-4 py-3 shadow-xl border transition-all duration-150"
                            style={{
                              background: msg.senderId === currentUser?.id 
                                ? 'rgba(59, 130, 246, 0.4)' 
                                : 'rgba(255, 255, 255, 0.15)',
                              backdropFilter: 'blur(40px)',
                              border: msg.senderId === currentUser?.id 
                                ? '1px solid rgba(59, 130, 246, 0.3)' 
                                : '1px solid rgba(255, 255, 255, 0.2)',
                              willChange: 'transform'
                            }}
                            whileHover={{ 
                              scale: 1.02,
                              transition: { duration: 0.1 }
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
                          </motion.div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Optimized fade overlays */}
              <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none z-10"
                   style={{ 
                     background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.02) 50%, rgba(0,0,0,0.01) 75%, transparent 100%)',
                     willChange: 'transform'
                   }} />
              <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10"
                   style={{ 
                     background: 'linear-gradient(0deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.02) 50%, rgba(0,0,0,0.01) 75%, transparent 100%)',
                     willChange: 'transform'
                   }} />
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}