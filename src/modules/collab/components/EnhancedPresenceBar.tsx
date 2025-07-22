import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';
import { Users, Video } from 'lucide-react';
import { mockCollabUsers } from '../data/mockData';

interface EnhancedPresenceBarProps {
  taskId?: string;
  onPairWorkStart?: (partnerId: string) => void;
}

export const EnhancedPresenceBar: React.FC<EnhancedPresenceBarProps> = ({ 
  taskId,
  onPairWorkStart 
}) => {
  const activeUsers = mockCollabUsers.filter(user => user.status === 'online');
  const otherUsers = mockCollabUsers.filter(user => user.status !== 'online');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'busy':
        return 'Busy';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  if (activeUsers.length === 0) return null;

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-3 bg-glass/70 backdrop-blur-20 border border-white/10 rounded-lg"
      >
        {/* Active Collaborators */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-400" />
          <span className="text-sm text-gray-300">Active:</span>
          
          <div className="flex -space-x-2">
            {activeUsers.slice(0, 4).map((user, index) => (
              <Tooltip key={user.id}>
                <TooltipTrigger>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <Avatar className="h-8 w-8 border-2 border-background ring-1 ring-purple-400">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-purple-500 text-white text-xs">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Status Indicator */}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`} />
                    
                    {/* Cursor Activity Indicator */}
                    {user.cursor && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full"
                      />
                    )}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                      <span className="text-xs">{getStatusText(user.status)}</span>
                    </div>
                    {user.cursor && (
                      <p className="text-xs text-blue-400 mt-1">
                        Working on: {user.cursor.widget || 'workspace'}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          
          {activeUsers.length > 4 && (
            <Badge variant="secondary" className="bg-white/10 text-white text-xs ml-2">
              +{activeUsers.length - 4}
            </Badge>
          )}
        </div>

        {/* Pair Work Button */}
        {activeUsers.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPairWorkStart?.(activeUsers[0].id)}
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200"
          >
            <Video className="h-3 w-3 mr-1" />
            Pair Work
          </Button>
        )}

        {/* Activity Indicator */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>{activeUsers.length} active</span>
        </div>

        {/* Real-time Activity */}
        {activeUsers.some(u => u.cursor) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-blue-400"
          >
            Live edits in progress...
          </motion.div>
        )}
      </motion.div>
    </TooltipProvider>
  );
};