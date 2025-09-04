
import type React from 'react';

export enum MessageAuthor {
  USER = 'user',
  RHESUS = 'rhesus',
  SYSTEM = 'system',
}

export interface Message {
  id: string;
  author: MessageAuthor;
  content: React.ReactNode;
}
