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
  const [selectedTensionSignals, setSelectedTensionSignals] = useState<any[]>([]);
  const [leveragePoints, setLeveragePoints] = useState<any[]>([]);
  const [macroVision, setMacroVision] = useState({ text: '', isValid: false });
  const [sprintCreated, setSprintCreated] = useState(false);
  const [showLearning, setShowLearning] = useState(false);

  const steps: ThinkZoneStep[] = [
    {
      id: 'loop-context',
      title: 'Define Loop Context',
      description: 'Select feedback loop archetype for strategic package',
      component: 'LoopBrowser',
      required: true,
      completed: selectedArchetypes.length > 0
    },
    {
      id: 'define-de-band',
      title: 'Define DE-Band',
      description: 'Configure dynamic equilibrium parameters',
      component: 'ParameterPanel',
      required: true,
      completed: selectedArchetypes.length > 0 && 
        parameterConfigs.length >= selectedArchetypes.length &&
        parameterConfigs.slice(0, selectedArchetypes.length).every(config => 
          config.tensionSignal && config.deBandConfig && config.srtHorizon
        )
    },
    {
      id: 'select-sub-levers',
      title: 'Select Sub-Levers',
      description: 'Choose leverage points and government levers',
      component: 'LeverageMapper',
      required: true,
      completed: leveragePoints.length > 0
    },
    {
      id: 'draft-macro-vision',
      title: 'Draft Macro Vision',
      description: 'Define strategic goals bound to feedback loop',
      component: 'MacroVision',
      required: true,
      completed: macroVision.isValid
    },
    {
      id: 'configure-cld',
      title: 'Configure CLD Structure',
      description: 'Build causal loop diagram for bundle context',
      component: 'CLDBuilder',
      required: true,
      completed: !!cldModel && cldModel.nodes.length > 0
    },
    {
      id: 'bundle-review',
      title: 'Bundle Design Review',
      description: 'Review strategic package and handoff to Act Zone',
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

  // Handler for multiple tension signals
  const handleTensionSignalToggle = (signal: any) => {
    setSelectedTensionSignals(prev => {
      const exists = prev.find(s => s.id === signal.id);
      if (exists) {
        return prev.filter(s => s.id !== signal.id);
      } else {
        return [...prev, signal];
      }
    });
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
    // Mock bundle creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mark the bundle review step as completed
    setSprintCreated(true);
    
    toast({
      title: "Bundle Design Complete",
      description: "Strategic bundle ready for Act Zone sprint planning!"
    });
  };

  const handleGoToActZone = (sprintId: string) => {
    // Navigate to Act Zone with bundle data
    toast({
      title: "Navigating to Act Zone",
      description: "Opening Act Zone with your strategic bundle configuration"
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
          <div className="space-y-6">
            <Card className="glass-accent p-6 border-primary/20 rounded-[--radius-lg]">
              <h4 className="font-semibold text-primary mb-3">Loop Context Definition</h4>
              <p className="text-sm text-foreground-muted">
                Select the feedback loop archetype that will form the foundation of your strategic bundle.
              </p>
            </Card>
            <LoopBrowser
              onArchetypeSelect={handleArchetypeSelect}
              onCustomLoopCreate={() => setSelectedArchetypes([])}
              selectedArchetypeIds={selectedArchetypes.map(a => a.id)}
              multiSelect={true}
            />
          </div>
        );
      
      case 'CLDBuilder':
        return (
          <div className="space-y-6">
            <Card className="glass-accent p-6 border-primary/20 rounded-[--radius-lg]">
              <h4 className="font-semibold text-primary mb-3">CLD Structure Configuration</h4>
              <p className="text-sm text-foreground-muted">
                Build the causal loop diagram that will provide the structural context for your strategic bundle.
              </p>
            </Card>
            <EnhancedCLDBuilder
              selectedArchetype={selectedArchetypes[0] || undefined}
              onModelChange={handleModelChange}
              onSave={handleModelSave}
            />
          </div>
        );
      
      case 'ParameterPanel':
        return (
          <div className="space-y-6">
            {/* DE-Band Design Header */}
            <Card className="glass-accent p-6 border-primary/20 rounded-[--radius-lg]">
              <h4 className="font-semibold text-primary mb-3">DE-Band Configuration</h4>
              <p className="text-sm text-foreground-muted">
                Define dynamic equilibrium parameters that will govern your strategic bundle execution.
              </p>
            </Card>
            
            {/* Multi-Loop Configuration Header */}
            {selectedArchetypes.length > 1 && (
              <Card className="glass-accent p-6 border-primary/20 rounded-[--radius-lg]">
                <h4 className="font-semibold text-primary mb-3">Multiple Loop Bundle</h4>
                <p className="text-sm text-foreground-muted">
                  Configure DE-Band parameters for each selected loop archetype in your strategic package.
                </p>
              </Card>
            )}
            
            {/* Parameter panels for each selected archetype */}
            {selectedArchetypes.map((archetype, index) => {
              const currentConfig = parameterConfigs[index] || {
                tensionSignal: null,
                deBandConfig: null,
                srtHorizon: null
              };
              
              return (
                <Card key={archetype.id} className="glass p-6 border-border/30 rounded-[--radius-lg]">
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground flex items-center gap-3">
                      {archetype.name} - DE-Band Design
                      {currentConfig.tensionSignal && currentConfig.deBandConfig && currentConfig.srtHorizon && (
                        <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                          Complete
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-foreground-muted mt-2">{archetype.description}</p>
                  </div>
                  
                  <ParameterPanel
                    config={currentConfig}
                    onConfigChange={(config) => {
                      if (parameterConfigs.length <= index) {
                        // Add new config
                        const newConfigs = [...parameterConfigs];
                        while (newConfigs.length <= index) {
                          newConfigs.push({ tensionSignal: null, deBandConfig: null, srtHorizon: null });
                        }
                        newConfigs[index] = config;
                        setParameterConfigs(newConfigs);
                      } else {
                        // Update existing config
                        handleParameterConfigUpdate(index, config);
                      }
                    }}
                    loopArchetype={archetype.id}
                    selectedTensionSignals={selectedTensionSignals}
                    onTensionSignalToggle={handleTensionSignalToggle}
                    multiSelect={true}
                  />
                </Card>
              );
            })}
            
            {/* Show message if no archetypes selected */}
            {selectedArchetypes.length === 0 && (
              <Card className="glass p-12 text-center border-border/30 rounded-[--radius-lg]">
                <p className="text-foreground-muted">
                  Please define loop context in the previous step to configure DE-Band parameters.
                </p>
              </Card>
            )}
          </div>
        );
      
      case 'LeverageMapper':
        return (
          <div className="space-y-6">
            <Card className="glass-accent p-6 border-primary/20 rounded-[--radius-lg]">
              <h4 className="font-semibold text-primary mb-3">Sub-Lever Selection</h4>
              <p className="text-sm text-foreground-muted">
                Choose specific leverage points and government levers for your strategic bundle.
              </p>
            </Card>
            <LeverageDomainMapper
              selectedLeveragePoint={leveragePoints[0] || null}
              onLeveragePointSelect={handleLeveragePointSelect}
              loopType={selectedArchetypes[0]?.type}
              selectedLeveragePoints={leveragePoints}
              multiSelect={true}
            />
          </div>
        );
      
      case 'MacroVision':
        return (
          <div className="space-y-6">
            <Card className="glass-accent p-6 border-primary/20 rounded-[--radius-lg]">
              <h4 className="font-semibold text-primary mb-3">Macro Vision Drafting</h4>
              <p className="text-sm text-foreground-muted">
                Define the strategic vision that will guide your bundle implementation.
              </p>
            </Card>
            <MacroVisionCapture
              loopArchetype={selectedArchetypes[0]?.id}
              tensionSignal={parameterConfigs[0]?.tensionSignal?.id}
              onVisionChange={setMacroVision}
              initialVision={macroVision.text}
            />
          </div>
        );
      
      case 'Review':
        const bundle = {
          id: `bundle-${Date.now()}`,
          loopConfiguration: {
            archetype: selectedArchetypes.length > 1 
              ? `Multi-Loop Configuration (${selectedArchetypes.length} loops)` 
              : selectedArchetypes[0]?.name || '',
            nodeCount: cldModel?.nodes.length || 0,
            linkCount: cldModel?.links.length || 0,
            modelData: {
              ...cldModel,
              selectedArchetypes,
              multiSelectMode: selectedArchetypes.length > 1
            }
          },
          parameterConfiguration: {
            tensionSignal: selectedTensionSignals.length > 0 ? selectedTensionSignals[0] : parameterConfigs[0]?.tensionSignal,
            deBandConfig: parameterConfigs[0]?.deBandConfig,
            srtHorizon: parameterConfigs[0]?.srtHorizon,
            // Additional data for multi-select
            allConfigurations: parameterConfigs,
            selectedTensionSignals: selectedTensionSignals
          },
          leveragePoint: leveragePoints[0] || {
            id: 'default',
            name: 'No leverage point selected',
            rank: 0,
            effectiveness: 0,
            governmentLevers: []
          },
          macroVision: {
            text: macroVision.text,
            characterCount: macroVision.text.length
          },
          metadata: {
            createdAt: new Date(),
            createdBy: 'current-user',
            thinkZoneVersion: '3.0',
            // Extended metadata for multi-select
            multiSelectMode: selectedArchetypes.length > 1,
            selectedArchetypes: selectedArchetypes,
            allParameterConfigs: parameterConfigs,
            allLeveragePoints: leveragePoints,
            totalSelections: {
              archetypes: selectedArchetypes.length,
              parameterConfigs: parameterConfigs.length,
              leveragePoints: leveragePoints.length,
              tensionSignals: selectedTensionSignals.length
            }
          }
        };

        const loopData = {
          name: selectedArchetypes.length > 1 
            ? `Multi-Loop Configuration (${selectedArchetypes.length} loops)` 
            : selectedArchetypes[0]?.name || '',
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
            {/* Bundle Design Summary */}
            {selectedArchetypes.length > 1 && (
              <Card className="glass-accent p-6 border-primary/20 rounded-[--radius-lg]">
                <h4 className="font-semibold text-primary mb-3">Strategic Bundle Configuration Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{selectedArchetypes.length}</div>
                    <div className="text-sm text-foreground-muted">Loop Contexts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{parameterConfigs.filter(config => 
                      config.tensionSignal && config.deBandConfig && config.srtHorizon
                    ).length}</div>
                    <div className="text-sm text-foreground-muted">DE-Band Configurations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{leveragePoints.length}</div>
                    <div className="text-sm text-foreground-muted">Sub-Levers</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-foreground">Bundle Components:</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedArchetypes.map((archetype, index) => {
                      const hasConfig = parameterConfigs[index] && 
                        parameterConfigs[index].tensionSignal && 
                        parameterConfigs[index].deBandConfig && 
                        parameterConfigs[index].srtHorizon;
                      return (
                        <Badge 
                          key={archetype.id} 
                          variant="outline" 
                          className={`text-primary border-primary/30 ${hasConfig ? 'bg-success/20' : 'bg-warning/20'}`}
                        >
                          {archetype.name} {hasConfig ? '✓' : '⚠️'}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <p className="text-sm text-foreground-muted mt-3">
                  Ready to handoff strategic bundle to Act Zone for sprint implementation.
                </p>
              </Card>
            )}
            
            <ReviewSummaryPanel
              validationItems={getValidationItems()}
              loopData={loopData}
              tensionSignal={selectedTensionSignals.length > 0 ? selectedTensionSignals[0] : parameterConfigs[0]?.tensionSignal}
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
    <div className="min-h-screen flex flex-col glass-hero">
      {/* Header */}
      <div className="glass-secondary border-b border-border/50 sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Think Zone</h1>
              <p className="text-foreground-muted">Streamlined Strategic Framing</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                onClick={() => setShowLearning(true)}
                className="glass rounded-[--radius-button]"
              >
                Learning Hub
              </Button>
              
              <div className="text-sm text-foreground-subtle">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Configuration Progress</span>
              <span className="text-primary font-semibold">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3 bg-muted rounded-full" />
          </div>

          {/* Steps Navigation */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {steps.map((step, index) => (
              <Button
                key={step.id}
                variant={index === currentStep ? "default" : step.completed ? "secondary" : "outline"}
                size="sm"
                onClick={() => setCurrentStep(index)}
                className={`whitespace-nowrap transition-all ${
                  index === currentStep 
                    ? "bg-primary text-primary-foreground shadow-lg" 
                    : step.completed 
                      ? "bg-success/20 text-success border-success/30 hover:bg-success/30" 
                      : "glass-secondary border-border/30 hover:bg-glass-primary"
                }`}
              >
                {step.completed && "✓ "}{step.title}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar glass-secondary">
        <div className="p-8 max-w-7xl mx-auto">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
          >
            <div className="glass rounded-[--radius-xl] p-8 shadow-elevation border border-border/20">
              {renderStepContent()}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="glass-secondary border-t border-border/50 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="glass rounded-[--radius-button] border-border/30 hover:bg-glass-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="text-sm text-foreground-subtle font-medium">
            {steps[currentStep]?.description}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentStep < steps.length - 1 && !canProceed}
            className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-[--radius-button] px-6 py-3 shadow-lg transition-all hover:shadow-xl hover:scale-105"
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