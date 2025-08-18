import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, FlaskConical, BookOpen, Target } from 'lucide-react';
import { ExperimentStudio } from '@/components/widgets/ExperimentStudio';
import { ScenarioPlanner } from '@/components/widgets/ScenarioPlanner';
import type { ZoneBundleProps } from '@/types/zone-bundles';

interface InnovateZoneBundleProps extends ZoneBundleProps {}

const InnovateZoneBundle: React.FC<InnovateZoneBundleProps> = ({
  taskId,
  taskData,
  payload,
  onPayloadUpdate,
  onValidationChange,
  readonly = false
}) => {
  const [activeTab, setActiveTab] = useState('canvas');
  const [hypothesis, setHypothesis] = useState(payload?.hypothesis || '');
  const [outcomeMetric, setOutcomeMetric] = useState(payload?.outcomeMetric || '');
  const [evaluationDesign, setEvaluationDesign] = useState(payload?.evaluationDesign || { type: null });
  const [experiment, setExperiment] = useState(payload?.experiment || { id: null });
  const [stopScaleRules, setStopScaleRules] = useState(payload?.stopScaleRules || []);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Evaluation design types
  const evaluationTypes = [
    { id: 'ab', name: 'A/B Testing', description: 'Compare two variants' },
    { id: 'stepped-wedge', name: 'Stepped Wedge', description: 'Gradual rollout design' },
    { id: 'synthetic-control', name: 'Synthetic Control', description: 'Control group matching' },
    { id: 'rct', name: 'Randomized Control Trial', description: 'Gold standard experimental design' }
  ];

  // Update payload when data changes
  const updatePayload = useCallback((updates: any) => {
    const newPayload = {
      ...payload,
      ...updates,
      lastModified: new Date().toISOString()
    };
    onPayloadUpdate(newPayload);
  }, [payload, onPayloadUpdate]);

  // Handle hypothesis update
  const handleHypothesisUpdate = useCallback((newHypothesis: string) => {
    setHypothesis(newHypothesis);
    updatePayload({ hypothesis: newHypothesis });
  }, [updatePayload]);

  // Handle outcome metric update
  const handleOutcomeMetricUpdate = useCallback((metric: string) => {
    setOutcomeMetric(metric);
    updatePayload({ outcomeMetric: metric });
  }, [updatePayload]);

  // Handle evaluation design selection
  const handleEvaluationDesignSelect = useCallback((design: any) => {
    setEvaluationDesign(design);
    updatePayload({ evaluationDesign: design });
  }, [updatePayload]);

  // Handle experiment registration
  const handleExperimentRegister = useCallback(() => {
    const newExperiment = {
      id: `exp_${Date.now()}`,
      title: `${taskData?.title || 'Experiment'} - ${new Date().toLocaleDateString()}`,
      hypothesis,
      outcomeMetric,
      evaluationDesign,
      registeredAt: new Date().toISOString()
    };
    setExperiment(newExperiment);
    updatePayload({ experiment: newExperiment });
  }, [hypothesis, outcomeMetric, evaluationDesign, taskData, updatePayload]);

  // Handle stop/scale rules update
  const handleStopScaleRulesUpdate = useCallback((rules: any[]) => {
    setStopScaleRules(rules);
    updatePayload({ stopScaleRules: rules });
  }, [updatePayload]);

  // Add a new stop/scale rule
  const addStopScaleRule = useCallback(() => {
    const newRule = {
      id: Date.now(),
      type: 'stop',
      condition: '',
      threshold: '',
      action: ''
    };
    handleStopScaleRulesUpdate([...stopScaleRules, newRule]);
  }, [stopScaleRules, handleStopScaleRulesUpdate]);

  // Validate the current state
  const validateState = useCallback(() => {
    const errors: string[] = [];
    
    // Check hypothesis and outcome metric
    if (!hypothesis.trim()) {
      errors.push('Hypothesis must be defined');
    }
    if (!outcomeMetric.trim()) {
      errors.push('Outcome metric must be defined');
    }

    // Check evaluation design
    if (!evaluationDesign.type) {
      errors.push('Evaluation design must be selected');
    }

    // Check experiment registration
    if (!experiment.id) {
      errors.push('Experiment must be registered');
    }

    // Check stop/scale rules
    if (stopScaleRules.length === 0) {
      errors.push('At least one stop/scale rule must be defined');
    }

    setValidationErrors(errors);
    const isValid = errors.length === 0;
    onValidationChange(isValid);
    
    return isValid;
  }, [hypothesis, outcomeMetric, evaluationDesign, experiment, stopScaleRules, onValidationChange]);

  // Run validation when dependencies change
  useEffect(() => {
    validateState();
  }, [validateState]);

  // Initialize from payload
  useEffect(() => {
    if (payload?.hypothesis) {
      setHypothesis(payload.hypothesis);
    }
    if (payload?.outcomeMetric) {
      setOutcomeMetric(payload.outcomeMetric);
    }
    if (payload?.evaluationDesign) {
      setEvaluationDesign(payload.evaluationDesign);
    }
    if (payload?.experiment) {
      setExperiment(payload.experiment);
    }
    if (payload?.stopScaleRules) {
      setStopScaleRules(payload.stopScaleRules);
    }
  }, [payload]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Lightbulb className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">INNOVATE Zone Bundle</h2>
            <p className="text-sm text-muted-foreground">
              Experiment Design & Innovation Canvas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="outline" className="text-purple-500 border-purple-500/30">
            INNOVATE
          </Badge>
          {validationErrors.length === 0 ? (
            <Badge variant="outline" className="text-green-500 border-green-500/30">
              Valid
            </Badge>
          ) : (
            <Badge variant="outline" className="text-red-500 border-red-500/30">
              {validationErrors.length} Issues
            </Badge>
          )}
          {experiment.id && (
            <Badge variant="outline" className="text-green-500 border-green-500/30">
              Registered
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="canvas" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Innovation Canvas
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Experiment Design
            </TabsTrigger>
            <TabsTrigger value="registry" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Registry
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Stop/Scale Rules
            </TabsTrigger>
          </TabsList>

          <TabsContent value="canvas" className="h-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Innovation Canvas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hypothesis */}
                <div>
                  <label className="text-sm font-medium">Hypothesis</label>
                  <textarea
                    placeholder="State your hypothesis clearly..."
                    value={hypothesis}
                    onChange={(e) => handleHypothesisUpdate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-border/50 rounded-md h-24 resize-none"
                  />
                </div>

                {/* Outcome Metric */}
                <div>
                  <label className="text-sm font-medium">Outcome Metric</label>
                  <input
                    type="text"
                    placeholder="Define the primary metric to measure success..."
                    value={outcomeMetric}
                    onChange={(e) => handleOutcomeMetricUpdate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-border/50 rounded-md"
                  />
                </div>

                {/* Problem → Hypothesis → Experiment → Learning Flow */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h4 className="font-medium text-center mb-2">Problem</h4>
                    <p className="text-xs text-muted-foreground text-center">
                      What issue needs solving?
                    </p>
                  </div>
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h4 className="font-medium text-center mb-2">Hypothesis</h4>
                    <p className="text-xs text-muted-foreground text-center">
                      What do we believe?
                    </p>
                  </div>
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h4 className="font-medium text-center mb-2">Experiment</h4>
                    <p className="text-xs text-muted-foreground text-center">
                      How do we test?
                    </p>
                  </div>
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h4 className="font-medium text-center mb-2">Learning</h4>
                    <p className="text-xs text-muted-foreground text-center">
                      What did we learn?
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="h-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Evaluation Design</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {evaluationTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        evaluationDesign.type === type.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border/50 hover:border-border'
                      }`}
                      onClick={() => handleEvaluationDesignSelect({ ...evaluationDesign, type: type.id })}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{type.name}</h4>
                        {evaluationDesign.type === type.id && (
                          <Badge variant="outline" className="text-primary border-primary/30">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  ))}
                </div>
                
                {evaluationDesign.type && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Configuration</h4>
                    <ExperimentStudio
                      experimentType={evaluationDesign.type}
                      onConfigUpdate={(config) => 
                        handleEvaluationDesignSelect({ ...evaluationDesign, config })
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registry" className="h-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Experiment Registry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!experiment.id ? (
                  <div className="text-center py-8">
                    <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Register Experiment</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                      Register your experiment to track its progress and results.
                      Ensure hypothesis and evaluation design are complete first.
                    </p>
                    <Button 
                      onClick={handleExperimentRegister}
                      disabled={!hypothesis || !outcomeMetric || !evaluationDesign.type}
                    >
                      Register Experiment
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 border border-border/50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Experiment Registered</h4>
                      <Badge variant="outline" className="text-green-500 border-green-500/30">
                        Active
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">ID:</span> {experiment.id}</p>
                      <p><span className="font-medium">Title:</span> {experiment.title}</p>
                      <p><span className="font-medium">Registered:</span> {new Date(experiment.registeredAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="h-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Stop/Scale Rules</CardTitle>
                  <Button onClick={addStopScaleRule} size="sm">
                    Add Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {stopScaleRules.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Rules Defined</h3>
                    <p className="text-sm text-muted-foreground">
                      Define rules for when to stop or scale your experiment.
                    </p>
                  </div>
                ) : (
                  stopScaleRules.map((rule, index) => (
                    <div key={rule.id} className="p-4 border border-border/50 rounded-lg">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs font-medium">Type</label>
                          <select
                            value={rule.type}
                            onChange={(e) => {
                              const newRules = [...stopScaleRules];
                              newRules[index] = { ...rule, type: e.target.value };
                              handleStopScaleRulesUpdate(newRules);
                            }}
                            className="w-full mt-1 px-2 py-1 border border-border/50 rounded text-sm"
                          >
                            <option value="stop">Stop</option>
                            <option value="scale">Scale</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium">Condition</label>
                          <input
                            type="text"
                            placeholder="Metric threshold"
                            value={rule.condition}
                            onChange={(e) => {
                              const newRules = [...stopScaleRules];
                              newRules[index] = { ...rule, condition: e.target.value };
                              handleStopScaleRulesUpdate(newRules);
                            }}
                            className="w-full mt-1 px-2 py-1 border border-border/50 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Threshold</label>
                          <input
                            type="text"
                            placeholder="Value"
                            value={rule.threshold}
                            onChange={(e) => {
                              const newRules = [...stopScaleRules];
                              newRules[index] = { ...rule, threshold: e.target.value };
                              handleStopScaleRulesUpdate(newRules);
                            }}
                            className="w-full mt-1 px-2 py-1 border border-border/50 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Action</label>
                          <input
                            type="text"
                            placeholder="What to do"
                            value={rule.action}
                            onChange={(e) => {
                              const newRules = [...stopScaleRules];
                              newRules[index] = { ...rule, action: e.target.value };
                              handleStopScaleRulesUpdate(newRules);
                            }}
                            className="w-full mt-1 px-2 py-1 border border-border/50 rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="p-4 border-t border-border/50">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <h4 className="text-sm font-medium text-red-600 mb-2">
              Validation Issues ({validationErrors.length})
            </h4>
            <ul className="space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-xs text-red-600">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default InnovateZoneBundle;