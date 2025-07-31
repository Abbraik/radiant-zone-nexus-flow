import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Info, 
  TrendingUp, 
  Users, 
  Zap, 
  Settings, 
  Scale, 
  Eye,
  MessageSquare,
  Database,
  Lightbulb,
  Globe,
  Brain,
  Shield,
  Network,
  Compass,
  Calculator
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface LeveragePoint {
  id: string;
  rank: number;
  name: string;
  description: string;
  meadowsCategory: 'paradigm' | 'structure' | 'flows' | 'power';
  governmentLevers: string[];
  effectiveness: {
    balancing: number; // 0-100
    reinforcing: number; // 0-100
  };
  examples: string[];
  difficulty: 'low' | 'medium' | 'high';
  timeToImpact: 'immediate' | 'short' | 'medium' | 'long';
  icon: React.ReactNode;
}

interface GovernmentLever {
  id: string;
  name: string;
  description: string;
  domain: string;
  icon: React.ReactNode;
  color: string;
}

const governmentLevers: GovernmentLever[] = [
  {
    id: 'regulatory',
    name: 'Regulatory & Legal',
    description: 'Laws, regulations, and legal frameworks',
    domain: 'Structure',
    icon: <Scale className="h-4 w-4" />,
    color: 'bg-red-500/10 text-red-600 border-red-200'
  },
  {
    id: 'economic',
    name: 'Economic & Financial',
    description: 'Fiscal policy, incentives, and market mechanisms',
    domain: 'Flows',
    icon: <TrendingUp className="h-4 w-4" />,
    color: 'bg-green-500/10 text-green-600 border-green-200'
  },
  {
    id: 'communicative',
    name: 'Communicative & Normative',
    description: 'Information campaigns and norm-setting',
    domain: 'Information',
    icon: <MessageSquare className="h-4 w-4" />,
    color: 'bg-blue-500/10 text-blue-600 border-blue-200'
  },
  {
    id: 'organizational',
    name: 'Organizational & Structural',
    description: 'Institutional design and governance structures',
    domain: 'Structure',
    icon: <Settings className="h-4 w-4" />,
    color: 'bg-purple-500/10 text-purple-600 border-purple-200'
  },
  {
    id: 'collaborative',
    name: 'Collaborative & Partnership',
    description: 'Multi-stakeholder engagement and co-creation',
    domain: 'Networks',
    icon: <Users className="h-4 w-4" />,
    color: 'bg-orange-500/10 text-orange-600 border-orange-200'
  },
  {
    id: 'technological',
    name: 'Technological & Digital',
    description: 'Digital infrastructure and technology deployment',
    domain: 'Systems',
    icon: <Zap className="h-4 w-4" />,
    color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200'
  }
];

