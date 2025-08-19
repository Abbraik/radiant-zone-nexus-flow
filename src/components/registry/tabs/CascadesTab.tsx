import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { LoopData, HydratedLoop } from '@/types/loop-registry';

interface CascadesTabProps {
  loop: LoopData;
  hydratedLoop?: HydratedLoop | null;
  isLoading?: boolean;
}

const CascadesTab: React.FC<CascadesTabProps> = ({ loop, hydratedLoop, isLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="glass-secondary">
        <CardHeader>
          <CardTitle>Cascades</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Cascades functionality coming soon. This will show read-only cascade maps and relationships between loops.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CascadesTab;