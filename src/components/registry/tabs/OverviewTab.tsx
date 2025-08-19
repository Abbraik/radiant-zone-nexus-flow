import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ExternalLink, 
  Download, 
  Zap,
  Network,
  Target,
  Database,
  GitBranch,
  Calendar,
  User,
  AlertTriangle
} from 'lucide-react';
import { LoopData, HydratedLoop } from '@/types/loop-registry';
import { formatDistanceToNow } from 'date-fns';

interface OverviewTabProps {
  loop: LoopData;
  hydratedLoop?: HydratedLoop | null;
  isLoading?: boolean;
}

const QuickStat: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description?: string;
}> = ({ icon, label, value, description }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
    <div className="text-muted-foreground">{icon}</div>
    <div>
      <div className="font-semibold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      {description && (
        <div className="text-xs text-muted-foreground">{description}</div>
      )}
    </div>
  </div>
);

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  loop, 
  hydratedLoop, 
  isLoading 
}) => {
  const nodeCount = hydratedLoop?.nodes?.length || loop.node_count || 0;
  const edgeCount = hydratedLoop?.edges?.length || 0;
  const snlCount = 0; // TODO: Get from shared nodes
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Quick Actions */}
      <Card className="glass-secondary">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Open in Editor
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export JSON
            </Button>
            <Button variant="outline" className="gap-2">
              <Zap className="w-4 h-4" />
              Hydrate in Workspace
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loop Statistics */}
      <Card className="glass-secondary">
        <CardHeader>
          <CardTitle className="text-lg">Loop Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickStat
              icon={<Network className="w-5 h-5" />}
              label="Nodes"
              value={nodeCount}
              description="System components"
            />
            <QuickStat
              icon={<Target className="w-5 h-5" />}
              label="Edges"
              value={edgeCount}
              description="Causal connections"
            />
            <QuickStat
              icon={<Database className="w-5 h-5" />}
              label="Shared Nodes"
              value={snlCount}
              description="Cross-loop connections"
            />
            <QuickStat
              icon={<GitBranch className="w-5 h-5" />}
              label="Version"
              value={`v${loop.version}`}
              description="Current revision"
            />
          </div>
        </CardContent>
      </Card>

      {/* Loop Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <div className="text-foreground">{loop.name}</div>
            </div>

            {loop.notes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <div className="text-foreground">{loop.notes}</div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground">Type & Scale</label>
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary">{loop.loop_type}</Badge>
                <Badge variant="outline">{loop.scale}</Badge>
              </div>
            </div>

            {loop.leverage_default && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Default Leverage</label>
                <div className="text-foreground">{loop.leverage_default}</div>
              </div>
            )}

            {loop.tags && loop.tags.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tags</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {loop.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="text-lg">Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge 
                  variant={loop.status === 'published' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {loop.status}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <div className="text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {formatDistanceToNow(new Date(loop.created_at), { addSuffix: true })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <div className="text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {formatDistanceToNow(new Date(loop.updated_at), { addSuffix: true })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Owner</label>
              <div className="text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                {loop.user_id.slice(0, 8)}...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mini Cascade Map Placeholder */}
      <Card className="glass-secondary">
        <CardHeader>
          <CardTitle className="text-lg">Cascade Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted/10 rounded-lg flex items-center justify-center border-2 border-dashed border-muted">
            <div className="text-center text-muted-foreground">
              <Network className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm">Mini cascade map coming soon</div>
              <div className="text-xs">View full cascades in the Cascades tab</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Check Summary */}
      {nodeCount === 0 && (
        <Card className="glass-secondary border-yellow-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-yellow-300">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <div className="font-medium">Loop Structure Incomplete</div>
                <div className="text-sm text-muted-foreground">
                  This loop has no nodes defined. Add nodes and edges to create a functional system dynamics model.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default OverviewTab;