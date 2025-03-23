export interface Message {
    id: string;
    role: 'user' | 'support';
    content: string;
    timestamp?: string;
  }
  
  export interface Chat {
    chatId: string;
    wallet: string;
    category: string;
    status: 'ongoing' | 'expired' | 'resolved';
    messages: Message[];
    rating: number | null;
    refundLink?: string | null;
    createdAt: string;
    expiresAt: string;
  }