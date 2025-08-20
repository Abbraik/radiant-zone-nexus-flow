import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Settings, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  Plus,
  Clock,
  User
} from 'lucide-react';

interface TimelineEntry {
  id: string;
  type: 'tuning' | 'bands' | 'eval' | 'note';
  title: string;
  description: string;
  timestamp: Date;
  actor: string;
  metadata?: any;
}

export const LearningTimeline: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'tuning' | 'bands' | 'eval' | 'notes'>('all');
  const [newNote, setNewNote] = useState('');

  const entries: TimelineEntry[] = [
    {
      id: '1',
      type: 'tuning',
      title: 'Family switched PID→PI',
      description: 'Applied "Dampen Oscillations" recipe to reduce settling time',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      actor: 'operator-alice',
      metadata: { recipe: 'rx-meta02-oscillations' }
    },
    {
      id: '2',
      type: 'bands',
      title: 'T2 weight +10%',
      description: 'Increased T2 weighting to address dispersion imbalance',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      actor: 'controller-bob',
      metadata: { deltaWeight: 0.1, tier: 'T2' }
    },
    {
      id: '3',
      type: 'eval',
      title: 'ITS scheduled',
      description: 'Interrupted Time Series evaluation set for 14 days from now',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      actor: 'system',
      metadata: { method: 'ITS', reviewDate: '2024-02-15' }
    },
    {
      id: '4',
      type: 'note',
      title: 'Performance degradation observed',
      description: 'Oscillation increased after load balancer changes. Monitoring closely.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      actor: 'operator-charlie'
    }
  ];

  const filteredEntries = entries.filter(entry => 
    filter === 'all' || 
    (filter === 'notes' && entry.type === 'note') ||
    entry.type === filter
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tuning': return <Settings className="h-4 w-4" />;
      case 'bands': return <TrendingUp className="h-4 w-4" />;
      case 'eval': return <Calendar className="h-4 w-4" />;
      case 'note': return <MessageSquare className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tuning': return 'bg-blue-500';
      case 'bands': return 'bg-green-500';
      case 'eval': return 'bg-purple-500';
      case 'note': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return 'Just now';
    }
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    
    // Add note logic here
    console.log('Adding note:', newNote);
    setNewNote('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Learning Timeline
        </CardTitle>
        <CardDescription>
          Governance notes and system changes history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(value: any) => setFilter(value)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="tuning" className="text-xs">Tuning</TabsTrigger>
            <TabsTrigger value="bands" className="text-xs">Bands</TabsTrigger>
            <TabsTrigger value="eval" className="text-xs">Eval</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Add Note */}
        <div className="flex gap-2">
          <Input
            placeholder="Add a governance note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && addNote()}
          />
          <Button 
            size="sm" 
            onClick={addNote}
            disabled={!newNote.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Timeline */}
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {filteredEntries.map((entry, index) => (
              <div key={entry.id} className="flex gap-3">
                {/* Timeline indicator */}
                <div className="relative flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full ${getTypeColor(entry.type)} flex items-center justify-center text-white`}>
                    {getTypeIcon(entry.type)}
                  </div>
                  {index < filteredEntries.length - 1 && (
                    <div className="w-px h-6 bg-border mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium">{entry.title}</h4>
                      <p className="text-xs text-muted-foreground">{entry.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {entry.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{entry.actor}</span>
                    <Clock className="h-3 w-3 ml-2" />
                    <span>{formatRelativeTime(entry.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {filteredEntries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No entries found for the selected filter</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};