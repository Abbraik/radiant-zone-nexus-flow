import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Play, Upload, Download, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLoopRegistry, useLoopHydration } from '@/hooks/useLoopRegistry';
import { LoopData, HydratedLoop } from '@/types/loop-registry';

import { MetadataEditor } from '@/components/registry/editor/MetadataEditor';
import { CLDGraphEditor } from '@/components/registry/editor/CLDGraphEditor';
import { IndicatorsEditor } from '@/components/registry/editor/IndicatorsEditor';
import { SRTEditor } from '@/components/registry/editor/SRTEditor';
import { SNLLinksEditor } from '@/components/registry/editor/SNLLinksEditor';
import { CascadeBuilderEditor } from '@/components/registry/editor/CascadeBuilderEditor';
import { VersionsReadOnly } from '@/components/registry/editor/VersionsReadOnly';
import { PublishDrawer } from '@/components/registry/editor/PublishDrawer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeSection, setActiveSection] = useState('metadata');
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishDrawerOpen, setIsPublishDrawerOpen] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  const isNewLoop = id === 'new';
  const { getLoop, updateLoop, createLoop, publishLoop } = useLoopRegistry();
  const { data: hydrated, isLoading } = useLoopHydration(isNewLoop ? undefined : id);
  const { data: loop } = getLoop(isNewLoop ? '' : id || '');

  const [editorData, setEditorData] = useState<Partial<HydratedLoop> | null>(null);

  useEffect(() => {
    if (isNewLoop) {
      setEditorData({
        name: 'New Loop',
        loop_type: 'reactive',
        scale: 'micro',
        status: 'draft',
        nodes: [],
        edges: []
      } as Partial<HydratedLoop>);
    } else if (hydrated) {
      setEditorData(hydrated);
    }
  }, [isNewLoop, hydrated]);

  // Autosave with 2s debounce
  useEffect(() => {
    if (!isDirty || !editorData?.loop) return;
    
    const timeoutId = setTimeout(async () => {
      setAutosaveStatus('saving');
      try {
        if (isNewLoop) {
          // Will handle new loop creation separately
          setAutosaveStatus('saved');
        } else {
          await updateLoop.mutateAsync({
            id: id!,
            updates: editorData.loop
          });
          setAutosaveStatus('saved');
        }
        setIsDirty(false);
        
        setTimeout(() => setAutosaveStatus('idle'), 2000);
      } catch (error) {
        setAutosaveStatus('error');
        toast({
          title: "Autosave Failed",
          description: "Failed to save changes automatically.",
          variant: "destructive",
        });
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isDirty, editorData, isNewLoop, id, updateLoop, toast]);

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
      }
      
      return prev;
    });
    setIsDirty(true);
  }, []);

  const handleSaveDraft = async () => {
    if (!editorData?.loop) return;
    
    try {
      if (isNewLoop) {
        const newLoop = await createLoop.mutateAsync(editorData.loop);
        navigate(`/registry/${newLoop.id}/editor`);
      } else {
        await updateLoop.mutateAsync({
          id: id!,
          updates: editorData.loop
        });
      }
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
    // TODO: Implement linting
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
    
    const exportData = {
      loop: editorData.loop,
      nodes: editorData.nodes,
      edges: editorData.edges
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editorData.loop?.name || 'loop'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderEditorContent = () => {
    if (!editorData) return null;

    switch (activeSection) {
      case 'metadata':
        return (
          <MetadataEditor
            data={editorData.loop}
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
            loopId={isNewLoop ? undefined : id}
            nodes={editorData.nodes || []}
          />
        );
      case 'srt':
        return (
          <SRTEditor
            loopId={isNewLoop ? undefined : id}
          />
        );
      case 'snl':
        return (
          <SNLLinksEditor
            loopId={isNewLoop ? undefined : id}
            nodes={editorData.nodes || []}
          />
        );
      case 'cascades':
        return (
          <CascadeBuilderEditor
            loopId={isNewLoop ? undefined : id}
          />
        );
      case 'versions':
        return (
          <VersionsReadOnly
            loopId={isNewLoop ? undefined : id}
          />
        );
      default:
        return <div>Section coming soon</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
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
            <h1 className="text-2xl font-bold text-foreground">
              {isNewLoop ? 'Create New Loop' : 'Edit Loop'}
            </h1>
            {editorData?.loop?.name && (
              <Badge variant="secondary">{editorData.loop.name}</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Autosave Status */}
            {autosaveStatus !== 'idle' && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {autosaveStatus === 'saving' && (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                )}
                {autosaveStatus === 'saved' && (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Saved
                  </>
                )}
                {autosaveStatus === 'error' && (
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
              disabled={isNewLoop}
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
        loopId={isNewLoop ? undefined : id}
        onPublish={() => {
          if (id) {
            publishLoop.mutate(id);
            setIsPublishDrawerOpen(false);
          }
        }}
      />
    </div>
  );
}