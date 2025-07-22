import { useState, useCallback } from 'react';

export interface CopilotMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export const useCopilot = (activeTask?: any) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I\'m your AI Copilot. I can help you with task insights, SRT recommendations, and governance strategies.',
      timestamp: new Date(),
      suggestions: [
        'Optimize tension parameters',
        'Generate intervention strategies',
        'Analyze performance metrics'
      ]
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions] = useState([
    'Based on Loop A data, consider reducing SRT range to 0.6-0.8',
    'Current bundle B shows high intervention potential',
    'TRI patterns suggest quarterly review schedule'
  ]);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: CopilotMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(content, activeTask),
        timestamp: new Date(),
        suggestions: generateSuggestions(content, activeTask)
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  }, [activeTask]);

  return {
    messages,
    sendMessage,
    isLoading,
    suggestions
  };
};

const generateAIResponse = (userMessage: string, activeTask?: any): string => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('srt') || message.includes('tension')) {
    return `For ${activeTask?.title || 'this task'}, I recommend starting with SRT values between 0.4-0.7. This range typically provides good balance between stability and responsiveness. Would you like me to analyze specific tension patterns?`;
  }
  
  if (message.includes('intervention') || message.includes('strategy')) {
    return `Based on current data patterns, I suggest a multi-layered intervention approach: 1) Immediate tactical adjustments, 2) Short-term process optimization, 3) Long-term structural improvements. Shall I elaborate on any specific layer?`;
  }
  
  if (message.includes('analyze') || message.includes('performance')) {
    return `I've analyzed recent performance metrics. Key insights: Task completion rate is 87%, average cycle time is 2.3 hours, and there's a 15% improvement opportunity in the review phase. Would you like detailed breakdowns?`;
  }
  
  return `I understand you're asking about "${userMessage}". Let me help you with actionable insights for ${activeTask?.title || 'your current task'}. Could you provide more specific context about what aspect you'd like to focus on?`;
};

const generateSuggestions = (userMessage: string, activeTask?: any): string[] => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('srt')) {
    return [
      'Set initial SRT to 0.6 for optimal balance',
      'Monitor feedback loops every 2 hours',
      'Consider environmental factors'
    ];
  }
  
  if (message.includes('intervention')) {
    return [
      'Implement graduated response protocol',
      'Establish clear escalation triggers',
      'Schedule regular effectiveness reviews'
    ];
  }
  
  return [
    'Review historical patterns',
    'Consider stakeholder impact',
    'Plan implementation timeline'
  ];
};