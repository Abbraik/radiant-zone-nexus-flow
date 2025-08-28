import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronRight, 
  Clock, 
  AlertTriangle, 
  Shield, 
  TrendingUp,
  Activity,
  Users,
  Settings,
  MessageSquare,
  CheckCircle,
  Pause,
  Play,
  ArrowRight,
  BarChart3,
  Target,
  Globe,
  Zap,
  Brain,
  GitBranch
} from 'lucide-react';

// Scenario helpers
import { getScenarioTitle, getScenarioPlaybookName, getScenarioRationale, getScenarioTasks } from '@/utils/scenarioHelpers';

// Sub-components
import { CheckpointConsole } from './responsive/CheckpointConsole';
import { QuickActionsBar } from './responsive/QuickActionsBar';
import { GuardrailsPanel } from './responsive/GuardrailsPanel';
import { HarmonizationDrawer } from './responsive/HarmonizationDrawer';
import { AlertsWatchpoints } from './responsive/AlertsWatchpoints';
import { ProposedTasks } from './responsive/ProposedTasks';
import { TaskManagementDashboard } from '@/components/responsive/TaskManagementDashboard';
import { HandoffsCard } from './responsive/HandoffsCard';
import { ActivationVector } from './responsive/ActivationVector';
import { SRTCountdown } from './responsive/SRTCountdown';
import { useLanguageMode } from './ResponsiveCapacityWrapper';
import { mainHeaderCopy, kpiFooterCopy } from '@/bundles/responsive/copy.map';

interface ResponsiveCapacityPageProps {
  decision?: any;
  reading?: any;
  playbook?: any;
  taskData?: any;
  onUpsertIncident?: (payload: any) => Promise<any>;
  onAppendIncidentEvent?: (incidentId: string, event: any) => Promise<any>;
  onCreateSprintWithTasks?: (payload: any) => Promise<any>;
  onOpenClaimDrawer?: (tasks: any[]) => void;
}

