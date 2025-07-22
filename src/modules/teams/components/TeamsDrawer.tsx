import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Smile, 
  AtSign, 
  MoreVertical,
  ExternalLink,
  Users
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';
import { mockTeamsMessages, TeamsMessage } from '../../collab/data/mockData';
import { formatDistanceToNow } from 'date-fns';

interface TeamsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  taskId?: string;
  taskTitle?: string;
}

export const TeamsDrawer: React.FC<TeamsDrawerProps> = ({ 
  isOpen, 
  onClose, 
  taskId,
  taskTitle 
}) => {
  const [messages, setMessages] = useState<TeamsMessage[]>(mockTeamsMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: TeamsMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate response
      const response: TeamsMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'bot-assistant',
        userName: 'AI Assistant',
        content: `Thanks for the update! I've noted the information about ${taskTitle || 'the current task'}.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
        if (existingReaction) {
          // Toggle reaction
          if (existingReaction.users.includes('You')) {
            existingReaction.users = existingReaction.users.filter(u => u !== 'You');
          } else {
            existingReaction.users.push('You');
          }
        } else {
          msg.reactions = [...(msg.reactions || []), { emoji, users: ['You'] }];
        }
      }
      return msg;
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
            className="fixed right-0 top-0 h-full w-96 bg-glass/90 backdrop-blur-20 border-l border-white/20 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-white">Teams Chat</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {taskTitle && (
                <Badge className="bg-blue-500/20 text-blue-300">
                  Discussing: {taskTitle}
                </Badge>
              )}
              
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                <Users className="h-3 w-3" />
                <span>4 participants active</span>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.userAvatar} />
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {message.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">
                            {message.userName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="bg-white/10 rounded-lg p-3 text-sm text-gray-200">
                          {message.content}
                        </div>
                        
                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {message.reactions.map((reaction, i) => (
                              <TooltipProvider key={i}>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <button
                                      onClick={() => addReaction(message.id, reaction.emoji)}
                                      className="flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs transition-colors"
                                    >
                                      <span>{reaction.emoji}</span>
                                      <span className="text-gray-400">{reaction.users.length}</span>
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{reaction.users.join(', ')}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                            
                            <button
                              onClick={() => addReaction(message.id, '👍')}
                              className="flex items-center justify-center w-6 h-6 bg-white/5 hover:bg-white/10 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-gray-400"
                  >
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">AI Assistant is typing...</span>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-white/20">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <AtSign className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Smile className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <button className="text-blue-400 hover:text-blue-300">
                  Open in Teams
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};