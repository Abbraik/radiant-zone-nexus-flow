import React, { useState, Suspense } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAtlasRegistry } from '@/hooks/useAtlasRegistry';
import { LoopHeader } from '@/components/registry/LoopHeader';
import { TabNav } from '@/components/registry/TabNav';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Lazy load heavy tab components
const OverviewTab = React.lazy(() => import('@/components/registry/tabs/OverviewTab'));
const StructureTab = React.lazy(() => import('@/components/registry/tabs/StructureTab'));
const IndicatorsTab = React.lazy(() => import('@/components/registry/tabs/IndicatorsTab'));
const SRTTab = React.lazy(() => import('@/components/registry/tabs/SRTTab'));
const SNLTab = React.lazy(() => import('@/components/registry/tabs/SNLTab'));
const CascadesTab = React.lazy(() => import('@/components/registry/tabs/CascadesTab'));
const VersionsTab = React.lazy(() => import('@/components/registry/tabs/VersionsTab'));
const ChecksTab = React.lazy(() => import('@/components/registry/tabs/ChecksTab'));

const PrimarySignalsTab = React.lazy(() => import('@/components/registry/tabs/PrimarySignalsTab'));

const TABS = [
  { id: 'overview', label: 'Overview', component: OverviewTab },
  { id: 'structure', label: 'Structure', component: StructureTab },
  { id: 'indicators', label: 'Indicators & DE-Bands', component: IndicatorsTab },
  { id: 'signals', label: 'Primary Signals', component: PrimarySignalsTab },
  { id: 'srt', label: 'SRT & Cadence', component: SRTTab },
  { id: 'cascades', label: 'Cascade Hooks', component: CascadesTab },
  { id: 'snl', label: 'Shared Nodes (SNL)', component: SNLTab },
  { id: 'versions', label: 'Version Seed', component: VersionsTab },
  { id: 'checks', label: 'Checks', component: ChecksTab }
] as const;

type TabId = typeof TABS[number]['id'];

const LoopDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const activeTab = (searchParams.get('tab') as TabId) || 'overview';
  const [loadedTabs, setLoadedTabs] = useState<Set<TabId>>(new Set(['overview']));
  
  const { getLoop } = useAtlasRegistry();
  const loopQuery = getLoop(id!);
  
  const loop = loopQuery.data;

  const setActiveTab = (tabId: TabId) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tabId);
    setSearchParams(newParams);
    setLoadedTabs(prev => new Set(prev).add(tabId));
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Invalid loop ID.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loopQuery.error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate('/registry')} className="mb-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Registry
          </Button>
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load loop</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (loopQuery.isLoading || !loop) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate('/registry')} className="mb-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Registry
          </Button>
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!loop) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate('/registry')} className="mb-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Registry
          </Button>
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Loop not found. This loop may not exist in the atlas.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const ActiveTabComponent = TABS.find(tab => tab.id === activeTab)?.component || OverviewTab;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Button variant="ghost" onClick={() => navigate('/registry')} className="mb-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Registry
          </Button>

          <LoopHeader 
            loop={loop} 
            onEdit={() => navigate(`/registry/${id}/editor`)}
            onExport={() => console.log('Export loop:', id)}
            onPublish={() => console.log('Publish loop:', id)}
            onSignalMonitor={() => navigate(`/signal-monitor?loop=${loop.loop_code || id}`)}
          />

          <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="min-h-[500px]">
            <Suspense fallback={
              <Card className="glass-secondary">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center h-32">
                    <LoadingSpinner size="lg" />
                  </div>
                </CardContent>
              </Card>
            }>
              {(loadedTabs.has(activeTab) || activeTab === 'overview') && (
                <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <ActiveTabComponent loop={loop} />
                </motion.div>
              )}
            </Suspense>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoopDetail;