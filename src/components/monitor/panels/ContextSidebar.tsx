import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MacroSidebarContent } from './MacroSidebarContent';
import { MesoSidebarContent } from './MesoSidebarContent';
import { MicroSidebarContent } from './MicroSidebarContent';

interface SelectedItem {
  type: 'macro' | 'meso' | 'micro';
  id: string;
  data: any;
}

interface ContextSidebarProps {
  selectedItem: SelectedItem | null;
}

export function ContextSidebar({ selectedItem }: ContextSidebarProps) {
  if (!selectedItem) {
    return (
      <div className="h-full p-4">
        <motion.div
          className="text-center glass rounded-xl border-border/50 p-6 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Select a loop to view detailed analysis
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const { type, data } = selectedItem;

  return (
    <div className="h-full p-4">
      <motion.div
        className="h-full glass rounded-xl border-border/50 overflow-hidden"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
            <Badge 
              variant={data.status === 'healthy' ? 'default' : 
                     data.status === 'warning' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {data.status}
            </Badge>
          </div>
          <h3 className="font-semibold text-sm text-foreground">{data.name}</h3>
          {data.vision && (
            <p className="text-xs text-muted-foreground mt-1">{data.vision}</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Dynamic content based on loop type */}
          {type === 'macro' && <MacroSidebarContent data={data} />}
          {type === 'meso' && <MesoSidebarContent data={data} />}
          {type === 'micro' && <MicroSidebarContent data={data} />}
        </div>
      </motion.div>
    </div>
  );
}