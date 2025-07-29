import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Info, Target, Database, Zap, Users, Globe, Cog, Clock, GitBranch, MessageCircle, Layers, Brain, Infinity } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface LeveragePoint {
  id: string;
  level: number;
  name: string;
  description: string;
  example: string;
  impact: 'transformational' | 'high' | 'medium' | 'low';
  category: 'paradigm' | 'structure' | 'process' | 'data';
  icon: any;
  difficulty: 'expert' | 'advanced' | 'intermediate' | 'beginner';
}

interface LeveragePointPickerProps {
  value?: string;
  onChange: (leverageId: string) => void;
  onComplete: () => void;
}

const leveragePoints: LeveragePoint[] = [
  {
    id: 'lp1-paradigms',
    level: 1,
    name: 'Paradigms',
    description: 'Mindsets, shared ideas, and worldviews out of which systems arise',
    example: 'Shifting from "growth at all costs" to "sustainable prosperity"',
    impact: 'transformational',
    category: 'paradigm',
    icon: Brain,
    difficulty: 'expert'
  },
  {
    id: 'lp2-transcending',
    level: 2,
    name: 'Transcending Paradigms',
    description: 'The source of paradigms, staying unattached to any particular worldview',
    example: 'Teaching systems thinking and paradigm flexibility',
    impact: 'transformational',
    category: 'paradigm',
    icon: Infinity,
    difficulty: 'expert'
  },
  {
    id: 'lp3-goals',
    level: 3,
    name: 'Goals',
    description: 'The purpose or function of the system',
    example: 'Changing from maximizing profit to optimizing stakeholder value',
    impact: 'high',
    category: 'structure',
    icon: Target,
    difficulty: 'advanced'
  },
  {
    id: 'lp4-power',
    level: 4,
    name: 'Power Structure',
    description: 'Who gets to make the rules, the distribution of power',
    example: 'Implementing participatory decision-making processes',
    impact: 'high',
    category: 'structure',
    icon: Users,
    difficulty: 'advanced'
  },
  {
    id: 'lp5-rules',
    level: 5,
    name: 'Rules & Incentives',
    description: 'Policies, regulations, and reward structures',
    example: 'Carbon pricing, performance bonuses aligned with sustainability',
    impact: 'high',
    category: 'process',
    icon: Cog,
    difficulty: 'intermediate'
  },
  {
    id: 'lp6-information-flows',
    level: 6,
    name: 'Information Flows',
    description: 'Who has access to information and when',
    example: 'Real-time dashboards, transparent reporting systems',
    impact: 'medium',
    category: 'data',
    icon: Zap,
    difficulty: 'intermediate'
  },
  {
    id: 'lp7-self-organization',
    level: 7,
    name: 'Self-Organization',
    description: 'The power to add, change, or evolve system structure',
    example: 'Adaptive governance models, autonomous teams',
    impact: 'high',
    category: 'structure',
    icon: GitBranch,
    difficulty: 'advanced'
  },
  {
    id: 'lp8-delays',
    level: 8,
    name: 'Delays',
    description: 'The lengths of time relative to the rates of system changes',
    example: 'Reducing decision-making lag time, faster feedback loops',
    impact: 'medium',
    category: 'process',
    icon: Clock,
    difficulty: 'intermediate'
  },
  {
    id: 'lp9-negative-feedback',
    level: 9,
    name: 'Negative Feedback',
    description: 'The strength of reactions that keep the system stable',
    example: 'Automated quality controls, budget constraints',
    impact: 'medium',
    category: 'process',
    icon: MessageCircle,
    difficulty: 'beginner'
  },
  {
    id: 'lp10-positive-feedback',
    level: 10,
    name: 'Positive Feedback',
    description: 'The strength of reactions that drive system growth',
    example: 'Network effects, viral marketing, compound interest',
    impact: 'medium',
    category: 'process',
    icon: Globe,
    difficulty: 'beginner'
  },
  {
    id: 'lp11-stocks',
    level: 11,
    name: 'Stocks & Buffers',
    description: 'Material stocks and flows, buffers, and stabilizing stocks',
    example: 'Cash reserves, inventory levels, skilled workforce',
    impact: 'low',
    category: 'structure',
    icon: Database,
    difficulty: 'beginner'
  },
  {
    id: 'lp12-material-elements',
    level: 12,
    name: 'Material Elements',
    description: 'Numbers, subsidies, incentives, constraints',
    example: 'Budget allocations, headcount, physical infrastructure',
    impact: 'low',
    category: 'structure',
    icon: Layers,
    difficulty: 'beginner'
  }
];

