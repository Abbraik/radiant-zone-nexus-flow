import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';
import { useCollabPresence } from '../hooks/useCollab';

interface PresenceBarProps {
  taskId?: string;
}

export const PresenceBar: React.FC<PresenceBarProps> = ({ taskId }) => {
  const { activeUsers, currentUser } = useCollabPresence(taskId);

  if (activeUsers.length === 0) return null;

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <div className="flex -space-x-2">
          {activeUsers.slice(0, 3).map((user, index) => (
            <Tooltip key={user.id}>
              <TooltipTrigger>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Avatar className="h-8 w-8 border-2 border-background ring-2 ring-teal-400">
                    <AvatarFallback className="bg-teal-500 text-white text-xs">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Active now</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        {activeUsers.length > 3 && (
          <Badge variant="secondary" className="bg-white/10 text-white text-xs">
            +{activeUsers.length - 3}
          </Badge>
        )}
        
        <div className="text-xs text-gray-400">
          {activeUsers.length} collaborator{activeUsers.length !== 1 ? 's' : ''} active
        </div>
      </motion.div>
    </TooltipProvider>
  );
};