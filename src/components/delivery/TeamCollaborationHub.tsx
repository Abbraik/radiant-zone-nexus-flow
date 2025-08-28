import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Video, 
  Calendar,
  FileText,
  Share2,
  Coffee,
  Clock,
  Send,
  Smile,
  Paperclip,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface TeamCollaborationHubProps {
  taskId?: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'system' | 'file';
}

interface Meeting {
  id: string;
  title: string;
  startTime: Date;
  duration: number;
  attendees: string[];
  type: 'standup' | 'review' | 'planning' | 'adhoc';
}

export const TeamCollaborationHub: React.FC<TeamCollaborationHubProps> = ({ taskId }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [newMessage, setNewMessage] = useState('');
  
  // Mock data
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Sprint Lead',
      status: 'online',
      lastSeen: new Date(),
    },
    {
      id: '2', 
      name: 'Alex Rodriguez',
      role: 'Developer',
      status: 'online',
      lastSeen: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: '3',
      name: 'Jordan Kim',
      role: 'Designer',
      status: 'away',
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: '4',
      name: 'Morgan Taylor',
      role: 'Analyst',
      status: 'busy',
      lastSeen: new Date(Date.now() - 15 * 60 * 1000),
    }
  ];

  const chatMessages: ChatMessage[] = [
    {
      id: '1',
      senderId: '1',
      senderName: 'Sarah Chen',
      content: 'Good morning team! Ready for today\'s sprint review?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'message'
    },
    {
      id: '2',
      senderId: '2',
      senderName: 'Alex Rodriguez',
      content: 'Yes! I\'ve completed the API integration task. Running final tests now.',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      type: 'message'
    },
    {
      id: '3',
      senderId: 'system',
      senderName: 'System',
      content: 'Jordan Kim has joined the sprint channel',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      type: 'system'
    },
    {
      id: '4',
      senderId: '3',
      senderName: 'Jordan Kim',
      content: 'Hi everyone! The mockups are ready for review. I\'ll share them in the next meeting.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      type: 'message'
    }
  ];

  const upcomingMeetings: Meeting[] = [
    {
      id: '1',
      title: 'Daily Standup',
      startTime: new Date(Date.now() + 30 * 60 * 1000),
      duration: 15,
      attendees: ['1', '2', '3', '4'],
      type: 'standup'
    },
    {
      id: '2',
      title: 'Sprint Review',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      duration: 60,
      attendees: ['1', '2', '3'],
      type: 'review'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getMeetingTypeColor = (type: string) => {
    switch (type) {
      case 'standup': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-purple-100 text-purple-800';
      case 'adhoc': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Here you would typically send the message to your backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const startQuickMeeting = () => {
    console.log('Starting quick meeting');
  };

  const startPairWork = (memberId: string) => {
    console.log('Starting pair work with member:', memberId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Team Collaboration Hub</h3>
          <p className="text-sm text-muted-foreground">Connect and collaborate with your team</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={startQuickMeeting}>
            <Video className="h-4 w-4 mr-2" />
            Quick Meet
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Screen
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="h-96 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Sprint Team Chat
                <Badge variant="outline" className="ml-auto">
                  {teamMembers.filter(m => m.status === 'online').length} online
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {chatMessages.map(message => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-3 ${
                        message.type === 'system' ? 'justify-center' : ''
                      }`}
                    >
                      {message.type === 'system' ? (
                        <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          {message.content}
                        </div>
                      ) : (
                        <>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {message.senderName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{message.senderName}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                              </span>
                            </div>
                            <div className="bg-muted rounded-lg p-3 text-sm">
                              {message.content}
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="pr-20"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Paperclip className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Smile className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-4">
            {teamMembers.map(member => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                      </div>
                      
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.status === 'online' 
                            ? 'Online now' 
                            : `Last seen ${formatDistanceToNow(member.lastSeen, { addSuffix: true })}`
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => startPairWork(member.id)}
                      >
                        <Coffee className="h-3 w-3 mr-1" />
                        Pair Work
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        DM
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Meetings Tab */}
        <TabsContent value="meetings" className="space-y-4">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upcoming Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingMeetings.map(meeting => (
                    <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{meeting.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {meeting.startTime.toLocaleTimeString()} • {meeting.duration} min • {meeting.attendees.length} attendees
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getMeetingTypeColor(meeting.type)}>
                          {meeting.type}
                        </Badge>
                        <Button size="sm">
                          <Video className="h-3 w-3 mr-1" />
                          Join
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start">
                    <Video className="h-4 w-4 mr-2" />
                    Start Standup
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Coffee className="h-4 w-4 mr-2" />
                    Coffee Chat
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Share2 className="h-4 w-4 mr-2" />
                    Screen Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shared Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Sprint Planning Document.pdf', size: '2.4 MB', modified: '2 hours ago', type: 'pdf' },
                  { name: 'Design Mockups.fig', size: '15.7 MB', modified: '1 day ago', type: 'design' },
                  { name: 'API Documentation.md', size: '156 KB', modified: '3 days ago', type: 'document' }
                ].map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-medium">{file.name}</h4>
                      <p className="text-sm text-muted-foreground">{file.size} • Modified {file.modified}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};