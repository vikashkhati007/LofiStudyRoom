"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, MessageSquare, Music, Clock, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface NotificationItem {
  id: string
  message: string
  timestamp: string
  type?: "music" | "timer" | "info" | "chat"
}

interface ToastNotificationProps {
  notification: NotificationItem | null
  onClose: () => void
}

export default function ToastNotification({ notification, onClose }: ToastNotificationProps) {
  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "chat":
        return <MessageSquare className="h-4 w-4 text-blue-400" />
      case "music":
        return <Music className="h-4 w-4 text-green-400" />
      case "timer":
        return <Clock className="h-4 w-4 text-orange-400" />
      default:
        return <Info className="h-4 w-4 text-white/70" />
    }
  }

  const getBackgroundColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "chat":
        return "bg-blue-500/20 border-blue-400/30"
      case "music":
        return "bg-green-500/20 border-green-400/30"
      case "timer":
        return "bg-orange-500/20 border-orange-400/30"
      default:
        return "bg-white/10 border-white/20"
    }
  }

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.id}
            initial={{ y: -100, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`ios-glass-card p-4 rounded-xl flex items-center gap-3 max-w-sm w-full pointer-events-auto ${getBackgroundColor(notification.type)}`}
          >
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{notification.message}</p>
              <p className="text-white/70 text-xs mt-0.5">{notification.timestamp}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:bg-white/20 w-6 h-6 rounded-full flex-shrink-0"
              onClick={onClose}
            >
              <X className="h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
