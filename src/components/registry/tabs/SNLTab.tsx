import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Share2, Database, RefreshCw, Link, Info, AlertCircle } from 'lucide-react';
import { LoopData } from '@/types/loop-registry';

interface SNLTabProps {
  loop: LoopData;
}

interface SharedNode {
  name: string;
  type: 'stock' | 'flow' | 'auxiliary' | 'indicator';
  sharedWith: string[];
  syncStatus: 'synced' | 'out-of-sync' | 'pending';
  lastSync?: string;
  description?: string;
}

// Sample data mapping - in production this would come from the loop metadata
const getSharedNodesForLoop = (loopId: string): SharedNode[] => {
  const snlData: Record<string, SharedNode[]> = {
    'atlas-MAC-L05': [
      { 
        name: 'Firms.CapitalStock', 
        type: 'stock', 
        sharedWith: ['atlas-MAC-L02', 'atlas-MES-L03'], 
        syncStatus: 'synced', 
        lastSync: '2 hours ago',
        description: 'Total productive capital stock of firms in the economy'
      },
      { 
        name: 'CapacityUtilization', 
        type: 'indicator', 
        sharedWith: ['atlas-MAC-L02', 'atlas-MAC-L03'], 
        syncStatus: 'synced', 
        lastSync: '1 hour ago',
        description: 'Current utilization rate of productive capacity'
      },
      { 
        name: 'ExpectedProfit', 
        type: 'auxiliary', 
        sharedWith: ['atlas-MAC-L06', 'atlas-MES-L04'], 
        syncStatus: 'out-of-sync', 
        lastSync: '6 hours ago',
        description: 'Forward-looking profit expectations driving investment decisions'
      }
    ],
    'atlas-MAC-L06': [
      { 
        name: 'ExternalDemand', 
        type: 'stock', 
        sharedWith: ['atlas-MAC-L02'], 
        syncStatus: 'synced', 
        lastSync: '30 minutes ago',
        description: 'Aggregate external demand for domestic products'
      },
      { 
        name: 'REER', 
        type: 'indicator', 
        sharedWith: ['atlas-MAC-L03'], 
        syncStatus: 'synced', 
        lastSync: '45 minutes ago',
        description: 'Real Effective Exchange Rate measure'
      },
      { 
        name: 'TradablesCapacity', 
        type: 'stock', 
        sharedWith: ['atlas-MES-L03'], 
        syncStatus: 'pending', 
        description: 'Production capacity in tradeable sectors'
      }
    ],
    'atlas-MAC-L07': [
      { 
        name: 'Environment.Quality', 
        type: 'stock', 
        sharedWith: ['atlas-MES-L08', 'atlas-MIC-L01'], 
        syncStatus: 'synced', 
        lastSync: '3 hours ago',
        description: 'Overall environmental quality index'
      },
      { 
        name: 'ResourceUse', 
        type: 'flow', 
        sharedWith: ['atlas-MES-L05', 'atlas-MES-L08'], 
        syncStatus: 'synced', 
        lastSync: '2 hours ago',
        description: 'Rate of natural resource consumption'
      },
      { 
        name: 'Emissions', 
        type: 'flow', 
        sharedWith: ['atlas-MAC-L03'], 
        syncStatus: 'out-of-sync', 
        lastSync: '8 hours ago',
        description: 'Greenhouse gas emissions flow'
      }
    ],
    'atlas-MAC-L08': [
      { 
        name: 'Society.Trust', 
        type: 'stock', 
        sharedWith: ['atlas-MIC-L10', 'atlas-MIC-L12'], 
        syncStatus: 'synced', 
        lastSync: '1 hour ago',
        description: 'Social trust levels in institutions and society'
      },
      { 
        name: 'Society.Participation', 
        type: 'indicator', 
        sharedWith: ['atlas-MIC-L12'], 
        syncStatus: 'synced', 
        lastSync: '2 hours ago',
        description: 'Level of civic and political participation'
      },
      { 
        name: 'PerceivedFairness', 
        type: 'auxiliary', 
        sharedWith: ['atlas-MIC-L10'], 
        syncStatus: 'synced', 
        lastSync: '1 hour ago',
        description: 'Public perception of fairness in institutions and policies'
      }
    ],
    'atlas-MAC-L09': [
      { 
        name: 'Buffers', 
        type: 'stock', 
        sharedWith: ['atlas-MES-L07', 'atlas-MES-L08'], 
        syncStatus: 'synced', 
        lastSync: '4 hours ago',
        description: 'Strategic reserves and buffers for crisis response'
      },
      { 
        name: 'ResponseLatency', 
        type: 'indicator', 
        sharedWith: ['atlas-MES-L11'], 
        syncStatus: 'synced', 
        lastSync: '2 hours ago',
        description: 'Time delay in system response to shocks'
      }
    ],
    'atlas-MAC-L10': [
      { 
        name: 'HealthStock', 
        type: 'stock', 
        sharedWith: ['atlas-MES-L01'], 
        syncStatus: 'synced', 
        lastSync: '6 hours ago',
        description: 'Population health capital stock'
      },
      { 
        name: 'LearningStock', 
        type: 'stock', 
        sharedWith: ['atlas-MES-L02'], 
        syncStatus: 'synced', 
        lastSync: '12 hours ago',
        description: 'Population learning and knowledge capital'
      },
      { 
        name: 'Participation', 
        type: 'indicator', 
        sharedWith: ['atlas-MAC-L08'], 
        syncStatus: 'out-of-sync', 
        lastSync: '1 day ago',
        description: 'Participation in education and health systems'
      }
    ],
    'atlas-MES-L06': [
      { 
        name: 'NetworkCapacity', 
        type: 'stock', 
        sharedWith: ['atlas-MES-L07'], 
        syncStatus: 'synced', 
        lastSync: '1 hour ago',
        description: 'Transport network infrastructure capacity'
      },
      { 
        name: 'Load', 
        type: 'flow', 
        sharedWith: ['atlas-MES-L07'], 
        syncStatus: 'synced', 
        lastSync: '30 minutes ago',
        description: 'Current load on transport infrastructure'
      },
      { 
        name: 'TravelTimeReliability', 
        type: 'indicator', 
        sharedWith: ['atlas-MIC-L07'], 
        syncStatus: 'synced', 
        lastSync: '45 minutes ago',
        description: 'Predictability of travel times across the network'
      }
    ],
    'atlas-MES-L07': [
      { 
        name: 'GenCapacity', 
        type: 'stock', 
        sharedWith: ['atlas-MAC-L07'], 
        syncStatus: 'synced', 
        lastSync: '2 hours ago',
        description: 'Electrical generation capacity'
      },
      { 
        name: 'ReserveMargin', 
        type: 'indicator', 
        sharedWith: ['atlas-MAC-L09'], 
        syncStatus: 'synced', 
        lastSync: '1 hour ago',
        description: 'Available generation capacity above peak demand'
      },
      { 
        name: 'OutageRate', 
        type: 'indicator', 
        sharedWith: ['atlas-MES-L12'], 
        syncStatus: 'synced', 
        lastSync: '3 hours ago',
        description: 'Frequency and duration of power outages'
      }
    ],
    'atlas-MES-L08': [
      { 
        name: 'Supply', 
        type: 'stock', 
        sharedWith: ['atlas-MAC-L07'], 
        syncStatus: 'synced', 
        lastSync: '4 hours ago',
        description: 'Available water supply capacity'
      },
      { 
        name: 'Demand', 
        type: 'flow', 
        sharedWith: ['atlas-MES-L05'], 
        syncStatus: 'synced', 
        lastSync: '2 hours ago',
        description: 'Water demand from all sectors'
      },
      { 
        name: 'NonRevenueWater', 
        type: 'indicator', 
        sharedWith: ['atlas-MES-L12'], 
        syncStatus: 'out-of-sync', 
        lastSync: '1 day ago',
        description: 'Water losses through leakage and theft'
      },
      { 
        name: 'StressIndex', 
        type: 'indicator', 
        sharedWith: ['atlas-MAC-L07'], 
        syncStatus: 'synced', 
        lastSync: '6 hours ago',
        description: 'Water stress ratio relative to sustainable limits'
      }
    ],
    'atlas-MES-L09': [
      { 
        name: 'Uptime', 
        type: 'indicator', 
        sharedWith: ['atlas-MIC-L06'], 
        syncStatus: 'synced', 
        lastSync: '15 minutes ago',
        description: 'Digital service availability percentage'
      },
      { 
        name: 'ErrorRates', 
        type: 'indicator', 
        sharedWith: ['atlas-MIC-L06'], 
        syncStatus: 'synced', 
        lastSync: '5 minutes ago',
        description: 'Rate of service errors and failures'
      },
      { 
        name: 'Adoption', 
        type: 'indicator', 
        sharedWith: ['atlas-MIC-L11'], 
        syncStatus: 'synced', 
        lastSync: '1 hour ago',
        description: 'Digital service adoption rates'
      },
      { 
        name: 'Satisfaction', 
        type: 'indicator', 
        sharedWith: ['atlas-MIC-L11'], 
        syncStatus: 'synced', 
        lastSync: '2 hours ago',
        description: 'User satisfaction with digital services'
      }
    ]
  };

  return snlData[loopId] || [];
};

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'stock': return <Database className="w-4 h-4" />;
    case 'flow': return <Share2 className="w-4 h-4" />;
    case 'auxiliary': return <Link className="w-4 h-4" />;
    case 'indicator': return <RefreshCw className="w-4 h-4" />;
    default: return <Database className="w-4 h-4" />;
  }
};

