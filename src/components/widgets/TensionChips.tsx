import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '../../hooks/useTasks';
import { Badge } from '../ui/badge';

interface TensionChipsProps {
  task: Task;
}

const TensionChips: React.FC<TensionChipsProps> = ({ task }) => {
  const tensions = ['Critical', 'High', 'Medium', 'Low'];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-glass/70 backdrop-blur-20 rounded-2xl shadow-2xl border border-white/10"
    >
      <h3 className="text-xl font-semibold text-white mb-4">Tension Levels</h3>
      <div className="flex flex-wrap gap-2">
        {tensions.map((tension, index) => (
          <Badge key={tension} variant="secondary" className="bg-white/10 text-white">
            {tension}
          </Badge>
        ))}
      </div>
    </motion.div>
  );
};

export default TensionChips;