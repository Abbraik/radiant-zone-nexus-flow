import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Users, 
  Settings, 
  Play, 
  Pause,
  CheckCircle,
  Clock,
  AlertTriangle,
  GitBranch,
  Zap,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SprintSetupWizard } from './SprintSetupWizard';
import { MicrosoftTeamsIntegration } from './MicrosoftTeamsIntegration';
import { ActiveSprintDashboard } from './ActiveSprintDashboard';
import { TeamCollaborationHub } from './TeamCollaborationHub';

interface DeliveryChainManagerProps {
  isOpen: boolean;
  onClose: () => void;
  taskId?: string;
  taskData?: any;
}

export const DeliveryChainManager: React.FC<DeliveryChainManagerProps> = ({ 
  isOpen, 
  onClose, 
  taskId,
  taskData 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSprints] = useState([
    {
      id: '1',
      name: 'Heat Stress Response Sprint',
      status: 'active',
      progress: 65,
      teamMembers: 8,
      tasksTotal: 12,
      tasksCompleted: 8,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      capacity: 'responsive'
    },
    {
      id: '2', 
      name: 'Fertility Policy Analysis',
      status: 'planning',
      progress: 0,
      teamMembers: 5,
      tasksTotal: 6,
      tasksCompleted: 0,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      capacity: 'deliberative'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600 text-white">Active</Badge>;
      case 'planning':
        return <Badge variant="outline">Planning</Badge>;
      case 'completed':
        return <Badge className="bg-blue-600 text-white">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCapacityColor = (capacity: string) => {
    switch (capacity) {
      case 'responsive': return 'border-l-red-500';
      case 'deliberative': return 'border-l-blue-500';
      case 'reflexive': return 'border-l-yellow-500';
      case 'anticipatory': return 'border-l-green-500';
      case 'structural': return 'border-l-purple-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Manager Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
            className="fixed right-0 top-0 h-full w-[800px] bg-background border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Delivery Chain Manager</h2>
                    <p className="text-sm text-muted-foreground">Sprint orchestration & team coordination</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{activeSprints.filter(s => s.status === 'active').length}</div>
                  <div className="text-xs text-muted-foreground">Active Sprints</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {activeSprints.reduce((sum, s) => sum + s.teamMembers, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Team Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(activeSprints.reduce((sum, s) => sum + s.progress, 0) / activeSprints.length)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Progress</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="px-6 pt-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="sprints">Active Sprints</TabsTrigger>
                    <TabsTrigger value="teams">Teams Hub</TabsTrigger>
                    <TabsTrigger value="integration">Integration</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 px-6 py-4">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6 mt-0">
                    {/* Team Coordination */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-blue-600" />
                          Team Coordination
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Coordinate with team members and manage collaborative workflows
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="justify-start">
                            <Users className="h-4 w-4 mr-2" />
                            Invite Members
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <GitBranch className="h-4 w-4 mr-2" />
                            Create Branch
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Active Sprints Overview */}
                    <div className="space-y-4">
                      <h3 className="font-medium flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Active Sprints
                      </h3>
                      
                      {activeSprints.map((sprint) => (
                        <Card key={sprint.id} className={`border-l-4 ${getCapacityColor(sprint.capacity)}`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{sprint.name}</h4>
                                {getStatusBadge(sprint.status)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-3 w-3" />
                                <span>{sprint.teamMembers}</span>
                                <Clock className="h-3 w-3" />
                                <span>{sprint.tasksCompleted}/{sprint.tasksTotal}</span>
                              </div>
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div 
                                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${sprint.progress}%` }}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{sprint.progress}% complete</span>
                              <span>Due {sprint.dueDate.toLocaleDateString()}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="justify-start">
                            <GitBranch className="h-4 w-4 mr-2" />
                            Create Task Branch
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <Users className="h-4 w-4 mr-2" />
                            Invite Team Members
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Report Blockers
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <Settings className="h-4 w-4 mr-2" />
                            Configure Alerts
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Active Sprints Tab */}
                  <TabsContent value="sprints" className="mt-0">
                    <ActiveSprintDashboard sprints={activeSprints} />
                  </TabsContent>

                  {/* Teams Hub Tab */}
                  <TabsContent value="teams" className="mt-0">
                    <TeamCollaborationHub taskId={taskId} />
                  </TabsContent>

                  {/* Integration Tab */}
                  <TabsContent value="integration" className="mt-0">
                    <MicrosoftTeamsIntegration />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </motion.div>

        </>
      )}
    </AnimatePresence>
  );
};