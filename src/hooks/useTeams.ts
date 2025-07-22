import { useCallback } from 'react';
import { useToast } from './use-toast';

export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  status: 'online' | 'away' | 'offline';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  taskId?: string;
}

// Mock team members
const mockTeamMembers: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Alex Chen',
    avatar: '👨‍💻',
    role: 'Lead Developer',
    status: 'online'
  },
  {
    id: 'user-2', 
    name: 'Sarah Kim',
    avatar: '👩‍🎨',
    role: 'UX Designer',
    status: 'online'
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    avatar: '👨‍🔬',
    role: 'Data Analyst',
    status: 'away'
  }
];

export const useTeams = () => {
  const { toast } = useToast();

  const openTeamsChat = useCallback((taskId: string, taskTitle?: string) => {
    console.log('Opening Teams chat for task:', taskId, taskTitle);
    
    // Simulate opening chat interface
    toast({
      title: "Teams Chat Opening",
      description: `Starting collaboration session for: ${taskTitle || 'Task'}`,
      duration: 3000
    });

    // In real implementation, this would:
    // 1. Open Teams drawer/panel
    // 2. Create or join task-specific channel
    // 3. Load chat history for this task
    // 4. Notify team members
  }, [toast]);

  const inviteToTask = useCallback((taskId: string, memberIds: string[]) => {
    console.log('Inviting members to task:', taskId, memberIds);
    
    toast({
      title: "Team Members Invited",
      description: `${memberIds.length} members invited to collaborate`,
      duration: 3000
    });
  }, [toast]);

  const startPairProgramming = useCallback((taskId: string, partnerId: string) => {
    console.log('Starting pair programming:', taskId, partnerId);
    
    const partner = mockTeamMembers.find(m => m.id === partnerId);
    toast({
      title: "Pair Programming Started",
      description: `Connected with ${partner?.name || 'teammate'} for collaboration`,
      duration: 3000
    });
  }, [toast]);

  return {
    teamMembers: mockTeamMembers,
    openTeamsChat,
    inviteToTask,
    startPairProgramming
  };
};