export const ResponsiveCapacityPage: React.FC<ResponsiveCapacityPageProps> = ({
  decision: propDecision,
  reading: propReading,
  playbook: propPlaybook,
  taskData,
  onUpsertIncident,
  onAppendIncidentEvent,
  onCreateSprintWithTasks,
  onOpenClaimDrawer
}) => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { mode: langMode } = useLanguageMode();
  
  // Extract route params and scenario data
  const loop = searchParams.get('loop') || taskData?.loop_id || 'UNKNOWN';
  const indicator = searchParams.get('indicator') || 'primary';
  
  // Use enriched scenario data when available
  const scenarioData = taskData?.payload;
  const isGoldenScenario = scenarioData?.scenario_id;
  
  console.log('ResponsiveCapacityPage received taskData:', { taskData, scenarioData, isGoldenScenario });
  
  // Local state
  const [isStartingSprint, setIsStartingSprint] = useState(false);
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [harmonizationOpen, setHarmonizationOpen] = useState(false);
  
  // Use real scenario data or fallback to mock data
  const decision = propDecision || (isGoldenScenario ? {
    severity: scenarioData.context?.alert_level === 'high' ? 0.9 : 
              scenarioData.context?.alert_level === 'medium' ? 0.65 : 0.4,
    guardrails: { 
      timeboxDays: scenarioData.scenario_id === 'fertility' ? 14 : 7, 
      caps: ['max_concurrent_substeps: 5', 'max_coverage_pct: 40'] 
    },
    srt: { cadence: 'daily', horizon: 'P7D' },
    consent: { requireDeliberative: true },
    scores: { 
      responsive: taskData?.tri?.r_value || 0.8, 
      reflexive: taskData?.tri?.i_value || 0.3, 
      deliberative: taskData?.tri?.t_value || 0.6 
    }
  } : {
    severity: 0.75,
    guardrails: { timeboxDays: 7, caps: ['max_concurrent_substeps: 5', 'max_coverage_pct: 40'] },
    srt: { cadence: 'daily', horizon: 'P7D' },
    consent: { requireDeliberative: true },
    scores: { responsive: 0.8, reflexive: 0.3, deliberative: 0.6 }
  });
  
  const reading = propReading || (isGoldenScenario ? {
    value: scenarioData.indicators?.childcare_wait_days || 
           scenarioData.indicators?.vacancy_fill_time_days || 
           scenarioData.indicators?.service_outage_rate * 100 || 42.3,
    lower: 35,
    upper: 45,
    slope: scenarioData.context?.trending === 'increasing' ? 0.12 : -0.08,
    oscillation: 0.6,
    dispersion: 0.4,
    persistencePk: 0.3,
    integralError: 0.2,
    hubSaturation: scenarioData.indicators?.capacity_utilization || 0.7,
    guardrailViolation: scenarioData.context?.alert_level === 'high' ? 'timebox_renewed_twice' : null
  } : {
    value: 42.3,
    lower: 35,
    upper: 45,
    slope: 0.12,
    oscillation: 0.6,
    dispersion: 0.4,
    persistencePk: 0.3,
    integralError: 0.2,
    hubSaturation: 0.7,
    guardrailViolation: 'timebox_renewed_twice'
  });
  
  const playbook = propPlaybook || (isGoldenScenario ? {
    id: `${scenarioData.scenario_id}-response-v1`,
    name: getScenarioPlaybookName(scenarioData.scenario_id),
    rationale: getScenarioRationale(scenarioData),  
    tasks: getScenarioTasks(scenarioData)
  } : {
    id: 'health-surge-v2',
    name: 'Health Capacity Surge',
    rationale: 'Re-enter band faster with mobile units and triage v2',
    tasks: [
      { title: 'Deploy mobile triage units', description: 'Activate standby capacity', capacity: 'responsive' },
      { title: 'Update care protocols', description: 'Switch to crisis triage v2', capacity: 'responsive' },
      { title: 'Coordinate with regional hubs', description: 'Balance load across network', capacity: 'responsive' }
    ]
  });

  // Derived values
  const severityPct = Math.round(decision.severity * 100);
  const timeboxDays = decision.guardrails.timeboxDays;
  const requiresDeliberative = decision.consent?.requireDeliberative;

  // Handoff enablement logic
  const handoffEligible = {
    reflexive: reading.oscillation >= 0.4 || reading.slope > 0.15,
    deliberative: reading.dispersion >= 0.5 || requiresDeliberative,
    structural: reading.persistencePk >= 0.5 || reading.integralError >= 0.5
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) return;
      
      switch (e.key.toLowerCase()) {
        case 'a':
          e.preventDefault();
          handleStartSprint();
          break;
        case 'b':
          e.preventDefault();
          handlePublishBanner();
          break;
        case 'h':
          e.preventDefault();
          setHarmonizationOpen(true);
          break;
        case 'r':
          e.preventDefault();
          // Focus handoffs section
          document.getElementById('handoffs-section')?.focus();
          break;
        case 'n':
          e.preventDefault();
          handleAddNote();
          break;
        case '.':
          e.preventDefault();
          handleAckAlert();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Actions
  const handleStartSprint = useCallback(async () => {
    if (isStartingSprint) return;
    
    setIsStartingSprint(true);
    try {
      // Create incident
      const incident = await onUpsertIncident?.({
        loop_code: loop,
        indicator,
        severity: decision.severity,
        srt: decision.srt,
        guardrails: decision.guardrails,
        status: 'active'
      });

      if (incident) {
        setActiveIncidentId(incident.id);
        
        // Append timeline event
        await onAppendIncidentEvent?.(incident.id, {
          kind: 'containment_sprint_started',
          payload: { playbook_id: playbook.id, tasks_count: playbook.tasks.length }
        });

        // Create sprint with tasks
        await onCreateSprintWithTasks?.({
          capacity: 'responsive',
          leverage: 'P',
          due_at: new Date(Date.now() + timeboxDays * 24 * 60 * 60 * 1000).toISOString(),
          guardrails: decision.guardrails,
          srt: decision.srt,
          tasks: playbook.tasks
        });

        // Update timeline
        setTimelineEvents(prev => [{
          id: Date.now(),
          timestamp: new Date(),
          kind: 'containment_sprint_started',
          description: `Containment sprint started · due in ${timeboxDays} days`,
          icon: Activity
        }, ...prev]);

        // Open claim drawer
        onOpenClaimDrawer?.(playbook.tasks);

        toast({
          title: "Containment sprint started",
          description: `Due ${new Date(Date.now() + timeboxDays * 24 * 60 * 60 * 1000).toLocaleDateString()}. Tasks ready to claim.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error starting sprint",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setIsStartingSprint(false);
    }
  }, [isStartingSprint, loop, indicator, decision, playbook, timeboxDays, onUpsertIncident, onAppendIncidentEvent, onCreateSprintWithTasks, onOpenClaimDrawer, toast]);

  const handlePublishBanner = useCallback(() => {
    toast({
      title: "Status banner published",
      description: "Stakeholders notified of current containment status"
    });
  }, [toast]);

  const handleAddNote = useCallback(() => {
    setTimelineEvents(prev => [{
      id: Date.now(),
      timestamp: new Date(),
      kind: 'note_added',
      description: 'Manual note added by operator',
      icon: MessageSquare
    }, ...prev]);
  }, []);

  const handleAckAlert = useCallback(() => {
    toast({
      title: "Alert acknowledged",
      description: "Top alert marked as seen"
    });
  }, [toast]);

  const handleHandoff = useCallback((to: 'reflexive' | 'deliberative' | 'structural', reason: string) => {
    if (activeIncidentId) {
      onAppendIncidentEvent?.(activeIncidentId, {
        kind: 'handoff_requested',
        payload: { to, reason }
      });
    }

    setTimelineEvents(prev => [{
      id: Date.now(),
      timestamp: new Date(),
      kind: 'handoff_requested',
      description: `Switching to ${to} capacity: ${reason}`,
      icon: ArrowRight
    }, ...prev]);

    toast({
      title: `Handoff to ${to}`,
      description: reason
    });
  }, [activeIncidentId, onAppendIncidentEvent, toast]);

  // Get copy for current language mode
  const headerCopy = mainHeaderCopy(langMode);
  const footerCopy = kpiFooterCopy(langMode);

  return (
    <motion.div 
      className="min-h-screen bg-background p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.header 
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          {/* Left: Title Block */}
          <div className="space-y-2">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{headerCopy.workspace}</span>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-primary">{headerCopy.capacity}</span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl font-bold text-foreground">
              {isGoldenScenario ? getScenarioTitle(scenarioData.scenario_id) : `${loop} · ${indicator}`}
            </h1>
            
            {/* Meta Row */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>{headerCopy.severity} {severityPct}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{headerCopy.timebox} {timeboxDays}d</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span>{headerCopy.cadence} {decision.srt.cadence}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Last update 2m ago</span>
              </div>
              {reading.guardrailViolation && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {headerCopy.guardrailViolation}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Right: Rail */}
          <div className="flex items-center gap-4">
            <ActivationVector scores={decision.scores} />
            {requiresDeliberative && (
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                {headerCopy.consentGate}
              </Badge>
            )}
            <SRTCountdown 
              dueDate={new Date(Date.now() + timeboxDays * 24 * 60 * 60 * 1000)}
              cadence={decision.srt.cadence}
            />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Column - Priority Content */}
        <div className="xl:col-span-3 space-y-6">
          {/* Checkpoint Console */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CheckpointConsole
              reading={reading}
              incidentId={activeIncidentId}
              timelineEvents={timelineEvents}
              playbook={playbook}
              onStartSprint={handleStartSprint}
              isStartingSprint={isStartingSprint}
            />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <QuickActionsBar
              onStartSprint={handleStartSprint}
              onPublishBanner={handlePublishBanner}
              onAckAlert={handleAckAlert}
              onAddNote={handleAddNote}
              isStartingSprint={isStartingSprint}
            />
          </motion.div>

          {/* Handoffs */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            id="handoffs-section"
            tabIndex={-1}
          >
            <HandoffsCard
              eligibility={handoffEligible}
              reading={reading}
              onHandoff={handleHandoff}
            />
          </motion.div>
        </div>

        {/* Right Column - Operational Context */}
        <div className="xl:col-span-1 space-y-6">
          {/* Guardrails */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <GuardrailsPanel
              guardrails={decision.guardrails}
              violation={reading.guardrailViolation}
              onGuardrailUpdate={(updates) => {
                toast({
                  title: "Guardrail updated",
                  description: "Renewal counter reset; review scheduled"
                });
              }}
            />
          </motion.div>

          {/* Harmonization */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <HarmonizationDrawer
              hubSaturation={reading.hubSaturation}
              dispersion={reading.dispersion}
              isOpen={harmonizationOpen}
              onOpenChange={setHarmonizationOpen}
              onApplyThrottle={(throttleConfig) => {
                toast({
                  title: "Throttle applied",
                  description: `Linked across ${throttleConfig.affectedLoops || 2} affected loops`
                });
              }}
            />
          </motion.div>

          {/* Alerts & Watchpoints */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <AlertsWatchpoints
              alerts={[
                { id: '1', severity: 'high', message: 'Hub saturation at 70%', timestamp: new Date() },
                { id: '2', severity: 'medium', message: 'Oscillation detected in secondary loop', timestamp: new Date(Date.now() - 300000) }
              ]}
              watchpoints={[
                { id: '1', name: 'Critical threshold watch', status: 'active' },
                { id: '2', name: 'Cross-loop cascade monitor', status: 'on-hold' }
              ]}
              onAckAlert={handleAckAlert}
            />
          </motion.div>

          {/* Proposed Tasks */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <TaskManagementDashboard 
              onCreateTask={() => onOpenClaimDrawer?.(playbook.tasks)}
            />
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className="mt-12 pt-8 border-t border-border"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <div className="flex items-center justify-between">
          {/* KPIs */}
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{footerCopy.mttd}:</span>
              <span className="font-medium">4.2m</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{footerCopy.mtta}:</span>
              <span className="font-medium">1.8m</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{footerCopy.mttr}:</span>
              <span className="font-medium">12.4m</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{footerCopy.containment}:</span>
              <span className="font-medium text-success">87%</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Open Incident Details
            </Button>
            <Button variant="ghost" size="sm">
              View Audit Trail
            </Button>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
};