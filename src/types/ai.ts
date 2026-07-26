export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isWarning?: boolean;
  createdAt: number;
}

export interface AiResponse {
  content: string;
  isWarning: boolean;
}
