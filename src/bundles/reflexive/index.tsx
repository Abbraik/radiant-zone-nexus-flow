import React, { useState } from 'react';
import { useReflexiveBundle } from '@/hooks/useReflexiveBundle';
import { ReflexiveHeader } from './components/ReflexiveHeader';
import { EquilibriumScorecard } from './components/EquilibriumScorecard';
import { TriTrendSparkline } from './components/TriTrendSparkline';
import { BreachTimeline } from './components/BreachTimeline';
import { RetuneSuggestionsPanel } from './components/RetuneSuggestionsPanel';
import { SimulationPreview } from './components/SimulationPreview';
import { CommitBar } from './components/CommitBar';
import type { CapacityBundleProps } from '@/types/capacity';

export const ReflexiveBundle: React.FC<CapacityBundleProps> = ({
  taskId,
  taskData,
  payload,
  onPayloadUpdate,
  onValidationChange,
  readonly = false
}) => {
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [bandChanges, setBandChanges] = useState(null);
  const [srtChanges, setSrtChanges] = useState(null);

  const loopId = taskData?.loop_id || '';
  const {
    context,
    isLoading,
    generateSuggestions,
    applyRetune,
    dismissSuggestion,
    simulateRetune,
    refresh
  } = useReflexiveBundle(loopId);

  const handleApplyRetune = (rationale: string) => {
    applyRetune.mutate({
      bandChanges,
      srtChanges,
      rationale,
      taskId
    });
  };

  const handlePreviewSuggestion = (suggestion: any) => {
    setCurrentSuggestion(suggestion);
    // Convert suggestion to band/SRT changes
    if (suggestion.proposed_changes) {
      setBandChanges(suggestion.proposed_changes);
    }
    simulateRetune.mutate({ bandChanges: suggestion.proposed_changes });
  };

  if (isLoading || !context) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReflexiveHeader
        loop={context.loop}
        task={taskData}
        lastHeartbeat={context.scorecard?.heartbeat_at}
        onRefresh={refresh}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Diagnostics */}
        <div className="space-y-6">
          <EquilibriumScorecard 
            scorecard={context.scorecard}
            onOpenRetune={() => {/* scroll to suggestions */}}
          />
          
          <TriTrendSparkline
            triSeries={context.tri_series}
            slope={context.scorecard?.tri_slope}
            confidence={0.85}
          />
          
          <BreachTimeline
            breachTimeline={context.breach_timeline}
          />
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <RetuneSuggestionsPanel
            suggestions={context.suggestions}
            onPreview={handlePreviewSuggestion}
            onDismiss={(suggestionId) => dismissSuggestion.mutate(suggestionId)}
            onGenerateNew={() => generateSuggestions.mutate(60)}
            isGenerating={generateSuggestions.isPending}
          />
          
          <SimulationPreview
            simulation={simulateRetune.data}
            isSimulating={simulateRetune.isPending}
            triSeries={context.tri_series}
          />
        </div>
      </div>

      <CommitBar
        hasChanges={!!(bandChanges || srtChanges)}
        changesSummary={{ bandChanges, srtChanges }}
        onApplyRetune={handleApplyRetune}
        onCreateRedesignTask={(reason) => {
          onPayloadUpdate({
            ...payload,
            redesignRequested: true,
            redesignReason: reason
          });
        }}
        onSwitchMode={() => {/* implement mode switch */}}
        isApplying={applyRetune.isPending}
      />
    </div>
  );
};