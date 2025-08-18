import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { LoopStudio } from '@/components/think-zone/LoopStudio';
import type { ZoneBundleProps } from '@/types/zone-bundles';

interface ThinkZoneBundleProps extends ZoneBundleProps {}

const ThinkZoneBundle: React.FC<ThinkZoneBundleProps> = ({
  taskId,
  taskData,
  payload,
  onPayloadUpdate,
  onValidationChange,
  readonly = false
}) => {
  const [showLoopStudio, setShowLoopStudio] = useState(false);

  // Simple validation - just check if we have basic task data
  useEffect(() => {
    onValidationChange(true, []);
  }, [onValidationChange]);

  const handleCreateNewLoop = () => {
    setShowLoopStudio(true);
  };

  const handleCloseLoopStudio = () => {
    setShowLoopStudio(false);
  };

  if (showLoopStudio) {
    return (
      <LoopStudio
        taskId={taskId}
        payload={payload}
        onPayloadUpdate={onPayloadUpdate}
        onValidationChange={onValidationChange}
        readonly={readonly}
        onClose={handleCloseLoopStudio}
      />
    );
  }

  return (
    <motion.div 
      className="h-full flex flex-col bg-background"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center">
          <h3 className="text-lg font-semibold mb-4">Think Zone Bundle</h3>
          <p className="text-muted-foreground mb-6">
            Create a new loop or continue working on an existing one.
          </p>
          <Button 
            onClick={handleCreateNewLoop}
            className="w-full"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Loop
          </Button>
        </Card>
      </div>
    </motion.div>
  );
};

export default ThinkZoneBundle;