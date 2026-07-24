import { AsyncStatus } from './common';

export type ChatRole = 'user' | 'bot' | 'assistant';

export interface ChatMessage {
  from?: ChatRole;
  text?: string;
  role?: ChatRole;
  content?: string;
  timestamp?: string;
}

export interface AiState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  status: AsyncStatus;
}
