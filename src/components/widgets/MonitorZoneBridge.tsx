import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bridge, ArrowRight, CheckCircle, Clock, Target, Users, BarChart3, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface MonitorTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  linkedInterventionId: string;
  triMetrics: {
    tension: number;
    response: number;
    impact: number;
  };
}

interface HandoffData {
  bundleId: string;
  bundleName: string;
  interventionCount: number;
  publishedAt: Date;
  estimatedDuration: string;
  totalResourceCost: number;
  expectedImpact: number;
  assignedRoles: Array<{ name: string; role: string; }>;
}

interface MonitorZoneBridgeProps {
  bundleData: HandoffData;
  onHandoffComplete: (tasks: MonitorTask[]) => void;
}

const generateMonitorTasks = (bundleData: HandoffData): MonitorTask[] => {
  const tasks: MonitorTask[] = [
    {
      id: 'monitor-1',
      title: 'Initial TRI Baseline Assessment',
      description: 'Establish baseline measurements for Tension-Response-Impact metrics',
      assignee: 'Maria Santos',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
      status: 'pending',
      priority: 'high',
      linkedInterventionId: 'bundle-all',
      triMetrics: { tension: 0, response: 0, impact: 0 }
    },
    {
      id: 'monitor-2',
      title: 'Family Planning Program Monitoring',
      description: 'Track implementation progress and early indicators',
      assignee: 'Dr. James Wilson',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
      status: 'pending',
      priority: 'high',
      linkedInterventionId: 'pop-1',
      triMetrics: { tension: 65, response: 0, impact: 0 }
    },
    {
      id: 'monitor-3',
      title: 'Education Initiative Stakeholder Review',
      description: 'Gather feedback from educational institutions and communities',
      assignee: 'Lisa Rodriguez',
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks
      status: 'pending',
      priority: 'medium',
      linkedInterventionId: 'pop-2',
      triMetrics: { tension: 68, response: 0, impact: 0 }
    },
    {
      id: 'monitor-4',
      title: 'Resource Allocation Tracking',
      description: 'Monitor budget utilization and resource deployment',
      assignee: 'Maria Santos',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month
      status: 'pending',
      priority: 'medium',
      linkedInterventionId: 'bundle-all',
      triMetrics: { tension: 0, response: 0, impact: 0 }
    },
    {
      id: 'monitor-5',
      title: 'Mid-term Impact Assessment',
      description: 'Evaluate intervention effectiveness and adjust strategies',
      assignee: 'Dr. James Wilson',
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
      status: 'pending',
      priority: 'high',
      linkedInterventionId: 'bundle-all',
      triMetrics: { tension: 0, response: 0, impact: 0 }
    }
  ];

  return tasks;
};

