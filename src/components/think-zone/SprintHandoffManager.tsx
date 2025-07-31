import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Package, 
  CheckCircle, 
  Clock, 
  Target, 
  Users,
  Rocket,
  FileText
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';
import { useThinkZone } from '../../contexts/ThinkZoneContext';

interface SprintBundle {
  id: string;
  loopConfiguration: {
    archetype: string;
    nodeCount: number;
    linkCount: number;
    modelData: any;
  };
  parameterConfiguration: {
    tensionSignal: any;
    deBandConfig: any;
    srtHorizon: any;
    allConfigurations?: any[];
  };
  leveragePoint: {
    id: string;
    name: string;
    rank: number;
    effectiveness: number;
    governmentLevers: string[];
  };
  macroVision: {
    text: string;
    characterCount: number;
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    thinkZoneVersion: string;
  };
}

interface SprintHandoffManagerProps {
  bundle: SprintBundle;
  onCreateSprint: (bundle: SprintBundle) => Promise<void>;
  onGoToActZone: (sprintId: string) => void;
  isCreating?: boolean;
}

export const SprintHandoffManager: React.FC<SprintHandoffManagerProps> = ({
  bundle,
  onCreateSprint,
  onGoToActZone,
  isCreating = false
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { navigateToActZone } = useThinkZone();

  const handleCreateSprint = async () => {
    try {
      await onCreateSprint(bundle);
      toast({
        title: "Sprint Created Successfully",
        description: "Your Think Zone configuration has been converted into an actionable sprint.",
      });
    } catch (error) {
      toast({
        title: "Sprint Creation Failed",
        description: "There was an error creating your sprint. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleGoToActZone = () => {
    // Convert bundle to SprintBundle format and navigate
    const sprintBundle = {
      id: bundle.id,
      leverageContext: {
        leveragePointRank: bundle.leveragePoint?.rank || 6,
        leveragePointName: bundle.leveragePoint?.name || 'Unknown',
        loopId: bundle.loopConfiguration?.modelData?.selectedArchetypes?.[0]?.id || 'unknown',
        loopName: bundle.loopConfiguration?.archetype || 'Unknown Loop',
        loopType: bundle.loopConfiguration?.modelData?.selectedArchetypes?.[0]?.type || 'Balancing',
        deBandStatus: 'yellow' as const
      },
      selectedArchetypes: bundle.loopConfiguration?.modelData?.selectedArchetypes || [],
      macroVision: {
        text: bundle.macroVision?.text || '',
        timeHorizon: bundle.parameterConfiguration?.srtHorizon?.duration ? `${bundle.parameterConfiguration.srtHorizon.duration} months` : '6 months',
        successMetrics: []
      },
      parameterConfiguration: {
        ...bundle.parameterConfiguration,
        allConfigurations: bundle.parameterConfiguration?.allConfigurations || []
      },
      metadata: bundle.metadata
    };
    
    navigateToActZone(sprintBundle);
  };

  const getBundleSize = () => {
    const components = [
      bundle.loopConfiguration,
      bundle.parameterConfiguration,
      bundle.leveragePoint,
      bundle.macroVision
    ].filter(Boolean).length;
    
    return components;
  };

  const getEstimatedSetupTime = () => {
    const leverageComplexity = bundle.leveragePoint?.rank || 6;
    const srtDuration = bundle.parameterConfiguration?.srtHorizon?.duration || 6;
    
    // Estimate based on leverage point complexity and SRT horizon
    if (leverageComplexity >= 10) return "2-3 weeks";
    if (leverageComplexity >= 7) return "1-2 weeks";
    if (srtDuration <= 3) return "3-5 days";
    return "1 week";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-semibold">Sprint Bundle Ready</h3>
        </div>
        <p className="text-muted-foreground">
          Your Think Zone configuration is packaged and ready for Act Zone deployment
        </p>
      </div>

      {/* Bundle Overview */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Bundle Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{getBundleSize()}</div>
              <div className="text-sm text-muted-foreground">Components</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {bundle.parameterConfiguration?.srtHorizon?.duration || 6}m
              </div>
              <div className="text-sm text-muted-foreground">SRT Horizon</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                #{bundle.leveragePoint?.rank || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Leverage Point</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{getEstimatedSetupTime()}</div>
              <div className="text-sm text-muted-foreground">Setup Time</div>
            </div>
          </div>

          {/* Component Checklist */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Bundle Contents</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  icon: <Target className="h-4 w-4" />,
                  title: "Loop Configuration",
                  description: `${bundle.loopConfiguration?.archetype} archetype with ${bundle.loopConfiguration?.nodeCount} variables`,
                  completed: !!bundle.loopConfiguration
                },
                {
                  icon: <Clock className="h-4 w-4" />,
                  title: "Parameter Settings",
                  description: `${bundle.parameterConfiguration?.tensionSignal?.name} with DE-Bands and SRT`,
                  completed: !!bundle.parameterConfiguration
                },
                {
                  icon: <Users className="h-4 w-4" />,
                  title: "Leverage Strategy",
                  description: `${bundle.leveragePoint?.name} (${bundle.leveragePoint?.effectiveness}% effectiveness)`,
                  completed: !!bundle.leveragePoint
                },
                {
                  icon: <FileText className="h-4 w-4" />,
                  title: "Macro Vision",
                  description: `"${bundle.macroVision?.text?.substring(0, 40)}${bundle.macroVision?.text?.length > 40 ? '...' : ''}"`,
                  completed: !!bundle.macroVision?.text
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center mt-0.5">
                    {item.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="font-medium text-sm">{item.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Government Levers Preview */}
          {bundle.leveragePoint?.governmentLevers && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Connected Government Levers</h4>
              <div className="flex flex-wrap gap-2">
                {bundle.leveragePoint.governmentLevers.map((lever) => (
                  <Badge key={lever} variant="outline" className="text-xs">
                    {lever.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Handoff Actions */}
      <div className="space-y-4">
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Rocket className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium">Ready for Sprint Launch</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your strategic framing is complete. Create a sprint to begin operational design 
                  and intervention development in the Act Zone.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCreateSprint}
                disabled={isCreating}
                className="flex-1"
                size="lg"
              >
                {isCreating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Package className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Package className="h-4 w-4 mr-2" />
                )}
                {isCreating ? 'Creating Sprint...' : 'Create Sprint'}
              </Button>

              <Button
                onClick={handleGoToActZone}
                variant="outline"
                size="lg"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Go to Act Zone
              </Button>
            </div>
          </div>
        </Card>

        {/* Next Steps Preview */}
        <Card className="p-4">
          <h4 className="font-medium text-sm mb-3">What Happens Next?</h4>
          <div className="space-y-3">
            {[
              {
                step: 1,
                title: "Sprint Initialization",
                description: "Your Think Zone bundle becomes an active sprint with tasks and workflows"
              },
              {
                step: 2,
                title: "Intervention Design",
                description: "Use Act Zone tools to design specific interventions based on your leverage strategy"
              },
              {
                step: 3,
                title: "Stakeholder Mapping",
                description: "Identify and engage stakeholders using the RACI matrix and collaboration tools"
              },
              {
                step: 4,
                title: "Implementation Planning",
                description: "Create detailed implementation plans with timelines and resource allocation"
              }
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-sm">{item.title}</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};