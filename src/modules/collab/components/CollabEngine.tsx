import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Video, 
  Share2, 
  UserPlus, 
  Settings,
  X,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Phone,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  isTyping?: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system' | 'task-link';
  taskId?: string;
  fileName?: string;
}

interface CollabEngineProps {
  isOpen: boolean;
  onClose: () => void;
  activeTask?: any;
  currentUserId?: string;
}

// Mock data
const mockTeamMembers: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Alex Chen',
    avatar: '🧑‍💻',
    role: 'Lead Developer',
    status: 'online'
  },
  {
    id: 'user-2',
    name: 'Sarah Kim',
    avatar: '👩‍🎨',
    role: 'UX Designer',
    status: 'online',
    isTyping: false
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    avatar: '🧑‍🔬',
    role: 'Data Analyst',
    status: 'away'
  },
  {
    id: 'user-4',
    name: 'Lisa Wong',
    avatar: '👩‍💼',
    role: 'Product Manager',
    status: 'busy'
  },
  {
    id: 'user-5',
    name: 'David Miller',
    avatar: '🧑‍🏫',
    role: 'QA Engineer',
    status: 'offline'
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'user-1',
    content: 'Hey team! I\'ve completed the API optimization for the response time loop. We should see improvements in the next sprint.',
    timestamp: new Date(Date.now() - 3600000),
    type: 'text'
  },
  {
    id: 'msg-2',
    senderId: 'user-2',
    content: 'Great work Alex! I\'ve updated the dashboard mockups based on the new performance metrics.',
    timestamp: new Date(Date.now() - 3000000),
    type: 'text'
  },
  {
    id: 'msg-3',
    senderId: 'user-3',
    content: 'The TRI scores are looking much better. Check out the latest analytics dashboard.',
    timestamp: new Date(Date.now() - 1800000),
    type: 'task-link',
    taskId: 'task-123'
  },
  {
    id: 'msg-4',
    senderId: 'system',
    content: 'Sarah Kim started pair programming session',
    timestamp: new Date(Date.now() - 900000),
    type: 'system'
  },
  {
    id: 'msg-5',
    senderId: 'user-4',
    content: 'Can we schedule a quick sync to review the intervention strategy?',
    timestamp: new Date(Date.now() - 300000),
    type: 'text'
  }
];

// Presence Indicator Component
const PresenceIndicator: React.FC<{ status: TeamMember['status'] }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'busy': return 'bg-destructive';
      case 'offline': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  return (
    <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} relative`}>
      {status === 'online' && (
        <div className="absolute inset-0 w-3 h-3 rounded-full bg-success animate-ping opacity-75" />
      )}
    </div>
  );
};

// Real-time Presence Bar
const PresenceBar: React.FC<{ members: TeamMember[] }> = ({ members }) => {
  const onlineMembers = members.filter(m => m.status === 'online');
  
  return (
    <div className="flex items-center gap-3 p-4 border-b border-border-subtle/20">
      <div className="flex -space-x-2">
        {onlineMembers.slice(0, 5).map((member) => (
          <div key={member.id} className="relative">
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {member.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1">
              <PresenceIndicator status={member.status} />
            </div>
          </div>
        ))}
        {onlineMembers.length > 5 && (
          <div className="h-8 w-8 rounded-full bg-glass-primary border-2 border-background flex items-center justify-center">
            <span className="text-xs text-foreground-subtle">+{onlineMembers.length - 5}</span>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <span className="text-sm text-foreground-subtle">
          {onlineMembers.length} online
        </span>
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" size="sm">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Monitor className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Message Component
const MessageBubble: React.FC<{ 
  message: ChatMessage; 
  sender: TeamMember | undefined;
  isOwnMessage: boolean;
}> = ({ message, sender, isOwnMessage }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-2">
        <Badge variant="secondary" className="text-xs">
          {message.content}
        </Badge>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 mb-4 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
    >
      {!isOwnMessage && sender && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
            {sender.avatar}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col max-w-[75%] ${isOwnMessage ? 'items-end' : ''}`}>
        {!isOwnMessage && sender && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-foreground">{sender.name}</span>
            <span className="text-xs text-foreground-subtle">{formatTime(message.timestamp)}</span>
          </div>
        )}
        
        <div
          className={`rounded-2xl px-4 py-2 break-words ${
            isOwnMessage
              ? 'bg-primary text-primary-foreground'
              : message.type === 'task-link'
              ? 'bg-accent/20 text-accent border border-accent/30'
              : 'bg-glass-primary border border-border-subtle/30'
          }`}
        >
          {message.type === 'task-link' ? (
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span className="text-sm">{message.content}</span>
            </div>
          ) : (
            <span className="text-sm">{message.content}</span>
          )}
        </div>
        
        {isOwnMessage && (
          <span className="text-xs text-foreground-subtle mt-1">
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// Typing Indicator
const TypingIndicator: React.FC<{ typingMembers: TeamMember[] }> = ({ typingMembers }) => {
  if (typingMembers.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 p-3 mb-2"
    >
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
      </div>
      <span className="text-xs text-foreground-subtle">
        {typingMembers.length === 1 
          ? `${typingMembers[0].name} is typing...`
          : `${typingMembers.length} people are typing...`
        }
      </span>
    </motion.div>
  );
};

// Main Component
export const CollabEngine: React.FC<CollabEngineProps> = ({
  isOpen,
  onClose,
  activeTask,
  currentUserId = 'current-user'
}) => {
  const [members] = useState<TeamMember[]>(mockTeamMembers);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const [typingMembers, setTypingMembers] = useState<TeamMember[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (inputValue.length > 0) {
      const timer = setTimeout(() => {
        setTypingMembers([members[1]]); // Sarah is typing
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setTypingMembers([]);
    }
  }, [inputValue, members]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      content: inputValue.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setTypingMembers([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: '0%', opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 bottom-0 w-96 z-50 glass-secondary border-l border-border-subtle/30 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border-subtle/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Team Collaboration</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {activeTask && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Task: {activeTask.title}
            </Badge>
            <Button variant="ghost" size="sm" className="text-xs h-6">
              <Share2 className="h-3 w-3 mr-1" />
              Share Context
            </Button>
          </div>
        )}
      </div>

      {/* Presence Bar */}
      <PresenceBar members={members} />

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            {messages.map((message) => {
              const sender = members.find(m => m.id === message.senderId);
              const isOwnMessage = message.senderId === currentUserId;
              
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  sender={sender}
                  isOwnMessage={isOwnMessage}
                />
              );
            })}
            
            <AnimatePresence>
              <TypingIndicator typingMembers={typingMembers} />
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border-subtle/20">
        <div className="flex gap-2 mb-3">
          <Button variant="ghost" size="sm" className="text-xs h-8">
            <UserPlus className="h-3 w-3 mr-1" />
            Invite
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-8">
            <Monitor className="h-3 w-3 mr-1" />
            Pair Work
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-8">
            <Settings className="h-3 w-3 mr-1" />
            Settings
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-20 bg-glass-primary/50 border-border-subtle/30"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Paperclip className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Smile className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};