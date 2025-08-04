"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, SkipBack, SkipForward, Music2 } from "lucide-react" // Removed Timer, Clock
import { Button } from "@/components/ui/button"

interface Track {
  title: string
  artist: string
  album: string
  duration: number
  currentTime: number
}

interface DynamicIslandProps {
  track: Track
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
}

export default function DynamicIsland({ track, isPlaying, onPlayPause, onNext, onPrevious }: DynamicIslandProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = track.duration > 0 ? (track.currentTime / track.duration) * 100 : 0

  // Music visualizer bars
  const VisualizerBars = () => (
    <div className="flex items-center gap-0.5 h-4">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 bg-white/60 rounded-full"
          animate={{
            height: isPlaying ? [4, 12, 8, 16, 6] : [4, 4, 4, 4, 4],
          }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <motion.div
        className="ios-glass rounded-full cursor-pointer overflow-hidden"
        layout
        initial={{ width: 120, height: 40 }}
        animate={{
          width: isExpanded ? 320 : 120,
          height: isExpanded ? 80 : 40, // Only music height
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
            // Compact State (Music)
            <motion.div
              key="compact-music"
              className="flex items-center justify-center h-full px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <Music2 className="h-4 w-4 text-white/80" />
                <VisualizerBars />
                <motion.div
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{
                    scale: isPlaying ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </div>
            </motion.div>
          ) : (
            // Expanded State (Music)
            <motion.div
              key="expanded-music"
              className="pt-6 px-4 pb-4 h-full flex flex-col justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Music Controls */}
              <div className="flex items-center justify-between h-full">
                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <motion.h4
                    className="text-white font-medium text-sm truncate"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {track.title}
                  </motion.h4>
                  <motion.p
                    className="text-white/70 text-xs truncate"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    {track.artist}
                  </motion.p>
                </div>

                {/* Controls */}
                <motion.div
                  className="flex items-center gap-2 ml-4"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 w-8 h-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      onPrevious()
                    }}
                  >
                    <SkipBack className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 w-8 h-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      onPlayPause()
                    }}
                  >
                    {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 ml-0.5" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 w-8 h-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      onNext()
                    }}
                  >
                    <SkipForward className="h-3 w-3" />
                  </Button>
                </motion.div>
              </div>

              {/* Progress Bar */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-3xl overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
                  style={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.1 }}
                />
              </motion.div>

              {/* Time Display */}
              <motion.div
                className="absolute bottom-2 right-4 text-white/60 text-xs font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {track.duration > 0 ? (
                  <>
                    {formatTime(track.currentTime)} / {formatTime(track.duration)}
                  </>
                ) : (
                  "Loading..."
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
