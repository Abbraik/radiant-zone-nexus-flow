import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, CheckCircle2, Eye, ArrowRight } from 'lucide-react';
import { useGoldenScenarios, type GoldenScenario } from '@/hooks/useGoldenScenarios';
import { cn } from '@/lib/utils';

const getStatusColor = (status: GoldenScenario['status']) => {
  switch (status) {
    case 'armed': return 'bg-muted text-muted-foreground';
    case 'triggered': return 'bg-warning text-warning-foreground';
    case 'active': return 'bg-primary text-primary-foreground';
    case 'resolved': return 'bg-success text-success-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getCapacityColor = (capacity: GoldenScenario['capacity']) => {
  switch (capacity) {
    case 'responsive': return 'text-red-600 bg-red-50 border-red-200';
    case 'reflexive': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'deliberative': return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'anticipatory': return 'text-green-600 bg-green-50 border-green-200';
    case 'structural': return 'text-orange-600 bg-orange-50 border-orange-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

interface ScenarioCardProps {
  scenario: GoldenScenario;
  index: number;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, index }) => {
  const handleDeeplink = () => {
    window.location.href = scenario.deeplink;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{scenario.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{scenario.description}</p>
            </div>
            <Badge className={getStatusColor(scenario.status)} variant="secondary">
              {scenario.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Capacity Badge */}
          <Badge 
            variant="outline" 
            className={cn('capitalize font-medium', getCapacityColor(scenario.capacity))}
          >
            {scenario.capacity}
          </Badge>

          {/* Task Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">{scenario.task_count}</div>
              <div className="text-xs text-muted-foreground">Total Tasks</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">{scenario.active_tasks}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-600">{scenario.overdue_tasks}</div>
              <div className="text-xs text-muted-foreground">Overdue</div>
            </div>
          </div>

          {/* Next Review */}
          {scenario.next_review && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Next review: {scenario.next_review.toLocaleDateString()}</span>
            </div>
          )}

          {/* Loop Codes */}
          <div className="flex flex-wrap gap-1">
            {scenario.loop_codes.map(code => (
              <Badge key={code} variant="outline" className="text-xs">
                {code}
              </Badge>
            ))}
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleDeeplink}
            className="w-full"
            variant={scenario.active_tasks > 0 ? "default" : "outline"}
          >
            <Eye className="h-4 w-4 mr-2" />
            Open Workspace
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const GoldenScenariosPanel: React.FC = () => {
  const { data: scenarios = [], isLoading, error } = useGoldenScenarios();

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center gap-2 pt-6">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <span className="text-sm text-destructive">Failed to load golden scenarios</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Golden Scenarios</h2>
          <p className="text-muted-foreground">
            Live monitoring of Fertility, Labour, and Social Cohesion loops
          </p>
        </div>
        <Badge variant="outline" className="gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Live Backend
        </Badge>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-64">
              <CardHeader>
                <div className="animate-pulse space-y-2">
                  <div className="h-5 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-8 bg-muted rounded"></div>
                    <div className="h-8 bg-muted rounded"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => (
            <ScenarioCard 
              key={scenario.id} 
              scenario={scenario} 
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};