import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '../../hooks/useTasks';
import { Settings } from 'lucide-react';

interface SimulationParamsProps {
  task: Task;
}

const SimulationParams: React.FC<SimulationParamsProps> = ({ task }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-glass/70 backdrop-blur-20 rounded-2xl shadow-2xl border border-white/10"
    >
      <div className="flex items-center gap-3 mb-4">
        <Settings className="h-6 w-6 text-teal-400" />
        <h3 className="text-xl font-semibold text-white">Simulation Parameters</h3>
      </div>
      <p className="text-gray-300">Parameter configuration for {task.title}</p>
    </motion.div>
  );
};

export default SimulationParams;