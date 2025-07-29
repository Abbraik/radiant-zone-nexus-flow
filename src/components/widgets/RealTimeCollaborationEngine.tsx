import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageCircle, Eye, Edit, Cursor, Clock, Bell } from 'lucide-react';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface CollaboratorPresence {
  id: string;
  name: string;
  avatar: string;
  color: string;
  status: 'active' | 'idle' | 'away';
  currentAction: string;
  cursor?: { x: number; y: number; };
  lastSeen: Date;
}

interface Comment {
  id: string;
  authorId: string;
  content: string;
  timestamp: Date;
  resolved: boolean;
  interventionId?: string;
  position: { x: number; y: number; };
}

interface LiveEdit {
  id: string;
  userId: string;
  type: 'intervention_add' | 'intervention_remove' | 'dependency_add' | 'role_assign';
  data: any;
  timestamp: Date;
}

const mockCollaborators: CollaboratorPresence[] = [
  {
    id: 'user-1',
    name: 'Dr. Sarah Chen',
    avatar: '👩‍⚕️',
    color: 'bg-teal-500',
    status: 'active',
    currentAction: 'Reviewing RACI assignments',
    cursor: { x: 450, y: 200 },
    lastSeen: new Date()
  },
  {
    id: 'user-2',
    name: 'Prof. Ahmed',
    avatar: '👨‍🎓',
    color: 'bg-purple-500',
    status: 'active',
    currentAction: 'Adding intervention dependency',
    cursor: { x: 200, y: 350 },
    lastSeen: new Date(Date.now() - 30000)
  },
  {
    id: 'user-3',
    name: 'Maria Santos',
    avatar: '👩‍💼',
    color: 'bg-blue-500',
    status: 'idle',
    currentAction: 'Idle',
    lastSeen: new Date(Date.now() - 120000)
  }
];

const mockComments: Comment[] = [
  {
    id: 'comment-1',
    authorId: 'user-1',
    content: 'We should consider the timeline overlap with the health infrastructure project',
    timestamp: new Date(Date.now() - 300000),
    resolved: false,
    interventionId: 'pop-1',
    position: { x: 300, y: 150 }
  },
  {
    id: 'comment-2',
    authorId: 'user-2',
    content: 'Good synergy identified between education and family planning programs',
    timestamp: new Date(Date.now() - 600000),
    resolved: true,
    interventionId: 'pop-2',
    position: { x: 400, y: 250 }
  }
];

interface RealTimeCollaborationEngineProps {
  onCommentAdd: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  onPresenceUpdate: (presence: CollaboratorPresence[]) => void;
}

