import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Trash2, 
  MessageSquare, 
  Brain, 
  Zap, 
  Target,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useEnhancedCopilot, type CopilotMessage } from '../hooks/useEnhancedCopilot';

interface EnhancedCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTask?: any;
  currentZone?: string;
}

export const EnhancedCopilotDrawer: React.FC<EnhancedCopilotDrawerProps> = ({
  isOpen,
  onClose,
  activeTask,
  currentZone
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    isTyping,
    suggestions,
    conversationHistory,
    sendMessage,
    clearHistory,
    useSuggestion,
    contextualPrompts
  } = useEnhancedCopilot({
    activeTask,
    currentZone,
    userPreferences: {
      responseStyle: 'detailed',
      autoSuggest: true
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    useSuggestion(suggestion);
  };

  const formatMessage = (message: CopilotMessage) => {
    const lines = message.content.split('\n');
    return lines.map((line, index) => {
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={index} className="flex items-start gap-2 ml-4">
            <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span>{line.replace(/^[•-]\s*/, '')}</span>
          </div>
        );
      }
      if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
        return (
          <div key={index} className="font-semibold text-foreground mt-2 mb-1">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      if (line.includes('🔴') || line.includes('🟡') || line.includes('🟢') || line.includes('📈') || line.includes('⚡') || line.includes('🎯')) {
        return (
          <div key={index} className="flex items-center gap-2 font-medium">
            {line}
          </div>
        );
      }
      return line.trim() ? <div key={index}>{line}</div> : <div key={index} className="h-2" />;
    });
  };

  const drawerVariants = {
    closed: { x: '100%', opacity: 0 },
    open: { x: '0%', opacity: 1 }
  };

  const messageVariants = {
    initial: { opacity: 0, y: 10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="flex-1 bg-black/20 backdrop-blur-sm"
        />

        {/* Drawer */}
        <motion.div
          initial={drawerVariants.closed}
          animate={drawerVariants.open}
          exit={drawerVariants.closed}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-96 h-full glass-secondary border-l border-border-subtle/30 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-border-subtle/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Brain className="h-4 w-4 text-background" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">AI Copilot</h2>
                  <p className="text-xs text-foreground-subtle">Your governance assistant</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Context Info */}
            <div className="flex flex-wrap gap-2">
              {activeTask && (
                <Badge variant="outline" className="text-xs">
                  <Target className="h-3 w-3 mr-1" />
                  {activeTask.title}
                </Badge>
              )}
              {currentZone && (
                <Badge variant="secondary" className="text-xs">
                  Zone: {currentZone}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {messages.length} messages
              </Badge>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-border-subtle/20">
            <div className="grid grid-cols-2 gap-2">
              {contextualPrompts.slice(0, 4).map((prompt, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSuggestionClick(prompt)}
                  className="text-xs text-left p-2 h-auto justify-start"
                  disabled={isLoading}
                >
                  <Sparkles className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{prompt}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-6">
              <div className="py-4 space-y-4">
                {/* Welcome Message */}
                {messages.length === 0 && (
                  <motion.div
                    initial={messageVariants.initial}
                    animate={messageVariants.animate}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="text-center py-8"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-foreground mb-2">
                      Welcome to AI Copilot
                    </h3>
                    <p className="text-sm text-foreground-subtle mb-4">
                      I'm here to help optimize your governance workflows and provide strategic insights.
                    </p>
                    <div className="text-xs text-foreground-subtle">
                      Try asking: "Suggest SRT adjustments" or "Show risk analysis"
                    </div>
                  </motion.div>
                )}

                {/* Message List */}
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={messageVariants.initial}
                    animate={messageVariants.animate}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : message.type === 'system'
                          ? 'bg-warning/20 text-warning border border-warning/30'
                          : 'bg-glass-primary border border-border-subtle/30'
                      }`}
                    >
                      <div className="text-sm leading-relaxed space-y-1">
                        {message.type === 'ai' ? formatMessage(message) : message.content}
                      </div>
                      
                      {/* Metadata */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-subtle/20">
                        <span className="text-xs text-foreground-subtle">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.metadata?.confidence && (
                          <Badge variant="outline" className="text-xs">
                            {Math.round(message.metadata.confidence * 100)}% confidence
                          </Badge>
                        )}
                      </div>

                      {/* AI Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="text-xs text-foreground-subtle font-medium">Follow up:</div>
                          {message.suggestions.slice(0, 3).map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs h-auto p-2 justify-start w-full bg-glass-secondary/50 hover:bg-glass-secondary"
                              disabled={isLoading}
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-glass-primary border border-border-subtle/30 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-foreground-subtle">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-xs">AI is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Input */}
          <div className="p-6 border-t border-border-subtle/20">
            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about tasks, metrics, or optimizations..."
                  disabled={isLoading}
                  className="pr-10 bg-glass-primary/50 border-border-subtle/30"
                />
                <Button
                  size="sm"
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  disabled={messages.length === 0}
                  className="text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear
                </Button>
                <Badge variant="outline" className="text-xs">
                  {conversationHistory.length} history
                </Badge>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-foreground-subtle">
                <TrendingUp className="h-3 w-3" />
                Enhanced AI
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};