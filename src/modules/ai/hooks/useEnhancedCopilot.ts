import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface CopilotMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  context?: {
    taskId?: string;
    taskTitle?: string;
    zone?: string;
    action?: string;
  };
  suggestions?: string[];
  metadata?: {
    tokens?: number;
    model?: string;
    confidence?: number;
  };
}

export interface CopilotContext {
  activeTask?: any;
  currentZone?: string;
  recentActions?: string[];
  userPreferences?: {
    responseStyle?: 'concise' | 'detailed' | 'technical';
    autoSuggest?: boolean;
  };
}

export const useEnhancedCopilot = (context?: CopilotContext) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<CopilotMessage[]>([]);
  const contextRef = useRef<CopilotContext | undefined>(context);

  // Update context when it changes
  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  // Load conversation history on mount
  useEffect(() => {
    loadConversationHistory();
  }, []);

  const loadConversationHistory = useCallback(() => {
    try {
      const stored = localStorage.getItem('rgs-copilot-history');
      if (stored) {
        const parsed = JSON.parse(stored);
        setConversationHistory(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
    } catch (error) {
      console.warn('Failed to load conversation history:', error);
    }
  }, []);

  const saveConversationHistory = useCallback((newMessages: CopilotMessage[]) => {
    try {
      localStorage.setItem('rgs-copilot-history', JSON.stringify(newMessages));
    } catch (error) {
      console.warn('Failed to save conversation history:', error);
    }
  }, []);

  const generateContextualPrompts = useCallback((currentContext?: CopilotContext): string[] => {
    const ctx = currentContext || contextRef.current;
    const prompts: string[] = [];

    if (ctx?.activeTask) {
      prompts.push(
        `Suggest SRT adjustments for "${ctx.activeTask.title}"`,
        `Draft intervention for this task`,
        `Analyze risk factors for "${ctx.activeTask.title}"`,
        `Forecast TRI impact if I adjust resources`
      );
    }

    prompts.push(
      'Show me loops at risk this sprint',
      'What tasks need my attention?',
      'Summarize my governance performance',
      'Recommend optimization strategies'
    );

    // Zone-specific prompts
    switch (ctx?.currentZone) {
      case 'think':
        prompts.push('Help me design a new loop', 'Validate my intervention logic');
        break;
      case 'act':
        prompts.push('What should I prioritize today?', 'Check task dependencies');
        break;
      case 'monitor':
        prompts.push('Explain this metric trend', 'Identify performance anomalies');
        break;
    }

    return prompts.slice(0, 6); // Limit to 6 suggestions
  }, []);

  const generateAIResponse = useCallback(async (
    userMessage: string, 
    currentContext?: CopilotContext,
    conversationContext?: CopilotMessage[]
  ): Promise<{ content: string; suggestions: string[]; metadata: any }> => {
    // Simulate AI processing with realistic delay
    const processingTime = Math.random() * 1000 + 500; // 500-1500ms
    await new Promise(resolve => setTimeout(resolve, processingTime));

    const ctx = currentContext || contextRef.current;
    const lowerMessage = userMessage.toLowerCase();

    // Context-aware responses
    let response = '';
    let newSuggestions: string[] = [];

    if (lowerMessage.includes('srt') || lowerMessage.includes('suggest')) {
      if (ctx?.activeTask) {
        response = `Based on "${ctx.activeTask.title}" performance patterns, I recommend:\n\n• Increase SRT from 0.7 to 0.85 for higher throughput\n• Monitor tension levels - currently showing amber signals\n• Consider resource reallocation from Loop B`;
        newSuggestions = ['Show detailed SRT analysis', 'Compare with similar tasks', 'Set up automated monitoring'];
      } else {
        response = 'I can help suggest SRT adjustments once you select an active task. Would you like me to analyze all current loops for optimization opportunities?';
        newSuggestions = ['Analyze all loops', 'Show performance overview', 'Identify bottlenecks'];
      }
    } else if (lowerMessage.includes('risk') || lowerMessage.includes('forecast')) {
      response = `Risk Assessment:\n\n🔴 High Risk: 2 loops showing red tension\n🟡 Medium Risk: 5 loops with resource constraints\n🟢 Low Risk: 8 loops performing optimally\n\nRecommended actions:\n• Immediate intervention needed for Loops C & F\n• Resource rebalancing for medium-risk loops`;
      newSuggestions = ['Show detailed risk breakdown', 'Schedule interventions', 'Export risk report'];
    } else if (lowerMessage.includes('performance') || lowerMessage.includes('metric')) {
      response = `Performance Summary:\n\n📈 TRI Score: 78% (↗️ +5% from last week)\n⚡ Avg Response Time: 2.3 days\n🎯 Goal Completion: 85%\n\nKey insights:\n• Sprint velocity improving\n• Decision bottlenecks reduced by 30%\n• Stakeholder satisfaction up 12%`;
      newSuggestions = ['Deep dive into metrics', 'Compare team performance', 'Set new targets'];
    } else if (lowerMessage.includes('intervention') || lowerMessage.includes('draft')) {
      response = `Intervention Draft:\n\n**Type**: Resource Optimization\n**Target**: ${ctx?.activeTask?.title || 'Selected Loop'}\n**Duration**: 2 weeks\n**Expected Impact**: +15% efficiency\n\n**Actions**:\n1. Reallocate 2 team members from low-priority tasks\n2. Implement daily stand-ups\n3. Automate routine decisions`;
      newSuggestions = ['Refine intervention details', 'Preview simulation', 'Schedule implementation'];
    } else {
      // General conversational response
      response = `I understand you're asking about: "${userMessage}"\n\nAs your governance copilot, I can help you with:\n• Strategic recommendations\n• Performance analysis\n• Risk assessment\n• Task optimization\n• Decision support\n\nWhat specific area would you like to explore?`;
      newSuggestions = generateContextualPrompts(ctx);
    }

    return {
      content: response,
      suggestions: newSuggestions,
      metadata: {
        tokens: response.length,
        model: 'RGS-Copilot-v1',
        confidence: 0.85 + Math.random() * 0.1,
        processingTime
      }
    };
  }, [generateContextualPrompts]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: CopilotMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
      context: {
        taskId: contextRef.current?.activeTask?.id,
        taskTitle: contextRef.current?.activeTask?.title,
        zone: contextRef.current?.currentZone,
      }
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Generate AI response with context
      const { content: aiContent, suggestions: newSuggestions, metadata } = await generateAIResponse(
        content,
        contextRef.current,
        [...conversationHistory, ...messages, userMessage]
      );

      const aiMessage: CopilotMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: aiContent,
        timestamp: new Date(),
        suggestions: newSuggestions,
        metadata
      };

      setMessages(prev => [...prev, aiMessage]);
      setSuggestions(newSuggestions);

      // Update conversation history
      const updatedHistory = [...conversationHistory, userMessage, aiMessage];
      setConversationHistory(updatedHistory);
      saveConversationHistory(updatedHistory);

      // Show success toast for complex queries
      if (content.length > 20) {
        toast({
          title: "Analysis Complete",
          description: "AI copilot has provided contextual recommendations",
          duration: 2000
        });
      }

    } catch (error) {
      console.error('Failed to generate AI response:', error);
      
      const errorMessage: CopilotMessage = {
        id: `error-${Date.now()}`,
        type: 'system',
        content: 'I encountered an issue processing your request. Please try again or rephrase your question.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Processing Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [isLoading, messages, conversationHistory, generateAIResponse, saveConversationHistory, toast]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setConversationHistory([]);
    setSuggestions(generateContextualPrompts(contextRef.current));
    localStorage.removeItem('rgs-copilot-history');
    
    toast({
      title: "History Cleared",
      description: "Conversation history has been reset",
      duration: 2000
    });
  }, [generateContextualPrompts, toast]);

  const useSuggestion = useCallback((suggestion: string) => {
    sendMessage(suggestion);
  }, [sendMessage]);

  // Initialize suggestions based on context
  useEffect(() => {
    if (suggestions.length === 0) {
      setSuggestions(generateContextualPrompts(contextRef.current));
    }
  }, [contextRef.current, suggestions.length, generateContextualPrompts]);

  return {
    messages,
    isLoading,
    isTyping,
    suggestions,
    conversationHistory: conversationHistory.slice(-20), // Keep last 20 messages
    sendMessage,
    clearHistory,
    useSuggestion,
    contextualPrompts: generateContextualPrompts(contextRef.current)
  };
};