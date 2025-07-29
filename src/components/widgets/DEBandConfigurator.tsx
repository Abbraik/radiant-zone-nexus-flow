import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface DEBandConfiguratorProps {
  lowerBound?: number;
  upperBound?: number;
  onChange: (bounds: { lower: number; upper: number }) => void;
  onComplete: () => void;
  currentValue?: number;
  unit?: string;
}

const DEBandConfigurator: React.FC<DEBandConfiguratorProps> = ({ 
  lowerBound = 0,
  upperBound = 100,
  onChange, 
  onComplete,
  currentValue = 50,
  unit = 'score'
}) => {
  const [lower, setLower] = useState(lowerBound);
  const [upper, setUpper] = useState(upperBound);
  const [isDragging, setIsDragging] = useState<'lower' | 'upper' | null>(null);

  // Mock breach history for demonstration
  const mockBreaches = [
    { date: '2024-07-25', value: 85, type: 'upper' },
    { date: '2024-07-22', value: 15, type: 'lower' },
    { date: '2024-07-20', value: 88, type: 'upper' },
    { date: '2024-07-18', value: 12, type: 'lower' },
  ];

  const handleSliderChange = (type: 'lower' | 'upper', value: number) => {
    if (type === 'lower') {
      const newLower = Math.min(value, upper - 5);
      setLower(newLower);
      onChange({ lower: newLower, upper });
    } else {
      const newUpper = Math.max(value, lower + 5);
      setUpper(newUpper);
      onChange({ lower, upper: newUpper });
    }
  };

  const handleConfirm = () => {
    onChange({ lower, upper });
    onComplete();
  };

  const getZoneColor = (value: number) => {
    if (value <= lower) return 'bg-red-500';
    if (value >= upper) return 'bg-red-500';
    if (value <= lower + (upper - lower) * 0.2 || value >= upper - (upper - lower) * 0.2) {
      return 'bg-yellow-500';
    }
    return 'bg-green-500';
  };

  const getZoneLabel = (value: number) => {
    if (value <= lower || value >= upper) return 'Breach Zone';
    if (value <= lower + (upper - lower) * 0.2 || value >= upper - (upper - lower) * 0.2) {
      return 'Warning Zone';
    }
    return 'Safe Zone';
  };

  const lowerPercentage = (lower / 100) * 100;
  const upperPercentage = (upper / 100) * 100;
  const currentPercentage = (currentValue / 100) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <Label className="text-lg font-medium text-white mb-4 block">
          Configure DE-Band
        </Label>
        <p className="text-sm text-gray-400 mb-4">
          Set upper and lower bounds for acceptable metric fluctuation.
        </p>
      </div>

      {/* Visual Slider */}
      <div className="space-y-4">
        <div className="relative h-16 bg-gray-800 rounded-lg overflow-hidden">
          {/* Background zones */}
          <div className="absolute inset-0 flex">
            {/* Red zone (lower) */}
            <div 
              className="bg-red-500/30 h-full"
              style={{ width: `${lowerPercentage}%` }}
            />
            {/* Green zone (middle) */}
            <div 
              className="bg-green-500/30 h-full"
              style={{ width: `${upperPercentage - lowerPercentage}%` }}
            />
            {/* Red zone (upper) */}
            <div 
              className="bg-red-500/30 h-full"
              style={{ width: `${100 - upperPercentage}%` }}
            />
          </div>

          {/* Current value indicator */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
            style={{ left: `${currentPercentage}%` }}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <Badge variant="secondary" className="bg-white text-black text-xs">
                {currentValue} {unit}
              </Badge>
            </div>
          </div>

          {/* Lower bound handle */}
          <motion.div
            className="absolute top-2 bottom-2 w-4 bg-blue-500 rounded cursor-grab active:cursor-grabbing"
            style={{ left: `${lowerPercentage}%` }}
            whileHover={{ scale: 1.1 }}
            whileDrag={{ scale: 1.2 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={() => setIsDragging('lower')}
            onDragEnd={() => setIsDragging(null)}
            onDrag={(_, info) => {
              const rect = info.point.x / 400; // Assuming 400px width
              const newValue = Math.round(rect * 100);
              handleSliderChange('lower', Math.max(0, Math.min(95, newValue)));
            }}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">
                {lower}
              </Badge>
            </div>
          </motion.div>

          {/* Upper bound handle */}
          <motion.div
            className="absolute top-2 bottom-2 w-4 bg-blue-500 rounded cursor-grab active:cursor-grabbing"
            style={{ left: `${upperPercentage}%` }}
            whileHover={{ scale: 1.1 }}
            whileDrag={{ scale: 1.2 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={() => setIsDragging('upper')}
            onDragEnd={() => setIsDragging(null)}
            onDrag={(_, info) => {
              const rect = info.point.x / 400; // Assuming 400px width
              const newValue = Math.round(rect * 100);
              handleSliderChange('upper', Math.max(5, Math.min(100, newValue)));
            }}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">
                {upper}
              </Badge>
            </div>
          </motion.div>
        </div>

        {/* Numeric inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-300 mb-2 block">Lower Bound</Label>
            <Input
              type="number"
              value={lower}
              onChange={(e) => handleSliderChange('lower', Number(e.target.value))}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-300 mb-2 block">Upper Bound</Label>
            <Input
              type="number"
              value={upper}
              onChange={(e) => handleSliderChange('upper', Number(e.target.value))}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${getZoneColor(currentValue)}`}></div>
          <span className="text-sm font-medium text-white">
            Current Status: {getZoneLabel(currentValue)}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          Value {currentValue} {unit} is {currentValue <= lower || currentValue >= upper ? 'outside' : 'within'} 
          acceptable bounds ({lower}-{upper} {unit})
        </p>
      </div>

      {/* Recent Breaches */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-white">Recent Breaches</Label>
          <Badge variant="outline" className="text-xs">
            {mockBreaches.length} in last 7 days
          </Badge>
        </div>
        
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {mockBreaches.map((breach, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-gray-300">{breach.date}</span>
              </div>
              <div className="text-xs">
                <span className="text-red-400">{breach.value} {unit}</span>
                <span className="text-gray-400 ml-1">
                  ({breach.type} bound)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <Button 
        onClick={handleConfirm}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Confirm DE-Band Configuration
      </Button>
    </motion.div>
  );
};

export default DEBandConfigurator;