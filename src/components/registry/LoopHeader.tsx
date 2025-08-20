import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Edit, 
  Download, 
  Share2, 
  Calendar,
  Network,
  Target,
  Tag,
  GitBranch,
  Clock,
  User,
  Activity
} from 'lucide-react';
import { LoopData } from '@/types/loop-registry';
import { formatDistanceToNow } from 'date-fns';

interface LoopHeaderProps {
  loop: LoopData;
  onEdit: () => void;
  onExport: () => void;
  onPublish: () => void;
  onSignalMonitor?: () => void;
}

const getLoopTypeColor = (type: string) => {
  const colors = {
    reactive: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    structural: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    perceptual: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  };
  return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

const getScaleColor = (scale: string) => {
  const colors = {
    micro: 'bg-green-500/20 text-green-300 border-green-500/30',
    meso: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    macro: 'bg-red-500/20 text-red-300 border-red-500/30'
  };
  return colors[scale as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

const getStatusColor = (status: string) => {
  const colors = {
    draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    published: 'bg-green-500/20 text-green-300 border-green-500/30',
    deprecated: 'bg-red-500/20 text-red-300 border-red-500/30'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

export const LoopHeader: React.FC<LoopHeaderProps> = ({
  loop,
  onEdit,
  onExport,
  onPublish,
  onSignalMonitor
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-secondary">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <CardTitle className="text-2xl font-bold text-foreground">
                {loop.name}
              </CardTitle>
              
              {loop.notes && (
                <p className="text-muted-foreground text-base leading-relaxed">
                  {loop.notes}
                </p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className={getLoopTypeColor(loop.loop_type)}>
                  {loop.loop_type}
                </Badge>
                <Badge className={getScaleColor(loop.scale)}>
                  {loop.scale}
                </Badge>
                <Badge className={getStatusColor(loop.status)}>
                  {loop.status}
                </Badge>
                {loop.leverage_default && (
                  <Badge variant="outline">
                    Leverage: {loop.leverage_default}
                  </Badge>
                )}
                {loop.tags?.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-6">
              {onSignalMonitor && (
                <Button variant="outline" onClick={onSignalMonitor} className="gap-2">
                  <Activity className="w-4 h-4" />
                  Signal Monitor
                </Button>
              )}
              
              <Button variant="outline" onClick={onEdit} className="gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              
              <Button variant="outline" onClick={onExport} className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              
              {loop.status === 'draft' && (
                <Button onClick={onPublish} className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Publish
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Network className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{loop.node_count || 0}</div>
                <div className="text-xs text-muted-foreground">Nodes</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">0</div>
                <div className="text-xs text-muted-foreground">Edges</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <GitBranch className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">v{loop.version}</div>
                <div className="text-xs text-muted-foreground">Version</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">0</div>
                <div className="text-xs text-muted-foreground">SNL</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium text-xs">
                  {formatDistanceToNow(new Date(loop.updated_at), { addSuffix: true })}
                </div>
                <div className="text-xs text-muted-foreground">Updated</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium text-xs">
                  {formatDistanceToNow(new Date(loop.created_at), { addSuffix: true })}
                </div>
                <div className="text-xs text-muted-foreground">Created</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};