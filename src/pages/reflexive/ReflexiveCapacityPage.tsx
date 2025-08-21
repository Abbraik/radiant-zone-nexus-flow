import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import type { DecisionResult, SignalReading } from '@/services/capacity-decision/types';
import type { ReflexiveRecipe } from '@/reflexive/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  HelpCircle,
  CheckCircle,
  Activity
} from 'lucide-react';

// Component imports - use existing paths since they already exist
import { ControllerTuner } from '../reflexive/ControllerTuner';
import { BandsWeightsStudio } from '../reflexive/BandsWeightsStudio';
import { ExperimentPlanner } from '../reflexive/ExperimentPlanner';
import { LearningTimeline } from '../reflexive/LearningTimeline';
import { GuardrailsPolicies } from '../reflexive/GuardrailsPolicies';
import { ProposedTasks } from '../responsive/ProposedTasks';
import { HandoffsPanel } from '../reflexive/HandoffsPanel';
import { ActivationVector } from './ActivationVector';
import { ReviewCountdown } from './ReviewCountdown';
import { TransparencyDrawer } from './TransparencyDrawer';
import { AdvancedEditSheet } from './AdvancedEditSheet';
import { HelpOverlay } from './HelpOverlay';

interface ReflexiveCapacityPageProps {
  loopCode: string;
  indicator: string;
  decision: DecisionResult;
  reading: SignalReading;
  recipe?: ReflexiveRecipe;
  onSaveTuning?: (tuning: any) => Promise<{ id: string }>;
  onSaveBandWeight?: (change: any) => Promise<{ id: string }>;
  onSaveEvaluation?: (evaluation: any) => Promise<{ id: string }>;
  onCreateTasks?: (tasks: any[]) => Promise<void>;
  onOpenClaimDrawer?: (tasks: any[]) => void;
  onHandoff?: (to: string, reason: string) => void;
}

