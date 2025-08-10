"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import DynamicIsland from "./components/dynamic-island"
import TimerDynamicIsland from "./components/timer-dynamic-island"
import NotificationCenter from "./components/notification-center"
import ToastNotification from "./components/toast-notification"
import WorldChat from "./components/world-chat"
// Update the import statement to include VolumeX
import { Play, Pause, SkipBack, SkipForward, Palette, Music, MessageSquare, Volume2, VolumeX } from 'lucide-react'

interface NotificationItem {
  id: string
  message: string
  timestamp: string
  type?: "music" | "timer" | "info" | "chat"
}

interface Message {
  $id: string
  senderName: string
  messageContent: string
  timestamp: string
  senderId: string
}

export default function LofiPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTheme, setCurrentTheme] = useState("study-lofi")
  const [volume, setVolume] = useState([75])
  const [rainVolume, setRainVolume] = useState([30])
  const [fireVolume, setFireVolume] = useState([20])
  const [oceanWavesVolume, setOceanWavesVolume] = useState([0])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [latestNotification, setLatestNotification] = useState<NotificationItem | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const processedNotificationIds = useRef<Set<string>>(new Set())

  // Timer states
  const [totalSecondsRemaining, setTotalSecondsRemaining] = useState(25 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerMode, setTimerMode] = useState<"work" | "break">("work")
  const [workDuration, setWorkDuration] = useState([25])
  const [breakDuration, setBreakDuration] = useState([5])

  // Audio refs
  const audioRef = useRef<HTMLAudioElement>(null)
  const rainAudioRef = useRef<HTMLAudioElement>(null)
  const fireAudioRef = useRef<HTMLAudioElement>(null)
  const oceanWavesAudioRef = useRef<HTMLAudioElement>(null)
  const timerEndSfxRef = useRef<HTMLAudioElement>(null)
  const breakEndSfxRef = useRef<HTMLAudioElement>(null)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isMuted, setIsMuted] = useState(false);
