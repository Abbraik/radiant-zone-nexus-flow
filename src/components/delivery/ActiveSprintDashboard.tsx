import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Users, 
  Target,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Sprint {
  id: string;
  name: string;
  status: string;
  progress: number;
  teamMembers: number;
  tasksTotal: number;
  tasksCompleted: number;
  dueDate: Date;
  capacity: string;
}

interface ActiveSprintDashboardProps {
  sprints: Sprint[];
}

export const ActiveSprintDashboard: React.FC<ActiveSprintDashboardProps> = ({ sprints }) => {
  const [selectedSprint, setSelectedSprint] = useState(sprints[0]?.id);
  const [viewMode, setViewMode] = useState<'overview' | 'tasks' | 'team' | 'metrics'>('overview');

  const currentSprint = sprints.find(s => s.id === selectedSprint) || sprints[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'planning': return 'bg-blue-600';
      case 'blocked': return 'bg-red-600';
      case 'completed': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getCapacityColor = (capacity: string) => {
    switch (capacity) {
      case 'responsive': return 'text-red-600 bg-red-50 border-red-200';
      case 'deliberative': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'reflexive': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'anticipatory': return 'text-green-600 bg-green-50 border-green-200';
      case 'structural': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Mock data for detailed sprint view
  const sprintDetails = {
    tasks: [
      {
        id: '1',
        title: 'Setup monitoring dashboard',
        status: 'completed',
        assignee: 'John Doe',
        priority: 'high',
        dueDate: '2024-01-15'
      },
      {
        id: '2',
        title: 'Implement alert system',
        status: 'in-progress',
        assignee: 'Jane Smith',
        priority: 'critical',
        dueDate: '2024-01-16'
      },
      {
        id: '3',
        title: 'Create response protocols',
        status: 'pending',
        assignee: 'Mike Johnson',
        priority: 'medium',
        dueDate: '2024-01-18'
      }
    ],
    teamMembers: [
      { id: '1', name: 'John Doe', role: 'Lead Engineer', avatar: null, status: 'online' },
      { id: '2', name: 'Jane Smith', role: 'DevOps Specialist', avatar: null, status: 'online' },
      { id: '3', name: 'Mike Johnson', role: 'Product Manager', avatar: null, status: 'away' }
    ],
    metrics: {
      velocity: 15,
      burndownRate: 0.8,
      blockerCount: 1,
      avgTaskCompletion: 2.5
    }
  };

  return (
    <div className="space-y-6">
      {/* Sprint Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Active Sprint Dashboard</h3>
          <p className="text-sm text-muted-foreground">Monitor and manage your active sprints</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={selectedSprint}
            onChange={(e) => setSelectedSprint(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background"
          >
            {sprints.map(sprint => (
              <option key={sprint.id} value={sprint.id}>
                {sprint.name}
              </option>
            ))}
          </select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit Sprint</DropdownMenuItem>
              <DropdownMenuItem>Clone Sprint</DropdownMenuItem>
              <DropdownMenuItem>Export Data</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {currentSprint && (
        <>
          {/* Sprint Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {currentSprint.name}
                    <Badge className={`${getStatusColor(currentSprint.status)} text-white`}>
                      {currentSprint.status}
                    </Badge>
                  </CardTitle>
                  <div className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${getCapacityColor(currentSprint.capacity)}`}>
                    {currentSprint.capacity} capacity
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Take Action
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    Progress
                  </div>
                  <div className="text-2xl font-bold text-green-600">{currentSprint.progress}%</div>
                  <Progress value={currentSprint.progress} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4" />
                    Tasks
                  </div>
                  <div className="text-2xl font-bold">{currentSprint.tasksCompleted}/{currentSprint.tasksTotal}</div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((currentSprint.tasksCompleted / currentSprint.tasksTotal) * 100)}% complete
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Team
                  </div>
                  <div className="text-2xl font-bold">{currentSprint.teamMembers}</div>
                  <div className="text-xs text-muted-foreground">active members</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Due Date
                  </div>
                  <div className="text-sm font-medium">{currentSprint.dueDate.toLocaleDateString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {Math.ceil((currentSprint.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed View Tabs */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { action: 'Task completed', user: 'John Doe', time: '2 hours ago', type: 'success' },
                        { action: 'New task assigned', user: 'Jane Smith', time: '4 hours ago', type: 'info' },
                        { action: 'Blocker reported', user: 'Mike Johnson', time: '1 day ago', type: 'warning' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded border">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'success' ? 'bg-green-500' :
                            activity.type === 'info' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Sprint Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Velocity</span>
                        <div className="flex items-center gap-2">
                          <Progress value={75} className="w-20 h-2" />
                          <span className="text-sm font-medium">Good</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">On Schedule</span>
                        <div className="flex items-center gap-2">
                          <Progress value={80} className="w-20 h-2" />
                          <span className="text-sm font-medium">Good</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Team Capacity</span>
                        <div className="flex items-center gap-2">
                          <Progress value={60} className="w-20 h-2" />
                          <span className="text-sm font-medium">Moderate</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Sprint Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sprintDetails.tasks.map(task => (
                      <div key={task.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'in-progress' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`} />
                        
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Assigned to {task.assignee} • Due {task.dueDate}
                          </p>
                        </div>
                        
                        <Badge variant={task.priority === 'critical' ? 'destructive' : 'outline'}>
                          {task.priority}
                        </Badge>
                        
                        <Badge variant={
                          task.status === 'completed' ? 'default' :
                          task.status === 'in-progress' ? 'secondary' :
                          'outline'
                        }>
                          {task.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sprintDetails.teamMembers.map(member => (
                      <div key={member.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <Avatar>
                          <AvatarImage src={member.avatar || undefined} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                        
                        <Badge variant={member.status === 'online' ? 'default' : 'secondary'}>
                          {member.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Sprint Velocity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {sprintDetails.metrics.velocity}
                    </div>
                    <p className="text-sm text-muted-foreground">story points/sprint</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Avg Completion Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {sprintDetails.metrics.avgTaskCompletion}d
                    </div>
                    <p className="text-sm text-muted-foreground">per task</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Active Blockers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">
                      {sprintDetails.metrics.blockerCount}
                    </div>
                    <p className="text-sm text-muted-foreground">requiring attention</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Burndown Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.round(sprintDetails.metrics.burndownRate * 100)}%
                    </div>
                    <p className="text-sm text-muted-foreground">on track</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};