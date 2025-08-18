import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Download, GitBranch, Settings, Eye, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLoopRegistry } from '@/hooks/useLoopRegistry';
import { useLoopHydration } from '@/hooks/useLoopRegistry';
import { SNLBrowser } from '@/components/registry/SNLBrowser';
import { LoopOverview } from '@/components/registry/LoopOverview';
import { LoopEditor } from '@/components/registry/LoopEditor';
import { LoopVersions } from '@/components/registry/LoopVersions';

const LoopDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  
  const { getLoop, publishLoop } = useLoopRegistry();
  const { data: hydratedLoop } = useLoopHydration(id);
  const { data: loop, isLoading } = getLoop(id!);

  if (isLoading || !loop) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading loop details...</p>
        </div>
      </div>
    );
  }

  const handlePublish = () => {
    if (loop.status === 'draft') {
      publishLoop.mutate(loop.id);
    }
  };

  const handleExport = () => {
    const exportData = {
      ...loop,
      nodes: hydratedLoop?.nodes || [],
      edges: hydratedLoop?.edges || [],
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${loop.name.replace(/\s+/g, '_')}_v${loop.version}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLoopTypeColor = (type: string) => {
    switch (type) {
      case 'reactive': return 'bg-blue-100 text-blue-800';
      case 'structural': return 'bg-green-100 text-green-800';
      case 'perceptual': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScaleColor = (scale: string) => {
    switch (scale) {
      case 'micro': return 'bg-orange-100 text-orange-800';
      case 'meso': return 'bg-yellow-100 text-yellow-800';
      case 'macro': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/registry')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Registry
              </Button>
              
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{loop.name}</h1>
                <div className="flex gap-2">
                  <Badge className={getLoopTypeColor(loop.loop_type)}>
                    {loop.loop_type}
                  </Badge>
                  <Badge className={getScaleColor(loop.scale)}>
                    {loop.scale}
                  </Badge>
                  <Badge variant={loop.status === 'published' ? 'default' : 'secondary'}>
                    {loop.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <GitBranch className="h-4 w-4" />
                v{loop.version}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              
              {loop.status === 'draft' && (
                <Button
                  onClick={handlePublish}
                  className="flex items-center gap-2"
                  disabled={publishLoop.isPending}
                >
                  <Share2 className="h-4 w-4" />
                  {publishLoop.isPending ? 'Publishing...' : 'Publish'}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue={initialTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="controller" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Controller
              </TabsTrigger>
              <TabsTrigger value="snl" className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                SNL
              </TabsTrigger>
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="versions" className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Versions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <LoopOverview loop={loop} hydratedLoop={hydratedLoop} />
            </TabsContent>

            <TabsContent value="controller">
              <Card>
                <CardHeader>
                  <CardTitle>Loop Controller</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                    {JSON.stringify(loop.controller, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="snl">
              <SNLBrowser loopId={loop.id} />
            </TabsContent>

            <TabsContent value="edit">
              <LoopEditor loop={loop} />
            </TabsContent>

            <TabsContent value="versions">
              <LoopVersions loopId={loop.id} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default LoopDetail;