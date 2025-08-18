import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Wrench, 
  Target, 
  BookOpen,
  CheckCircle,
  Circle
} from 'lucide-react';

const MEADOWS_LEVERS = [
  { id: 'LP1', label: 'Constants, parameters, numbers, subsidies', description: 'Least effective leverage point' },
  { id: 'LP2', label: 'Material stocks and flows', description: 'Regulating material flows' },
  { id: 'LP3', label: 'Regulating negative feedback loops', description: 'Self-correcting rules' },
  { id: 'LP4', label: 'Self-organization', description: 'Power to add, change, evolve, or self-organize structure' },
  { id: 'LP5', label: 'Goals', description: 'Purpose or function of the system' },
  { id: 'LP6', label: 'Paradigms or mindsets', description: 'Shared ideas and assumptions' },
  { id: 'LP7', label: 'Transcending paradigms', description: 'Not being attached to any particular paradigm' },
  { id: 'LP8', label: 'Information flows', description: 'Who has access to what information' },
  { id: 'LP9', label: 'Rules', description: 'Incentives, punishments, constraints' },
  { id: 'LP10', label: 'Distribution of power', description: 'Who gets to make the rules' },
  { id: 'LP11', label: 'Feedback delays', description: 'Length of time between cause and effect' },
  { id: 'LP12', label: 'Structure', description: 'Physical structure of the system' }
];

const INSTRUMENT_FAMILIES = [
  {
    id: 'communicative',
    label: 'Communicative & Normative',
    description: 'Information, persuasion, social norms',
    examples: ['Public campaigns', 'Education', 'Social marketing', 'Transparency']
  },
  {
    id: 'administrative',
    label: 'Administrative & Executive',
    description: 'Direct government action and management',
    examples: ['Public services', 'Administrative decisions', 'Procurement', 'Licensing']
  },
  {
    id: 'economic',
    label: 'Economic & Fiscal',
    description: 'Financial incentives and disincentives',
    examples: ['Taxes', 'Subsidies', 'Grants', 'Market mechanisms']
  },
  {
    id: 'legal',
    label: 'Legal & Regulatory',
    description: 'Laws, regulations, and enforcement',
    examples: ['Legislation', 'Regulations', 'Standards', 'Enforcement']
  },
  {
    id: 'participatory',
    label: 'Participatory & Collaborative',
    description: 'Engaging stakeholders in decision-making',
    examples: ['Consultation', 'Co-creation', 'Citizen panels', 'Partnerships']
  },
  {
    id: 'hybrid',
    label: 'Hybrid & Innovative',
    description: 'Novel combinations and experimental approaches',
    examples: ['Policy labs', 'Sandboxes', 'Pilots', 'Cross-sector partnerships']
  }
];

interface LeversInstrumentsEditorProps {
  meadowsLevers: string[];
  instrumentFamilies: string[];
  onMeadowsChange: (levers: string[]) => void;
  onInstrumentsChange: (families: string[]) => void;
  readonly?: boolean;
}

