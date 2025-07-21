import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '../../hooks/useTasks';
import { Lightbulb } from 'lucide-react';

interface InsightFeedProps {
  task: Task;
}

const InsightFeed: React.FC<InsightFeedProps> = ({ task }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-glass/70 backdrop-blur-20 rounded-2xl shadow-2xl border border-white/10"
    >
      <div className="flex items-center gap-3 mb-4">
        <Lightbulb className="h-6 w-6 text-teal-400" />
        <h3 className="text-xl font-semibold text-white">Insight Feed</h3>
      </div>
      <p className="text-gray-300">Insight discovery widget for {task.title}</p>
    </motion.div>
  );
};

export default InsightFeed;