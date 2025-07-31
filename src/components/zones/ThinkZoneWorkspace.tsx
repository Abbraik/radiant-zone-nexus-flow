import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Save, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { LoopBrowser, LoopArchetype } from '../think-zone/LoopBrowser';
import { EnhancedCLDBuilder } from '../think-zone/EnhancedCLDBuilder';
import { ParameterPanel } from '../think-zone/ParameterPanel';
import { LeverageDomainMapper } from '../think-zone/LeverageDomainMapper';
import { MacroVisionCapture } from '../think-zone/MacroVisionCapture';
import { ReviewSummaryPanel } from '../think-zone/ReviewSummaryPanel';
import { LearningAidSystem } from '../think-zone/LearningAidSystem';
import { SprintHandoffManager } from '../think-zone/SprintHandoffManager';
import { CLDModel } from '../../types/cld';
import { useToast } from '../ui/use-toast';

interface ThinkZoneStep {
  id: string;
  title: string;
  description: string;
  component: string;
  required: boolean;
  completed: boolean;
}

export const ThinkZoneWorkspace: React.FC = () => {
  const { toast } = useToast();
  
  // Core state - now supporting multiple selections
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedArchetypes, setSelectedArchetypes] = useState<LoopArchetype[]>([]);
  const [cldModel, setCldModel] = useState<CLDModel | null>(null);
  const [parameterConfigs, setParameterConfigs] = useState<any[]>([]);
  const [leveragePoints, setLeveragePoints] = useState<any[]>([]);
  const [macroVision, setMacroVision] = useState({ text: '', isValid: false });
  const [sprintCreated, setSprintCreated] = useState(false);
  const [showLearning, setShowLearning] = useState(false);

  const steps: ThinkZoneStep[] = [
    {
      id: 'loop-selection',
      title: 'Loop Selection',
      description: 'Choose or create your causal loop archetypes',
      component: 'LoopBrowser',
      required: true,
      completed: selectedArchetypes.length > 0
    },
    {
      id: 'cld-building',
      title: 'CLD Building',
      description: 'Configure your causal loop diagram',
      component: 'CLDBuilder',
      required: true,
      completed: !!cldModel && cldModel.nodes.length > 0
    },
    {
      id: 'parameters',
      title: 'Parameters',
      description: 'Set tension signals, DE-Bands, and SRT horizons',
      component: 'ParameterPanel',
      required: true,
      completed: parameterConfigs.length > 0 && parameterConfigs.every(config => 
        config.tensionSignal && config.deBandConfig && config.srtHorizon
      )
    },
    {
      id: 'leverage',
      title: 'Leverage Mapping',
      description: 'Select leverage points and government levers',
      component: 'LeverageMapper',
      required: true,
      completed: leveragePoints.length > 0
    },
    {
      id: 'vision',
      title: 'Macro Vision',
      description: 'Define high-level goals in 120 characters',
      component: 'MacroVision',
      required: true,
      completed: macroVision.isValid
    },
    {
      id: 'review',
      title: 'Review & Launch',
      description: 'Review configuration and create sprint',
      component: 'Review',
      required: false,
      completed: sprintCreated
    }
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;
  const canProceed = steps[currentStep]?.completed || !steps[currentStep]?.required;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handler for multiple archetype selection
  const handleArchetypeSelect = (archetype: LoopArchetype) => {
    setSelectedArchetypes(prev => {
      const exists = prev.find(a => a.id === archetype.id);
      if (exists) {
        return prev.filter(a => a.id !== archetype.id);
      } else {
        return [...prev, archetype];
      }
    });
    toast({
      title: "Archetype Selected",
      description: `${archetype.name} archetype ready for configuration`
    });
  };

  const handleModelChange = (model: CLDModel) => {
    setCldModel(model);
  };

  const handleModelSave = (model: CLDModel) => {
    setCldModel(model);
    toast({
      title: "Model Saved",
      description: "Your causal loop diagram has been saved"
    });
  };

  // Handler for multiple parameter configurations
  const handleParameterConfigAdd = (config: any) => {
    setParameterConfigs(prev => [...prev, config]);
  };

  const handleParameterConfigUpdate = (index: number, config: any) => {
    setParameterConfigs(prev => prev.map((c, i) => i === index ? config : c));
  };

  const handleParameterConfigRemove = (index: number) => {
    setParameterConfigs(prev => prev.filter((_, i) => i !== index));
  };

  // Handler for multiple leverage points
  const handleLeveragePointSelect = (point: any) => {
    setLeveragePoints(prev => {
      const exists = prev.find(p => p.id === point.id);
      if (exists) {
        return prev.filter(p => p.id !== point.id);
      } else {
        return [...prev, point];
      }
    });
  };

  const handleCreateSprint = async (bundle: any) => {
    // Mock sprint creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mark the review step as completed
    setSprintCreated(true);
    
    toast({
      title: "Sprint Created",
      description: "Your Think Zone configuration is now a sprint!"
    });
  };

  const handleGoToActZone = (sprintId: string) => {
    // Navigate to Act Zone with sprint data
    toast({
      title: "Navigating to Act Zone",
      description: "Opening Act Zone with your sprint configuration"
    });
  };

  const getValidationItems = () => {
    return steps.map(step => ({
      id: step.id,
      label: step.title,
      description: step.description,
      completed: step.completed,
      required: step.required,
      category: (step.id.includes('loop') || step.id.includes('cld') ? 'loop' : 
                step.id.includes('parameter') ? 'parameters' :
                step.id.includes('leverage') ? 'leverage' : 'vision') as 'loop' | 'parameters' | 'leverage' | 'vision'
    }));
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step?.component) {
      case 'LoopBrowser':
        return (
          <LoopBrowser
            onArchetypeSelect={handleArchetypeSelect}
            onCustomLoopCreate={() => setSelectedArchetypes([])}
            selectedArchetypeIds={selectedArchetypes.map(a => a.id)}
            multiSelect={true}
          />
        );
      
      case 'CLDBuilder':
        return (
          <EnhancedCLDBuilder
            selectedArchetype={selectedArchetypes[0] || undefined}
            onModelChange={handleModelChange}
            onSave={handleModelSave}
          />
        );
      
      case 'ParameterPanel':
        // For now, create one config per archetype
        const currentConfig = parameterConfigs[0] || {
          tensionSignal: null,
          deBandConfig: null,
          srtHorizon: null
        };
        
        return (
          <ParameterPanel
            config={currentConfig}
            onConfigChange={(config) => {
              if (parameterConfigs.length === 0) {
                handleParameterConfigAdd(config);
              } else {
                handleParameterConfigUpdate(0, config);
              }
            }}
            loopArchetype={selectedArchetypes[0]?.id}
          />
        );
      
      case 'LeverageMapper':
        return (
          <LeverageDomainMapper
            selectedLeveragePoint={leveragePoints[0] || null}
            onLeveragePointSelect={handleLeveragePointSelect}
            loopType={selectedArchetypes[0]?.type}
          />
        );
      
      case 'MacroVision':
        return (
          <MacroVisionCapture
            loopArchetype={selectedArchetypes[0]?.id}
            tensionSignal={parameterConfigs[0]?.tensionSignal?.id}
            onVisionChange={setMacroVision}
            initialVision={macroVision.text}
          />
        );
      
      case 'Review':
        const bundle = {
          id: `bundle-${Date.now()}`,
          loopConfiguration: {
            archetype: selectedArchetypes[0]?.name || '',
            nodeCount: cldModel?.nodes.length || 0,
            linkCount: cldModel?.links.length || 0,
            modelData: cldModel
          },
          parameterConfiguration: parameterConfigs[0] || {},
          leveragePoint: leveragePoints[0] || null,
          macroVision: {
            text: macroVision.text,
            characterCount: macroVision.text.length
          },
          metadata: {
            createdAt: new Date(),
            createdBy: 'current-user',
            thinkZoneVersion: '3.0',
            selectedArchetypes: selectedArchetypes,
            allParameterConfigs: parameterConfigs,
            allLeveragePoints: leveragePoints
          }
        };

        const loopData = {
          name: selectedArchetypes[0]?.name || '',
          type: selectedArchetypes[0]?.type || 'balancing' as 'balancing' | 'reinforcing',
          nodeCount: cldModel?.nodes.length || 0,
          linkCount: cldModel?.links.length || 0
        };

        const reviewMacroVision = {
          text: macroVision.text,
          isValid: macroVision.isValid
        };
        
        return (
          <div className="space-y-6">
            {/* Multi-Selection Summary */}
            {selectedArchetypes.length > 1 && (
              <Card className="p-4 bg-blue-500/5 border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Multiple Loops Selected</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArchetypes.map((archetype) => (
                    <Badge key={archetype.id} variant="outline" className="text-blue-600">
                      {archetype.name}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-blue-700 mt-2">
                  The system will configure parameters for all selected loops and find common leverage points.
                </p>
              </Card>
            )}
            
            <ReviewSummaryPanel
              validationItems={getValidationItems()}
              loopData={loopData}
              tensionSignal={parameterConfigs[0]?.tensionSignal}
              deBandConfig={parameterConfigs[0]?.deBandConfig}
              srtHorizon={parameterConfigs[0]?.srtHorizon}
              leveragePoint={leveragePoints[0]}
              macroVision={reviewMacroVision}
            />
            
            <SprintHandoffManager
              bundle={bundle}
              onCreateSprint={handleCreateSprint}
              onGoToActZone={handleGoToActZone}
            />
          </div>
        );
      
      default:
        return <div>Step content not found</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Think Zone</h1>
              <p className="text-muted-foreground">Streamlined Strategic Framing</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowLearning(true)}
              >
                Learning Hub
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Configuration Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps Navigation */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto">
            {steps.map((step, index) => (
              <Button
                key={step.id}
                variant={index === currentStep ? "default" : step.completed ? "secondary" : "outline"}
                size="sm"
                onClick={() => setCurrentStep(index)}
                className="whitespace-nowrap"
              >
                {step.completed && "✓ "}{step.title}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            {renderStepContent()}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-background/95 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="text-sm text-muted-foreground">
            {steps[currentStep]?.description}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentStep < steps.length - 1 && !canProceed}
          >
            {currentStep === steps.length - 1 ? "Complete" : "Next"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Learning Aid Dialog */}
      {showLearning && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <LearningAidSystem
              currentContext={steps[currentStep]?.id}
              onClose={() => setShowLearning(false)}
            />
          </Card>
        </div>
      )}
    </div>
  );
};