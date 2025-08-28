import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Target, 
  Settings, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Zap,
  Clock,
  User,
  Plus,
  Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface SprintSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  taskData?: any;
}

interface SprintConfig {
  name: string;
  description: string;
  capacity: string;
  leverage: string;
  duration: number;
  startDate?: string;
  endDate?: string;
  teamSize: number;
  guardrails: string[];
  tasks: TaskConfig[];
  teamMembers: TeamMemberConfig[];
  teamsIntegration: {
    enabled: boolean;
    channelName: string;
    autoNotifications: boolean;
  };
}

interface TaskConfig {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  priority: string;
  estimatedHours: number;
  dueDate?: string;
  dependencies: string[];
}

interface TeamMemberConfig {
  id: string;
  name: string;
  role: string;
  skills: string[];
  availability: number; // percentage
}

const WIZARD_STEPS = [
  { id: 'basic', title: 'Basic Info', icon: Target },
  { id: 'tasks', title: 'Task Configuration', icon: CheckCircle },
  { id: 'team', title: 'Team Setup', icon: Users },
  { id: 'integration', title: 'Teams Integration', icon: Zap },
  { id: 'review', title: 'Review & Launch', icon: Settings }
];

export const SprintSetupWizard: React.FC<SprintSetupWizardProps> = ({ 
  isOpen, 
  onClose,
  taskData
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<SprintConfig>({
    name: taskData?.title ? `${taskData.title} Sprint` : 'New Sprint',
    description: taskData?.description || '',
    capacity: taskData?.capacity || 'responsive',
    leverage: 'P',
    duration: 7,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    teamSize: 5,
    guardrails: ['max_concurrent_tasks:3', 'daily_standup:required'],
    tasks: [],
    teamMembers: [],
    teamsIntegration: {
      enabled: true,
      channelName: '',
      autoNotifications: true
    }
  });

  const { toast } = useToast();

  // Helper function to convert priority string to number
  const getPriorityNumber = (priority: string): number => {
    switch (priority) {
      case 'critical': return 1;
      case 'high': return 2; 
      case 'medium': return 3;
      case 'low': return 4;
      default: return 3;
    }
  };

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create the sprint first
      const { data: sprint, error: sprintError } = await supabase
        .from('sprints')
        .insert({
          user_id: user.id,
          name: config.name,
          description: config.description,
          status: 'planning',
          start_date: config.startDate,
          end_date: config.endDate,
          goals: config.tasks.map(t => ({ title: t.title, description: t.description }))
        })
        .select()
        .single();

      if (sprintError) throw sprintError;

      // Create sprint tasks
      const sprintTasks = config.tasks.map(task => ({
        sprint_id: sprint.id,
        user_id: user.id,
        title: task.title,
        description: task.description || '',
        status: 'pending',
        priority: getPriorityNumber(task.priority),
        estimated_hours: task.estimatedHours || 8,
        due_date: task.dueDate || config.endDate,
        meta: {
          capacity: config.capacity,
          leverage: config.leverage,
          progress_percent: 0
        }
      }));

      if (sprintTasks.length > 0) {
        const { error: tasksError } = await supabase
          .from('sprint_tasks')
          .insert(sprintTasks);

        if (tasksError) throw tasksError;
      }

      toast({
        title: "Sprint Created Successfully!",
        description: `${config.name} has been set up with ${config.tasks.length} tasks and ${config.teamMembers.length} team members.`,
      });

      // Simulate Teams channel creation if enabled
      if (config.teamsIntegration.enabled) {
        setTimeout(() => {
          toast({
            title: "Microsoft Teams Channel Created",
            description: `Channel "${config.teamsIntegration.channelName}" is ready for collaboration.`,
          });
        }, 1000);
      }

      onClose();
    } catch (error) {
      console.error('Error creating sprint:', error);
      toast({
        title: "Error Creating Sprint",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive"
      });
    }
  };

  const addTask = () => {
    const newTask: TaskConfig = {
      id: `task-${Date.now()}`,
      title: '',
      description: '',
      priority: 'medium',
      estimatedHours: 8,
      dependencies: []
    };
    setConfig(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
  };

  const updateTask = (taskId: string, updates: Partial<TaskConfig>) => {
    setConfig(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));
  };

  const removeTask = (taskId: string) => {
    setConfig(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId)
    }));
  };

  const addTeamMember = () => {
    const newMember: TeamMemberConfig = {
      id: `member-${Date.now()}`,
      name: '',
      role: '',
      skills: [],
      availability: 100
    };
    setConfig(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, newMember]
    }));
  };

  const updateTeamMember = (memberId: string, updates: Partial<TeamMemberConfig>) => {
    setConfig(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member => 
        member.id === memberId ? { ...member, ...updates } : member
      )
    }));
  };

  const renderStepContent = () => {
    switch (WIZARD_STEPS[currentStep].id) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="sprint-name">Sprint Name</Label>
                <Input
                  id="sprint-name"
                  value={config.name}
                  onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter sprint name..."
                />
              </div>

              <div>
                <Label htmlFor="sprint-description">Description</Label>
                <Textarea
                  id="sprint-description"
                  value={config.description}
                  onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the sprint objectives..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Select value={config.capacity} onValueChange={(value) => setConfig(prev => ({ ...prev, capacity: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="responsive">Responsive</SelectItem>
                      <SelectItem value="reflexive">Reflexive</SelectItem>
                      <SelectItem value="deliberative">Deliberative</SelectItem>
                      <SelectItem value="anticipatory">Anticipatory</SelectItem>
                      <SelectItem value="structural">Structural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="leverage">Leverage Level</Label>
                  <Select value={config.leverage} onValueChange={(value) => setConfig(prev => ({ ...prev, leverage: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="N">Operational (N)</SelectItem>
                      <SelectItem value="P">Policy (P)</SelectItem>
                      <SelectItem value="S">Strategic (S)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={config.duration}
                    onChange={(e) => setConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  />
                </div>

                <div>
                  <Label htmlFor="team-size">Team Size</Label>
                  <Input
                    id="team-size"
                    type="number"
                    value={config.teamSize}
                    onChange={(e) => setConfig(prev => ({ ...prev, teamSize: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Task Configuration</h3>
                <p className="text-sm text-muted-foreground">Define and organize sprint tasks</p>
              </div>
              <Button onClick={addTask} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {config.tasks.map((task, index) => (
                <Card key={task.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Task {index + 1}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTask(task.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Task title..."
                        value={task.title}
                        onChange={(e) => updateTask(task.id, { title: e.target.value })}
                      />
                      <Select 
                        value={task.priority} 
                        onValueChange={(value) => updateTask(task.id, { priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Textarea
                      placeholder="Task description..."
                      value={task.description}
                      onChange={(e) => updateTask(task.id, { description: e.target.value })}
                      rows={2}
                    />

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <Input
                          type="number"
                          placeholder="Hours"
                          value={task.estimatedHours}
                          onChange={(e) => updateTask(task.id, { estimatedHours: parseInt(e.target.value) })}
                          className="w-20"
                        />
                        <span className="text-xs text-muted-foreground">hours</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {config.tasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No tasks added yet</p>
                  <p className="text-sm">Click "Add Task" to get started</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Team Configuration</h3>
                <p className="text-sm text-muted-foreground">Set up team members and roles</p>
              </div>
              <Button onClick={addTeamMember} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {config.teamMembers.map((member, index) => (
                <Card key={member.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Member {index + 1}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Name..."
                        value={member.name}
                        onChange={(e) => updateTeamMember(member.id, { name: e.target.value })}
                      />
                      <Input
                        placeholder="Role..."
                        value={member.role}
                        onChange={(e) => updateTeamMember(member.id, { role: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="h-3 w-3" />
                      <Input
                        type="number"
                        placeholder="Availability %"
                        value={member.availability}
                        onChange={(e) => updateTeamMember(member.id, { availability: parseInt(e.target.value) })}
                        className="w-32"
                      />
                      <span className="text-xs text-muted-foreground">% available</span>
                    </div>
                  </div>
                </Card>
              ))}

              {config.teamMembers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No team members added yet</p>
                  <p className="text-sm">Click "Add Member" to get started</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'integration':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Microsoft Teams Integration</h3>
              <p className="text-sm text-muted-foreground">Configure Teams collaboration settings</p>
            </div>

            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enable-teams"
                    checked={config.teamsIntegration.enabled}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({
                        ...prev,
                        teamsIntegration: { ...prev.teamsIntegration, enabled: checked as boolean }
                      }))
                    }
                  />
                  <Label htmlFor="enable-teams">Enable Microsoft Teams integration</Label>
                </div>

                {config.teamsIntegration.enabled && (
                  <div className="space-y-4 pl-6">
                    <div>
                      <Label htmlFor="channel-name">Teams Channel Name</Label>
                      <Input
                        id="channel-name"
                        value={config.teamsIntegration.channelName || `${config.name} Channel`}
                        onChange={(e) => 
                          setConfig(prev => ({
                            ...prev,
                            teamsIntegration: { ...prev.teamsIntegration, channelName: e.target.value }
                          }))
                        }
                        placeholder="Enter channel name..."
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="auto-notifications"
                        checked={config.teamsIntegration.autoNotifications}
                        onCheckedChange={(checked) => 
                          setConfig(prev => ({
                            ...prev,
                            teamsIntegration: { ...prev.teamsIntegration, autoNotifications: checked as boolean }
                          }))
                        }
                      />
                      <Label htmlFor="auto-notifications">Enable automatic notifications</Label>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-800">Teams Integration Features:</p>
                          <ul className="text-blue-700 mt-1 space-y-1">
                            <li>• Automatic channel creation with team members</li>
                            <li>• Task notifications and updates</li>
                            <li>• Sprint progress tracking</li>
                            <li>• File sharing and collaboration tools</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Review & Launch</h3>
              <p className="text-sm text-muted-foreground">Review your sprint configuration before launching</p>
            </div>

            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-medium mb-2">Sprint Details</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Name:</span> {config.name}</p>
                  <p><span className="font-medium">Capacity:</span> {config.capacity}</p>
                  <p><span className="font-medium">Duration:</span> {config.duration} days</p>
                  <p><span className="font-medium">Team Size:</span> {config.teamSize} members</p>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-2">Tasks ({config.tasks.length})</h4>
                <div className="space-y-1">
                  {config.tasks.slice(0, 3).map((task, index) => (
                    <div key={task.id} className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      <span>{task.title || `Task ${index + 1}`}</span>
                    </div>
                  ))}
                  {config.tasks.length > 3 && (
                    <p className="text-xs text-muted-foreground">+ {config.tasks.length - 3} more tasks</p>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-2">Team Members ({config.teamMembers.length})</h4>
                <div className="space-y-1">
                  {config.teamMembers.slice(0, 3).map((member, index) => (
                    <div key={member.id} className="text-sm flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>{member.name || `Member ${index + 1}`} - {member.role}</span>
                    </div>
                  ))}
                  {config.teamMembers.length > 3 && (
                    <p className="text-xs text-muted-foreground">+ {config.teamMembers.length - 3} more members</p>
                  )}
                </div>
              </Card>

              {config.teamsIntegration.enabled && (
                <Card className="p-4 border-blue-200 bg-blue-50">
                  <h4 className="font-medium mb-2 text-blue-800">Teams Integration</h4>
                  <div className="text-sm text-blue-700">
                    <p>Channel: {config.teamsIntegration.channelName}</p>
                    <p>Notifications: {config.teamsIntegration.autoNotifications ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-8"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-xl border border-border w-full max-w-4xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Sprint Setup Wizard</h2>
                  <p className="text-sm text-muted-foreground">
                    Step {currentStep + 1} of {WIZARD_STEPS.length}: {WIZARD_STEPS[currentStep].title}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                {WIZARD_STEPS.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  
                  return (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isActive ? 'bg-blue-600 text-white' :
                          isCompleted ? 'bg-green-600 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {isCompleted ? <CheckCircle className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                        </div>
                        <span className={`text-xs ${isActive ? 'text-blue-600 font-medium' : 'text-muted-foreground'}`}>
                          {step.title}
                        </span>
                      </div>
                      {index < WIZARD_STEPS.length - 1 && (
                        <div className={`flex-1 h-px mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-auto">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent()}
              </motion.div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep === WIZARD_STEPS.length - 1 ? (
                <Button onClick={handleFinish} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Zap className="h-4 w-4 mr-2" />
                  Launch Sprint
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};