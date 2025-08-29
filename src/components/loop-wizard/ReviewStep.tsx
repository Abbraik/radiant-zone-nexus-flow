import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Edit, Loader2, AlertCircle, FlaskConical, Target, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLoopWizardStore } from '@/stores/useLoopWizardStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ReviewStepProps {
  onPrevious: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ onPrevious }) => {
  const navigate = useNavigate();
  const { formData, setCurrentStep, resetForm, setLoading, isLoading } = useLoopWizardStore();
  const [creationError, setCreationError] = useState<string | null>(null);

  const triAverage = (formData.baselines.trust + formData.baselines.reciprocity + formData.baselines.integrity) / 3;

  const buildPayload = () => {
    const now = new Date().toISOString();

    return {
      loop: {
        name: formData.name,
        loop_code: formData.loop_code,
        description: formData.description,
        type: formData.type,
        scale: formData.scale,
        domain: formData.domain,
        layer: formData.layer,
        metadata: {
          doctrine_reference: formData.doctrine_reference,
          worldview: formData.worldview,
          paradigm_statement: formData.paradigm_statement,
          coherence_principles: formData.coherence_principles,
          cas_assumptions: formData.cas_assumptions,
          created_via: 'rre_wizard',
        },
      },
      indicators: formData.indicators,
      sources: formData.sources,
      nodes: formData.nodes,
      edges: formData.edges,
      bands: formData.bands,
      
      // RRE-specific data
      loop_classification: formData.loop_classification,
      system_purpose: formData.system_purpose,
      key_feedbacks: formData.key_feedbacks,
      experiments: formData.experiments,
      pilots: formData.pilots,
      
      baselines: {
        ...formData.baselines,
        as_of: now,
      },
      reflex_memory: formData.reflex_memory,
      create_followup_task: formData.create_followup_task,
    };
  };

  const handleCreate = async () => {
    setLoading(true);
    setCreationError(null);

    try {
      const payload = buildPayload();
      
      const { data: loopId, error } = await supabase.rpc('rre_create_loop_full', { p: payload });

      if (error) {
        throw error;
      }

      if (!loopId) {
        throw new Error('No loop ID returned from creation');
      }

      // Success! 
      toast({
        title: 'RRE Loop created successfully!',
        description: `${formData.name} has been created with all RRE artifacts.`,
      });

      // Reset the wizard and navigate to the new loop
      resetForm();
      navigate(`/loops/${loopId}`);

    } catch (error: any) {
      console.error('Error creating RRE loop:', error);
      setCreationError(error.message || 'Failed to create RRE loop. Please try again.');
      toast({
        title: 'Creation failed',
        description: error.message || 'Failed to create RRE loop. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const editSection = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="space-y-6">
      {/* Creation Error */}
      {creationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {creationError}
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{formData.indicators.length}</div>
            <p className="text-xs text-muted-foreground">Indicators</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{formData.nodes.length}</div>
            <p className="text-xs text-muted-foreground">Nodes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{formData.loop_classification.length}</div>
            <p className="text-xs text-muted-foreground">Loop Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{(formData.experiments?.length || 0) + (formData.pilots?.length || 0)}</div>
            <p className="text-xs text-muted-foreground">Modules</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{Math.round(triAverage * 100)}%</div>
            <p className="text-xs text-muted-foreground">TRI Average</p>
          </CardContent>
        </Card>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-4">
          {/* Paradigm & Doctrine */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Paradigm & Doctrine</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => editSection(0)}
                  className="flex items-center space-x-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Name:</strong> {formData.name}</div>
              <div><strong>Code:</strong> <Badge variant="secondary">{formData.loop_code}</Badge></div>
              <div><strong>Type:</strong> <Badge>{formData.type}</Badge></div>
              <div><strong>Scale:</strong> <Badge>{formData.scale}</Badge></div>
              <div><strong>Domain:</strong> {formData.domain}</div>
              <div><strong>Layer:</strong> {formData.layer}</div>
              <div><strong>Worldview:</strong> <Badge variant="outline">{formData.worldview}</Badge></div>
              {formData.description && <div><strong>Description:</strong> {formData.description}</div>}
              {formData.paradigm_statement && <div><strong>Paradigm:</strong> {formData.paradigm_statement}</div>}
              {formData.doctrine_reference && <div><strong>Doctrine:</strong> {formData.doctrine_reference}</div>}
            </CardContent>
          </Card>

          {/* Aggregates & Indicators */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Aggregates & Indicators ({formData.indicators.length})</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => editSection(1)}
                  className="flex items-center space-x-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {formData.indicators.map((indicator, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <div className="font-medium">{indicator.title}</div>
                      <div className="text-sm text-muted-foreground">{indicator.indicator_key}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{indicator.triad_tag}</Badge>
                      <div className="text-xs text-muted-foreground">{indicator.unit}</div>
                    </div>
                  </div>
                ))}
              </div>
              {formData.sources.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Data Sources ({formData.sources.length})</h5>
                  <div className="text-sm text-muted-foreground">
                    {formData.sources.map(s => s.name).join(', ')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stocks & Flows */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Stocks & Flows</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => editSection(2)}
                  className="flex items-center space-x-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Nodes ({formData.nodes.length})</h5>
                  <div className="space-y-1">
                    {formData.nodes.map((node, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{node.label}</span>
                        <Badge variant="outline" className="text-xs">{node.kind}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Edges ({formData.edges.length})</h5>
                  <div className="space-y-1">
                    {formData.edges.map((edge, index) => (
                      <div key={index} className="text-sm">
                        {edge.from_label} → {edge.to_label}
                        <Badge variant={edge.polarity === 1 ? "default" : "destructive"} className="ml-1 text-xs">
                          {edge.polarity === 1 ? '+' : '-'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loop Atlas */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Loop Atlas</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => editSection(3)}
                  className="flex items-center space-x-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.system_purpose && (
                <div>
                  <h5 className="font-medium mb-1">System Purpose</h5>
                  <p className="text-sm text-muted-foreground">{formData.system_purpose}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Loop Classifications ({formData.loop_classification.length})</h5>
                  <div className="space-y-1">
                    {formData.loop_classification.map((classification, index) => (
                      <div key={index} className="text-sm">
                        <Badge variant={classification.loop_type === 'reinforcing' ? 'default' : 'secondary'}>
                          {classification.loop_type === 'reinforcing' ? 'R' : 'B'}
                        </Badge>
                        <span className="ml-2">{classification.from_node} → {classification.to_node}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Adaptive Bands ({formData.bands.length})</h5>
                  <div className="text-sm text-muted-foreground">
                    {formData.bands.length > 0 ? 
                      formData.bands.map(b => b.indicator).join(', ') : 
                      'No bands configured'
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modules & Experiments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Modules & Experiments</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => editSection(4)}
                  className="flex items-center space-x-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4" />
                    Experiments ({formData.experiments?.length || 0})
                  </h5>
                  <div className="space-y-1">
                    {(formData.experiments || []).map((experiment, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium">{experiment.name}</div>
                        <Badge variant="outline" className="text-xs">{experiment.methodology}</Badge>
                      </div>
                    ))}
                    {(!formData.experiments || formData.experiments.length === 0) && (
                      <div className="text-sm text-muted-foreground">No experiments defined</div>
                    )}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Pilots ({formData.pilots?.length || 0})
                  </h5>
                  <div className="space-y-1">
                    {(formData.pilots || []).map((pilot, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium">{pilot.name}</div>
                        <div className="text-xs text-muted-foreground">{pilot.duration_weeks} weeks</div>
                      </div>
                    ))}
                    {(!formData.pilots || formData.pilots.length === 0) && (
                      <div className="text-sm text-muted-foreground">No pilots defined</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Baselines & Reflex Memory */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Baselines & Reflex Memory
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => editSection(5)}
                  className="flex items-center space-x-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Trust</div>
                  <div className="font-medium">{Math.round(formData.baselines.trust * 100)}%</div>
                  <Progress value={formData.baselines.trust * 100} className="h-1 mt-1" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Reciprocity</div>
                  <div className="font-medium">{Math.round(formData.baselines.reciprocity * 100)}%</div>
                  <Progress value={formData.baselines.reciprocity * 100} className="h-1 mt-1" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Integrity</div>
                  <div className="font-medium">{Math.round(formData.baselines.integrity * 100)}%</div>
                  <Progress value={formData.baselines.integrity * 100} className="h-1 mt-1" />
                </div>
              </div>
              
              {formData.reflex_memory && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-1">Learning Objectives</h5>
                    <p className="text-sm text-muted-foreground">
                      {formData.reflex_memory.learning_objectives?.length > 0 
                        ? formData.reflex_memory.learning_objectives.join(', ')
                        : 'None defined'
                      }
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Adaptation Triggers</h5>
                    <p className="text-sm text-muted-foreground">
                      {formData.reflex_memory.adaptation_triggers?.length > 0 
                        ? formData.reflex_memory.adaptation_triggers.join(', ')
                        : 'None defined'
                      }
                    </p>
                  </div>
                </div>
              )}
              
              {formData.create_followup_task && (
                <Badge variant="secondary" className="mt-2">Follow-up task will be created</Badge>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious} 
          className="flex items-center space-x-2"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        <Button 
          onClick={handleCreate} 
          className="flex items-center space-x-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating RRE Loop...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Create RRE Loop</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};