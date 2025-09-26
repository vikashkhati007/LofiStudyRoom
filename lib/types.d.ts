export interface NotificationItem {
  id: string;
  message: string;
  timestamp: string;
  type?: "music" | "timer" | "info" | "chat";
}

export interface Message {
  $id: string;
  senderName: string;
  messageContent: string;
  timestamp: string;
  senderId: string;
}

export interface Message {
  $id: string
  senderName: string
  messageContent: string
  timestamp: string
  senderId: string // Ensure this is string
}

export interface WorldChatProps {
  isOpen: boolean
  onClose: () => void
  onNewMessage?: (message: Message) => void
  currentUser: { id: string; name: string; } | null; // Add this line
}

export interface Track {
  title: string
  artist: string
  album: string
  duration: number
  currentTime: number
}

export interface DynamicIslandProps {
  track: Track
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
}

export interface TimerDynamicIslandProps {
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


export interface NotificationItem {
  id: string
  message: string
  timestamp: string
  type?: "music" | "timer" | "info" | "chat"
}

export interface ToastNotificationProps {
  notification: NotificationItem | null
  onClose: () => void
}