export const ReflexiveCapacityPage: React.FC<ReflexiveCapacityPageProps> = ({
  loopCode,
  indicator,
  decision,
  reading,
  recipe,
  onSaveTuning,
  onSaveBandWeight,
  onSaveEvaluation,
  onCreateTasks,
  onOpenClaimDrawer,
  onHandoff
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const screen = (searchParams.get('screen') as 'controller-tuner' | 'bands-weights') || 'controller-tuner';
  
  const [busy, setBusy] = useState(false);
  const [rationale, setRationale] = useState('');
  const [showAdvancedEdit, setShowAdvancedEdit] = useState(false);
  const [showHelpOverlay, setShowHelpOverlay] = useState(false);
  const [showTransparencyDrawer, setShowTransparencyDrawer] = useState(false);

  // Screen switching
  const switchScreen = useCallback((newScreen: 'controller-tuner' | 'bands-weights') => {
    setSearchParams(prev => {
      const updated = new URLSearchParams(prev);
      updated.set('screen', newScreen);
      return updated;
    });
  }, [setSearchParams]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case 'r':
          e.preventDefault();
          if (recipe && rationale.trim()) handleApplyRecipe();
          break;
        case 'e':
          e.preventDefault();
          setShowAdvancedEdit(true);
          break;
        case 'w':
          e.preventDefault();
          if (screen === 'bands-weights' && rationale.trim()) handleSaveBandWeights();
          break;
        case 'l':
          e.preventDefault();
          (document.querySelector('textarea[placeholder*="rationale"]') as HTMLElement)?.focus();
          break;
        case 'h':
          e.preventDefault();
          (document.querySelector('[data-testid="handoffs-panel"] button') as HTMLElement)?.focus();
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
  }, [recipe, screen, rationale]);

  // Analytics
  const trackEvent = useCallback((eventType: string, data: any) => {
    console.log(`Analytics: ${eventType}`, { 
      ...data, 
      loop: loopCode,
      indicator,
      userId: 'current-user',
      timestamp: new Date().toISOString()
    });
  }, [loopCode, indicator]);

  useEffect(() => {
    trackEvent('reflexive_opened', {
      loop: loopCode,
      indicator,
      osc: reading.oscillation || 0,
      rmse: reading.rmseRel || 0,
      disp: reading.dispersion || 0,
      decisionId: decision.decisionId
    });
  }, []);

  // Handlers
  const handleApplyRecipe = useCallback(async () => {
    if (!recipe || !rationale.trim()) return;
    
    setBusy(true);
    try {
      await onSaveTuning?.({
        recipe: recipe.id,
        rationale: rationale.trim(),
        loopCode,
        indicator
      });

      trackEvent('reflexive_apply_recipe', {
        recipeId: recipe.id,
        type: 'tuning'
      });

      setRationale('');
    } finally {
      setBusy(false);
    }
  }, [recipe, rationale, loopCode, indicator, onSaveTuning, trackEvent]);

  const handleSaveBandWeights = useCallback(async () => {
    if (!rationale.trim()) return;
    
    setBusy(true);
    try {
      await onSaveBandWeight?.({
        rationale: rationale.trim(),
        loopCode,
        indicator
      });

      trackEvent('reflexive_band_weight_save', {
        deltaWeights: {},
        deltaBands: {}
      });

      setRationale('');
    } finally {
      setBusy(false);
    }
  }, [rationale, loopCode, indicator, onSaveBandWeight, trackEvent]);

  const handleScheduleReview = useCallback(async () => {
    await onSaveEvaluation?.({
      method: 'ITS',
      reviewAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      loopCode,
      indicators: [indicator]
    });

    trackEvent('reflexive_schedule_review', {
      method: 'ITS',
      reviewAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    });
  }, [loopCode, indicator, onSaveEvaluation, trackEvent]);

  const handleHandoff = useCallback((to: string, reason: string) => {
    onHandoff?.(to, reason);
    trackEvent('reflexive_handoff', { to, reason });
  }, [onHandoff, trackEvent]);

  // Handoff enablement logic
  const handoffStates = {
    responsive: (decision.severity >= 0.5) && ((reading.slope || 0) > 0),
    deliberative: (reading.dispersion || 0) >= 0.5 || decision.consent.requireDeliberative,
    structural: (reading.persistencePk || 0) >= 0.5 || (reading.integralError || 0) >= 0.5
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      {/* Header - Full Width */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-start justify-between">
            {/* Title Block (Left) */}
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground font-medium">
                Workspace-5C › Reflexive
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {loopCode} · {indicator}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Oscillation {(reading.oscillation || 0).toFixed(2)}
                </span>
                <span>RMSE {(reading.rmseRel || 0).toFixed(2)}</span>
                <span>Dispersion {(reading.dispersion || 0).toFixed(2)}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last update 2 min ago
                </span>
              </div>
            </div>
            
            {/* Right Rail */}
            <div className="flex items-center gap-3">
              <ActivationVector currentCapacity="reflexive" />
              {decision.consent.requireDeliberative && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-warning text-warning hover:bg-warning/10 gap-2"
                  onClick={() => setShowTransparencyDrawer(true)}
                >
                  <Shield className="h-4 w-4" />
                  Consent Gate
                </Button>
              )}
              <ReviewCountdown reviewDate={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 12-column responsive */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Primary Work (2 cols on lg+) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Screen Toggle */}
            <div className="flex items-center gap-4">
              <Tabs value={screen} onValueChange={switchScreen} className="flex-1">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                  <TabsTrigger 
                    value="controller-tuner" 
                    className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
                  >
                    <Settings className="h-4 w-4" />
                    Controller Tuner
                  </TabsTrigger>
                  <TabsTrigger 
                    value="bands-weights"
                    className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Bands & Weights
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              {recipe && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Recipe Ready
                </Badge>
              )}
            </div>

            {/* Screen Content */}
            {screen === 'controller-tuner' ? (
              <ControllerTuner
                reading={reading}
                recipe={recipe}
                onApplyRecipe={handleApplyRecipe}
                onAdvancedEdit={() => setShowAdvancedEdit(true)}
                rationale={rationale}
                onRationaleChange={setRationale}
                busy={busy}
              />
            ) : (
              <BandsWeightsStudio
                reading={reading}
                onSave={handleSaveBandWeights}
                rationale={rationale}
                onRationaleChange={setRationale}
                busy={busy}
              />
            )}

            {/* Experiment & Evaluation Card */}
            <ExperimentPlanner
              decision={decision}
              onScheduleReview={handleScheduleReview}
            />

            {/* Rationale Field */}
            <Card className="bg-card/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Rationale
                  </CardTitle>
                  <kbd className="px-2 py-1 text-xs bg-muted rounded border">L</kbd>
                </div>
                <CardDescription>
                  Required for all changes. Describe the reasoning and expected impact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Explain the rationale for this change..."
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  className="min-h-[80px] resize-none bg-background/50"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {rationale.length}/500 characters
                  </span>
                  {rationale.trim() && (
                    <span className="flex items-center gap-1 text-xs text-success">
                      <CheckCircle className="h-3 w-3" />
                      Ready for action
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Context & Safety (1 col on lg+) */}
          <div className="space-y-6">
            <LearningTimeline />
            <GuardrailsPolicies reading={reading} />
            <ProposedTasks 
              tasks={[]}
              onOpenClaimDrawer={() => onOpenClaimDrawer?.([])}
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

      {/* Help Button - Fixed Position */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 rounded-full shadow-lg bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/95"
        onClick={() => setShowHelpOverlay(true)}
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default ReflexiveCapacityPage;