import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, Tag, TrendingUp, Zap, Users } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Intervention {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  effort: string;
  impact: string;
  resourceCost: number;
  kpiImpact: number;
  tags: string[];
  evidenceLevel: 'High' | 'Medium' | 'Low';
  targetPopulation: string;
  timeToImpact: string;
}

interface EnhancedInterventionPickerProps {
  onAddIntervention: (intervention: Intervention) => void;
  selectedInterventions: string[];
}

const populationInterventions: Intervention[] = [
  {
    id: 'pop-1',
    name: 'Family Planning Programs',
    description: 'Comprehensive reproductive health education and services',
    icon: '👨‍👩‍👧‍👦',
    category: 'Population',
    effort: 'High',
    impact: 'High',
    resourceCost: 85,
    kpiImpact: 70,
    tags: ['Health', 'Education', 'Rights'],
    evidenceLevel: 'High',
    targetPopulation: 'Women 15-45',
    timeToImpact: '2-3 years'
  },
  {
    id: 'pop-2',
    name: 'Girls Education Initiative',
    description: 'Expand access to quality education, especially for girls',
    icon: '🎓',
    category: 'Development',
    effort: 'High',
    impact: 'Very High',
    resourceCost: 90,
    kpiImpact: 85,
    tags: ['Education', 'Gender', 'Long-term'],
    evidenceLevel: 'High',
    targetPopulation: 'Girls 6-18',
    timeToImpact: '5-10 years'
  },
  {
    id: 'pop-3',
    name: 'Maternal Health Infrastructure',
    description: 'Build and improve maternal and child health facilities',
    icon: '🏥',
    category: 'Development',
    effort: 'Very High',
    impact: 'High',
    resourceCost: 95,
    kpiImpact: 75,
    tags: ['Health', 'Infrastructure', 'Maternal'],
    evidenceLevel: 'High',
    targetPopulation: 'Pregnant women',
    timeToImpact: '1-2 years'
  },
  {
    id: 'pop-4',
    name: 'Women Economic Empowerment',
    description: 'Job creation and microfinance programs for women',
    icon: '💼',
    category: 'Development',
    effort: 'Medium',
    impact: 'Medium',
    resourceCost: 60,
    kpiImpact: 55,
    tags: ['Economic', 'Gender', 'Employment'],
    evidenceLevel: 'Medium',
    targetPopulation: 'Women 18-45',
    timeToImpact: '1-3 years'
  },
  {
    id: 'pop-5',
    name: 'Urban Planning Reform',
    description: 'Sustainable city development and family-friendly housing',
    icon: '🏙️',
    category: 'Development',
    effort: 'High',
    impact: 'Medium',
    resourceCost: 80,
    kpiImpact: 60,
    tags: ['Urban', 'Housing', 'Planning'],
    evidenceLevel: 'Medium',
    targetPopulation: 'Urban families',
    timeToImpact: '3-5 years'
  },
  {
    id: 'pop-6',
    name: 'Agricultural Innovation',
    description: 'Modern farming techniques and food security programs',
    icon: '🌾',
    category: 'Development',
    effort: 'Medium',
    impact: 'High',
    resourceCost: 70,
    kpiImpact: 65,
    tags: ['Agriculture', 'Food Security', 'Rural'],
    evidenceLevel: 'High',
    targetPopulation: 'Rural families',
    timeToImpact: '2-4 years'
  },
  {
    id: 'pop-7',
    name: 'Digital Health Services',
    description: 'Telemedicine and mobile health apps for family planning',
    icon: '📱',
    category: 'Technology',
    effort: 'Medium',
    impact: 'Medium',
    resourceCost: 45,
    kpiImpact: 50,
    tags: ['Technology', 'Health', 'Access'],
    evidenceLevel: 'Medium',
    targetPopulation: 'All ages',
    timeToImpact: '6-12 months'
  },
  {
    id: 'pop-8',
    name: 'Child Care Support Systems',
    description: 'Affordable childcare to support working parents',
    icon: '👶',
    category: 'Social',
    effort: 'High',
    impact: 'Medium',
    resourceCost: 75,
    kpiImpact: 55,
    tags: ['Childcare', 'Employment', 'Support'],
    evidenceLevel: 'Medium',
    targetPopulation: 'Working parents',
    timeToImpact: '1-2 years'
  }
];

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'Very High': return 'text-green-400 bg-green-500/20';
    case 'High': return 'text-blue-400 bg-blue-500/20';
    case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
    case 'Low': return 'text-gray-400 bg-gray-500/20';
    default: return 'text-gray-400 bg-gray-500/20';
  }
};

