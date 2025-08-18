import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, ExternalLink, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface ReflexiveHeaderProps {
  loop: {
    id: string;
    name: string;
    loop_type: string;
    scale: string;
    leverage_default: string;
  };
  task: {
    id: string;
    title: string;
  };
  lastHeartbeat?: string;
  onOpenRegistry?: () => void;
  onRefresh?: () => void;
}

export const ReflexiveHeader: React.FC<ReflexiveHeaderProps> = ({
  loop,
  task,
  lastHeartbeat,
  onOpenRegistry,
  onRefresh
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reactive': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'structural': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'perceptual': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getScaleColor = (scale: string) => {
    switch (scale) {
      case 'micro': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'meso': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'macro': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getLeverageColor = (leverage: string) => {
    switch (leverage) {
      case 'N': return 'bg-slate-500/10 text-slate-700 border-slate-200';
      case 'P': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'S': return 'bg-emerald-500/10 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{loop.name}</h1>
                <Badge variant="outline" className="bg-reflexive/10 text-reflexive border-reflexive/20">
                  Mode: Reflexive
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getTypeColor(loop.loop_type)}>
                  Type: {loop.loop_type}
                </Badge>
                <Badge className={getScaleColor(loop.scale)}>
                  Scale: {loop.scale}
                </Badge>
                <Badge className={getLeverageColor(loop.leverage_default)}>
                  Lever: {loop.leverage_default}
                </Badge>
              </div>

              {lastHeartbeat && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Last heartbeat: {formatDistanceToNow(new Date(lastHeartbeat), { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Refresh
              </Button>
              
              {onOpenRegistry && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenRegistry}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Registry
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};