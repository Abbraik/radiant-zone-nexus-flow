import React from 'react';
import { motion } from 'framer-motion';
import { LoopData, HydratedLoop } from '@/types/loop-registry';
import { AtlasCLDViewer } from '@/components/cld/AtlasCLDViewer';

interface StructureTabProps {
  loop: LoopData;
  hydratedLoop?: HydratedLoop | null;
  isLoading?: boolean;
}

const StructureTab: React.FC<StructureTabProps> = ({ 
  loop, 
  hydratedLoop, 
  isLoading 
}) => {
  // Use the new AtlasCLDViewer for all loops
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AtlasCLDViewer 
        loop={loop} 
        readonly={true}
      />
    </motion.div>
  );
};

export default StructureTab;