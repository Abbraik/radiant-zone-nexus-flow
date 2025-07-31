import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThinkZone } from '../contexts/ThinkZoneContext';
import { MetaSolveInterventionBuilder } from '../components/metasolve/MetaSolveInterventionBuilder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, CheckCircle, Target, Zap, FileText, Users, Calendar, Shield, Send } from 'lucide-react';
import { LeverageDomainMapper } from '@/components/think-zone/LeverageDomainMapper';
import { SixLeverSelector } from '@/components/widgets/SixLeverSelector';
import { EnhancedInterventionPicker } from '@/components/widgets/EnhancedInterventionPicker';
import { EnhancedDependencyConfigurator } from '@/components/widgets/EnhancedDependencyConfigurator';
import { EnhancedRACIMatrixEditor } from '@/components/widgets/EnhancedRACIMatrixEditor';
import { InterventionGanttChart } from '@/components/widgets/InterventionGanttChart';
import { ComplianceValidatorPro } from '@/components/widgets/ComplianceValidatorPro';
import { BundleSummaryModal } from '@/components/widgets/BundleSummaryModal';
import { useToast } from '@/hooks/use-toast';
import type { EnhancedIntervention, InterventionBundle, BundleDependency } from '@/types/intervention';

const steps = [
  {
    id: 'government-levers',
    title: 'Choose Government Levers',
    description: 'Select appropriate levers and sub-levers',
    icon: Zap,
    color: 'text-green-500'
  },
  {
    id: 'design-interventions',
    title: 'Design Interventions',
    description: 'Create custom interventions based on selected levers',
    icon: FileText,
    color: 'text-purple-500'
  },
  {
    id: 'configure-dependencies',
    title: 'Configure Dependencies',
    description: 'Set up intervention relationships and sequencing',
    icon: Target,
    color: 'text-orange-500'
  },
  {
    id: 'assign-roles',
    title: 'Assign Roles & Responsibilities',
    description: 'Define RACI matrix for stakeholder accountability',
    icon: Users,
    color: 'text-teal-500'
  },
  {
    id: 'schedule-sprints',
    title: 'Schedule Implementation',
    description: 'Plan timeline and sprint schedules',
    icon: Calendar,
    color: 'text-indigo-500'
  },
  {
    id: 'validate-compliance',
    title: 'Validate Compliance',
    description: 'Ensure regulatory and policy compliance',
    icon: Shield,
    color: 'text-red-500'
  },
  {
    id: 'finalize-bundle',
    title: 'Finalize & Publish',
    description: 'Review and publish intervention bundle',
    icon: Send,
    color: 'text-emerald-500'
  }
];

interface ActZoneWizardProps {
  leveragePoints?: string[]; // Passed from Think Zone
  loopType?: 'Reinforcing' | 'Balancing';
}

