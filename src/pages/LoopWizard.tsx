import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLoopWizardStore } from '@/stores/useLoopWizardStore';
import { ParadigmDoctrineStep } from '@/components/loop-wizard/ParadigmDoctrineStep';
import { IndicatorsStep } from '@/components/loop-wizard/IndicatorsStep';
import { FlowStep } from '@/components/loop-wizard/FlowStep';
import { LoopAtlasStep } from '@/components/loop-wizard/LoopAtlasStep';
import { ModulesExperimentsStep } from '@/components/loop-wizard/ModulesExperimentsStep';
import { BaselinesStep } from '@/components/loop-wizard/BaselinesStep';
import { ReviewStep } from '@/components/loop-wizard/ReviewStep';
import { toast } from '@/hooks/use-toast';

const STEPS = [
  { title: 'Paradigm & Doctrine', description: 'Define worldview, paradigm, and doctrine' },
  { title: 'Aggregates & Indicators', description: 'Select key indicators and data sources' },
  { title: 'Stocks & Flows', description: 'Map system dynamics and delays' },
  { title: 'Loop Atlas', description: 'Identify feedbacks and leverage points' },
  { title: 'Modules & Experiments', description: 'Design pilots and experiments' },
  { title: 'Baselines & Reflex Memory', description: 'Set baselines and capture learnings' },
  { title: 'Review & Create', description: 'Generate RRE outputs and create loop' },
];

const LoopWizard: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    setCurrentStep,
    formData,
    resetForm,
    isLoading,
  } = useLoopWizardStore();

  // Initialize form on mount
  useEffect(() => {
    // Reset form when component mounts to ensure clean state
    resetForm();
  }, [resetForm]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    resetForm();
    navigate('/registry');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ParadigmDoctrineStep onNext={handleNext} />;
      case 1:
        return <IndicatorsStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 2:
        return <FlowStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <LoopAtlasStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 4:
        return <ModulesExperimentsStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 5:
        return <BaselinesStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 6:
        return <ReviewStep onPrevious={handlePrevious} />;
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">New Loop (RRE)</h1>
              <p className="text-muted-foreground">Create a new loop with all related artifacts</p>
            </div>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Navigation */}
          <div className="flex space-x-1 overflow-x-auto pb-2">
            {STEPS.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`flex-shrink-0 px-3 py-2 text-xs rounded-md transition-colors ${
                  index === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index < currentStep
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-background text-muted-foreground hover:bg-muted'
                }`}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-1">
                  {index < currentStep && <Check className="w-3 h-3" />}
                  <span>{step.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="min-h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>{STEPS[currentStep].title}</span>
            </CardTitle>
            <p className="text-muted-foreground">{STEPS[currentStep].description}</p>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Auto-save indicator */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Changes are automatically saved to your browser
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoopWizard;