import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Clock, Activity } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useMockLoops } from '../../hooks/use-mock-data';
import { generateSparklineData } from '../../services/mock/data';

interface EnhancedLoopSelectorProps {
  value?: string;
  onChange: (loopId: string | null) => void;
  onComplete: () => void;
}

const EnhancedLoopSelector: React.FC<EnhancedLoopSelectorProps> = ({ 
  value, 
  onChange, 
  onComplete 
}) => {
  const { data: loops } = useMockLoops();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateNew, setShowCreateNew] = useState(false);

  const filteredLoops = loops?.filter(loop => 
    loop.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleLoopSelect = (loopId: string) => {
    onChange(loopId);
    onComplete();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'planning': return 'bg-yellow-500';
      case 'paused': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const generateMiniSparkline = (points: number[]) => {
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    
    return points.map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - ((point - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <Label className="text-lg font-medium text-white mb-4 block">
          Select or Create Loop
        </Label>
        <p className="text-sm text-gray-400 mb-4">
          Choose an existing governance loop or create a new one to begin configuration.
        </p>
      </div>

      {/* Search and Create New */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search loops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowCreateNew(true)}
          className="w-full border-teal-500 text-teal-300 hover:bg-teal-500 hover:text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Loop
        </Button>
      </div>

      {/* Loop List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredLoops.map((loop) => {
          const sparklineData = generateSparklineData(loop.triScore, 1.5, 12);
          const points = generateMiniSparkline(sparklineData);
          
          return (
            <motion.button
              key={loop.id}
              onClick={() => handleLoopSelect(loop.id)}
              className={`
                w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${value === loop.id 
                  ? 'border-teal-500 bg-teal-500/10' 
                  : 'border-white/10 bg-white/5 hover:border-white/30'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-white font-medium">{loop.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getStatusColor(loop.status)} text-white`}
                    >
                      {loop.status}
                    </Badge>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(loop.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {/* Mini Sparkline */}
                <div className="w-16 h-8">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polyline
                      points={points}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-teal-400"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">
                    SRT: <span className="text-white">{loop.srt}mo</span>
                  </span>
                  <span className="text-gray-400">
                    TRI: <span className="text-white">{loop.triScore}</span>
                  </span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`
                    ${loop.deBand === 'red' ? 'border-red-500 text-red-400' : ''}
                    ${loop.deBand === 'yellow' ? 'border-yellow-500 text-yellow-400' : ''}
                    ${loop.deBand === 'green' ? 'border-green-500 text-green-400' : ''}
                  `}
                >
                  {loop.deBand.toUpperCase()}
                </Badge>
              </div>
            </motion.button>
          );
        })}
      </div>

      {filteredLoops.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-400">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No loops found matching "{searchTerm}"</p>
        </div>
      )}
    </motion.div>
  );
};

export default EnhancedLoopSelector;