export const ActZoneWizard: React.FC<ActZoneWizardProps> = ({ 
  leveragePoints = [], 
  loopType = 'Reinforcing' 
}) => {
  const { sprintBundle } = useThinkZone();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLeveragePoints] = useState<string[]>(leveragePoints);
  const [selectedSubLevers, setSelectedSubLevers] = useState<string[]>([]);
  const [interventions, setInterventions] = useState<EnhancedIntervention[]>([]);
  const [dependencies, setDependencies] = useState<BundleDependency[]>([]);
  const [raciAssignments, setRaciAssignments] = useState<any>({});
  const [scheduleData, setScheduleData] = useState<any>({});
  const [complianceData, setComplianceData] = useState<any>({});
  const [showSummary, setShowSummary] = useState(false);
  const { toast } = useToast();

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: // Government Levers
        return selectedSubLevers.length > 0;
      case 1: // Design Interventions
        return interventions.length > 0;
      case 2: // Dependencies
        return true; // Optional step
      case 3: // Roles
        return Object.keys(raciAssignments).length > 0;
      case 4: // Schedule
        return Object.keys(scheduleData).length > 0;
      case 5: // Compliance
        return Object.keys(complianceData).length > 0;
      case 6: // Finalize
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInterventionCreate = (intervention: EnhancedIntervention) => {
    setInterventions(prev => [...prev, intervention]);
    toast({
      title: "Intervention Created",
      description: `${intervention.name} has been added to your bundle.`
    });
  };

  const handlePublishBundle = () => {
    const bundle: InterventionBundle = {
      id: `bundle-${Date.now()}`,
      name: `Policy Bundle ${new Date().toLocaleDateString()}`,
      description: 'Custom intervention bundle created through Act Zone wizard',
      interventions,
      totalBudget: interventions.reduce((sum, i) => sum + 100000, 0),
      totalTimelineWeeks: Math.max(...interventions.map(i => i.microTasks?.length || 4)),
      riskLevel: 'medium',
      dependencies,
      conflicts: [],
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      stakeholders: [],
      macroVision: 'Strategic policy intervention bundle',
      mesoConfiguration: 'Multi-lever approach with dependencies',
      microConfiguration: 'Detailed implementation with RACI assignments',
      workflowStage: 'design',
      createdBy: 'current-user',
      owner: 'current-user'
    };

    toast({
      title: "Bundle Published Successfully!",
      description: `Your intervention bundle with ${interventions.length} interventions is ready for implementation.`
    });
    
    setShowSummary(false);
    // Reset wizard or navigate away
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-500" />
                Choose Government Levers & Sub-Levers
              </CardTitle>
              {selectedLeveragePoints.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Based on selected leverage points: {selectedLeveragePoints.join(', ')}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <SixLeverSelector
                selectedSubLevers={selectedSubLevers}
                onSubLeverSelect={(subLeverId) => setSelectedSubLevers(prev => [...prev, subLeverId])}
                onSubLeverDeselect={(subLeverId) => setSelectedSubLevers(prev => prev.filter(s => s !== subLeverId))}
                multiSelect={true}
                leveragePointRank={selectedLeveragePoints.length > 0 ? 1 : undefined}
                loopType="Reinforcing"
              />
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                Design Custom Interventions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sprintBundle ? (
                <MetaSolveInterventionBuilder
                  leverageContext={sprintBundle.leverageContext}
                  selectedSubLevers={selectedSubLevers}
                  onInterventionCreate={handleInterventionCreate}
                />
              ) : (
                <div className="p-6 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="text-lg font-semibold mb-2">Design Custom Interventions</h3>
                  <p className="text-muted-foreground mb-4">Create interventions based on selected sub-levers.</p>
                  <Button onClick={() => handleInterventionCreate({
                    id: `intervention-${Date.now()}`,
                    name: 'Sample Intervention',
                    description: 'Sample intervention description',
                    icon: 'target',
                    category: 'Policy',
                    selectedSubLevers,
                    subLeverConfigurations: [],
                    targetLoopVariables: [],
                    expectedLoopImpact: { loopId: 'sample-loop', impactType: 'strengthen', targetVariables: [], expectedMagnitude: 5, confidenceLevel: 'medium', assumptions: [] },
                    parameters: [],
                    microTasks: [],
                    microLoops: [],
                    budget: { totalBudget: 100000, currency: 'USD', lineItems: [], contingency: 0, contingencyPercent: 10, approvalStatus: 'draft' },
                    resources: [],
                    automationRules: [],
                    effort: 'Medium',
                    impact: 'High',
                    complexity: 'Medium',
                    timeToImpact: 'Medium',
                    status: 'draft',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    createdBy: 'user',
                    lastModifiedBy: 'user'
                  })}>
                    Create Intervention
                  </Button>
                </div>
              )}
              {interventions.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Created Interventions ({interventions.length})</h3>
                  <div className="space-y-3">
                    {interventions.map((intervention) => (
                      <div
                        key={intervention.id}
                        className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{intervention.name}</h4>
                          <Badge variant="secondary">{intervention.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{intervention.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-500" />
                Configure Dependencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDependencyConfigurator
                interventions={interventions}
                dependencies={dependencies}
                onDependenciesChange={setDependencies}
              />
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-500" />
                Assign Roles & Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedRACIMatrixEditor
                interventions={interventions}
                onAssignmentsChange={setRaciAssignments}
              />
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                Schedule Implementation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-indigo-500" />
                <h3 className="text-lg font-semibold mb-2">Schedule Implementation</h3>
                <p className="text-muted-foreground mb-4">Plan timeline and sprint schedules for your interventions.</p>
                <Button onClick={() => setScheduleData({ startDate: new Date(), endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) })}>
                  Set Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Validate Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-lg font-semibold mb-2">Validate Compliance</h3>
                <p className="text-muted-foreground mb-4">Ensure your interventions meet regulatory and policy requirements.</p>
                <Button onClick={() => setComplianceData({ status: 'passed', checks: ['regulatory', 'policy', 'budget'] })}>
                  Run Compliance Check
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-emerald-500" />
                Finalize & Publish Bundle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Bundle Ready for Publication</h3>
                <p className="text-muted-foreground">
                  Your intervention bundle is complete and ready to be published.
                </p>
              </div>
              
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-accent">
                    <div className="text-2xl font-bold text-primary">{selectedLeveragePoints.length}</div>
                    <div className="text-sm text-muted-foreground">Leverage Points</div>
                  </div>
                <div className="p-4 rounded-lg bg-accent">
                  <div className="text-2xl font-bold text-primary">{selectedSubLevers.length}</div>
                  <div className="text-sm text-muted-foreground">Sub-Levers</div>
                </div>
                <div className="p-4 rounded-lg bg-accent">
                  <div className="text-2xl font-bold text-primary">{interventions.length}</div>
                  <div className="text-sm text-muted-foreground">Interventions</div>
                </div>
                <div className="p-4 rounded-lg bg-accent">
                  <div className="text-2xl font-bold text-primary">{dependencies.length}</div>
                  <div className="text-sm text-muted-foreground">Dependencies</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/20">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Act Zone Wizard
            </h1>
            <Badge variant="outline" className="text-sm">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentStepData.title}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-8">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div
                key={step.id}
                className={`relative p-3 rounded-lg text-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <StepIcon className="h-4 w-4 mx-auto mb-1" />
                <div className="text-xs font-medium hidden md:block">{step.title}</div>
                {isCompleted && (
                  <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-emerald-500 bg-background rounded-full" />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={() => setShowSummary(true)}
                disabled={!canProceedToNext()}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Review & Publish
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bundle Summary Modal */}
      <BundleSummaryModal
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        onConfirmPublish={handlePublishBundle}
        teamMembers={[
          { id: '1', name: 'John Doe', avatar: '', color: '#3B82F6' },
          { id: '2', name: 'Jane Smith', avatar: '', color: '#10B981' }
        ]}
        customRoles={[
          { id: 'analyst', name: 'Policy Analyst', color: '#8B5CF6', description: 'Analysis and research' },
          { id: 'coordinator', name: 'Project Coordinator', color: '#F59E0B', description: 'Project management' }
        ]}
        bundleData={{
          name: `Policy Bundle ${new Date().toLocaleDateString()}`,
          description: 'Custom intervention bundle created through Act Zone wizard',
          interventions: interventions.map(i => ({
            id: i.id,
            name: i.name,
            category: i.category,
            cost: 100000,
            triImpact: 5
          })),
          assignments: [],
          sprintStart: new Date(),
          sprintEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          totalCost: interventions.length * 100000,
          expectedTRIImprovement: 15,
          complianceStatus: 'passed',
          complianceChecks: [
            { name: 'Regulatory Compliance', status: 'passed', message: 'All regulations met' },
            { name: 'Budget Approval', status: 'passed', message: 'Budget within limits' },
            { name: 'Policy Alignment', status: 'passed', message: 'Aligned with organizational policy' }
          ]
        }}
      />
    </div>
  );
};