export interface Message {
    id: string;
    role: 'user' | 'support';
    content: string;
    timestamp: string;
  }
  
  export interface Chat {
    chatId: string;
    wallet: string;
    context: 'Food Delivery' | 'Ecommerce';
    status: 'ongoing' | 'expired' | 'resolved';
    messages: Message[];
    rating: number | null;
    createdAt: string;
    expiresAt: string;
  }