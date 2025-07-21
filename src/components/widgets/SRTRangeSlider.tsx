import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Task } from '../../hooks/useTasks';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';

interface SRTRangeSliderProps {
  task: Task;
}

const SRTRangeSlider: React.FC<SRTRangeSliderProps> = ({ task }) => {
  const [srtRange, setSrtRange] = useState([6]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-glass/70 backdrop-blur-20 rounded-2xl shadow-2xl border border-white/10"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">SRT Range</h3>
        <p className="text-sm text-gray-300">Set the strategic response timeframe (0-24 months)</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">0 months</span>
          <Badge variant="secondary" className="bg-teal-500 text-white">
            {srtRange[0]} months
          </Badge>
          <span className="text-sm text-gray-400">24 months</span>
        </div>

        <Slider
          value={srtRange}
          onValueChange={setSrtRange}
          max={24}
          min={0}
          step={1}
          className="w-full"
        />

        <div className="text-center">
          <p className="text-sm text-gray-300">
            Current range: <span className="text-teal-300 font-medium">{srtRange[0]} months</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SRTRangeSlider;