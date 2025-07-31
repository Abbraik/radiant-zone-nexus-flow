import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Database, TrendingUp, ArrowUpDown, Settings } from 'lucide-react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { CLDNodeType } from '../../types/cld';

interface VariableTemplate {
  label: string;
  type: CLDNodeType;
  category: string;
  description: string;
  commonConnections: string[];
  defaultValue?: number;
}

const variableTemplates: Record<string, VariableTemplate[]> = {
  'limits-to-growth': [
    { label: 'Population', type: 'stock', category: 'core', description: 'Total population size', commonConnections: ['Birth Rate', 'Death Rate'], defaultValue: 1000 },
    { label: 'Birth Rate', type: 'flow', category: 'core', description: 'Rate of population growth', commonConnections: ['Population', 'Carrying Capacity'] },
    { label: 'Death Rate', type: 'flow', category: 'core', description: 'Rate of population decline', commonConnections: ['Population', 'Resource Scarcity'] },
    { label: 'Resource Consumption', type: 'auxiliary', category: 'core', description: 'Per capita resource usage', commonConnections: ['Population', 'Available Resources'] },
    { label: 'Available Resources', type: 'stock', category: 'core', description: 'Total remaining resources', commonConnections: ['Resource Consumption'], defaultValue: 5000 },
    { label: 'Carrying Capacity', type: 'auxiliary', category: 'core', description: 'Maximum sustainable population', commonConnections: ['Available Resources', 'Population'] },
    { label: 'Technology Level', type: 'auxiliary', category: 'modifier', description: 'Efficiency improvements', commonConnections: ['Resource Consumption', 'Carrying Capacity'] },
    { label: 'Environmental Quality', type: 'stock', category: 'modifier', description: 'Ecosystem health', commonConnections: ['Population', 'Resource Consumption'], defaultValue: 100 }
  ],
  'fixes-that-fail': [
    { label: 'Problem Symptom', type: 'auxiliary', category: 'core', description: 'Visible manifestation of the issue', commonConnections: ['Quick Fix', 'Fundamental Solution'] },
    { label: 'Quick Fix', type: 'flow', category: 'core', description: 'Immediate symptomatic solution', commonConnections: ['Problem Symptom', 'Unintended Consequences'] },
    { label: 'Fundamental Solution', type: 'auxiliary', category: 'core', description: 'Root cause addressing approach', commonConnections: ['Problem Symptom', 'Capability'] },
    { label: 'Capability for Fundamental Solution', type: 'stock', category: 'core', description: 'Resources and skills for root cause solution', commonConnections: ['Fundamental Solution'], defaultValue: 50 },
    { label: 'Unintended Consequences', type: 'auxiliary', category: 'core', description: 'Negative side effects of quick fix', commonConnections: ['Quick Fix', 'Problem Symptom'] },
    { label: 'Time Pressure', type: 'auxiliary', category: 'modifier', description: 'Urgency driving quick solutions', commonConnections: ['Quick Fix', 'Fundamental Solution'] },
    { label: 'Learning Investment', type: 'flow', category: 'modifier', description: 'Resources devoted to building capability', commonConnections: ['Capability for Fundamental Solution'] }
  ],
  'common': [
    { label: 'Customer Satisfaction', type: 'auxiliary', category: 'outcome', description: 'Level of customer happiness', commonConnections: ['Service Quality', 'Revenue'] },
    { label: 'Employee Morale', type: 'auxiliary', category: 'outcome', description: 'Staff motivation and engagement', commonConnections: ['Productivity', 'Turnover Rate'] },
    { label: 'Revenue', type: 'flow', category: 'financial', description: 'Income generated', commonConnections: ['Customer Satisfaction', 'Market Share'] },
    { label: 'Costs', type: 'flow', category: 'financial', description: 'Expenses incurred', commonConnections: ['Revenue', 'Efficiency'] },
    { label: 'Quality', type: 'auxiliary', category: 'performance', description: 'Standard of output', commonConnections: ['Customer Satisfaction', 'Costs'] },
    { label: 'Time to Market', type: 'auxiliary', category: 'performance', description: 'Speed of delivery', commonConnections: ['Quality', 'Costs'] },
    { label: 'Market Share', type: 'auxiliary', category: 'competitive', description: 'Portion of total market', commonConnections: ['Revenue', 'Competitive Advantage'] },
    { label: 'Innovation Rate', type: 'flow', category: 'competitive', description: 'Pace of new developments', commonConnections: ['R&D Investment', 'Competitive Advantage'] }
  ]
};

