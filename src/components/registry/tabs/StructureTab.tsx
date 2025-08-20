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
  // Debug logging
  console.log('StructureTab rendering for loop:', loop?.id, {
    hasMetadata: !!loop?.metadata,
    metadataKeys: loop?.metadata ? Object.keys(loop.metadata) : [],
    hasAtlasData: !!(loop?.metadata as any)?.atlas_data,
    hasNodes: !!(loop?.nodes),
    hasEdges: !!(loop?.edges)
  });

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