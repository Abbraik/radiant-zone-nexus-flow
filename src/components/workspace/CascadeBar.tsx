import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Target, Zap } from 'lucide-react';
import { Task } from '../../hooks/useTasks';
import { useCascade, CascadeNode } from '../../hooks/useCascade';
import { cn } from '../../lib/utils';

interface CascadeBarProps {
  activeTask: Task | null;
  onNodeClick?: (nodeType: 'goal' | 'okr' | 'task', nodeId: string) => void;
}

const CascadeBar: React.FC<CascadeBarProps> = ({ activeTask, onNodeClick }) => {
  const { buildCascadeNodes, selectGoal, selectOKR, selectTask } = useCascade();

  if (!activeTask) {
    return (
      <div className="w-full p-4 bg-glass/50 backdrop-blur-20 rounded-full border border-white/10 mb-4">
        <div className="flex items-center justify-center text-gray-400 text-sm">
          <Target className="h-4 w-4 mr-2" />
          No active task - Cascade view unavailable
        </div>
      </div>
    );
  }

  const cascadeNodes = buildCascadeNodes(activeTask);

  const handleNodeClick = (node: CascadeNode) => {
    if (node.type === 'goal') {
      selectGoal(node.id);
    } else if (node.type === 'okr') {
      selectOKR(node.id);
    } else if (node.type === 'task') {
      selectTask(node.id);
    }
    onNodeClick?.(node.type, node.id);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'goal': return '🎯';
      case 'okr': return '📊';
      case 'task': return '⚡';
      default: return '•';
    }
  };

  const getNodeStyles = (type: string) => {
    switch (type) {
      case 'goal':
        return 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-400/30 text-purple-200';
      case 'okr':
        return 'bg-gradient-to-r from-blue-500/20 to-teal-500/20 border-blue-400/30 text-blue-200';
      case 'task':
        return 'bg-gradient-to-r from-teal-500/20 to-green-500/20 border-teal-400/30 text-teal-200';
      default:
        return 'bg-white/10 border-white/20 text-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full p-3 bg-glass/80 backdrop-blur-20 rounded-full border border-white/10 mb-4"
    >
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
        {cascadeNodes.map((node, index) => (
          <div key={node.id} className="flex items-center space-x-2">
            {/* Node */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNodeClick(node)}
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:shadow-lg group whitespace-nowrap',
                getNodeStyles(node.type)
              )}
              title={node.description}
            >
              <span className="text-lg">{getNodeIcon(node.type)}</span>
              <div className="text-left">
                <div className="text-sm font-medium">{node.title}</div>
                {node.progress !== undefined && (
                  <div className="text-xs opacity-70">
                    {node.progress}% complete
                  </div>
                )}
              </div>
            </motion.button>

            {/* Chevron separator */}
            {index < cascadeNodes.length - 1 && (
              <ChevronRight className="h-4 w-4 text-white/40 flex-shrink-0" />
            )}
          </div>
        ))}

        {/* Active indicator */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center space-x-1 ml-4 px-2 py-1 bg-teal-500/20 rounded-full border border-teal-400/30"
        >
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          <span className="text-xs text-teal-300 font-medium">Active</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CascadeBar;