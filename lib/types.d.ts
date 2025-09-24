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