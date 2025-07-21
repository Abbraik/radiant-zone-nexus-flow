import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '../../hooks/useTasks';
import { Network } from 'lucide-react';

interface KnowledgeGraphProps {
  task: Task;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ task }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-glass/70 backdrop-blur-20 rounded-2xl shadow-2xl border border-white/10"
    >
      <div className="flex items-center gap-3 mb-4">
        <Network className="h-6 w-6 text-teal-400" />
        <h3 className="text-xl font-semibold text-white">Knowledge Graph</h3>
      </div>
      <p className="text-gray-300">Knowledge visualization for {task.title}</p>
    </motion.div>
  );
};

export default KnowledgeGraph;