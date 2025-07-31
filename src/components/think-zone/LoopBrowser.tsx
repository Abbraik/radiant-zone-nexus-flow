import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpCircle, ArrowDownCircle, Target, Repeat, Shuffle } from 'lucide-react';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export interface LoopArchetype {
  id: string;
  name: string;
  type: 'reinforcing' | 'balancing';
  description: string;
  category: 'growth' | 'limits' | 'fixes' | 'tragedy' | 'success' | 'other';
  commonVariables: string[];
  typicalDelays: string[];
  icon: React.ReactNode;
}

const coreLoopArchetypes: LoopArchetype[] = [
  {
    id: 'limits-to-growth',
    name: 'Limits to Growth',
    type: 'balancing',
    description: 'Growth eventually hits resource constraints, triggering limits',
    category: 'limits',
    commonVariables: ['Population', 'Resources', 'Consumption', 'Carrying Capacity'],
    typicalDelays: ['Resource depletion lag', 'Growth momentum'],
    icon: <Target className="h-4 w-4" />
  },
  {
    id: 'fixes-that-fail',
    name: 'Fixes that Fail',
    type: 'balancing',
    description: 'Quick fixes create unintended consequences, worsening the original problem',
    category: 'fixes',
    commonVariables: ['Problem Symptom', 'Quick Fix', 'Fundamental Solution', 'Side Effects'],
    typicalDelays: ['Fix implementation delay', 'Side effect emergence'],
    icon: <Repeat className="h-4 w-4" />
  },
  {
    id: 'tragedy-of-commons',
    name: 'Tragedy of Commons',
    type: 'reinforcing',
    description: 'Individual rational behavior leads to collective irrationality',
    category: 'tragedy',
    commonVariables: ['Individual Use', 'Total Use', 'Resource Quality', 'User Benefit'],
    typicalDelays: ['Resource degradation lag', 'User response delay'],
    icon: <Shuffle className="h-4 w-4" />
  },
  {
    id: 'success-to-successful',
    name: 'Success to Successful',
    type: 'reinforcing',
    description: 'Success attracts more resources, creating further success',
    category: 'success',
    commonVariables: ['Performance', 'Resources', 'Investment', 'Capability'],
    typicalDelays: ['Performance measurement lag', 'Resource allocation delay'],
    icon: <ArrowUpCircle className="h-4 w-4" />
  },
  {
    id: 'growth-underinvestment',
    name: 'Growth and Underinvestment',
    type: 'balancing',
    description: 'Growth creates capacity demands that are met with underinvestment',
    category: 'growth',
    commonVariables: ['Demand', 'Capacity', 'Investment', 'Performance Standard'],
    typicalDelays: ['Capacity building delay', 'Standard adjustment lag'],
    icon: <ArrowDownCircle className="h-4 w-4" />
  }
];

interface LoopBrowserProps {
  onArchetypeSelect: (archetype: LoopArchetype) => void;
  onCustomLoopCreate: () => void;
  selectedArchetypeId?: string;
}

export const LoopBrowser: React.FC<LoopBrowserProps> = ({
  onArchetypeSelect,
  onCustomLoopCreate,
  selectedArchetypeId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredArchetypes = coreLoopArchetypes.filter(archetype => {
    const matchesSearch = archetype.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         archetype.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || archetype.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All Loops' },
    { id: 'growth', label: 'Growth Patterns' },
    { id: 'limits', label: 'Limits & Constraints' },
    { id: 'fixes', label: 'Problem Fixes' },
    { id: 'tragedy', label: 'Commons Issues' },
    { id: 'success', label: 'Success Patterns' }
  ];

  const getTypeIcon = (type: 'reinforcing' | 'balancing') => {
    return type === 'reinforcing' ? 
      <ArrowUpCircle className="h-3 w-3 text-orange-500" /> : 
      <ArrowDownCircle className="h-3 w-3 text-blue-500" />;
  };

  const getTypeColor = (type: 'reinforcing' | 'balancing') => {
    return type === 'reinforcing' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Loop Browser</h2>
          <p className="text-muted-foreground">Select a loop archetype to begin strategic framing</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search loop archetypes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Loop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredArchetypes.map((archetype) => (
          <motion.div
            key={archetype.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedArchetypeId === archetype.id 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onArchetypeSelect(archetype)}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted/50">
                      {archetype.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{archetype.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getTypeIcon(archetype.type)}
                        <Badge variant="secondary" className={getTypeColor(archetype.type)}>
                          {archetype.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {archetype.description}
                </p>

                {/* Variables Preview */}
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Common Variables
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {archetype.commonVariables.slice(0, 3).map((variable) => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                    {archetype.commonVariables.length > 3 && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        +{archetype.commonVariables.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Instantiate Button */}
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchetypeSelect(archetype);
                  }}
                >
                  Instantiate Archetype
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Custom Loop Option */}
      <Card className="p-6 border-dashed border-2 border-muted-foreground/30 hover:border-primary/50 transition-colors">
        <div className="text-center space-y-4">
          <div className="p-3 rounded-full bg-muted/50 w-fit mx-auto">
            <Target className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Create Custom Loop</h3>
            <p className="text-sm text-muted-foreground">
              Start with a blank canvas to design your own causal loop
            </p>
          </div>
          <Button onClick={onCustomLoopCreate} variant="outline">
            Create Custom Loop
          </Button>
        </div>
      </Card>

      {/* Results Summary */}
      {searchTerm && (
        <div className="text-sm text-muted-foreground">
          Found {filteredArchetypes.length} loop{filteredArchetypes.length !== 1 ? 's' : ''} 
          {searchTerm && ` for "${searchTerm}"`}
        </div>
      )}
    </motion.div>
  );
};