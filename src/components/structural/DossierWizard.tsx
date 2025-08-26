import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Clock, Shield } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DossierWizardProps {
  dossierId?: string;
  loopId: string;
  onPublish?: (dossierId: string) => void;
}

interface DossierComponent {
  component_id: string;
  kind: 'mandate' | 'mesh' | 'process' | 'standard' | 'market' | 'transparency';
  title: string;
  content: any;
  order_no: number;
}

export const DossierWizard: React.FC<DossierWizardProps> = ({
  dossierId,
  loopId,
  onPublish
}) => {
  const [activeTab, setActiveTab] = useState<'mandate' | 'mesh' | 'process' | 'standard' | 'market' | 'transparency'>('mandate');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [version, setVersion] = useState('1.0');
  const queryClient = useQueryClient();

  // Fetch dossier data
  const { data: dossier, isLoading } = useQuery({
    queryKey: ['structural-dossier', dossierId],
    queryFn: async () => {
      if (!dossierId) return null;
      
      const { data, error } = await supabase
        .from('structural_dossiers')
        .select('*')
        .eq('dossier_id', dossierId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!dossierId
  });

  // Fetch components
  const { data: components = [] } = useQuery({
    queryKey: ['structural-components', dossierId],
    queryFn: async () => {
      if (!dossierId) return [];
      
      const { data, error } = await supabase
        .from('structural_components')
        .select('*')
        .eq('dossier_id', dossierId)
        .order('order_no');
        
      if (error) throw error;
      return data;
    },
    enabled: !!dossierId
  });

  // Create dossier mutation
  const createDossierMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: result, error } = await supabase
        .from('structural_dossiers')
        .insert({
          loop_id: loopId,
          title: data.title,
          summary: data.summary,
          version: data.version,
          status: 'draft'
        })
        .select()
        .single();
        
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['structural-dossier'] });
      toast.success('Dossier created successfully');
    }
  });

  // Update component mutation
  const updateComponentMutation = useMutation({
    mutationFn: async ({ componentId, content }: { componentId?: string, content: any }) => {
      if (componentId) {
        const { error } = await supabase
          .from('structural_components')
          .update({ content })
          .eq('component_id', componentId);
        if (error) throw error;
      } else {
        // Create new component
        const { error } = await supabase
          .from('structural_components')
          .insert({
            dossier_id: dossierId!,
            kind: activeTab as any,
            title: getComponentTitle(activeTab),
            content,
            order_no: getComponentOrder(activeTab)
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['structural-components'] });
      toast.success('Component updated');
    }
  });

  // Publish mutation
  const publishMutation = useMutation({
    mutationFn: async (dossierId: string) => {
      const response = await supabase.functions.invoke('struct-publish-dossier', {
        body: { dossier_id: dossierId }
      });
      
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`Dossier published! Public URL: /p/${data.public_slug}`);
      onPublish?.(dossierId!);
      queryClient.invalidateQueries({ queryKey: ['structural-dossier'] });
    },
    onError: (error: any) => {
      toast.error(`Publication failed: ${error.message}`);
    }
  });

  const componentTabs = [
    { id: 'mandate', label: 'Mandate', icon: Shield },
    { id: 'mesh', label: 'Mesh', icon: CheckCircle },
    { id: 'process', label: 'Process', icon: Clock },
    { id: 'standard', label: 'Standards', icon: CheckCircle },
    { id: 'market', label: 'Market', icon: CheckCircle },
    { id: 'transparency', label: 'Transparency', icon: CheckCircle }
  ];

  const getCurrentComponent = () => {
    return components.find(c => c.kind === activeTab);
  };

  const handleComponentSave = (content: any) => {
    const currentComponent = getCurrentComponent();
    updateComponentMutation.mutate({
      componentId: currentComponent?.component_id,
      content
    });
  };

  const getValidationStatus = (kind: string) => {
    const component = components.find(c => c.kind === kind);
    if (!component) return 'missing';
    
    // Basic validation rules
    switch (kind) {
      case 'mandate':
        return (component.content as any)?.approved ? 'valid' : 'invalid';
      case 'mesh':
        return (component.content as any)?.joint_kpis?.length > 0 ? 'valid' : 'invalid';
      case 'process':
        return ((component.content as any)?.sla && (component.content as any)?.steps?.length > 0 && (component.content as any)?.gates?.length > 0) ? 'valid' : 'invalid';
      case 'standard':
        return ((component.content as any)?.spec || (component.content as any)?.standard_version_id) ? 'valid' : 'invalid';
      default:
        return component.content && Object.keys(component.content).length > 0 ? 'valid' : 'invalid';
    }
  };

  const canPublish = () => {
    return componentTabs.every(tab => getValidationStatus(tab.id) === 'valid') && 
           dossier?.status === 'draft';
  };

  if (isLoading) {
    return <div className="p-6">Loading dossier...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Structural Dossier</h1>
          <p className="text-muted-foreground">
            {dossier ? `${dossier.title} v${dossier.version}` : 'New Dossier'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dossier?.horizon_tag && (
            <Badge variant="outline">{dossier.horizon_tag}</Badge>
          )}
          {dossier?.status && (
            <Badge variant={dossier.status === 'published' ? 'default' : 'secondary'}>
              {dossier.status}
            </Badge>
          )}
        </div>
      </div>

      {/* Basic Info */}
      {!dossier && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Dossier Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
            />
            <Input
              placeholder="Version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
            <Button 
              onClick={() => createDossierMutation.mutate({ title, summary, version })}
              disabled={!title || createDossierMutation.isPending}
            >
              Create Dossier
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Component Wizard */}
      {dossier && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Rail - Progress */}
          <div className="space-y-2">
            <h3 className="font-semibold mb-4">Components</h3>
            {componentTabs.map((tab) => {
              const status = getValidationStatus(tab.id);
              const Icon = tab.icon;
              
              return (
                <div
                  key={tab.id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                    activeTab === tab.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <div className={`p-1 rounded ${
                    status === 'valid' ? 'bg-green-100 text-green-600' :
                    status === 'invalid' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {status === 'valid' ? <CheckCircle className="h-4 w-4" /> : 
                     status === 'invalid' ? <AlertCircle className="h-4 w-4" /> :
                     <Icon className="h-4 w-4" />}
                  </div>
                  <span className="text-sm">{tab.label}</span>
                </div>
              );
            })}
            
            <div className="pt-4 border-t">
              <Button
                onClick={() => publishMutation.mutate(dossier.dossier_id)}
                disabled={!canPublish() || publishMutation.isPending}
                className="w-full"
              >
                {publishMutation.isPending ? 'Publishing...' : 'Publish Dossier'}
              </Button>
              {!canPublish() && (
                <p className="text-xs text-muted-foreground mt-2">
                  Complete all components to publish
                </p>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <ComponentEditor
              kind={activeTab}
              component={getCurrentComponent() as DossierComponent | undefined}
              onSave={handleComponentSave}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Component Editor for each section
const ComponentEditor: React.FC<{
  kind: 'mandate' | 'mesh' | 'process' | 'standard' | 'market' | 'transparency';
  component?: DossierComponent;
  onSave: (content: any) => void;
}> = ({ kind, component, onSave }) => {
  const [content, setContent] = useState(component?.content || {});

  const handleSave = () => {
    onSave(content);
  };

  const renderEditor = () => {
    switch (kind) {
      case 'mandate':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Legal Authority</label>
              <Textarea
                value={content.legal_authority || ''}
                onChange={(e) => setContent({ ...content, legal_authority: e.target.value })}
                placeholder="Legal citations and delegated authorities..."
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Approvals</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="approved"
                  checked={content.approved || false}
                  onChange={(e) => setContent({ ...content, approved: e.target.checked })}
                />
                <label htmlFor="approved">Mandate approved and signed off</label>
              </div>
            </div>
          </div>
        );
        
      case 'mesh':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Parties</label>
              <Input
                value={content.parties?.join(', ') || ''}
                onChange={(e) => setContent({ ...content, parties: e.target.value.split(', ') })}
                placeholder="Ministry A, Agency B, Region C..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Joint KPIs</label>
              <Textarea
                value={content.joint_kpis?.join('\n') || ''}
                onChange={(e) => setContent({ ...content, joint_kpis: e.target.value.split('\n').filter(Boolean) })}
                placeholder="One KPI per line..."
                rows={3}
              />
            </div>
          </div>
        );

      case 'process':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target SLA (days)</label>
              <Input
                type="number"
                value={content.sla || ''}
                onChange={(e) => setContent({ ...content, sla: parseInt(e.target.value) })}
                placeholder="21"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Process Steps</label>
              <Textarea
                value={content.steps?.join('\n') || ''}
                onChange={(e) => setContent({ ...content, steps: e.target.value.split('\n').filter(Boolean) })}
                placeholder="1. Initial review\n2. Validation\n3. Approval..."
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gates</label>
              <Textarea
                value={content.gates?.join('\n') || ''}
                onChange={(e) => setContent({ ...content, gates: e.target.value.split('\n').filter(Boolean) })}
                placeholder="Quality gate at step 2\nApproval gate at step 5..."
                rows={2}
              />
            </div>
          </div>
        );

      case 'standard':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Standard Specification</label>
              <Textarea
                value={JSON.stringify(content.spec || {}, null, 2)}
                onChange={(e) => {
                  try {
                    setContent({ ...content, spec: JSON.parse(e.target.value) });
                  } catch {
                    // Invalid JSON, keep the text as is
                  }
                }}
                placeholder="JSON schema or specification..."
                rows={6}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">API Endpoint</label>
              <Input
                value={content.api_endpoint || ''}
                onChange={(e) => setContent({ ...content, api_endpoint: e.target.value })}
                placeholder="https://api.example.com/v1/..."
              />
            </div>
          </div>
        );

      case 'market':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rulebook Parameters</label>
              <Textarea
                value={content.rulebook || ''}
                onChange={(e) => setContent({ ...content, rulebook: e.target.value })}
                placeholder="Market rules, eligibility criteria, transparency requirements..."
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fee Structure</label>
              <Textarea
                value={content.fees || ''}
                onChange={(e) => setContent({ ...content, fees: e.target.value })}
                placeholder="Fee schedule and transparency rules..."
                rows={3}
              />
            </div>
          </div>
        );

      case 'transparency':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Public Communications</label>
              <Textarea
                value={content.public_comms || ''}
                onChange={(e) => setContent({ ...content, public_comms: e.target.value })}
                placeholder="Public status page obligations, API documentation..."
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status Page URL</label>
              <Input
                value={content.status_url || ''}
                onChange={(e) => setContent({ ...content, status_url: e.target.value })}
                placeholder="https://status.example.com"
              />
            </div>
          </div>
        );

      default:
        return <div>Component editor for {kind}</div>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getComponentTitle(kind)}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderEditor()}
        <div className="pt-4 border-t mt-6">
          <Button onClick={handleSave}>Save {getComponentTitle(kind)}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

function getComponentTitle(kind: string): string {
  const titles = {
    mandate: 'Mandate',
    mesh: 'Mesh Coordination',
    process: 'Process Design',
    standard: 'Standards',
    market: 'Market Design',
    transparency: 'Transparency Package'
  };
  return titles[kind as keyof typeof titles] || kind;
}

function getComponentOrder(kind: string): number {
  const orders = {
    mandate: 1,
    mesh: 2,
    process: 3,
    standard: 4,
    market: 5,
    transparency: 6
  };
  return orders[kind as keyof typeof orders] || 0;
}
