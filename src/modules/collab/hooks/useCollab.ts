import { useState, useEffect } from 'react';

export interface CollabUser {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  lastSeen: Date;
}

export interface CollabEvent {
  id: string;
  type: 'join' | 'leave' | 'update' | 'comment';
  userId: string;
  data: any;
  timestamp: Date;
}

export const useCollabPresence = (taskId?: string) => {
  const [activeUsers, setActiveUsers] = useState<CollabUser[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Analyst',
      lastSeen: new Date()
    },
    {
      id: '2', 
      name: 'Marcus Rodriguez',
      role: 'Champion',
      lastSeen: new Date()
    }
  ]);

  const [currentUser] = useState<CollabUser>({
    id: 'current',
    name: 'You',
    role: 'Champion',
    lastSeen: new Date()
  });

  // Simulate real-time presence updates
  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(() => {
      // Simulate users joining/leaving
      setActiveUsers(prev => {
        if (Math.random() > 0.8) {
          // Randomly add/remove users
          const shouldAdd = Math.random() > 0.5;
          if (shouldAdd && prev.length < 4) {
            return [...prev, {
              id: `user-${Date.now()}`,
              name: `User ${prev.length + 1}`,
              role: 'Contributor',
              lastSeen: new Date()
            }];
          } else if (!shouldAdd && prev.length > 1) {
            return prev.slice(0, -1);
          }
        }
        return prev;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [taskId]);

  return {
    activeUsers,
    currentUser
  };
};

export const useCollabSync = (taskId: string) => {
  const [events, setEvents] = useState<CollabEvent[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  const broadcast = (event: Omit<CollabEvent, 'id' | 'timestamp'>) => {
    const newEvent: CollabEvent = {
      ...event,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    setEvents(prev => [...prev, newEvent]);
    
    // Simulate WebSocket broadcast
    console.log('Broadcasting event:', newEvent);
  };

  return {
    events,
    broadcast,
    isConnected
  };
};