const leveragePoints: LeveragePoint[] = [
  {
    id: 'paradigms',
    rank: 12,
    name: 'Paradigms or Mindsets',
    description: 'The shared ideas and assumptions that create the system',
    meadowsCategory: 'paradigm',
    governmentLevers: ['communicative', 'collaborative'],
    effectiveness: { balancing: 95, reinforcing: 90 },
    examples: ['Cultural transformation', 'Worldview shifts', 'Value system changes'],
    difficulty: 'high',
    timeToImpact: 'long',
    icon: <Brain className="h-4 w-4" />
  },
  {
    id: 'goals',
    rank: 11,
    name: 'Goals of the System',
    description: 'The purpose or function of the system',
    meadowsCategory: 'paradigm',
    governmentLevers: ['organizational', 'regulatory'],
    effectiveness: { balancing: 85, reinforcing: 80 },
    examples: ['Mission statements', 'Strategic objectives', 'Performance metrics'],
    difficulty: 'high',
    timeToImpact: 'medium',
    icon: <Target className="h-4 w-4" />
  },
  {
    id: 'power-structure',
    rank: 10,
    name: 'Power to Add/Change Rules',
    description: 'The power to make up or change the rules of the system',
    meadowsCategory: 'power',
    governmentLevers: ['organizational', 'regulatory', 'collaborative'],
    effectiveness: { balancing: 90, reinforcing: 85 },
    examples: ['Constitutional change', 'Governance reform', 'Authority redistribution'],
    difficulty: 'high',
    timeToImpact: 'long',
    icon: <Scale className="h-4 w-4" />
  },
  {
    id: 'rules',
    rank: 9,
    name: 'Rules of the System',
    description: 'Incentives, punishments, constraints that govern behavior',
    meadowsCategory: 'structure',
    governmentLevers: ['regulatory', 'economic'],
    effectiveness: { balancing: 80, reinforcing: 75 },
    examples: ['Laws and regulations', 'Policies', 'Institutional procedures'],
    difficulty: 'medium',
    timeToImpact: 'medium',
    icon: <Settings className="h-4 w-4" />
  },
  {
    id: 'information-flows',
    rank: 8,
    name: 'Information Flows',
    description: 'Who has access to what information and when',
    meadowsCategory: 'structure',
    governmentLevers: ['communicative', 'technological'],
    effectiveness: { balancing: 75, reinforcing: 85 },
    examples: ['Transparency initiatives', 'Data sharing', 'Communication channels'],
    difficulty: 'medium',
    timeToImpact: 'short',
    icon: <Database className="h-4 w-4" />
  },
  {
    id: 'material-flows',
    rank: 7,
    name: 'Material Flows',
    description: 'Physical structure and interconnections',
    meadowsCategory: 'flows',
    governmentLevers: ['technological', 'economic', 'regulatory'],
    effectiveness: { balancing: 70, reinforcing: 65 },
    examples: ['Infrastructure', 'Supply chains', 'Resource allocation'],
    difficulty: 'medium',
    timeToImpact: 'medium',
    icon: <Globe className="h-4 w-4" />
  },
  {
    id: 'regulating-flows',
    rank: 6,
    name: 'Regulating Negative Feedback Loops',
    description: 'The strength of the mechanisms that keep the system in check',
    meadowsCategory: 'flows',
    governmentLevers: ['regulatory', 'organizational'],
    effectiveness: { balancing: 85, reinforcing: 60 },
    examples: ['Safety regulations', 'Quality controls', 'Performance monitoring'],
    difficulty: 'medium',
    timeToImpact: 'short',
    icon: <Shield className="h-4 w-4" />
  },
  {
    id: 'driving-flows',
    rank: 5,
    name: 'Driving Positive Feedback Loops',
    description: 'The strength of the mechanisms that drive system growth',
    meadowsCategory: 'flows',
    governmentLevers: ['economic', 'technological'],
    effectiveness: { balancing: 55, reinforcing: 80 },
    examples: ['Innovation incentives', 'Growth mechanisms', 'Network effects'],
    difficulty: 'medium',
    timeToImpact: 'short',
    icon: <TrendingUp className="h-4 w-4" />
  },
  {
    id: 'self-organization',
    rank: 4,
    name: 'Power of Self-Organization',
    description: 'The capacity to evolve and learn without external direction',
    meadowsCategory: 'structure',
    governmentLevers: ['collaborative', 'organizational'],
    effectiveness: { balancing: 70, reinforcing: 75 },
    examples: ['Decentralized networks', 'Community organizing', 'Emergent leadership'],
    difficulty: 'high',
    timeToImpact: 'medium',
    icon: <Network className="h-4 w-4" />
  },
  {
    id: 'goals-paradigm',
    rank: 3,
    name: 'Goals of Paradigm',
    description: 'The purpose for which the paradigm exists',
    meadowsCategory: 'paradigm',
    governmentLevers: ['communicative', 'collaborative'],
    effectiveness: { balancing: 80, reinforcing: 85 },
    examples: ['Societal values', 'Cultural norms', 'Collective purpose'],
    difficulty: 'high',
    timeToImpact: 'long',
    icon: <Compass className="h-4 w-4" />
  },
  {
    id: 'transcending-paradigms',
    rank: 2,
    name: 'Transcending Paradigms',
    description: 'Staying unattached to any particular paradigm',
    meadowsCategory: 'paradigm',
    governmentLevers: ['collaborative', 'communicative'],
    effectiveness: { balancing: 90, reinforcing: 95 },
    examples: ['Systems thinking', 'Multiple perspectives', 'Adaptive governance'],
    difficulty: 'high',
    timeToImpact: 'long',
    icon: <Eye className="h-4 w-4" />
  },
  {
    id: 'constants-parameters',
    rank: 1,
    name: 'Constants, Parameters, Numbers',
    description: 'Least effective but most commonly attempted interventions',
    meadowsCategory: 'flows',
    governmentLevers: ['economic', 'regulatory'],
    effectiveness: { balancing: 30, reinforcing: 25 },
    examples: ['Subsidies', 'Taxes', 'Minimum wages', 'Interest rates'],
    difficulty: 'low',
    timeToImpact: 'immediate',
    icon: <Calculator className="h-4 w-4" />
  }
];

