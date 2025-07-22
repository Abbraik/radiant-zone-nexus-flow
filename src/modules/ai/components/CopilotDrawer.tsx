import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Lightbulb, Zap } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Badge } from '../../../components/ui/badge';
import { useCopilot } from '../hooks/useCopilot';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTask?: any;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({ 
  isOpen, 
  onClose, 
  activeTask 
}) => {
  const [message, setMessage] = useState('');
  const { messages, sendMessage, isLoading, suggestions } = useCopilot(activeTask);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const quickPrompts = [
    "Suggest optimal SRT values for this loop",
    "What's the best intervention strategy?",
    "Analyze current tensions",
    "Draft policy recommendations"
  ];

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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-teal-400" />
                  <h2 className="text-lg font-semibold text-white">AI Copilot</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {activeTask && (
                <Badge className="mt-2 bg-teal-500/20 text-teal-300">
                  Working on: {activeTask.title}
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b border-white/10">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setMessage(prompt)}
                    className="text-xs text-left h-auto p-2 text-gray-300 hover:bg-white/10"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-teal-500/20 text-white ml-8'
                        : 'bg-white/10 text-gray-200 mr-8'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.type === 'ai' && <Bot className="h-4 w-4 text-teal-400 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm">{msg.content}</p>
                        {msg.suggestions && (
                          <div className="mt-2 space-y-1">
                            {msg.suggestions.map((suggestion, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <Lightbulb className="h-3 w-3 text-yellow-400" />
                                <span className="text-gray-300">{suggestion}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Bot className="h-4 w-4 animate-pulse" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-white/20">
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask AI for assistance..."
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[60px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || isLoading}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};