const getEffortColor = (effort: string) => {
  switch (effort) {
    case 'Very High': return 'text-red-400 bg-red-500/20';
    case 'High': return 'text-orange-400 bg-orange-500/20';
    case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
    case 'Low': return 'text-green-400 bg-green-500/20';
    default: return 'text-gray-400 bg-gray-500/20';
  }
};

export const EnhancedInterventionPicker: React.FC<EnhancedInterventionPickerProps> = ({
  onAddIntervention,
  selectedInterventions = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [impactFilter, setImpactFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredInterventions = populationInterventions.filter(intervention => {
    const matchesSearch = intervention.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         intervention.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         intervention.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !categoryFilter || intervention.category === categoryFilter;
    const matchesImpact = !impactFilter || intervention.impact === impactFilter;
    
    return matchesSearch && matchesCategory && matchesImpact;
  });

  const categories = [...new Set(populationInterventions.map(i => i.category))];
  const impacts = [...new Set(populationInterventions.map(i => i.impact))];

  return (
    <Card className="p-6 bg-white/5 border-white/10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 rounded-lg">
              <Plus className="h-6 w-6 text-teal-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Intervention Library</h3>
              <p className="text-sm text-gray-400">Population & Development Policy Interventions</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="border-white/30 text-white"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search interventions, tags, or descriptions..."
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Impact Level</label>
                  <Select value={impactFilter} onValueChange={setImpactFilter}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="All impacts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All impacts</SelectItem>
                      {impacts.map(impact => (
                        <SelectItem key={impact} value={impact}>{impact}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCategoryFilter('');
                      setImpactFilter('');
                      setSearchQuery('');
                    }}
                    className="w-full border-white/30 text-white"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            {filteredInterventions.length} interventions available
          </span>
          <span className="text-gray-400">
            {selectedInterventions.length} selected
          </span>
        </div>

        {/* Intervention Cards */}
        <div className="max-h-96 overflow-y-auto space-y-3">
          <AnimatePresence>
            {filteredInterventions.map((intervention) => {
              const isSelected = selectedInterventions.includes(intervention.id);
              
              return (
                <motion.div
                  key={intervention.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className={`
                    p-4 rounded-lg border transition-all duration-200 group cursor-pointer
                    ${isSelected 
                      ? 'bg-teal-500/20 border-teal-500/50 ring-1 ring-teal-500/30' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <span className="text-2xl">{intervention.icon}</span>
                      <div className="flex-1 space-y-2">
                        {/* Title and description */}
                        <div>
                          <div className="text-white font-medium flex items-center gap-2">
                            {intervention.name}
                            {intervention.evidenceLevel === 'High' && (
                              <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300">
                                High Evidence
                              </Badge>
                            )}
                          </div>
                          <div className="text-gray-400 text-sm mt-1">{intervention.description}</div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {intervention.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Resource Cost</span>
                              <span className="text-white">{intervention.resourceCost}%</span>
                            </div>
                            <Progress value={intervention.resourceCost} className="h-1.5" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">KPI Impact</span>
                              <span className="text-white">{intervention.kpiImpact}%</span>
                            </div>
                            <Progress value={intervention.kpiImpact} className="h-1.5" />
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400">Target:</span>
                            <div className="text-white">{intervention.targetPopulation}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Time to Impact:</span>
                            <div className="text-white">{intervention.timeToImpact}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Category:</span>
                            <div className="text-white">{intervention.category}</div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center space-x-2">
                          <Badge className={getImpactColor(intervention.impact)}>
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {intervention.impact} Impact
                          </Badge>
                          <Badge className={getEffortColor(intervention.effort)}>
                            <Zap className="w-3 h-3 mr-1" />
                            {intervention.effort} Effort
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={() => onAddIntervention(intervention)}
                      disabled={isSelected}
                      className={`
                        p-3 rounded-full transition-all duration-200 ml-4
                        ${isSelected 
                          ? 'bg-teal-500/30 text-teal-300 cursor-not-allowed' 
                          : 'bg-teal-500 text-white hover:bg-teal-600 opacity-0 group-hover:opacity-100'
                        }
                      `}
                      whileHover={{ scale: isSelected ? 1 : 1.1 }}
                      whileTap={{ scale: isSelected ? 1 : 0.9 }}
                    >
                      {isSelected ? (
                        <Users className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredInterventions.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No interventions match your filters</p>
            <p className="text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EnhancedInterventionPicker;