const [previousVolume, setPreviousVolume] = useState(50);

  // Themes configuration - Updated to use videos
  const themes = [
    {
      id: "study-lofi",
      name: "Study Lofi",
      video: "/images/lofigirl.mp4",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      id: "ambient",
      name: "Ambient",
      video: "/images/lofigirl.mp4",
      color: "from-blue-500/20 to-cyan-500/20",
    },
  ]

  // Theme-based playlists
  const themePlaylists = {
    "study-lofi": [
      { title: "Idea 15", artist: "Gibran Alcocer", src: "/music/Idea 15 - Gibran Alcocer.mp3" },
      { title: "Idea 20 - Kurate Music", artist: "Gibran Alcocer", src: "/music/Gibran Alcocer - Idea 20 - Kurate Music.mp3" },
      { title: "Rainy Day Vibes", artist: "Ambient Sounds", src: "/lofi.mp3" },
    ],
    "ambient": [
      { title: "SnowFall", artist: "Oneheart-x-Reidenshi", src: "/music/ambient/oneheart-x-reidenshi-snowfall-128-ytshorts.savetube.me.mp3" },
      { title: "Watching-The-Stars", artist: "Oneheart", src: "/music/ambient/oneheart-watching-the-stars-128-ytshorts.savetube.me.mp3" },
      { title: "Rain Inside", artist: "Oneheart-x-Antent", src: "/music/ambient/oneheart-x-antent-rain-inside-128-ytshorts.savetube.me.mp3" },
      { title: "Rescue", artist: "Oneheart-x-Ashess", src: "/music/ambient/oneheart-x-ashess-rescue-128-ytshorts.savetube.me.me.mp3" },
    ],
  }

  const [playlist, setPlaylist] = useState(themePlaylists["study-lofi"])

  const currentTrack = {
    title: playlist[currentTrackIndex]?.title || "No track",
    artist: playlist[currentTrackIndex]?.artist || "Unknown",
    album: "Lofi Dreams",
    duration: duration,
    currentTime: currentTime,
  }

  // Function to add notifications
  const addNotification = useCallback((message: string, type: NotificationItem["type"] = "info") => {
    if (type === "chat") return
    
    const newNotification: NotificationItem = {
      id: Date.now().toString(),
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type,
    }
    setNotifications((prev) => [newNotification, ...prev])
    setLatestNotification(newNotification)
  }, [])

  // Handle new chat messages
  const handleNewChatMessage = useCallback((message: Message) => {
    if (processedNotificationIds.current.has(message.$id)) return
    
    processedNotificationIds.current.add(message.$id)
    
    if (message.senderId !== currentUser?.id) {
      if (!isChatOpen) {
        setUnreadMessageCount(prev => prev + 1)
      }
      
      const truncatedMessage = message.messageContent.length > 40 
        ? `${message.messageContent.substring(0, 40)}...` 
        : message.messageContent
      
      const chatNotification: NotificationItem = {
        id: message.$id,
        message: `💬 ${message.senderName}: ${truncatedMessage}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "chat",
      }
      setLatestNotification(chatNotification)
    }
  }, [currentUser?.id, isChatOpen])

  // Handle chat open/close
  const handleChatToggle = () => {
    if (!isChatOpen) {
      setUnreadMessageCount(0)
      processedNotificationIds.current.clear()
    }
    setIsChatOpen(!isChatOpen)
  }

  useEffect(() => {
  if (audioRef.current) {
    if (isMuted) {
      audioRef.current.volume = 0;
    } else {
      audioRef.current.volume = volume[0] / 100;
    }
  }
}, [volume, isMuted]);

  // Effect to clear latestNotification
  useEffect(() => {
    if (latestNotification) {
      const timer = setTimeout(() => {
        setLatestNotification(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [latestNotification])

  // Initialize audio and handle metadata/time updates
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current

      const handleLoadedMetadata = () => {
        setDuration(Math.floor(audio.duration))
      }

      const handleTimeUpdate = () => {
        setCurrentTime(Math.floor(audio.currentTime))
      }

      const handleEnded = () => {
        handleNextTrack()
        addNotification(`Track ended: ${playlist[currentTrackIndex]?.title}`, "music")
      }

      audio.addEventListener("loadedmetadata", handleLoadedMetadata)
      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("ended", handleEnded)

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("ended", handleEnded)
      }
    }
  }, [currentTrackIndex, addNotification, playlist])

  // Handle play/pause
  const handlePlayPause = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          await audioRef.current.pause()
          addNotification("Music paused", "music")
        } else {
          audioRef.current.src = playlist[currentTrackIndex]?.src || ""
          await audioRef.current.play()
          addNotification(`Music started: ${playlist[currentTrackIndex]?.title}`, "music")
        }
        setIsPlaying(!isPlaying)
      } catch (error) {
        console.error("Error playing audio:", error)
        addNotification("Failed to play music", "info")
      }
    }
  }

  // Handle playlist navigation
  const handleNextTrack = async () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length
    const nextTrack = playlist[nextIndex]
    setCurrentTrackIndex(nextIndex)
    
    if (audioRef.current && nextTrack?.src) {
      audioRef.current.src = nextTrack.src
      audioRef.current.load()
      
      if (isPlaying) {
        try {
          // Add a small delay to ensure the audio element is ready
          await new Promise(resolve => setTimeout(resolve, 100))
          await audioRef.current.play()
          addNotification(`Next track: ${nextTrack.title}`, "music")
        } catch (error) {
          console.error("Error playing next track:", error)
          addNotification("Failed to play next track", "info")
        }
      }
    }
  }

  const handlePreviousTrack = async () => {
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length
    const prevTrack = playlist[prevIndex]
    setCurrentTrackIndex(prevIndex)
    
    if (audioRef.current && prevTrack?.src) {
      audioRef.current.src = prevTrack.src
      audioRef.current.load()
      
      if (isPlaying) {
        try {
          // Add a small delay to ensure the audio element is ready
          await new Promise(resolve => setTimeout(resolve, 100))
          await audioRef.current.play()
          addNotification(`Previous track: ${prevTrack.title}`, "music")
        } catch (error) {
          console.error("Error playing previous track:", error)
          addNotification("Failed to play previous track", "info")
        }
      }
    }
  }

  // Handle volume changes for all audio elements
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume[0] / 100
  }, [volume])

  useEffect(() => {
    if (rainAudioRef.current) rainAudioRef.current.volume = rainVolume[0] / 100
  }, [rainVolume])

  useEffect(() => {
    if (fireAudioRef.current) fireAudioRef.current.volume = fireVolume[0] / 100
  }, [fireVolume])

  useEffect(() => {
    if (oceanWavesAudioRef.current) oceanWavesAudioRef.current.volume = oceanWavesVolume[0] / 100
  }, [oceanWavesVolume])

  // Toggle ambient sounds
  const toggleAmbientSound = (audioElement: HTMLAudioElement | null, volumeValue: number[]) => {
    if (audioElement) {
      if (volumeValue[0] > 0 && audioElement.paused) {
        audioElement.play().catch((e) => console.error("Error playing ambient sound:", e))
      } else if (volumeValue[0] === 0 && !audioElement.paused) {
        audioElement.pause()
      }
    }
  }

  useEffect(() => toggleAmbientSound(rainAudioRef.current, rainVolume), [rainVolume])
  useEffect(() => toggleAmbientSound(fireAudioRef.current, fireVolume), [fireVolume])
  useEffect(() => toggleAmbientSound(oceanWavesAudioRef.current, oceanWavesVolume), [oceanWavesVolume])

  // Timer functions
  const startTimer = () => {
    if (isTimerRunning) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
      setIsTimerRunning(false)
      addNotification("Timer paused", "timer")
    } else {
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("Notification permission granted.")
          }
        })
      }

      setIsTimerRunning(true)
      addNotification(`Timer started: ${timerMode} session`, "timer")
      timerIntervalRef.current = setInterval(() => {
        setTotalSecondsRemaining((prevTotalSeconds) => {
          if (prevTotalSeconds <= 0) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current)
              timerIntervalRef.current = null
            }
            setIsTimerRunning(false)

            if (timerMode === "work") {
              if (timerEndSfxRef.current) timerEndSfxRef.current.play()
              if (Notification.permission === "granted") {
                new Notification("Work session finished!", {
                  body: "Time for a break!",
                  icon: "/placeholder.svg?height=64&width=64&text=🔔",
                })
              }
              addNotification("Work session finished! Time for a break.", "timer")
              setTimerMode("break")
              return breakDuration[0] * 60
            } else {
              if (breakEndSfxRef.current) breakEndSfxRef.current.play()
              if (Notification.permission === "granted") {
                new Notification("Break session finished!", {
                  body: "Time for a new work session!",
                  icon: "/placeholder.svg?height=64&width=64&text=🔔",
                })
              }
              addNotification("Break session finished! Time for a new work session.", "timer")
              setTimerMode("work")
              return workDuration[0] * 60
            }
          } else {
            return prevTotalSeconds - 1
          }
        })
      }, 1000)
    }
  }

  const resetTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
    setIsTimerRunning(false)
    setTimerMode("work")
    setTotalSecondsRemaining(workDuration[0] * 60)
    addNotification("Timer reset", "timer")
  }

  useEffect(() => {
    if (!isTimerRunning) {
      if (timerMode === "work") {
        setTotalSecondsRemaining(workDuration[0] * 60)
      } else {
        setTotalSecondsRemaining(breakDuration[0] * 60)
      }
    }
  }, [workDuration, breakDuration, timerMode, isTimerRunning])

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [])

  const handleClearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const displayMinutes = Math.floor(totalSecondsRemaining / 60)
  const displaySeconds = totalSecondsRemaining % 60

  // Load user data from localStorage
  useEffect(() => {
    const simulatedUser = { id: 'user_' + Math.random().toString(36).substr(2, 9), name: 'You' }
    setCurrentUser(simulatedUser)
  }, [])

  // Function to load theme-based music
  const loadThemeMusic = (themeId: string) => {
    setPlaylist(themePlaylists[themeId as keyof typeof themePlaylists] || themePlaylists["study-lofi"])
    setCurrentTrackIndex(0)
    if (isPlaying && audioRef.current) {
      audioRef.current.src = playlist[0]?.src || ""
      audioRef.current.load()
      audioRef.current.play().catch(console.error)
    }
  }

  // Get current theme background video
  const getBackgroundVideo = () => {
    const currentThemeData = themes.find(t => t.id === currentTheme)
    return currentThemeData?.video || "/images/lofigirl.mp4"
  }

  const toggleMute = () => {
  if (isMuted) {
    // Unmute - restore previous volume
    setVolume([previousVolume]);
    setIsMuted(false);
  } else {
    // Mute - save current volume and set to 0
    setPreviousVolume(volume[0]);
    setVolume([0]);
    setIsMuted(true);
  }
};

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Audio Elements */}
      <audio ref={audioRef} src={playlist[currentTrackIndex]?.src} preload="metadata" loop crossOrigin="anonymous" />
      <audio ref={rainAudioRef} src="/rain.mp3" preload="metadata" loop crossOrigin="anonymous" />
      <audio ref={fireAudioRef} src="/fire.mp3" preload="metadata" loop crossOrigin="anonymous" />
      <audio ref={oceanWavesAudioRef} src="/ocean-waves.mp3" preload="metadata" loop crossOrigin="anonymous" />
      <audio ref={timerEndSfxRef} src="/timer-end.mp3" preload="auto" crossOrigin="anonymous" />
      <audio ref={breakEndSfxRef} src="/break-end.mp3" preload="auto" crossOrigin="anonymous" />

      {/* Background Video - Dynamic based on theme */}
      <div className="absolute inset-0">
        <video
          src={getBackgroundVideo()}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40" />
      </div>

      {/* Music Dynamic Island (Top Center) */}
      <DynamicIsland
        track={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNextTrack}
        onPrevious={handlePreviousTrack}
      />

      {/* Message Toast Notification (Top Center, below Dynamic Island) */}
      <ToastNotification notification={latestNotification} onClose={() => setLatestNotification(null)} />

      {/* Timer Dynamic Island (Bottom Left) */}
      <TimerDynamicIsland
        timerMinutes={displayMinutes}
        timerSeconds={displaySeconds}
        isTimerRunning={isTimerRunning}
        timerMode={timerMode}
        workDuration={workDuration[0]}
        breakDuration={breakDuration[0]}
        onStartTimer={startTimer}
        onResetTimer={resetTimer}
        onWorkDurationChange={(val) => setWorkDuration(val)}
        onBreakDurationChange={(val) => setBreakDuration(val)}
      />

      {/* Notification Center (Top Left) */}
      {/* @ts-ignore */}
      <NotificationCenter notifications={notifications} onClearNotifications={handleClearNotifications} />

      {/* Settings Toggle Button */}
      <div className="absolute right-4 top-4 z-20">
        <Button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="ios-glass rounded-full w-12 h-12 p-0 text-white hover:bg-white/20 border-white/20"
        >
          <div className={`transition-transform duration-300 ${isSettingsOpen ? "rotate-45" : ""}`}>
            <div className="w-5 h-5 relative">
              <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-1 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2"></div>
              <div className="absolute bottom-1 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2"></div>
              <div className="absolute top-1/2 left-1 w-1 h-1 bg-white rounded-full transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 right-1 w-1 h-1 bg-white rounded-full transform -translate-y-1/2"></div>
            </div>
          </div>
        </Button>
      </div>

      {/* World Chat Button with Unread Count */}
      {!isChatOpen && (
        <div className="absolute bottom-4 right-4 z-20">
          <Button
            onClick={handleChatToggle}
            className="ios-glass rounded-full w-12 h-12 p-0 text-white hover:bg-white/20 border-white/20 relative"
          >
            <MessageSquare className="h-6 w-6" />
            {unreadMessageCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px] px-1">
                {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
              </span>
            )}
          </Button>
        </div>
      )}

      {/* World Chat Component */}
      <WorldChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        onNewMessage={handleNewChatMessage}
      />

          {/* Compact Settings Panel - Spaced and scrollbar hidden */}
      <div
        className={`absolute right-4 top-20 bottom-auto max-h-[70vh] w-56 transition-all duration-300 ease-out ${
          isSettingsOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="ios-glass rounded-xl p-3 transform transition-all duration-300 flex flex-col max-h-full">
          <Tabs defaultValue="themes" className="flex flex-col max-h-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-0.5 h-full">
              <TabsTrigger
                value="themes"
                className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 rounded-md transition-all text-xs py-1.5 "
              >
                <Palette className="h-3 w-3 mr-1" />
                Themes
              </TabsTrigger>
              <TabsTrigger
                value="sounds"
                className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 rounded-md transition-all text-xs py-1.5"
              >
                <Music className="h-3 w-3 mr-1" />
                Sounds
              </TabsTrigger>
            </TabsList>

            <TabsContent value="themes" className="flex-1 mt-2 space-y-2 overflow-y-auto scrollbar-hide">
              <h3 className="text-white font-semibold text-sm mb-2">Themes</h3>
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                    currentTheme === theme.id
                      ? "ring-1 ring-white/60 scale-[1.01]"
                      : "hover:scale-[1.01] hover:ring-1 hover:ring-white/30"
                  }`}
                  onClick={() => {
                    setCurrentTheme(theme.id)
                    loadThemeMusic(theme.id)
                  }}
                >
                  <div className="ios-glass-card rounded-lg overflow-hidden">
                    <video
                      src={theme.video}
                      muted
                      loop
                      playsInline
                      className="w-full h-16 object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${theme.color} to-transparent`} />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <h4 className="text-white font-medium text-xs drop-shadow-md">{theme.name}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="sounds" className="flex-1 mt-2 space-y-2 overflow-y-auto scrollbar-hide">
              <h3 className="text-white font-semibold text-sm mb-2">Ambient</h3>
              <div className="space-y-2">
                <div className="ios-glass-card rounded-lg p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs">Rain</span>
                    <span className="text-white/70 text-xs">{rainVolume[0]}%</span>
                  </div>
                  <Slider value={rainVolume} onValueChange={setRainVolume} max={100} step={1} className="ios-slider h-1" />
                </div>

                <div className="ios-glass-card rounded-lg p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs">Fire</span>
                    <span className="text-white/70 text-xs">{fireVolume[0]}%</span>
                  </div>
                  <Slider value={fireVolume} onValueChange={setFireVolume} max={100} step={1} className="ios-slider h-1" />
                </div>

                <div className="ios-glass-card rounded-lg p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs">Ocean</span>
                    <span className="text-white/70 text-xs">{oceanWavesVolume[0]}%</span>
                  </div>
                  <Slider
                    value={oceanWavesVolume}
                    onValueChange={setOceanWavesVolume}
                    max={100}
                    step={1}
                    className="ios-slider h-1"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Music Player Controls - Bottom Center - Ultra Compact */}
     <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
  <div className="ios-glass rounded-full px-2 py-2 backdrop-blur-md bg-white/10 border border-white/15 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 hover:bg-white/15">
    <div className="flex items-center gap-1">
      <button
        className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:scale-105 active:scale-95"
        onClick={handlePreviousTrack}
      >
        <SkipBack className="h-4 w-4" />
      </button>
      <button
        className="text-white bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-200 hover:scale-110 active:scale-95"
        onClick={handlePlayPause}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
      </button>
      <button
        className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:scale-105 active:scale-95"
        onClick={handleNextTrack}
      >
        <SkipForward className="h-4 w-4" />
      </button>
    </div>
  </div>
</div>

{/* Separate Volume Control - Positioned beside music controls */}
<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 translate-x-32">
  <div className="group relative">
    <div className="ios-glass rounded-full p-2 backdrop-blur-md bg-white/10 border border-white/15 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 hover:bg-white/15">
      <button 
        className="text-white/70 hover:text-white rounded-full p-2 transition-all duration-200 hover:scale-105 active:scale-95"
        onClick={toggleMute}
      >
        {isMuted || volume[0] === 0 ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>
    </div>
    
    {/* Vertical Volume Slider Popup - Extended hover area */}
    <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
      {/* Invisible bridge to connect button and popup */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-transparent"></div>
      
      <div className="ios-glass rounded-lg p-4 backdrop-blur-md bg-white/10 border border-white/15 shadow-lg">
        <div className="flex flex-col items-center gap-3">
          <span className="text-white/70 text-xs font-medium">
            {isMuted ? "Muted" : `${volume[0]}%`}
          </span>
          <div className="h-24 w-8 flex items-center justify-center relative px-2">
            {/* Custom Vertical Slider with larger clickable area */}
            <div 
              className="h-full w-2 bg-white/20 rounded-full relative cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const y = Math.max(0, Math.min(rect.height, rect.bottom - e.clientY));
                const percentage = Math.round((y / rect.height) * 100);
                setVolume([percentage]);
                setIsMuted(false); // Unmute when manually adjusting volume
              }}
            >
              <div 
                className="absolute bottom-0 w-full bg-white/70 rounded-full transition-all duration-150"
                style={{ height: `${isMuted ? 0 : volume[0]}%` }}
              ></div>
              <div 
                className="absolute w-4 h-4 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing transition-all duration-150 hover:scale-110 active:scale-125"
                style={{ 
                  bottom: `${isMuted ? 0 : volume[0]}%`, 
                  left: '50%',
                  transform: 'translateX(-50%) translateY(50%)' 
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const slider = e.currentTarget.parentElement;
                  const rect = slider.getBoundingClientRect();
                  const handleMouseMove = (e) => {
                    const y = Math.max(0, Math.min(rect.height, rect.bottom - e.clientY));
                    const percentage = Math.round((y / rect.height) * 100);
                    setVolume([percentage]);
                    setIsMuted(false); // Unmute when manually adjusting
                  };
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              ></div>
            </div>
          </div>
          {isMuted || volume[0] === 0 ? (
            <VolumeX className="h-3 w-3 text-white/50" />
          ) : (
            <Volume2 className="h-3 w-3 text-white/50" />
          )}
        </div>
      </div>
    </div>
  </div>
</div>
      </div>
  )
}
