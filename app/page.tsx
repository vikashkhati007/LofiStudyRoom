"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, SkipBack, SkipForward, Palette, Music } from "lucide-react"
import Image from "next/image"
import DynamicIsland from "./components/dynamic-island"

export default function LofiPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentScene, setCurrentScene] = useState("bedroom")
  const [volume, setVolume] = useState([75])
  const [rainVolume, setRainVolume] = useState([30])
  const [fireVolume, setFireVolume] = useState([20])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work')
  
  // Audio refs
  const audioRef = useRef<HTMLAudioElement>(null)
  const rainAudioRef = useRef<HTMLAudioElement>(null)
  const fireAudioRef = useRef<HTMLAudioElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const scenes = [
    {
      id: "bedroom",
      name: "Cozy Bedroom",
      image: "/images/cozy-bedroom-thumb.png",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      id: "vanlife",
      name: "VAN LIFE",
      image: "/images/van-life-thumb.png",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: "cafe",
      name: "LOFI CAFÉ",
      image: "/images/lofi-cafe-thumb.png",
      color: "from-amber-500/20 to-orange-500/20",
    },
    {
      id: "forest",
      name: "Forest House",
      image: "/images/forest-house-thumb.png",
      color: "from-green-500/20 to-emerald-500/20",
    },
  ]

  const currentTrack = {
    title: "Lofi Study Session",
    artist: "Chillhop Collective",
    album: "Lofi Dreams Vol. 3",
    duration: duration,
    currentTime: currentTime,
  }

  // Initialize audio
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
        setIsPlaying(false)
        setCurrentTime(0)
      }
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
      }
    }
  }, [])

  // Handle play/pause
  const handlePlayPause = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          await audioRef.current.pause()
        } else {
          await audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
      } catch (error) {
        console.error('Error playing audio:', error)
      }
    }
  }

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100
    }
  }, [volume])

  useEffect(() => {
    if (rainAudioRef.current) {
      rainAudioRef.current.volume = rainVolume[0] / 100
    }
  }, [rainVolume])

  useEffect(() => {
    if (fireAudioRef.current) {
      fireAudioRef.current.volume = fireVolume[0] / 100
    }
  }, [fireVolume])

  // Handle skip functions
  const handleNext = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioRef.current.duration)
    }
  }

  const handlePrevious = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0)
    }
  }

  // Timer functions
  const startTimer = () => {
    if (isTimerRunning) {
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      setIsTimerRunning(false)
    } else {
      // Start timer
      setIsTimerRunning(true)
      timerRef.current = setInterval(() => {
        setTimerSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1
          } else if (timerMinutes > 0) {
            setTimerMinutes((prevMinutes) => prevMinutes - 1)
            return 59
          } else {
            // Timer finished
            if (timerRef.current) {
              clearInterval(timerRef.current)
              timerRef.current = null
            }
            setIsTimerRunning(false)
            
            // Switch between work and break
            if (timerMode === 'work') {
              setTimerMode('break')
              setTimerMinutes(5)
              setTimerSeconds(0)
            } else {
              setTimerMode('work')
              setTimerMinutes(25)
              setTimerSeconds(0)
            }
            
            return 0
          }
        })
      }, 1000)
    }
  }

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsTimerRunning(false)
    setTimerMode('work')
    setTimerMinutes(25)
    setTimerSeconds(0)
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Audio Elements */}
      <audio
        ref={audioRef}
        src="/lofi.mp3"
        preload="metadata"
        loop
      />
      <audio
        ref={rainAudioRef}
        src="/rain.mp3" // Add rain sound if available
        preload="metadata"
        loop
      />
      <audio
        ref={fireAudioRef}
        src="/fire.mp3" // Add fire sound if available
        preload="metadata"
        loop
      />

      {/* Background Image */}
      <div className="absolute inset-0">
        <Image src="/images/lofi-bedroom-scene.png" alt="Cozy study room" fill className="object-cover" priority />
        {/* Film Grain Overlay */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40" />
      </div>

      {/* Dynamic Island */}
      <DynamicIsland
        track={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

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

      {/* Right Sidebar - Animated iOS Style Glassmorphism */}
      <div
        className={`absolute right-4 top-20 bottom-4 w-72 transition-all duration-500 ease-out ${
          isSettingsOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="ios-glass h-full rounded-2xl p-4 transform transition-all duration-500">
          <Tabs defaultValue="scenes" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1">
              <TabsTrigger
                value="scenes"
                className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 rounded-lg transition-all"
              >
                <Palette className="h-4 w-4 mr-1" />
                Scenes
              </TabsTrigger>
              <TabsTrigger
                value="sounds"
                className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 rounded-lg transition-all"
              >
                <Music className="h-4 w-4 mr-1" />
                Sounds
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scenes" className="flex-1 mt-4 space-y-3 overflow-y-auto">
              <h3 className="text-white font-semibold text-lg mb-3">Study Scenes</h3>
              {scenes.map((scene) => (
                <div
                  key={scene.id}
                  className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    currentScene === scene.id
                      ? "ring-2 ring-white/60 scale-[1.02] shadow-lg"
                      : "hover:scale-[1.01] hover:ring-1 hover:ring-white/40"
                  }`}
                  onClick={() => setCurrentScene(scene.id)}
                >
                  <div className="ios-glass-card rounded-xl overflow-hidden">
                    <Image
                      src={scene.image || "/placeholder.svg"}
                      alt={scene.name}
                      width={120}
                      height={80}
                      className="w-full h-20 object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${scene.color} to-transparent`} />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h4 className="text-white font-medium text-sm drop-shadow-lg">{scene.name}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="sounds" className="flex-1 mt-4 space-y-4">
              <h3 className="text-white font-semibold text-lg mb-3">Ambient Sounds</h3>

              <div className="space-y-4">
                <div className="ios-glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Music Volume</span>
                    <span className="text-white/70 text-sm">{volume[0]}%</span>
                  </div>
                  <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="ios-slider" />
                </div>

                <div className="ios-glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Rain</span>
                    <span className="text-white/70 text-sm">{rainVolume[0]}%</span>
                  </div>
                  <Slider value={rainVolume} onValueChange={setRainVolume} max={100} step={1} className="ios-slider" />
                  <Button
                    className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white text-xs"
                    onClick={() => {
                      if (rainAudioRef.current) {
                        if (rainAudioRef.current.paused) {
                          rainAudioRef.current.play()
                        } else {
                          rainAudioRef.current.pause()
                        }
                      }
                    }}
                  >
                    Toggle Rain
                  </Button>
                </div>

                <div className="ios-glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Fireplace</span>
                    <span className="text-white/70 text-sm">{fireVolume[0]}%</span>
                  </div>
                  <Slider value={fireVolume} onValueChange={setFireVolume} max={100} step={1} className="ios-slider" />
                  <Button
                    className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white text-xs"
                    onClick={() => {
                      if (fireAudioRef.current) {
                        if (fireAudioRef.current.paused) {
                          fireAudioRef.current.play()
                        } else {
                          fireAudioRef.current.pause()
                        }
                      }
                    }}
                  >
                    Toggle Fire
                  </Button>
                </div>
              </div>
            </TabsContent>


          </Tabs>
        </div>
      </div>

      {/* Music Player Controls - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="ios-glass rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 rounded-xl"
              onClick={handlePrevious}
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 w-12 h-12 rounded-xl"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 rounded-xl"
              onClick={handleNext}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Study Timer - Bottom Left */}
      <div className="absolute bottom-8 left-8">
        <div className="ios-glass rounded-2xl p-4 max-w-xs">
          <div className="text-white">
            <div className="flex items-center justify-center mb-2">
             <h4 className="font-semibold text-xs">
                {timerMode === 'work' ? 'Focus Session' : 'Break Time'}
              </h4>
              </div>
            <div className="flex items-center justify-center mb-2">
              <div className="text-xl font-mono">
                {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
              </div>
            </div>
            <div className="flex items-center justify-between">
             
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs px-2 py-1 h-6 rounded-md ${
                    isTimerRunning 
                      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-200 border-red-500/30' 
                      : 'bg-green-500/20 hover:bg-green-500/30 text-green-200 border-green-500/30'
                  }`}
                  onClick={startTimer}
                >
                  {isTimerRunning ? 'Pause' : 'Start'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs px-2 py-1 h-6 rounded-md bg-white/10 hover:bg-white/20 text-white/80 border-white/20"
                  onClick={resetTimer}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}