import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { DecisionResult, SignalReading } from '@/services/capacity-decision/types';
import type { ReflexiveRecipe } from '@/reflexive/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  TrendingUp, 
  Zap, 
  Clock, 
  Shield, 
  FileText, 
  ArrowRight,
  AlertTriangle,
  Play,
  Edit3,
  Save,
  Calendar,
  HelpCircle
} from 'lucide-react';

// Components
import { ControllerTuner } from './reflexive/ControllerTuner';
import { BandsWeightsStudio } from './reflexive/BandsWeightsStudio';
import { ExperimentPlanner } from './reflexive/ExperimentPlanner';
import { LearningTimeline } from './reflexive/LearningTimeline';
import { GuardrailsPolicies } from './reflexive/GuardrailsPolicies';
import { ProposedTasks } from './reflexive/ProposedTasks';
import { HandoffsPanel } from './reflexive/HandoffsPanel';
import { ActivationVector } from './reflexive/ActivationVector';
import { ReviewCountdown } from './reflexive/ReviewCountdown';
import { TransparencyDrawer } from './reflexive/TransparencyDrawer';
import { AdvancedEditSheet } from './reflexive/AdvancedEditSheet';
import { HelpOverlay } from './reflexive/HelpOverlay';

interface ReflexiveCapacityPageProps {
  decision: DecisionResult;
  reading: SignalReading;
  recipe?: ReflexiveRecipe;
  screen?: 'controller-tuner' | 'bands-weights';
  onSaveTuning?: (tuning: any) => Promise<{ id: string }>;
  onSaveBandWeight?: (change: any) => Promise<{ id: string }>;
  onSaveEvaluation?: (evaluation: any) => Promise<{ id: string }>;
  onCreateTasks?: (tasks: any[]) => Promise<void>;
  onOpenClaimDrawer?: (tasks: any[]) => void;
  onHandoff?: (to: string, reason: string) => void;
}