export const RealTimeCollaborationEngine: React.FC<RealTimeCollaborationEngineProps> = ({
  onCommentAdd,
  onPresenceUpdate
}) => {
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>(mockCollaborators);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(true);
  const [isAddingComment, setIsAddingComment] = useState(false);

  // Simulate real-time presence updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(prev => prev.map(collab => ({
        ...collab,
        cursor: {
          x: Math.max(0, Math.min(800, collab.cursor?.x + (Math.random() - 0.5) * 100)) || Math.random() * 800,
          y: Math.max(0, Math.min(600, collab.cursor?.y + (Math.random() - 0.5) * 50)) || Math.random() * 600
        },
        lastSeen: collab.status === 'active' ? new Date() : collab.lastSeen
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        authorId: 'current-user',
        content: newComment,
        timestamp: new Date(),
        resolved: false,
        position: { x: Math.random() * 600, y: Math.random() * 400 }
      };
      
      setComments(prev => [...prev, comment]);
      onCommentAdd(comment);
      setNewComment('');
      setIsAddingComment(false);
    }
  };

  const toggleCommentResolved = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, resolved: !comment.resolved }
        : comment
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'away': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const unresolvedComments = comments.filter(c => !c.resolved);

  return (
    <Card className="p-6 bg-white/5 border-white/10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Live Collaboration</h3>
              <p className="text-sm text-gray-400">Real-time editing with team presence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="border-white/30 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Comments ({unresolvedComments.length})
            </Button>
          </div>
        </div>

        {/* Active Collaborators */}
        <div className="space-y-3">
          <h4 className="text-white font-medium flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Team Presence ({collaborators.filter(c => c.status === 'active').length} active)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {collaborators.map(collaborator => (
              <motion.div
                key={collaborator.id}
                className="p-3 bg-white/5 rounded-lg border border-white/10"
                layout
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={`${collaborator.color} text-white`}>
                        {collaborator.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <motion.div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(collaborator.status)}`}
                      animate={{ scale: collaborator.status === 'active' ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-white font-medium">{collaborator.name}</div>
                    <div className="text-xs text-gray-400">{collaborator.currentAction}</div>
                    <div className="text-xs text-gray-500">
                      {collaborator.status === 'active' ? 'Just now' : 
                       `${Math.round((Date.now() - collaborator.lastSeen.getTime()) / 60000)}m ago`}
                    </div>
                  </div>

                  {collaborator.status === 'active' && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 bg-green-400 rounded-full"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live Cursors Visualization */}
        <div className="relative">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 h-48 overflow-hidden">
            <div className="text-sm text-gray-400 mb-2">Live Cursor Tracking</div>
            <div className="relative w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded">
              {collaborators
                .filter(c => c.status === 'active' && c.cursor)
                .map(collaborator => (
                  <motion.div
                    key={`cursor-${collaborator.id}`}
                    className="absolute"
                    animate={{
                      x: (collaborator.cursor!.x / 800) * 100 + '%',
                      y: (collaborator.cursor!.y / 600) * 100 + '%'
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <div className="flex items-center gap-1">
                      <Cursor className={`w-4 h-4 text-white`} style={{ color: collaborator.color.replace('bg-', '') === 'teal-500' ? '#14b8a6' : collaborator.color.replace('bg-', '') === 'purple-500' ? '#a855f7' : '#3b82f6' }} />
                      <div className={`text-xs text-white px-2 py-1 rounded ${collaborator.color}`}>
                        {collaborator.name.split(' ')[0]}
                      </div>
                    </div>
                  </motion.div>
                ))
              }
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Discussion Thread
                </h4>
                <Button
                  size="sm"
                  onClick={() => setIsAddingComment(true)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Add Comment
                </Button>
              </div>

              {/* Add Comment Form */}
              <AnimatePresence>
                {isAddingComment && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="space-y-3">
                      <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add your comment..."
                        className="bg-white/10 border-white/20 text-white"
                        onKeyPress={(e) => e.key === 'Enter' && addComment()}
                      />
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={addComment} className="bg-green-500 hover:bg-green-600">
                          Post Comment
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setIsAddingComment(false);
                            setNewComment('');
                          }}
                          className="border-white/30 text-white"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Comments List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {comments.map(comment => {
                  const author = collaborators.find(c => c.id === comment.authorId);
                  return (
                    <motion.div
                      key={comment.id}
                      layout
                      className={`p-3 rounded-lg border ${
                        comment.resolved 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`${author?.color || 'bg-gray-500'} text-white text-sm`}>
                            {author?.avatar || '👤'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium">{author?.name || 'Unknown'}</span>
                            <span className="text-xs text-gray-400">
                              {comment.timestamp.toLocaleTimeString()}
                            </span>
                            {comment.resolved && (
                              <Badge className="bg-green-500/20 text-green-300 text-xs">
                                Resolved
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-300 mb-2">{comment.content}</div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleCommentResolved(comment.id)}
                            className="border-white/30 text-white text-xs h-6"
                          >
                            {comment.resolved ? 'Reopen' : 'Resolve'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Activity Feed */}
        <div className="space-y-3">
          <h4 className="text-white font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Activity
          </h4>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-white/5 rounded">
              <Bell className="h-4 w-4 text-blue-400" />
              <div className="text-sm text-gray-300">
                <span className="text-white">Dr. Sarah Chen</span> assigned RACI roles to 3 interventions
              </div>
              <span className="text-xs text-gray-500 ml-auto">2m ago</span>
            </div>
            
            <div className="flex items-center gap-3 p-2 bg-white/5 rounded">
              <Bell className="h-4 w-4 text-green-400" />
              <div className="text-sm text-gray-300">
                <span className="text-white">Prof. Ahmed</span> added dependency between Family Planning and Education
              </div>
              <span className="text-xs text-gray-500 ml-auto">5m ago</span>
            </div>
            
            <div className="flex items-center gap-3 p-2 bg-white/5 rounded">
              <Bell className="h-4 w-4 text-purple-400" />
              <div className="text-sm text-gray-300">
                AI Bundle Optimizer suggested 3 new synergies
              </div>
              <span className="text-xs text-gray-500 ml-auto">8m ago</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RealTimeCollaborationEngine;