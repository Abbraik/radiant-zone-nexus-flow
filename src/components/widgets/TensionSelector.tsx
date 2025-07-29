import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Task } from '../../hooks/useTasks';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface TensionSelectorProps {
  task: Task;
  loopId?: string;
}

const tensionOptions = [
  { value: 'high', label: 'High Tension', description: 'Critical population pressure requiring immediate intervention' },
  { value: 'medium', label: 'Medium Tension', description: 'Moderate demographic stress with manageable impacts' },
  { value: 'low', label: 'Low Tension', description: 'Minor population variations within sustainable parameters' },
  { value: 'escalating', label: 'Escalating', description: 'Growing demographic pressure requiring proactive measures' }
];

const TensionSelector: React.FC<TensionSelectorProps> = ({ task, loopId }) => {
  const [selectedTension, setSelectedTension] = useState<string>('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-glass/70 backdrop-blur-20 rounded-2xl shadow-2xl border border-white/10"
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white mb-2">Select Tension Level</h3>
        <p className="text-sm text-gray-300">
          Choose the current tension state for {task.title}
        </p>
      </div>

      <div className="space-y-4">
        <Select value={selectedTension} onValueChange={setSelectedTension}>
          <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Choose tension level..." />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-white/20">
            {tensionOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-white hover:bg-white/10">
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-400">{option.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedTension && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="text-sm text-gray-300">
              Selected: <span className="text-teal-300 font-medium">
                {tensionOptions.find(opt => opt.value === selectedTension)?.label}
              </span>
            </div>
          </motion.div>
        )}

        <div className="flex justify-end">
          <Button 
            disabled={!selectedTension}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            Apply Tension Setting
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TensionSelector;