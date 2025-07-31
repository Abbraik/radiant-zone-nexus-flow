import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  AlertTriangle, 
  Target, 
  TrendingUp, 
  Calendar, 
  Brain,
  ArrowRight,
  Clock,
  Gauge
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface ValidationItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  required: boolean;
  category: 'loop' | 'parameters' | 'leverage' | 'vision';
}

interface ReviewSummaryPanelProps {
  validationItems: ValidationItem[];
  loopData?: {
    name: string;
    type: 'balancing' | 'reinforcing';
    nodeCount: number;
    linkCount: number;
  };
  tensionSignal?: {
    name: string;
    currentValue: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
  };
  deBandConfig?: {
    lowerBound: number;
    upperBound: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
  srtHorizon?: {
    label: string;
    duration: number;
  };
  leveragePoint?: {
    name: string;
    rank: number;
    effectiveness: number;
  };
  macroVision?: {
    text: string;
    isValid: boolean;
  };
  onStartSprint: () => void;
  onGoToActZone: () => void;
}

export const ReviewSummaryPanel: React.FC<ReviewSummaryPanelProps> = ({
  validationItems,
  loopData,
  tensionSignal,
  deBandConfig,
  srtHorizon,
  leveragePoint,
  macroVision,
  onStartSprint,
  onGoToActZone
}) => {
  const completedItems = validationItems.filter(item => item.completed);
  const requiredItems = validationItems.filter(item => item.required);
  const completedRequiredItems = requiredItems.filter(item => item.completed);
  
  const completionPercentage = (completedItems.length / validationItems.length) * 100;
  const readinessPercentage = (completedRequiredItems.length / requiredItems.length) * 100;
  const isReadyForSprint = readinessPercentage === 100;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'loop': return <Brain className="h-4 w-4" />;
      case 'parameters': return <Gauge className="h-4 w-4" />;
      case 'leverage': return <Target className="h-4 w-4" />;
      case 'vision': return <Calendar className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-500/10';
      case 'medium': return 'text-yellow-600 bg-yellow-500/10';
      case 'high': return 'text-red-600 bg-red-500/10';
      default: return 'text-gray-600 bg-gray-500/10';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-green-500 rotate-180" />;
      default: return <Target className="h-3 w-3 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">Sprint Configuration Review</h3>
          <p className="text-muted-foreground">
            Review your Think Zone configuration before launching the sprint
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Configuration Progress</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {completedItems.length}/{validationItems.length} complete
                </span>
                <Badge 
                  variant={isReadyForSprint ? "default" : "secondary"}
                  className={isReadyForSprint ? "bg-green-500/10 text-green-600" : ""}
                >
                  {isReadyForSprint ? "Ready" : "In Progress"}
                </Badge>
              </div>
            </div>
            
            <Progress value={completionPercentage} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">{completionPercentage.toFixed(0)}%</div>
                <div className="text-muted-foreground">Overall Complete</div>
              </div>
              <div>
                <div className="font-medium">{readinessPercentage.toFixed(0)}%</div>
                <div className="text-muted-foreground">Sprint Ready</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Configuration Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Loop Configuration */}
        {loopData && (
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Loop Configuration</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">{loopData.name}</span>
                <Badge variant="outline" className="text-xs">
                  {loopData.type}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {loopData.nodeCount} variables, {loopData.linkCount} connections
              </div>
            </div>
          </Card>
        )}

        {/* Parameter Configuration */}
        {tensionSignal && deBandConfig && (
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Parameter Configuration</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">{tensionSignal.name}</span>
                {getTrendIcon(tensionSignal.trend)}
              </div>
              <div className="text-xs text-muted-foreground">
                Current: {tensionSignal.currentValue} {tensionSignal.unit}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">DE-Band Risk:</span>
                <Badge className={getRiskColor(deBandConfig.riskLevel)}>
                  {deBandConfig.riskLevel}
                </Badge>
              </div>
            </div>
          </Card>
        )}

        {/* SRT Horizon */}
        {srtHorizon && (
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h4 className="font-medium">SRT Horizon</h4>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">{srtHorizon.label}</div>
              <div className="text-xs text-muted-foreground">
                {srtHorizon.duration} month strategic response timeframe
              </div>
            </div>
          </Card>
        )}

        {/* Leverage Point */}
        {leveragePoint && (
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Leverage Point</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">{leveragePoint.name}</span>
                <Badge variant="outline" className="text-xs">
                  #{leveragePoint.rank}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {typeof leveragePoint.effectiveness === 'object' && leveragePoint.effectiveness
                  ? `${(leveragePoint.effectiveness as any).balancing || (leveragePoint.effectiveness as any).reinforcing || 0}% effectiveness rating`
                  : `${leveragePoint.effectiveness || 0}% effectiveness rating`
                }
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Macro Vision */}
      {macroVision && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <h4 className="font-medium">Macro Vision</h4>
            {macroVision.isValid && <CheckCircle className="h-4 w-4 text-green-600" />}
          </div>
          <div className="space-y-2">
            <p className="text-sm italic">"{macroVision.text}"</p>
            <div className="text-xs text-muted-foreground">
              {macroVision.text.length}/120 characters
            </div>
          </div>
        </Card>
      )}

      {/* Validation Checklist */}
      <Card className="p-4 space-y-4">
        <h4 className="font-medium">Configuration Checklist</h4>
        
        <div className="space-y-3">
          {Object.entries(
            validationItems.reduce((acc, item) => {
              if (!acc[item.category]) acc[item.category] = [];
              acc[item.category].push(item);
              return acc;
            }, {} as Record<string, ValidationItem[]>)
          ).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center gap-2">
                {getCategoryIcon(category)}
                <h5 className="text-sm font-medium capitalize">{category}</h5>
              </div>
              
              <div className="space-y-1 ml-6">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex items-center mt-0.5">
                      {item.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : item.required ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {item.label}
                        </span>
                        {item.required && (
                          <Badge variant="outline" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onStartSprint}
          disabled={!isReadyForSprint}
          className="flex-1"
          size="lg"
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Start Sprint
        </Button>
        
        <Button
          onClick={onGoToActZone}
          variant="outline"
          disabled={!isReadyForSprint}
          size="lg"
        >
          Go to Act Zone
        </Button>
      </div>

      {/* Readiness Status */}
      {!isReadyForSprint && (
        <Card className="p-4 bg-yellow-500/5 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Configuration Incomplete</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Complete all required items to start your sprint. Missing: {' '}
                {requiredItems.filter(item => !item.completed).map(item => item.label).join(', ')}
              </p>
            </div>
          </div>
        </Card>
      )}

      {isReadyForSprint && (
        <Card className="p-4 bg-green-500/5 border-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800">Ready to Launch Sprint</h4>
              <p className="text-sm text-green-700 mt-1">
                All required configuration items are complete. You can now start your sprint 
                and transition to the Act Zone for intervention design.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};