import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, GitBranch, Clock, User, Tag } from 'lucide-react';
import { LoopData, HydratedLoop } from '@/types/loop-registry';
import { formatDistanceToNow } from 'date-fns';

interface LoopOverviewProps {
  loop: LoopData;
  hydratedLoop?: HydratedLoop | null;
}

export const LoopOverview: React.FC<LoopOverviewProps> = ({ loop, hydratedLoop }) => {
  const nodes = hydratedLoop?.nodes || [];
  const edges = hydratedLoop?.edges || [];

  const nodesByDomain = nodes.reduce((acc, node) => {
    if (!acc[node.domain]) acc[node.domain] = [];
    acc[node.domain].push(node);
    return acc;
  }, {} as Record<string, typeof nodes>);

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'population': return 'bg-blue-100 text-blue-800';
      case 'resource': return 'bg-green-100 text-green-800';
      case 'products': return 'bg-yellow-100 text-yellow-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'institution': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Network className="h-4 w-4" />
              Loop Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nodes:</span>
                <span className="font-medium">{nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Edges:</span>
                <span className="font-medium">{edges.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Positive:</span>
                <span className="font-medium text-green-600">
                  {edges.filter(e => e.polarity === 1).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Negative:</span>
                <span className="font-medium text-red-600">
                  {edges.filter(e => e.polarity === -1).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Version Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version:</span>
                <span className="font-medium">v{loop.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={loop.status === 'published' ? 'default' : 'secondary'}>
                  {loop.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Leverage:</span>
                <span className="font-medium">{loop.leverage_default || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium text-sm">
                  {formatDistanceToNow(new Date(loop.created_at), { addSuffix: true })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated:</span>
                <span className="font-medium text-sm">
                  {formatDistanceToNow(new Date(loop.updated_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Description */}
      {loop.notes && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{loop.notes}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Nodes by Domain */}
      {nodes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Shared Node Layer (SNL)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(nodesByDomain).map(([domain, domainNodes]) => (
                  <div key={domain} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getDomainColor(domain)}>{domain}</Badge>
                      <span className="text-sm text-muted-foreground">
                        ({domainNodes.length} nodes)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 ml-4">
                      {domainNodes.map((node) => (
                        <div
                          key={node.id}
                          className="p-2 bg-muted rounded-lg text-sm"
                        >
                          <div className="font-medium">{node.label}</div>
                          {node.descriptor && (
                            <div className="text-muted-foreground text-xs">
                              {node.descriptor}
                            </div>
                          )}
                          {node.role && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {node.role}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Thresholds */}
      {Object.keys(loop.thresholds).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Thresholds & Targets</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                {JSON.stringify(loop.thresholds, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};