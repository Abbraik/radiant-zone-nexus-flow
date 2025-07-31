import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpCircle, ArrowDownCircle, Target, Repeat, Shuffle, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

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
    id: 'population-development-loop',
    name: 'Population and Development Loop',
    type: 'reinforcing',
    description: 'Population size and characteristics greatly influence the efficiency of the resource market which in turn influences economic growth. Economic growth and the economic model determine the social outcome that eventually determine the population size and characteristics creating a reinforcing loop',
    category: 'growth',
    commonVariables: ['Population Size', 'Resource Market Efficiency', 'Economic Growth', 'Social Outcomes'],
    typicalDelays: ['Economic development lag', 'Population response delay'],
    icon: <ArrowUpCircle className="h-4 w-4" />
  },
  {
    id: 'natural-population-growth',
    name: 'Natural Population Growth Loop',
    type: 'reinforcing',
    description: 'The fertility rate determines the local population size and composition such as the age structure and number of women in childbearing age. These affect nuptiality factors like age of marriage and male choice. Changes in marriage affect family formation and birth rates. Increased marriage rates typically lead to higher birth rates, which affects the age structure and many other factors such as education and income level that influence nuptiality which eventually influences the fertility rate creating a reinforcing loop.',
    category: 'growth',
    commonVariables: ['Fertility Rate', 'Population Size', 'Marriage Rates', 'Birth Rates'],
    typicalDelays: ['Generational delay', 'Marriage formation lag'],
    icon: <ArrowUpCircle className="h-4 w-4" />
  },
  {
    id: 'population-resource-market',
    name: 'Population and Resource Market Loop',
    type: 'reinforcing',
    description: 'Population dynamics such as growth and migration directly impact the resource market, affecting both supply and demand. These changes, in turn, impact population sustainability and growth. Also, different demographic dynamics affect the capital structure and capital movement, as capital is part of the resource market. An increase in the young population can lead to more investment in education and infrastructure, enhancing efficiency and economic stability.',
    category: 'growth',
    commonVariables: ['Population Growth', 'Resource Market', 'Capital Structure', 'Economic Stability'],
    typicalDelays: ['Investment realization lag', 'Infrastructure development delay'],
    icon: <ArrowUpCircle className="h-4 w-4" />
  },
  {
    id: 'economic-population-growth',
    name: 'Economic Model and Unnatural Population Growth Loop',
    type: 'reinforcing',
    description: 'The economic model defines growth patterns. If the economic model relies on labor-intensive activities that cannot be met by the local population, external labor is recruited. This affects the population characteristics by altering the demographic composition and increasing population diversity.',
    category: 'growth',
    commonVariables: ['Economic Model', 'Labor Demand', 'Population Composition', 'Migration'],
    typicalDelays: ['Labor recruitment lag', 'Demographic adjustment delay'],
    icon: <ArrowUpCircle className="h-4 w-4" />
  },
  {
    id: 'environmental-quality-loop',
    name: 'Environmental Quality Loop',
    type: 'balancing',
    description: 'The economic model and patterns of resource demand influence environmental quality, affecting health and social outcomes. Declines in health and social outcomes can negatively impact the population characteristics which can slow economic growth, balancing the system. This underscores the need for sustainable environmental policies to maintain a balance between economic growth and environmental quality.',
    category: 'limits',
    commonVariables: ['Environmental Quality', 'Economic Growth', 'Health Outcomes', 'Population Characteristics'],
    typicalDelays: ['Environmental degradation lag', 'Health impact delay'],
    icon: <Target className="h-4 w-4" />
  },
  {
    id: 'production-process-loop',
    name: 'Production Process Loop',
    type: 'reinforcing',
    description: 'The production process loop is a reinforcing feedback loop where the goods and services market demand for resources, particularly labor, generates income for the workforce. This increased income boosts purchasing power, leading to higher demand for goods and services, which in turn requires more resources and labor, perpetuating the cycle of income generation and market demand.',
    category: 'growth',
    commonVariables: ['Market Demand', 'Labor Resources', 'Income', 'Purchasing Power'],
    typicalDelays: ['Production scaling delay', 'Income distribution lag'],
    icon: <ArrowUpCircle className="h-4 w-4" />
  },
  {
    id: 'economic-stability-loop',
    name: 'Economic Stability Loop',
    type: 'reinforcing',
    description: 'Increased population size leads to higher demand for goods and services which when met by the supply, stabilizes the market and leads to economic growth. This economic growth enhances social outcomes and improves population characteristics leading to enhanced resource market efficiency depending on the market conditions, further enhancing goods and services market stability.',
    category: 'growth',
    commonVariables: ['Population Size', 'Market Demand', 'Economic Growth', 'Market Stability'],
    typicalDelays: ['Market adjustment lag', 'Economic response delay'],
    icon: <ArrowUpCircle className="h-4 w-4" />
  },
  {
    id: 'global-influence-loop',
    name: 'Global Influence Loop',
    type: 'reinforcing',
    description: 'External global factors such as international trade and economic policies impact local conditions and resource availability. These factors can either enhance or balance local growth depending on global conditions and policies. For instance, increased global demand for resources can raise local prices and affect economic stability. Herrin notes that globalization and international trade can significantly impact local development by affecting resource prices and availability.',
    category: 'other',
    commonVariables: ['Global Trade', 'International Policies', 'Resource Prices', 'Local Development'],
    typicalDelays: ['Global market transmission lag', 'Policy implementation delay'],
    icon: <Shuffle className="h-4 w-4" />
  },
  {
    id: 'social-outcomes-loop',
    name: 'Social Outcomes Loop',
    type: 'reinforcing',
    description: 'Improving social outcomes such as education and healthcare and overall well-being is dependent on a stable goods and services market as well as responsible utilization of resources in a manner that protects the environment. This in turn will improve the population characteristics and society in nuptiality which eventually impacts the population growth restarting the cycle of development.',
    category: 'success',
    commonVariables: ['Social Outcomes', 'Education', 'Healthcare', 'Population Characteristics'],
    typicalDelays: ['Social development lag', 'Educational impact delay'],
    icon: <ArrowUpCircle className="h-4 w-4" />
  },
  {
    id: 'migration-economic-opportunities',
    name: 'Migration and Economic Opportunities Loop',
    type: 'reinforcing',
    description: 'Economic opportunities drive migration patterns, impacting population dynamics and labor market composition. This impacts economic growth and development. For instance, migration of economic opportunities can increase the workforce and improve economic efficiency. Herrin notes that economic migration can lead to significant changes in labor force composition and improve productive efficiency.',
    category: 'growth',
    commonVariables: ['Migration Patterns', 'Economic Opportunities', 'Labor Market', 'Economic Efficiency'],
    typicalDelays: ['Migration response lag', 'Labor market adjustment delay'],
    icon: <ArrowUpCircle className="h-4 w-4" />
  },
  {
    id: 'social-structure-loop',
    name: 'Social Structure Loop',
    type: 'reinforcing',
    description: 'The improvement in social outcomes leads to new and changing social phenomena that can increase nuptiality restarting the natural population growth loop.',
    category: 'success',
    commonVariables: ['Social Outcomes', 'Social Phenomena', 'Nuptiality', 'Population Growth'],
    typicalDelays: ['Social change lag', 'Cultural adaptation delay'],
    icon: <ArrowUpCircle className="h-4 w-4" />
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
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCardExpansion = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

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

  const getCategoryColor = (category: string) => {
    const colors = {
      'growth': 'bg-green-500/10 text-green-500',
      'limits': 'bg-red-500/10 text-red-500',
      'fixes': 'bg-yellow-500/10 text-yellow-500',
      'tragedy': 'bg-purple-500/10 text-purple-500',
      'success': 'bg-blue-500/10 text-blue-500',
      'other': 'bg-gray-500/10 text-gray-500'
    };
    return colors[category as keyof typeof colors] || colors.other;
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
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredArchetypes.map((archetype) => (
          <motion.div
            key={archetype.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedArchetypeId === archetype.id 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onArchetypeSelect(archetype)}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 rounded-lg bg-muted/50">
                      {archetype.icon}
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="secondary" className={`${getCategoryColor(archetype.category)} text-xs`}>
                        {archetype.category}
                      </Badge>
                      <Badge variant="secondary" className={`${getTypeColor(archetype.type)} text-xs`}>
                        {archetype.type}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm leading-tight">{archetype.name}</h3>
                </div>

                {/* Expandable Description */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-between text-xs p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCardExpansion(archetype.id);
                      }}
                    >
                      <span className="text-muted-foreground">
                        {expandedCards.has(archetype.id) ? 'Hide Details' : 'Show Details'}
                      </span>
                      {expandedCards.has(archetype.id) ? 
                        <ChevronUp className="h-3 w-3" /> : 
                        <ChevronDown className="h-3 w-3" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {archetype.description}
                    </p>
                  </CollapsibleContent>
                </Collapsible>

                {/* Variables Preview */}
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Variables
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {archetype.commonVariables.slice(0, 2).map((variable) => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                    {archetype.commonVariables.length > 2 && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        +{archetype.commonVariables.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Select Button */}
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchetypeSelect(archetype);
                  }}
                >
                  Select Loop
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