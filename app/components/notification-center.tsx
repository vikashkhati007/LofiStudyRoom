"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NotificationItem {
  id: string
  message: string
  timestamp: string
  type?: "music" | "timer" | "info"
}

interface NotificationCenterProps {
  notifications: NotificationItem[]
  onClearNotifications: () => void
}

export default function NotificationCenter({ notifications, onClearNotifications }: NotificationCenterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const unreadCount = notifications.length // Simple count for now

  return (
    <div className="fixed top-4 left-4 z-50">
      <motion.div
        className="ios-glass rounded-full cursor-pointer overflow-hidden"
        layout
        initial={{ width: 40, height: 40 }}
        animate={{
          width: isExpanded ? 300 : 40,
          height: isExpanded ? 300 : 40,
          borderRadius: isExpanded ? 24 : 20,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            // Compact State
            <motion.div
              key="compact"
              className="flex items-center justify-center h-full relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bell className="h-5 w-5 text-white/80" />
              {unreadCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.div>
          ) : (
            // Expanded State
            <motion.div
              key="expanded"
              className="p-4 h-full flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-semibold text-lg">Notifications</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:bg-white/20 w-8 h-8 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded(false)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1 pr-2">
                {notifications.length === 0 ? (
                  <p className="text-white/60 text-sm text-center mt-8">No new notifications.</p>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className="ios-glass-card p-3 rounded-lg text-sm text-white/90"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p>{notification.message}</p>
                        <p className="text-white/50 text-xs mt-1">{notification.timestamp}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {notifications.length > 0 && (
                <Button
                  className="mt-4 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl px-4 py-2 text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClearNotifications()
                  }}
                >
                  Clear All
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
