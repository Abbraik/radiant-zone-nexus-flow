import React from 'react';
import { Cascade3DViewer } from '../../modules/cascade3D/components/Cascade3DViewer';

interface Cascade3DWidgetProps {
  task: any;
}

const Cascade3DWidget: React.FC<Cascade3DWidgetProps> = ({ task }) => {
  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-white/10">
      <Cascade3DViewer
        isOpen={true}
        onClose={() => {}}
        activeTask={task}
        onNodeSelect={(nodeId) => console.log('Selected node:', nodeId)}
      />
    </div>
  );
};

export default Cascade3DWidget;