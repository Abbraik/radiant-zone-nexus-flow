import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  X, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff,
  Share,
  MessageSquare,
  Settings,
  ExternalLink,
  Send
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { mockCollabUsers } from '../data/mockData';

interface PairWorkOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  partnerId?: string;
  taskTitle?: string;
}

export const PairWorkOverlay: React.FC<PairWorkOverlayProps> = ({ 
  isOpen, 
  onClose, 
  partnerId,
  taskTitle 
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const partner = mockCollabUsers.find(u => u.id === partnerId) || mockCollabUsers[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50"
          />
          
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
            className="fixed inset-4 bg-glass/90 backdrop-blur-20 border border-white/20 rounded-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-purple-400" />
                  <div>
                    <h2 className="text-lg font-semibold text-white">Pair Work Session</h2>
                    <p className="text-sm text-gray-400">
                      Working with {partner.name} on {taskTitle || 'current task'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-300">
                    Live
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
              
              {/* Left Side - Workspace */}
              <div className="flex-1 p-4">
                <Card className="h-full bg-white/5 border-white/10 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-white">Synchronized Workspace</h3>
                    <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-300">
                      Real-time Sync
                    </Badge>
                  </div>
                  
                  {/* Simulated Workspace Content */}
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <h4 className="text-sm font-medium text-white mb-2">SRT Range Slider</h4>
                      <div className="relative">
                        <div className="w-full h-2 bg-gray-600 rounded">
                          <div className="h-2 bg-blue-500 rounded" style={{ width: '65%' }}></div>
                        </div>
                        <div className="absolute top-0 left-[65%] w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-purple-400 rounded-full opacity-50"
                          />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {partner.name} is adjusting this slider
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <h4 className="text-sm font-medium text-white mb-2">Bundle Preview</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded">
                          <span className="text-sm text-white">Intervention A</span>
                          <Badge variant="outline" className="text-xs">Selected</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/5 rounded relative">
                          <span className="text-sm text-white">Intervention B</span>
                          <Badge variant="outline" className="text-xs">Pending</Badge>
                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute inset-0 border-2 border-purple-400 rounded"
                          />
                        </div>
                        <div className="text-xs text-gray-400">
                          {partner.name} is reviewing this intervention
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Side - Video & Chat */}
              <div className="w-80 p-4 border-l border-white/10">
                <div className="space-y-4">
                  
                  {/* Video Call */}
                  <Card className="p-4 bg-white/5 border-white/10">
                    <div className="space-y-4">
                      
                      {/* Partner Video */}
                      <div className="relative">
                        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={partner.avatar} />
                              <AvatarFallback className="bg-purple-500 text-white text-lg">
                                {partner.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="secondary" className="bg-black/50 text-white text-xs">
                              {partner.name}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Your Video (Picture-in-Picture) */}
                      <div className="relative">
                        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-blue-500/50">
                          <div className="w-full h-full flex items-center justify-center">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-blue-500 text-white">
                                You
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="secondary" className="bg-black/50 text-white text-xs">
                              You
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Call Controls */}
                      <div className="flex justify-center gap-2">
                        <Button
                          variant={isMuted ? "destructive" : "secondary"}
                          size="sm"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          variant={isVideoOff ? "destructive" : "secondary"}
                          size="sm"
                          onClick={() => setIsVideoOff(!isVideoOff)}
                        >
                          {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          variant={isScreenSharing ? "default" : "secondary"}
                          size="sm"
                          onClick={() => setIsScreenSharing(!isScreenSharing)}
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                        
                        <Button variant="secondary" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Quick Chat */}
                  <Card className="p-4 bg-white/5 border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="h-4 w-4 text-blue-400" />
                      <h4 className="text-sm font-medium text-white">Quick Chat</h4>
                    </div>
                    
                    <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                      <div className="text-xs text-gray-400">
                        <span className="font-medium">{partner.name}:</span> Let's adjust the SRT range together
                      </div>
                      <div className="text-xs text-gray-400">
                        <span className="font-medium">You:</span> Good idea, I'm seeing the tension stabilize
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-2 py-1 text-xs bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
                      />
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>

                  {/* Session Info */}
                  <Card className="p-4 bg-white/5 border-white/10">
                    <h4 className="text-sm font-medium text-white mb-3">Session Info</h4>
                    <div className="space-y-2 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>15:32</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sync Status:</span>
                        <Badge variant="outline" className="text-xs border-green-500/50 text-green-300">
                          Active
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Changes Made:</span>
                        <span>7</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open Full Teams
                    </Button>
                  </Card>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};