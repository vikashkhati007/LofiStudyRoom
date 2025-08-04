"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface TimerDynamicIslandProps {
  timerMinutes: number
  timerSeconds: number
  isTimerRunning: boolean
  timerMode: "work" | "break"
  workDuration: number
  breakDuration: number
  onStartTimer: () => void
  onResetTimer: () => void
  onWorkDurationChange: (val: number[]) => void
  onBreakDurationChange: (val: number[]) => void
}

export default function TimerDynamicIsland({
  timerMinutes,
  timerSeconds,
  isTimerRunning,
  timerMode,
  workDuration,
  breakDuration,
  onStartTimer,
  onResetTimer,
  onWorkDurationChange,
  onBreakDurationChange,
}: TimerDynamicIslandProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {" "}
      {/* Positioned at bottom-left */}
      <motion.div
        className="ios-glass rounded-full cursor-pointer overflow-hidden"
        layout
        initial={{ width: 100, height: 40 }} // Smaller compact state
        animate={{
          width: isExpanded ? 280 : 100, // Adjusted expanded width
          height: isExpanded ? 200 : 40, // Adjusted expanded height
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
            // Compact State (Timer)
            <motion.div
              key="compact-timer"
              className="flex items-center justify-center h-full px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-white/80" />
                <span className="text-white text-sm font-mono">
                  {String(timerMinutes).padStart(2, "0")}:{String(timerSeconds).padStart(2, "0")}
                </span>
                <motion.div
                  className={`w-2 h-2 rounded-full ${isTimerRunning ? "bg-green-400" : "bg-red-400"}`}
                  animate={{
                    scale: isTimerRunning ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </div>
            </motion.div>
          ) : (
            // Expanded State (Timer)
            <motion.div
              key="expanded-timer"
              className="p-4 h-full flex flex-col items-center justify-center space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.div
                className="text-3xl font-mono text-white"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {String(timerMinutes).padStart(2, "0")}:{String(timerSeconds).padStart(2, "0")}
              </motion.div>
              <motion.p
                className="text-white/70 text-sm"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                {isTimerRunning ? `Focusing on ${timerMode}` : `Ready for ${timerMode}`}
              </motion.p>

              <motion.div
                className="flex gap-2 mt-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-xl px-4 py-2 text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onStartTimer()
                  }}
                >
                  {isTimerRunning ? "Pause" : "Start"}
                </Button>
                <Button
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl px-4 py-2 text-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onResetTimer()
                  }}
                >
                  Reset
                </Button>
              </motion.div>

              <motion.div
                className="w-full px-4 mt-4 space-y-2"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <div className="flex items-center justify-between text-white/70 text-xs">
                  <span>Work: {workDuration} min</span>
                  <Slider
                    value={[workDuration]}
                    onValueChange={onWorkDurationChange}
                    max={60}
                    step={1}
                    className="ios-slider w-24"
                  />
                </div>
                <div className="flex items-center justify-between text-white/70 text-xs">
                  <span>Break: {breakDuration} min</span>
                  <Slider
                    value={[breakDuration]}
                    onValueChange={onBreakDurationChange}
                    max={30}
                    step={1}
                    className="ios-slider w-24"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