interface LeverageDomainMapperProps {
  selectedLeveragePoint?: LeveragePoint;
  onLeveragePointSelect: (point: LeveragePoint) => void;
  loopType?: 'balancing' | 'reinforcing';
  selectedLeveragePoints?: LeveragePoint[];
  multiSelect?: boolean;
}

export const LeverageDomainMapper: React.FC<LeverageDomainMapperProps> = ({
  selectedLeveragePoint,
  onLeveragePointSelect,
  loopType = 'balancing',
  selectedLeveragePoints = [],
  multiSelect = false
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  const isPointSelected = (point: LeveragePoint) => {
    if (multiSelect && selectedLeveragePoints) {
      return selectedLeveragePoints.some(p => p.id === point.id);
    }
    return selectedLeveragePoint?.id === point.id;
  };

  const getEffectivenessScore = (point: LeveragePoint) => {
    return loopType === 'balancing' ? point.effectiveness.balancing : point.effectiveness.reinforcing;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'low': return 'bg-green-500/10 text-green-600';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600';
      case 'high': return 'bg-red-500/10 text-red-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getTimeColor = (time: string) => {
    switch (time) {
      case 'immediate': return 'bg-green-500/10 text-green-600';
      case 'short': return 'bg-blue-500/10 text-blue-600';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600';
      case 'long': return 'bg-red-500/10 text-red-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getRationale = (point: LeveragePoint, loopType: string) => {
    const effectiveness = getEffectivenessScore(point);
    const category = point.meadowsCategory;
    
    if (loopType === 'balancing') {
      switch (category) {
        case 'paradigm':
          return `High-leverage for balancing loops. Changing mindsets (${effectiveness}% effective) can establish new equilibrium points and prevent overcorrection.`;
        case 'structure':
          return `Structural changes (${effectiveness}% effective) modify system boundaries and information flows, crucial for balancing loop stability.`;
        case 'flows':
          return `Flow interventions (${effectiveness}% effective) can regulate rates and buffer oscillations in balancing systems.`;
        case 'power':
          return `Power interventions (${effectiveness}% effective) can redistribute authority to maintain balance and prevent dominance loops.`;
      }
    } else {
      switch (category) {
        case 'paradigm':
          return `Paradigm shifts (${effectiveness}% effective) can redirect reinforcing loops toward beneficial outcomes and growth patterns.`;
        case 'structure':
          return `Structural interventions (${effectiveness}% effective) can channel reinforcing dynamics and prevent runaway effects.`;
        case 'flows':
          return `Flow modifications (${effectiveness}% effective) can amplify positive reinforcement while limiting negative spirals.`;
        case 'power':
          return `Power restructuring (${effectiveness}% effective) can democratize benefits of reinforcing loops and prevent concentration.`;
      }
    }
    return '';
  };

  const getConnectedLevers = (point: LeveragePoint) => {
    return governmentLevers.filter(lever => point.governmentLevers.includes(lever.id));
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Leverage Point Mapping</h3>
            <p className="text-sm text-muted-foreground">
              Meadows' 12 leverage points connected to Six Universal Government Levers
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>

        {/* Loop Type Indicator */}
        <Card className="p-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${loopType === 'balancing' ? 'bg-blue-500/10' : 'bg-orange-500/10'}`}>
              {loopType === 'balancing' ? 
                <Target className="h-4 w-4 text-blue-600" /> : 
                <TrendingUp className="h-4 w-4 text-orange-600" />
              }
            </div>
            <div>
              <div className="font-medium text-sm capitalize">{loopType} Loop Context</div>
              <div className="text-xs text-muted-foreground">
                Effectiveness scores optimized for {loopType} loop interventions
              </div>
            </div>
          </div>
        </Card>

        {/* Leverage Points Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">
              {multiSelect ? 'Select Leverage Points (Ordered by Impact)' : 'Select Leverage Point (Ordered by Impact)'}
            </h4>
            {multiSelect && selectedLeveragePoints.length > 0 && (
              <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-600">
                {selectedLeveragePoints.length} selected
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leveragePoints
            .sort((a, b) => b.rank - a.rank)
            .map((point) => {
              const effectiveness = getEffectivenessScore(point);
              const connectedLevers = getConnectedLevers(point);
              const isSelected = isPointSelected(point);
              const isHovered = hoveredPoint === point.id;

              return (
                <motion.div
                  key={point.id}
                  onHoverStart={() => setHoveredPoint(point.id)}
                  onHoverEnd={() => setHoveredPoint(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`p-3 cursor-pointer transition-all h-full ${
                      isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                    onClick={() => onLeveragePointSelect(point)}
                  >
                    <div className="space-y-3 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <div className="p-1.5 rounded-lg bg-muted/50 flex-shrink-0">
                            {point.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                #{point.rank}
                              </Badge>
                              <h5 className="font-medium text-sm leading-tight truncate">{point.name}</h5>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                              {point.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                          <div className="text-right">
                            <div className="text-base font-bold text-primary">
                              {effectiveness}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Effect
                            </div>
                          </div>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm">
                              <p>{getRationale(point, loopType)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(point.difficulty)}>
                          {point.difficulty} difficulty
                        </Badge>
                        <Badge className={getTimeColor(point.timeToImpact)}>
                          {point.timeToImpact} impact
                        </Badge>
                      </div>

                      {/* Connected Government Levers */}
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">
                          Connected Government Levers:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {connectedLevers.map((lever) => (
                            <Badge key={lever.id} className={lever.color}>
                              {lever.icon}
                              <span className="ml-1 text-xs">{lever.name}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Examples (shown on hover or selection) */}
                      <AnimatePresence>
                        {(isHovered || isSelected || showDetails) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-2 pt-3 border-t border-border"
                          >
                            <div className="text-xs font-medium text-muted-foreground">
                              Examples:
                            </div>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {point.examples.map((example, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <Lightbulb className="h-3 w-3" />
                                  {example}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Selected Point Details */}
        {selectedLeveragePoint && (
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Selected Leverage Point</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-2">{selectedLeveragePoint.name}</h5>
                  <p className="text-sm text-muted-foreground">
                    {getRationale(selectedLeveragePoint, loopType)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h6 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Government Lever Domains
                  </h6>
                  <div className="space-y-1">
                    {getConnectedLevers(selectedLeveragePoint).map((lever) => (
                      <div key={lever.id} className="flex items-center gap-2 text-sm">
                        {lever.icon}
                        <span>{lever.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {lever.domain}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};