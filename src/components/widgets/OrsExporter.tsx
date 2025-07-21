import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '../../hooks/useTasks';
import { Download } from 'lucide-react';

interface OrsExporterProps {
  task: Task;
}

const OrsExporter: React.FC<OrsExporterProps> = ({ task }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-glass/70 backdrop-blur-20 rounded-2xl shadow-2xl border border-white/10"
    >
      <div className="flex items-center gap-3 mb-4">
        <Download className="h-6 w-6 text-teal-400" />
        <h3 className="text-xl font-semibold text-white">ORS Exporter</h3>
      </div>
      <p className="text-gray-300">Data export widget for {task.title}</p>
    </motion.div>
  );
};

export default OrsExporter;