const LeveragePointPicker: React.FC<LeveragePointPickerProps> = ({ 
  value, 
  onChange, 
  onComplete 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImpact, setSelectedImpact] = useState<string>('all');

  const filteredPoints = leveragePoints.filter(point => {
    const matchesSearch = point.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         point.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || point.category === selectedCategory;
    const matchesImpact = selectedImpact === 'all' || point.impact === selectedImpact;
    
    return matchesSearch && matchesCategory && matchesImpact;
  });

  const handlePointSelect = (pointId: string) => {
    onChange(pointId);
    onComplete();
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'transformational': return 'bg-purple-500';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'expert': return 'text-red-400';
      case 'advanced': return 'text-orange-400';
      case 'intermediate': return 'text-yellow-400';
      case 'beginner': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <Label className="text-lg font-medium text-white mb-4 block">
            Choose Leverage Point
          </Label>
          <p className="text-sm text-gray-400 mb-4">
            Select the systemic intervention focus based on Meadows' 12 leverage points. 
            Higher-numbered points are easier to implement but have lower impact.
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search leverage points..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
          >
            <option value="all">All Categories</option>
            <option value="paradigm">Paradigm</option>
            <option value="structure">Structure</option>
            <option value="process">Process</option>
            <option value="data">Data</option>
          </select>
          
          <select
            value={selectedImpact}
            onChange={(e) => setSelectedImpact(e.target.value)}
            className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
          >
            <option value="all">All Impact Levels</option>
            <option value="transformational">Transformational</option>
            <option value="high">High Impact</option>
            <option value="medium">Medium Impact</option>
            <option value="low">Low Impact</option>
          </select>
        </div>

        {/* Leverage Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredPoints.map((point) => {
            const Icon = point.icon;
            const isSelected = value === point.id;
            
            return (
              <motion.button
                key={point.id}
                onClick={() => handlePointSelect(point.id)}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 text-left relative
                  ${isSelected 
                    ? 'border-teal-500 bg-teal-500/10' 
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Level Badge */}
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="text-xs">
                    LP{point.level}
                  </Badge>
                </div>

                {/* Icon and Title */}
                <div className="flex items-start gap-3 mb-3">
                  <Icon className="w-6 h-6 text-teal-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-sm mb-1">{point.name}</h3>
                    <p className="text-gray-400 text-xs leading-tight">{point.description}</p>
                  </div>
                </div>

                {/* Example */}
                <div className="mb-3">
                  <p className="text-xs text-gray-300 italic">"{point.example}"</p>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getImpactColor(point.impact)} text-white`}
                    >
                      {point.impact}
                    </Badge>
                  </div>
                  
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className={`w-3 h-3 ${getDifficultyColor(point.difficulty)}`} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Difficulty: {point.difficulty}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </motion.button>
            );
          })}
        </div>

        {filteredPoints.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No leverage points found matching your filters</p>
          </div>
        )}

        {/* Selected Point Summary */}
        {value && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-teal-500/10 rounded-lg border border-teal-500/30"
          >
            {(() => {
              const selected = leveragePoints.find(p => p.id === value);
              return selected ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-sm font-medium text-teal-300">
                      Selected: LP{selected.level} - {selected.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Impact Level: <span className="text-white capitalize">{selected.impact}</span> | 
                    Difficulty: <span className="text-white capitalize">{selected.difficulty}</span>
                  </p>
                </div>
              ) : null;
            })()}
          </motion.div>
        )}

        {/* Confirm Button */}
        {value && (
          <Button 
            onClick={onComplete}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          >
            Confirm Leverage Point Selection
          </Button>
        )}
      </motion.div>
    </TooltipProvider>
  );
};

export default LeveragePointPicker;