import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GoldenScenariosPanel } from './GoldenScenariosPanel';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { Clock, AlertTriangle, CheckCircle2, TrendingUp, LogIn, User } from 'lucide-react';
import { isFeatureEnabled } from '@/lib/featureFlags';
import { useNavigate } from 'react-router-dom';

const QuickStats: React.FC = () => {
  const { allTasks, myTasks, availableTasks } = useTasks();
  const useRealData = isFeatureEnabled('useTaskEngineV2') && !isFeatureEnabled('useMockHome');

  const overdueTasks = allTasks.filter(task => 
    task.due_at && task.due_at < new Date() && task.status !== 'completed'
  );

  const criticalTasks = allTasks.filter(task => 
    task.priority === 'critical' && task.status !== 'completed'
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{myTasks.length}</p>
              <p className="text-sm text-muted-foreground">My Tasks</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{availableTasks.length}</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overdueTasks.length}</p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{criticalTasks.length}</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const HomeWorkspace: React.FC = () => {
  const useRealData = isFeatureEnabled('useTaskEngineV2') && !isFeatureEnabled('useMockHome');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      navigate('/admin');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PAGS Workspace</h1>
          <p className="text-muted-foreground">
            {useRealData ? 'Live backend integration' : 'Development mode'} • Population & Development Systems
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={useRealData ? "default" : "outline"}>
            {useRealData ? 'Live Data' : 'Mock Data'}
          </Badge>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">NCF Compass Active</span>
          </div>
          <Button
            onClick={handleAuthAction}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover transition-all duration-300"
          >
            {user ? (
              <>
                <User className="h-4 w-4 mr-2" />
                Admin Console
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Golden Scenarios */}
      <GoldenScenariosPanel />

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">Capacity Brain</span>
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  {isFeatureEnabled('useCapacityBrain') ? 'Active' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Anticipatory Runtime</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  {isFeatureEnabled('useAnticipatoryRuntime') ? 'Active' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium">NCF Compass</span>
                <Badge variant="outline" className="bg-purple-100 text-purple-700">
                  {isFeatureEnabled('useNCFCompassOverlays') ? 'Active' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};