export const MonitorZoneBridge: React.FC<MonitorZoneBridgeProps> = ({
  bundleData,
  onHandoffComplete
}) => {
  const [isCreatingTasks, setIsCreatingTasks] = useState(false);
  const [monitorTasks, setMonitorTasks] = useState<MonitorTask[]>([]);
  const [handoffComplete, setHandoffComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  const initiateHandoff = async () => {
    setIsCreatingTasks(true);
    
    // Simulate task creation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const tasks = generateMonitorTasks(bundleData);
    setMonitorTasks(tasks);
    setHandoffComplete(true);
    setIsCreatingTasks(false);
    onHandoffComplete(tasks);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'in_progress': return 'bg-blue-500/20 text-blue-300';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'low': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const formatDuration = (date: Date) => {
    const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  return (
    <Card className="p-6 bg-white/5 border-white/10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Bridge className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Monitor Zone Bridge</h3>
              <p className="text-sm text-gray-400">Seamless handoff to monitoring and evaluation</p>
            </div>
          </div>
          
          {!handoffComplete && (
            <Button
              onClick={initiateHandoff}
              disabled={isCreatingTasks}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
            >
              {isCreatingTasks ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 mr-2"
                >
                  <Bridge className="w-4 h-4" />
                </motion.div>
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              {isCreatingTasks ? 'Creating Tasks...' : 'Initiate Handoff'}
            </Button>
          )}
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {isCreatingTasks && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/30 text-center"
            >
              <div className="space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-16 h-16 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center"
                >
                  <Bridge className="w-8 h-8 text-orange-400" />
                </motion.div>
                <div className="text-white font-medium">Creating Monitor Tasks</div>
                <div className="text-sm text-gray-400">
                  Generating TRI monitoring schedule and assigning roles...
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-gray-400">Setting up monitoring framework...</div>
                  <Progress value={75} className="h-1" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bundle Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Interventions</div>
                <div className="text-2xl font-bold text-blue-400">{bundleData.interventionCount}</div>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Expected Impact</div>
                <div className="text-2xl font-bold text-green-400">{bundleData.expectedImpact}%</div>
              </div>
              <BarChart3 className="h-8 w-8 text-green-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Team Members</div>
                <div className="text-2xl font-bold text-purple-400">{bundleData.assignedRoles.length}</div>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Duration</div>
                <div className="text-lg font-bold text-yellow-400">{bundleData.estimatedDuration}</div>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </Card>
        </div>

        {/* Handoff Status */}
        {handoffComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-lg border border-green-500/30"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <div>
                <div className="text-white font-medium">Handoff Complete</div>
                <div className="text-sm text-gray-300">
                  {monitorTasks.length} monitoring tasks created and assigned to Monitor Zone
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Detailed Handoff Information */}
        {handoffComplete && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-white/10">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="tasks">Monitor Tasks</TabsTrigger>
              <TabsTrigger value="metrics">TRI Setup</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-white/5 border-white/10">
                  <h4 className="text-white font-medium mb-3">Bundle Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bundle Name:</span>
                      <span className="text-white">{bundleData.bundleName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Published:</span>
                      <span className="text-white">{bundleData.publishedAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Resource Cost:</span>
                      <span className="text-white">${bundleData.totalResourceCost}M</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-white/5 border-white/10">
                  <h4 className="text-white font-medium mb-3">Assigned Roles</h4>
                  <div className="space-y-2">
                    {bundleData.assignedRoles.map((assignment, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-white">{assignment.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {assignment.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <div className="space-y-3">
                {monitorTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-medium">{task.title}</span>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-300 mb-2">{task.description}</div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Assignee:</span>
                            <span className="text-white ml-2">{task.assignee}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Due:</span>
                            <span className="text-white ml-2">{formatDuration(task.dueDate)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/30 text-white ml-4"
                      >
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-lg border border-teal-500/30">
                  <h4 className="text-teal-300 font-medium mb-3">TRI Monitoring Framework Setup</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-400">T</div>
                      <div className="text-sm text-gray-300">Tension</div>
                      <div className="text-xs text-gray-400">Population growth signals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">R</div>
                      <div className="text-sm text-gray-300">Response</div>
                      <div className="text-xs text-gray-400">Intervention effectiveness</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">I</div>
                      <div className="text-sm text-gray-300">Impact</div>
                      <div className="text-xs text-gray-400">Outcome measurements</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 bg-white/5 border-white/10">
                    <h5 className="text-white font-medium mb-3">Monitoring Schedule</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Baseline Assessment:</span>
                        <span className="text-white">Week 1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monthly Reviews:</span>
                        <span className="text-white">Ongoing</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Quarterly Deep Dive:</span>
                        <span className="text-white">Q1, Q2, Q3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Final Evaluation:</span>
                        <span className="text-white">Month 18</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white/5 border-white/10">
                    <h5 className="text-white font-medium mb-3">Alert Thresholds</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <span className="text-gray-400">TRI deviation &gt;20%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                        <span className="text-gray-400">Budget variance &gt;15%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-400" />
                        <span className="text-gray-400">Timeline delay &gt;2 weeks</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Card>
  );
};

export default MonitorZoneBridge;