export const LeversInstrumentsEditor: React.FC<LeversInstrumentsEditorProps> = ({
  meadowsLevers,
  instrumentFamilies,
  onMeadowsChange,
  onInstrumentsChange,
  readonly = false
}) => {
  const [rationale, setRationale] = useState('');
  const [selectedTab, setSelectedTab] = useState<'meadows' | 'instruments'>('meadows');

  // Handle Meadows lever selection
  const handleMeadowsToggle = useCallback((leverId: string) => {
    if (readonly) return;
    
    const newLevers = meadowsLevers.includes(leverId)
      ? meadowsLevers.filter(id => id !== leverId)
      : [...meadowsLevers, leverId];
    
    onMeadowsChange(newLevers);
  }, [meadowsLevers, onMeadowsChange, readonly]);

  // Handle instrument family selection
  const handleInstrumentToggle = useCallback((familyId: string) => {
    if (readonly) return;
    
    const newFamilies = instrumentFamilies.includes(familyId)
      ? instrumentFamilies.filter(id => id !== familyId)
      : [...instrumentFamilies, familyId];
    
    onInstrumentsChange(newFamilies);
  }, [instrumentFamilies, onInstrumentsChange, readonly]);

  // Get effectiveness score based on selected levers
  const getEffectivenessScore = useCallback(() => {
    if (meadowsLevers.length === 0) return 0;
    
    const leverScores = meadowsLevers.map(leverId => {
      const leverNumber = parseInt(leverId.replace('LP', ''));
      return 13 - leverNumber; // Higher number = more effective (LP12 = 1, LP1 = 12)
    });
    
    return Math.round(leverScores.reduce((sum, score) => sum + score, 0) / leverScores.length);
  }, [meadowsLevers]);

  const effectivenessScore = getEffectivenessScore();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Wrench className="h-4 w-4" />
          <h3 className="font-semibold">Levers & Instruments</h3>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div>{meadowsLevers.length} levers selected</div>
          <div>{instrumentFamilies.length} instrument families</div>
          {effectivenessScore > 0 && (
            <Badge variant="outline" className="text-xs">
              Effectiveness: {effectivenessScore}/12
            </Badge>
          )}
        </div>
      </div>

      {/* Tab Selection */}
      <div className="border-b border-border">
        <div className="flex">
          <Button
            variant={selectedTab === 'meadows' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTab('meadows')}
            className="rounded-none flex-1"
          >
            <Target className="h-3 w-3 mr-2" />
            Meadows Levers
          </Button>
          <Button
            variant={selectedTab === 'instruments' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTab('instruments')}
            className="rounded-none flex-1"
          >
            <BookOpen className="h-3 w-3 mr-2" />
            Instrument Families
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedTab === 'meadows' && (
          <div className="p-4 space-y-4">
            {/* Effectiveness Indicator */}
            {meadowsLevers.length > 0 && (
              <Card className="p-3 bg-blue-50/50 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm text-blue-900">Leverage Assessment</span>
                </div>
                <div className="text-xs text-blue-700">
                  Selected levers provide an effectiveness score of {effectivenessScore}/12.
                  Higher numbers indicate more fundamental leverage points.
                </div>
              </Card>
            )}

            {/* Meadows Levers List */}
            <div className="space-y-2">
              {MEADOWS_LEVERS.map((lever, index) => {
                const isSelected = meadowsLevers.includes(lever.id);
                const leverNumber = parseInt(lever.id.replace('LP', ''));
                const effectiveness = 13 - leverNumber;
                
                return (
                  <motion.div
                    key={lever.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? 'ring-2 ring-ring bg-accent/50' 
                          : 'hover:bg-accent/20'
                      } ${readonly ? 'cursor-default' : ''}`}
                      onClick={() => handleMeadowsToggle(lever.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2 mt-0.5">
                            {isSelected ? (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                effectiveness > 8 ? 'bg-green-50 text-green-700 border-green-200' :
                                effectiveness > 5 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-red-50 text-red-700 border-red-200'
                              }`}
                            >
                              {lever.id}
                            </Badge>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm mb-1">
                              {lever.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {lever.description}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs font-medium text-muted-foreground">
                              Level {effectiveness}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {selectedTab === 'instruments' && (
          <div className="p-4 space-y-4">
            {/* Instrument Families */}
            <div className="space-y-3">
              {INSTRUMENT_FAMILIES.map((family, index) => {
                const isSelected = instrumentFamilies.includes(family.id);
                
                return (
                  <motion.div
                    key={family.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? 'ring-2 ring-ring bg-accent/50' 
                          : 'hover:bg-accent/20'
                      } ${readonly ? 'cursor-default' : ''}`}
                      onClick={() => handleInstrumentToggle(family.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {isSelected ? (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="font-medium text-sm">
                              {family.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {family.description}
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {family.examples.slice(0, 3).map(example => (
                                <Badge 
                                  key={example} 
                                  variant="secondary" 
                                  className="text-xs"
                                >
                                  {example}
                                </Badge>
                              ))}
                              {family.examples.length > 3 && (
                                <Badge variant="secondary" className="text-xs text-muted-foreground">
                                  +{family.examples.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Rationale Section */}
            {!readonly && instrumentFamilies.length > 0 && (
              <div className="space-y-3">
                <Separator />
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Implementation Rationale
                  </label>
                  <Textarea
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    placeholder="Explain why these instrument families were selected and how they complement each other..."
                    className="min-h-[80px] text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Summary */}
      <div className="border-t border-border p-3 bg-accent/10">
        <div className="text-xs text-muted-foreground space-y-1">
          <div>
            <strong>Selected:</strong> {meadowsLevers.length} leverage points, {instrumentFamilies.length} instrument families
          </div>
          {effectivenessScore > 0 && (
            <div>
              <strong>Effectiveness:</strong> {effectivenessScore}/12 - {
                effectivenessScore > 8 ? 'High leverage potential' :
                effectivenessScore > 5 ? 'Moderate leverage potential' :
                'Lower leverage potential'
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};