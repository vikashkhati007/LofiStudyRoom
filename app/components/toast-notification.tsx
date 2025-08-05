"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotificationItem {
  id: string
  message: string
  timestamp: string
  type?: "music" | "timer" | "info"
}

interface ToastNotificationProps {
  notification: NotificationItem | null
  onClose: () => void
}

export default function ToastNotification({ notification, onClose }: ToastNotificationProps) {
  return (
    <div className="fixed top-4 left-20 z-40 pointer-events-none">
      {" "}
      {/* Adjusted position */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.id}
            initial={{ x: -100, opacity: 0 }} // Slide in from left
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }} // Slide out to left
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="ios-glass-card p-3 rounded-xl flex items-center gap-3 max-w-xs w-full pointer-events-auto"
          >
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{notification.message}</p>
              <p className="text-white/70 text-xs mt-0.5">{notification.timestamp}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:bg-white/20 w-6 h-6 rounded-full"
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