export const ReflexiveCapacityPage: React.FC<ReflexiveCapacityPageProps> = ({
  decision,
  reading,
  recipe,
  screen = 'controller-tuner',
  onSaveTuning,
  onSaveBandWeight,
  onSaveEvaluation,
  onCreateTasks,
  onOpenClaimDrawer,
  onHandoff
}) => {
  const [busy, setBusy] = useState(false);
  const [rationale, setRationale] = useState('');
  const [showAdvancedEdit, setShowAdvancedEdit] = useState(false);
  const [showHelpOverlay, setShowHelpOverlay] = useState(false);
  const [showTransparencyDrawer, setShowTransparencyDrawer] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      
      switch (e.key.toLowerCase()) {
        case 'r':
          e.preventDefault();
          if (recipe) handleApplyRecipe();
          break;
        case 'e':
          e.preventDefault();
          setShowAdvancedEdit(true);
          break;
        case 'w':
          e.preventDefault();
          if (screen === 'bands-weights') handleSaveBandWeights();
          break;
        case 'l':
          e.preventDefault();
          // Focus on rationale textarea
          (document.querySelector('textarea[placeholder*="rationale"]') as HTMLElement)?.focus();
          break;
        case 'h':
          e.preventDefault();
          // Focus handoffs panel
          (document.querySelector('[data-testid="handoffs-panel"]') as HTMLElement)?.focus();
          break;
        case 's':
          e.preventDefault();
          handleScheduleReview();
          break;
        case '?':
          e.preventDefault();
          setShowHelpOverlay(true);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [recipe, screen]);

  // Analytics
  const trackEvent = useCallback((eventType: string, data: any) => {
    // Integration point for analytics
    console.log(`Analytics: ${eventType}`, { 
      ...data, 
      loop: decision.loopCode,
      indicator: decision.indicator,
      userId: 'current-user',
      timestamp: new Date().toISOString()
    });
  }, [decision]);

  useEffect(() => {
    trackEvent('reflexive_opened', {
      loop: decision.loopCode,
      indicator: decision.indicator,
      osc: reading.oscillation,
      rmse: reading.rmseRel,
      disp: reading.dispersion,
      decisionId: decision.decisionId
    });
  }, []);

  // Handlers
  const handleApplyRecipe = useCallback(async () => {
    if (!recipe || !rationale.trim()) return;
    
    setBusy(true);
    try {
      // Apply recipe logic here
      await onSaveTuning?.({
        recipe: recipe.id,
        rationale: rationale.trim(),
        loopCode: decision.loopCode,
        indicator: decision.indicator
      });

      trackEvent('reflexive_apply_recipe', {
        recipeId: recipe.id,
        type: 'tuning'
      });

      setRationale('');
    } finally {
      setBusy(false);
    }
  }, [recipe, rationale, decision, onSaveTuning, trackEvent]);

  const handleSaveBandWeights = useCallback(async () => {
    if (!rationale.trim()) return;
    
    setBusy(true);
    try {
      await onSaveBandWeight?.({
        rationale: rationale.trim(),
        loopCode: decision.loopCode,
        indicator: decision.indicator
      });

      trackEvent('reflexive_band_weight_save', {
        deltaWeights: {},
        deltaBands: {}
      });

      setRationale('');
    } finally {
      setBusy(false);
    }
  }, [rationale, decision, onSaveBandWeight, trackEvent]);

  const handleScheduleReview = useCallback(async () => {
    await onSaveEvaluation?.({
      method: 'ITS',
      reviewAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      loopCode: decision.loopCode,
      indicators: [decision.indicator]
    });

    trackEvent('reflexive_schedule_review', {
      method: 'ITS',
      reviewAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    });
  }, [decision, onSaveEvaluation, trackEvent]);

  const handleHandoff = useCallback((to: string, reason: string) => {
    onHandoff?.(to, reason);
    trackEvent('reflexive_handoff', { to, reason });
  }, [onHandoff, trackEvent]);

  // Handoff enablement logic
  const handoffStates = {
    responsive: decision.severity >= 0.5 && reading.slope > 0,
    deliberative: reading.dispersion >= 0.5 || decision.consent.requireDeliberative,
    structural: reading.persistencePk >= 0.5 || reading.integralError >= 0.5
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                Workspace-5C › Reflexive
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {decision.loopCode} · {decision.indicator}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Oscillation {reading.oscillation.toFixed(2)}</span>
                <span>RMSE {reading.rmseRel.toFixed(2)}</span>
                <span>Dispersion {reading.dispersion.toFixed(2)}</span>
                <span>Last update 2 min ago</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ActivationVector currentCapacity="reflexive" />
              {decision.consent.requireDeliberative && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-warning text-warning hover:bg-warning/10"
                  onClick={() => setShowTransparencyDrawer(true)}
                >
                  Consent Gate
                </Button>
              )}
              <ReviewCountdown reviewDate={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Column - Primary Work */}
          <div className="xl:col-span-3 space-y-6">
            {/* Screen Toggle */}
            <Tabs value={screen} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="controller-tuner" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Controller Tuner
                </TabsTrigger>
                <TabsTrigger value="bands-weights" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Bands & Weights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="controller-tuner" className="space-y-6 mt-6">
                <ControllerTuner
                  reading={reading}
                  recipe={recipe}
                  onApplyRecipe={handleApplyRecipe}
                  onAdvancedEdit={() => setShowAdvancedEdit(true)}
                  rationale={rationale}
                  onRationaleChange={setRationale}
                  busy={busy}
                />
              </TabsContent>

              <TabsContent value="bands-weights" className="space-y-6 mt-6">
                <BandsWeightsStudio
                  reading={reading}
                  onSave={handleSaveBandWeights}
                  rationale={rationale}
                  onRationaleChange={setRationale}
                  busy={busy}
                />
              </TabsContent>
            </Tabs>

            {/* Experiment & Evaluation */}
            <ExperimentPlanner
              decision={decision}
              onScheduleReview={handleScheduleReview}
            />

            {/* Rationale Field */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rationale</CardTitle>
                <CardDescription>
                  Required for all changes. Describe the reasoning and expected impact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Explain the rationale for this change..."
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Context & Safety */}
          <div className="space-y-6">
            <LearningTimeline />
            <GuardrailsPolicies reading={reading} />
            <ProposedTasks 
              tasks={[]}
              onOpenClaimDrawer={onOpenClaimDrawer}
            />
            <HandoffsPanel
              states={handoffStates}
              onHandoff={handleHandoff}
            />
          </div>
        </div>
      </div>

      {/* Drawers and Sheets */}
      <AdvancedEditSheet
        open={showAdvancedEdit}
        onOpenChange={setShowAdvancedEdit}
        onSave={onSaveTuning}
      />

      <TransparencyDrawer
        open={showTransparencyDrawer}
        onOpenChange={setShowTransparencyDrawer}
      />

      <HelpOverlay
        open={showHelpOverlay}
        onOpenChange={setShowHelpOverlay}
      />

      {/* Help Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full shadow-lg"
        onClick={() => setShowHelpOverlay(true)}
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default ReflexiveCapacityPage;