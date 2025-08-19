import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { LoopData, HydratedLoop } from '@/types/loop-registry';

interface VersionsTabProps {
  loop: LoopData;
  hydratedLoop?: HydratedLoop | null;
  isLoading?: boolean;
}

const VersionsTab: React.FC<VersionsTabProps> = ({ loop, hydratedLoop, isLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="glass-secondary">
        <CardHeader>
          <CardTitle>Versions</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Version history functionality coming soon. This will show version timeline, diffs, and allow exporting specific versions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VersionsTab;