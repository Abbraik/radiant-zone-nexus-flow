import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  Zap, 
  TrendingUp, 
  Settings2,
  Eye
} from 'lucide-react';

interface MetaLoopOverlayProps {
  className?: string;
}

export const MetaLoopOverlay: React.FC<MetaLoopOverlayProps> = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border ${className}`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: System Status */}
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs font-medium">
              <Activity className="w-3 h-3 mr-1" />
              Meta-Loop Console
            </Badge>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
              
              <Badge variant="secondary" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                REL: 94%
              </Badge>
              
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                Equilibrium
              </Badge>
            </div>
          </div>

          {/* Center: Current Loop Context */}
          <div className="flex items-center gap-3">
            <div className="text-sm">
              <span className="text-muted-foreground">Loop:</span>
              <span className="ml-1 font-medium">Supply Chain Optimization</span>
            </div>
            
            <div className="text-sm">
              <span className="text-muted-foreground">Scale:</span>
              <span className="ml-1 font-medium">Macro</span>
            </div>
            
            <Badge variant="default" className="text-xs">
              Structural
            </Badge>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 px-3">
              <Eye className="w-4 h-4 mr-1" />
              Monitor
            </Button>
            
            <Button variant="ghost" size="sm" className="h-8 px-3">
              <Settings2 className="w-4 h-4 mr-1" />
              Configure
            </Button>
            
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="text-xs text-muted-foreground">2 Alerts</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Simplified version for workspace
export const WorkspaceMetaBar: React.FC<{ taskTitle?: string; capacity?: string; scale?: string }> = ({
  taskTitle = 'No Task',
  capacity = 'responsive',
  scale = 'micro'
}) => {
  return (
    <div className="bg-primary/5 border-b border-border backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-xs">
            Meta-Loop Console
          </Badge>
          <span className="text-sm text-muted-foreground">
            Task: {taskTitle}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={capacity === 'responsive' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {capacity.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {scale.toUpperCase()}
          </Badge>
        </div>
      </div>
    </div>
  );
};