interface VariablePaletteProps {
  archetypeId?: string;
  onVariableSelect: (variable: VariableTemplate) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export const VariablePalette: React.FC<VariablePaletteProps> = ({
  archetypeId,
  onVariableSelect,
  searchTerm = '',
  onSearchChange
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customVariable, setCustomVariable] = useState({
    label: '',
    type: 'auxiliary' as CLDNodeType,
    description: '',
    category: 'custom'
  });

  const search = onSearchChange ? searchTerm : localSearch;
  const setSearch = onSearchChange || setLocalSearch;

  // Get variables for current archetype and common variables
  const archetypeVariables = archetypeId ? variableTemplates[archetypeId] || [] : [];
  const commonVariables = variableTemplates.common || [];
  const allVariables = [...archetypeVariables, ...commonVariables];

  // Filter variables
  const filteredVariables = allVariables.filter(variable => {
    const matchesSearch = variable.label.toLowerCase().includes(search.toLowerCase()) ||
                         variable.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || variable.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...new Set(allVariables.map(v => v.category))];

  const getTypeIcon = (type: CLDNodeType) => {
    switch (type) {
      case 'stock': return <Database className="h-3 w-3" />;
      case 'flow': return <TrendingUp className="h-3 w-3" />;
      case 'auxiliary': return <ArrowUpDown className="h-3 w-3" />;
      case 'constant': return <Settings className="h-3 w-3" />;
    }
  };

  const getTypeColor = (type: CLDNodeType) => {
    switch (type) {
      case 'stock': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'flow': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'auxiliary': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'constant': return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'all': 'All Variables',
      'core': 'Core Variables',
      'modifier': 'Modifying Factors',
      'outcome': 'Outcomes',
      'financial': 'Financial',
      'performance': 'Performance',
      'competitive': 'Competitive'
    };
    return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  const handleCustomSubmit = () => {
    if (customVariable.label.trim()) {
      onVariableSelect({
        ...customVariable,
        commonConnections: []
      });
      setCustomVariable({
        label: '',
        type: 'auxiliary',
        description: '',
        category: 'custom'
      });
      setShowCustomForm(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Variable Palette</h3>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowCustomForm(!showCustomForm)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Custom
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search variables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-1 overflow-x-auto">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap text-xs"
            >
              {getCategoryLabel(category)}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Variable Form */}
      <AnimatePresence>
        {showCustomForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-border"
          >
            <div className="p-4 space-y-3">
              <Input
                placeholder="Variable name"
                value={customVariable.label}
                onChange={(e) => setCustomVariable(prev => ({ ...prev, label: e.target.value }))}
                className="h-8 text-sm"
              />
              <div className="flex gap-2">
                {(['stock', 'flow', 'auxiliary', 'constant'] as CLDNodeType[]).map(type => (
                  <Button
                    key={type}
                    variant={customVariable.type === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCustomVariable(prev => ({ ...prev, type }))}
                    className="text-xs"
                  >
                    {getTypeIcon(type)}
                    <span className="ml-1 capitalize">{type}</span>
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCustomSubmit} size="sm" className="text-xs">
                  Add Variable
                </Button>
                <Button onClick={() => setShowCustomForm(false)} variant="outline" size="sm" className="text-xs">
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Variables List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {filteredVariables.map((variable, index) => (
            <motion.div
              key={`${variable.label}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="p-3 cursor-pointer hover:bg-accent/50 transition-colors group"
                onClick={() => onVariableSelect(variable)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-foreground truncate">
                          {variable.label}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getTypeColor(variable.type)}`}
                        >
                          {getTypeIcon(variable.type)}
                          <span className="ml-1 capitalize">{variable.type}</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {variable.description}
                      </p>
                    </div>
                  </div>

                  {variable.commonConnections.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        Common connections:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {variable.commonConnections.slice(0, 2).map(connection => (
                          <Badge key={connection} variant="secondary" className="text-xs">
                            {connection}
                          </Badge>
                        ))}
                        {variable.commonConnections.length > 2 && (
                          <Badge variant="secondary" className="text-xs text-muted-foreground">
                            +{variable.commonConnections.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredVariables.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No variables found</p>
            {search && (
              <p className="text-xs">Try adjusting your search or category filter</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};