import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { LoopData, HydratedLoop } from '@/types/loop-registry';

interface ChecksTabProps {
  loop: LoopData;
  hydratedLoop?: HydratedLoop | null;
  isLoading?: boolean;
}

const ChecksTab: React.FC<ChecksTabProps> = ({ loop, hydratedLoop, isLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="glass-secondary">
        <CardHeader>
          <CardTitle>Lint Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Loop validation and lint checks coming soon. This will show structural validation, completeness checks, and publishing readiness.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChecksTab;