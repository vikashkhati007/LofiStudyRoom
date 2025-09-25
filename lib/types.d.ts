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
}