const getSyncStatusColor = (status: string) => {
  switch (status) {
    case 'synced': return 'text-green-400';
    case 'out-of-sync': return 'text-red-400';
    case 'pending': return 'text-yellow-400';
    default: return 'text-muted-foreground';
  }
};

const getSyncStatusBadge = (status: string) => {
  switch (status) {
    case 'synced': return 'secondary';
    case 'out-of-sync': return 'destructive';
    case 'pending': return 'outline';
    default: return 'outline';
  }
};

const SharedNodeCard: React.FC<{ node: SharedNode }> = ({ node }) => {
  const { name, type, sharedWith, syncStatus, lastSync, description } = node;
  const needsAttention = syncStatus === 'out-of-sync' || syncStatus === 'pending';

  return (
    <Card className={`glass-secondary ${needsAttention ? 'border-yellow-500/20' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground">
              {getNodeIcon(type)}
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">{name}</h4>
              <div className="text-xs text-muted-foreground capitalize">{type}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getSyncStatusBadge(syncStatus)} className="text-xs capitalize">
              {syncStatus.replace('-', ' ')}
            </Badge>
            {needsAttention && <AlertCircle className="w-4 h-4 text-yellow-400" />}
          </div>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground mb-3">
            {description}
          </p>
        )}

        <div className="space-y-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Shared With</label>
            <div className="flex flex-wrap gap-1 mt-1">
              {sharedWith.map((loopId, index) => (
                <Badge key={index} variant="outline" className="text-xs font-mono">
                  {loopId.replace('atlas-', '')}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className={`font-medium ${getSyncStatusColor(syncStatus)}`}>
              {syncStatus === 'synced' ? 'In Sync' : 
               syncStatus === 'out-of-sync' ? 'Needs Sync' : 'Sync Pending'}
            </span>
            {lastSync && (
              <span className="text-muted-foreground">
                Last sync: {lastSync}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SNLTab: React.FC<SNLTabProps> = ({ loop }) => {
  const sharedNodes = getSharedNodesForLoop(loop.id);
  const outOfSyncNodes = sharedNodes.filter(n => n.syncStatus === 'out-of-sync');
  const pendingNodes = sharedNodes.filter(n => n.syncStatus === 'pending');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="glass-secondary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Shared Nodes (SNL)
            </CardTitle>
            <div className="flex items-center gap-2">
              {outOfSyncNodes.length > 0 && (
                <Badge variant="destructive">
                  {outOfSyncNodes.length} Out of Sync
                </Badge>
              )}
              <Badge variant="secondary">
                {sharedNodes.length} Shared
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Shared Node Links (SNL) are system variables that synchronize across multiple loops.
            These nodes ensure consistency and coordination between different system components.
          </p>
        </CardContent>
      </Card>

      {/* Sync status alerts */}
      {(outOfSyncNodes.length > 0 || pendingNodes.length > 0) && (
        <Alert variant={outOfSyncNodes.length > 0 ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {outOfSyncNodes.length > 0 && `${outOfSyncNodes.length} nodes are out of sync and need attention. `}
            {pendingNodes.length > 0 && `${pendingNodes.length} nodes have pending synchronization.`}
          </AlertDescription>
        </Alert>
      )}

      {/* Shared Nodes Grid */}
      {sharedNodes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sharedNodes.map((node, index) => (
            <SharedNodeCard key={index} node={node} />
          ))}
        </div>
      ) : (
        <Card className="glass-secondary">
          <CardContent className="p-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No shared nodes defined for this loop yet. Configure shared nodes to synchronize variables across multiple loops.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      {sharedNodes.length > 0 && (
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="text-sm">Synchronization Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {sharedNodes.filter(n => n.syncStatus === 'synced').length}
                </div>
                <div className="text-muted-foreground">Synced</div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-red-400">
                  {outOfSyncNodes.length}
                </div>
                <div className="text-muted-foreground">Out of Sync</div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">
                  {pendingNodes.length}
                </div>
                <div className="text-muted-foreground">Pending</div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {new Set(sharedNodes.flatMap(n => n.sharedWith)).size}
                </div>
                <div className="text-muted-foreground">Connected Loops</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default SNLTab;