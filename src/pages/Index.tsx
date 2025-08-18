import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useFeatureFlags } from '@/components/layout/FeatureFlagProvider';
import { 
  Zap, 
  Brain, 
  Building, 
  RefreshCw, 
  Telescope, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Settings
} from 'lucide-react';

export const Index: React.FC = () => {
  const navigate = useNavigate();
  const { flags } = useFeatureFlags();

  const demoTasks = [
    {
      id: 'task-responsive-1',
      title: 'Supply Chain Disruption Response',
      description: 'Immediate response to shipping delays affecting Q1 deliveries',
      capacity: 'responsive',
      type: 'reactive',
      scale: 'micro',
      leverage: 'N',
      status: 'open',
      priority: 'high'
    },
    {
      id: 'task-deliberative-1',
      title: 'Strategic Market Analysis',
      description: 'Comprehensive analysis of market opportunities for expansion',
      capacity: 'deliberative',
      type: 'structural',
      scale: 'macro',
      leverage: 'S',
      status: 'open',
      priority: 'medium'
    },
    {
      id: 'task-structural-1',
      title: 'Organizational Restructure',
      description: 'Redesign departmental structure for improved efficiency',
      capacity: 'structural',
      type: 'structural',
      scale: 'macro',
      leverage: 'S',
      status: 'open',
      priority: 'high'
    }
  ];

  const handleClaimTask = (taskId: string) => {
    if (flags.CAPACITY_WORKSPACE) {
      navigate(`/workspace?task=${taskId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const capacityIcons = {
    responsive: Zap,
    reflexive: RefreshCw,
    deliberative: Brain,
    anticipatory: Telescope,
    structural: Building
  };

  const capacityColors = {
    responsive: 'text-orange-500 bg-orange-50 border-orange-200',
    reflexive: 'text-green-500 bg-green-50 border-green-200',
    deliberative: 'text-blue-500 bg-blue-50 border-blue-200',
    anticipatory: 'text-indigo-500 bg-indigo-50 border-indigo-200',
    structural: 'text-purple-500 bg-purple-50 border-purple-200'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <Badge variant="outline" className="mb-4">
              {flags.CAPACITY_WORKSPACE ? 'Capacity-Mode Architecture' : 'Multi-Value UI'}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
            RGS {flags.CAPACITY_WORKSPACE ? 'Capacity System' : 'MVUI'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {flags.CAPACITY_WORKSPACE 
              ? 'Advanced governance through responsive, reflexive, deliberative, anticipatory, and structural capacities'
              : 'Multi-Value User Interface for Rapid Governance Sprints'
            }
          </p>

          {flags.CAPACITY_WORKSPACE && (
            <div className="flex justify-center gap-2 mb-8">
              {Object.entries(capacityIcons).map(([capacity, Icon]) => (
                <div key={capacity} className={`p-3 rounded-lg border ${capacityColors[capacity as keyof typeof capacityColors]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => flags.CAPACITY_WORKSPACE ? navigate('/workspace') : navigate('/dashboard')}
              className="text-lg px-8"
            >
              {flags.CAPACITY_WORKSPACE ? 'Enter Workspace' : 'Get Started'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/mission-control')}>
              View Reports
            </Button>
            {flags.CAPACITY_WORKSPACE && (
              <Button variant="outline" size="lg" onClick={() => navigate('/demo')}>
                <Settings className="mr-2 w-4 h-4" />
                Demo
              </Button>
            )}
          </div>
        </motion.div>

        {/* Capacity-Mode Task Cards */}
        {flags.CAPACITY_WORKSPACE && demoTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Available Capacity Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoTasks.map((task, index) => {
                const CapacityIcon = capacityIcons[task.capacity as keyof typeof capacityIcons];
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group" 
                          onClick={() => handleClaimTask(task.id)}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`p-2 rounded-lg ${capacityColors[task.capacity as keyof typeof capacityColors]}`}>
                            <CapacityIcon className="w-5 h-5" />
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">{task.scale}</Badge>
                            <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {task.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs capitalize">
                              {task.capacity}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {task.type}
                            </Badge>
                          </div>
                          <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            Claim <ArrowRight className="ml-1 w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500 mb-1">94%</div>
                  <div className="text-sm text-muted-foreground">System Health</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500 mb-1">{demoTasks.length}</div>
                  <div className="text-sm text-muted-foreground">Available Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500 mb-1">5</div>
                  <div className="text-sm text-muted-foreground">Active Capacities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500 mb-1">
                    <Clock className="w-5 h-5 inline" />
                  </div>
                  <div className="text-sm text-muted-foreground">Real-time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-muted-foreground"
        >
          <p className="text-sm">
            {flags.CAPACITY_WORKSPACE 
              ? 'Powered by Capacity-Mode Architecture • Built for Adaptive Governance'
              : 'Powered by Multi-Value UI • Built for Rapid Governance Sprints'
            }
          </p>
        </motion.div>
      </div>
    </div>
  );
};