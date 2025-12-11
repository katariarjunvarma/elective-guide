import { User } from "@/utils/authApi";

export interface UserMessage {
  id: string;
  userId: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  batchId?: string;
}

const STORAGE_KEY_MESSAGES = "ers_messages";

export function loadAllMessages(): UserMessage[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY_MESSAGES);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as UserMessage[];
  } catch {
    return [];
  }
}

function saveAllMessages(messages: UserMessage[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
}

export function loadMessagesForUser(userId: string): UserMessage[] {
  return loadAllMessages().filter((m) => m.userId === userId);
}

export function countUnreadMessagesForUser(userId: string): number {
  return loadAllMessages().filter((m) => m.userId === userId && !m.read).length;
}

export function addMessageForUser(user: User, title: string, body: string, batchId?: string): UserMessage {
  const all = loadAllMessages();
  const message: UserMessage = {
    id: `msg-${Date.now()}`,
    userId: user.id,
    title,
    body,
    createdAt: new Date().toISOString(),
    read: false,
    batchId,
  };
  all.push(message);
  saveAllMessages(all);
  return message;
}

export function markAllMessagesReadForUser(userId: string): void {
  const all = loadAllMessages();
  const updated = all.map((m) => (m.userId === userId ? { ...m, read: true } : m));
  saveAllMessages(updated);
}
