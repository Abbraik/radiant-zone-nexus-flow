import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Play, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  X, 
  ExternalLink,
  ChevronRight,
  Brain,
  Users,
  Gauge
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'tutorial' | 'article' | 'video' | 'exercise';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'systems-thinking' | 'leverage-points' | 'causal-loops' | 'deband' | 'srt';
  url?: string;
  content?: string;
}

interface LearningAidSystemProps {
  currentContext?: string;
  userExpertiseLevel?: 'beginner' | 'intermediate' | 'advanced';
  onClose?: () => void;
  embedded?: boolean;
}

const learningResources: LearningResource[] = [
  {
    id: 'loop-archetypes-101',
    title: 'Understanding Loop Archetypes',
    description: 'Learn the fundamental patterns that govern system behavior',
    type: 'tutorial',
    duration: '8 min',
    difficulty: 'beginner',
    category: 'causal-loops',
    content: `
# Understanding Loop Archetypes

Loop archetypes are recurring patterns of behavior in complex systems. Each archetype represents a specific type of dynamic that can help predict system behavior and identify intervention points.

## The Five Core Archetypes:

### 1. Limits to Growth
When growth approaches resource constraints, creating balancing pressure.
- **Pattern**: Exponential growth → Resource limits → Growth slowdown
- **Example**: Population growth hitting carrying capacity
- **Intervention**: Invest in resource efficiency or alternative resources

### 2. Fixes that Fail
Quick fixes that create unintended consequences, worsening the original problem.
- **Pattern**: Problem → Quick fix → Temporary relief → Worse problem
- **Example**: Taking on debt to solve cash flow, creating larger debt burden
- **Intervention**: Build fundamental capabilities instead of quick fixes

### 3. Tragedy of Commons
Individual rational behavior leads to collective irrationality.
- **Pattern**: Individual use → Total use increases → Resource degrades → Individual benefits decrease
- **Example**: Overfishing in shared waters
- **Intervention**: Create governance structures for shared resources

### 4. Success to Successful
Success attracts more resources, creating further success.
- **Pattern**: Performance → Resources → Capability → Better performance
- **Example**: Well-funded schools attracting better teachers and students
- **Intervention**: Redistribute resources to underperforming areas

### 5. Growth and Underinvestment
Growth creates capacity demands that are met with underinvestment.
- **Pattern**: Demand growth → Capacity strain → Lower standards → Reduced investment
- **Example**: Infrastructure underinvestment during economic growth
- **Intervention**: Invest proactively in capacity building

## Key Insights:
- Each archetype has predictable intervention points
- Understanding the pattern helps predict future behavior
- Different archetypes require different intervention strategies
    `
  },
  {
    id: 'deband-significance',
    title: 'DE-Band Configuration & Significance',
    description: 'Master the art of setting detection and early-warning bands',
    type: 'tutorial',
    duration: '6 min',
    difficulty: 'intermediate',
    category: 'deband',
    content: `
# DE-Band Configuration & Significance

DE-Bands (Detection and Early-warning Bands) are critical thresholds that help detect when a system is moving outside acceptable operating parameters.

## What are DE-Bands?

DE-Bands define the "safe operating space" for key system variables. When values move outside these bands, it triggers alerts and potential interventions.

## Key Components:

### 1. Lower Bound
- The minimum acceptable value for the variable
- Going below this indicates system underperformance
- Often relates to basic functionality or safety thresholds

### 2. Upper Bound  
- The maximum acceptable value for the variable
- Exceeding this may indicate system stress or unsustainability
- Often relates to resource limits or capacity constraints

### 3. Breach Frequency
- How often the system operates outside the bands
- High breach frequency indicates volatile or unstable system
- Used to assess system resilience and predict future behavior

## Setting Effective DE-Bands:

### Historical Analysis
- Review past performance to understand normal variation
- Identify periods of crisis or exceptional performance
- Use this data to set realistic but challenging bounds

### Risk Assessment
- Consider consequences of breaching each bound
- Tighter bands provide earlier warning but more false alarms
- Looser bands reduce false alarms but may miss critical changes

### Stakeholder Input
- Involve subject matter experts in setting bounds
- Consider political and social acceptability of thresholds
- Ensure bounds align with policy objectives

## Common Mistakes:
- Setting bands too tight (constant false alarms)
- Setting bands too loose (missing critical changes)
- Not updating bands as system conditions change
- Ignoring the relationship between different variables

## Best Practices:
- Start with wider bands and tighten based on experience
- Regular review and adjustment of band settings
- Consider seasonal or cyclical patterns in data
- Document rationale for band selection
    `
  },
  {
    id: 'leverage-points-theory',
    title: 'Meadows\' Leverage Points Theory',
    description: 'Deep dive into the 12 leverage points for system intervention',
    type: 'article',
    duration: '12 min',
    difficulty: 'advanced',
    category: 'leverage-points',
    content: `
# Meadows' 12 Leverage Points

Donella Meadows identified 12 leverage points where small changes can produce big impacts in complex systems, ranked from least to most effective.

## The 12 Points (from least to most effective):

### 12. Constants, parameters, numbers, subsidies
- **Impact**: Low
- **Example**: Interest rates, minimum wages, tax rates
- **Why Low**: Changes the symptoms but not the structure

### 11. Material stocks and flows
- **Impact**: Low-Medium  
- **Example**: Road widths, factory sizes
- **Why Limited**: Physical constraints are often the least flexible

### 10. Regulating negative feedback loops
- **Impact**: Medium
- **Example**: Performance standards, regulations
- **Why Important**: Keeps system within bounds

### 9. Driving positive feedback loops
- **Impact**: Medium
- **Example**: Population growth, economic growth
- **Why Powerful**: Can create virtuous or vicious cycles

### 8. Information flows
- **Impact**: Medium-High
- **Example**: Transparency, reporting requirements
- **Why Effective**: Information changes behavior

### 7. Rules of the system
- **Impact**: High
- **Example**: Constitutions, policies, protocols
- **Why Powerful**: Define the scope and boundaries

### 6. Power to add, change, evolve or self-organize system structure
- **Impact**: High
- **Example**: Democracy, distributed vs. centralized power
- **Why Critical**: Changes who makes the rules

### 5. Goals of the system
- **Impact**: Very High
- **Example**: Profit vs. sustainability, competition vs. cooperation
- **Why Transformative**: Changes the purpose and direction

### 4. Paradigms or mindsets
- **Impact**: Highest
- **Example**: Worldviews, ideologies, cultural beliefs
- **Why Ultimate**: The source of systems

## Government Lever Connections:

### Regulatory & Legal (Points 7, 10)
- Rules and feedback loops
- Constitutional and legal frameworks

### Economic & Financial (Points 12, 11, 9)
- Parameters, flows, and growth loops
- Market mechanisms and incentives

### Communicative & Normative (Points 8, 4)
- Information flows and paradigm shifts
- Cultural change and norm setting

### Organizational & Structural (Points 6, 7)
- Power distribution and system rules
- Institutional design

### Collaborative & Partnership (Points 6, 5)
- Shared power and aligned goals
- Multi-stakeholder governance

### Technological & Digital (Points 8, 11)
- Information systems and digital flows
- Platform and infrastructure design

## Intervention Strategy:
1. **Start High**: Always consider higher-leverage interventions first
2. **Work Down**: If high-leverage isn't feasible, work down the list
3. **Combine**: Often most effective to combine multiple leverage points
4. **Be Patient**: Higher leverage points take longer to show results
    `
  },
  {
    id: 'srt-horizon-guide',
    title: 'Strategic Response Time Horizons',
    description: 'Choose the right time horizon for maximum intervention impact',
    type: 'tutorial',
    duration: '5 min',
    difficulty: 'intermediate',
    category: 'srt',
    content: `
# Strategic Response Time (SRT) Horizons

The SRT horizon determines how quickly you expect to see results from your interventions and influences which strategies are feasible.

## The Four Standard Horizons:

### 3 Months (Short-term Tactical)
**Best for:**
- Crisis response and immediate fixes
- Quick wins and visible improvements
- Pilot programs and proof-of-concepts

**Limitations:**
- Limited structural change possible
- May create "fixes that fail" dynamics
- Pressure for visible results may compromise quality

**Examples:**
- Emergency response protocols
- Short-term incentive programs
- Rapid deployment initiatives

### 6 Months (Medium-term Strategic) ⭐ **Recommended**
**Best for:**
- Balanced approach to change
- Building capabilities while showing progress
- Sustainable intervention development

**Advantages:**
- Enough time for meaningful change
- Maintains stakeholder engagement
- Allows for iteration and learning

**Examples:**
- Policy implementation with feedback loops
- Organizational restructuring
- Training and capability building

### 12 Months (Long-term Systemic)
**Best for:**
- Deep structural transformations
- Cultural and behavioral change
- Complex multi-stakeholder initiatives

**Considerations:**
- Requires sustained commitment
- May lose political support over time
- Higher risk of external disruption

**Examples:**
- Institutional reform
- Large-scale infrastructure projects
- Cultural transformation programs

### 24 Months (Multi-year Paradigm Shift)
**Best for:**
- Fundamental system redesign
- Generational change initiatives
- Cross-sector transformation

**Challenges:**
- Very high complexity
- Political cycle misalignment
- Measurement and attribution difficulties

**Examples:**
- Educational system reform
- Climate transition programs
- Democratic institution building

## Choosing Your SRT Horizon:

### Consider These Factors:

**Political Context**
- Election cycles and leadership stability
- Public patience and expectation management
- Coalition sustainability

**System Complexity**
- Number of stakeholders involved
- Interdependencies and feedback loops
- Historical change velocity

**Resource Availability**
- Funding sustainability
- Human capital and expertise
- Infrastructure and technology readiness

**Change Readiness**
- Stakeholder buy-in and resistance levels
- Previous change experiences
- Current crisis or opportunity windows

## SRT Best Practices:

1. **Match Horizon to Leverage Point**
   - Higher leverage points need longer horizons
   - Quick wins should use lower leverage points

2. **Build in Milestones**
   - Create intermediate success markers
   - Maintain momentum and support

3. **Plan for Extension**
   - Assume longer horizons may be needed
   - Build capability for sustained effort

4. **Communicate Expectations**
   - Set realistic timeline expectations
   - Explain why certain changes take time
    `
  }
];

const contextualRecommendations = {
  'loop-selection': ['loop-archetypes-101'],
  'parameter-config': ['deband-significance', 'srt-horizon-guide'],
  'leverage-mapping': ['leverage-points-theory'],
  'vision-capture': ['leverage-points-theory', 'srt-horizon-guide']
};

export const LearningAidSystem: React.FC<LearningAidSystemProps> = ({
  currentContext,
  userExpertiseLevel = 'intermediate',
  onClose,
  embedded = false
}) => {
  const [selectedResource, setSelectedResource] = useState<LearningResource | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get contextual recommendations
  const recommendedResources = currentContext 
    ? contextualRecommendations[currentContext as keyof typeof contextualRecommendations] || []
    : [];

  // Filter resources based on category and expertise level
  const filteredResources = learningResources.filter(resource => {
    const categoryMatch = selectedCategory === 'all' || resource.category === selectedCategory;
    const levelMatch = userExpertiseLevel === 'advanced' || 
                      (userExpertiseLevel === 'intermediate' && resource.difficulty !== 'advanced') ||
                      (userExpertiseLevel === 'beginner' && resource.difficulty === 'beginner');
    return categoryMatch && levelMatch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tutorial': return <Play className="h-4 w-4" />;
      case 'article': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Play className="h-4 w-4" />;
      case 'exercise': return <Target className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-600';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-600';
      case 'advanced': return 'bg-red-500/10 text-red-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const categories = [
    { id: 'all', label: 'All Topics', icon: <Brain className="h-3 w-3" /> },
    { id: 'causal-loops', label: 'Causal Loops', icon: <TrendingUp className="h-3 w-3" /> },
    { id: 'leverage-points', label: 'Leverage Points', icon: <Target className="h-3 w-3" /> },
    { id: 'deband', label: 'DE-Bands', icon: <Gauge className="h-3 w-3" /> },
    { id: 'srt', label: 'SRT Horizons', icon: <Users className="h-3 w-3" /> },
    { id: 'systems-thinking', label: 'Systems Thinking', icon: <Brain className="h-3 w-3" /> }
  ];

  if (embedded) {
    return (
      <div className="space-y-4">
        {/* Quick Tips for Current Context */}
        {recommendedResources.length > 0 && (
          <Card className="p-4 bg-blue-500/5 border-blue-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-800">Learning Suggestions</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Based on your current step, these resources might be helpful:
                </p>
                <div className="mt-2 space-y-1">
                  {recommendedResources.map((resourceId) => {
                    const resource = learningResources.find(r => r.id === resourceId);
                    if (!resource) return null;
                    
                    return (
                      <Button
                        key={resource.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedResource(resource)}
                        className="justify-start h-auto p-2 text-blue-700 hover:bg-blue-500/10"
                      >
                        {getTypeIcon(resource.type)}
                        <span className="ml-2 text-sm">{resource.title}</span>
                        <ChevronRight className="h-3 w-3 ml-auto" />
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Access Button */}
        <Button
          variant="outline"
          onClick={() => setShowTutorial(true)}
          className="w-full"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Access Learning Hub
        </Button>

        {/* Full Learning Dialog */}
        <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Learning Hub</DialogTitle>
            </DialogHeader>
            <LearningAidSystem 
              currentContext={currentContext}
              userExpertiseLevel={userExpertiseLevel}
              embedded={false}
            />
          </DialogContent>
        </Dialog>

        {/* Resource Detail Dialog */}
        <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            {selectedResource && (
              <div className="space-y-4">
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    {getTypeIcon(selectedResource.type)}
                    <DialogTitle>{selectedResource.title}</DialogTitle>
                    <Badge className={getDifficultyColor(selectedResource.difficulty)}>
                      {selectedResource.difficulty}
                    </Badge>
                  </div>
                </DialogHeader>
                
                <div className="prose prose-sm max-w-none">
                  {selectedResource.content ? (
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {selectedResource.content}
                    </pre>
                  ) : (
                    <p>{selectedResource.description}</p>
                  )}
                </div>

                {selectedResource.url && (
                  <Button onClick={() => window.open(selectedResource.url, '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open External Resource
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Learning Hub</h3>
          <p className="text-sm text-muted-foreground">
            Contextual tutorials and resources to deepen your systems thinking
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="whitespace-nowrap"
          >
            {category.icon}
            <span className="ml-1">{category.label}</span>
          </Button>
        ))}
      </div>

      {/* Recommended Resources */}
      {recommendedResources.length > 0 && selectedCategory === 'all' && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Recommended for You</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendedResources.map((resourceId) => {
              const resource = learningResources.find(r => r.id === resourceId);
              if (!resource) return null;
              
              return (
                <motion.div
                  key={resource.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="p-4 cursor-pointer hover:border-primary/50 transition-colors border-primary/20 bg-primary/5"
                    onClick={() => setSelectedResource(resource)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(resource.type)}
                          <Badge variant="outline" className="text-xs bg-primary/10">
                            Recommended
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{resource.duration}</span>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm">{resource.title}</h5>
                        <p className="text-xs text-muted-foreground mt-1">
                          {resource.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge className={getDifficultyColor(resource.difficulty)}>
                          {resource.difficulty}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Resources */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">
          {selectedCategory === 'all' ? 'All Resources' : categories.find(c => c.id === selectedCategory)?.label}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredResources.map((resource) => (
            <motion.div
              key={resource.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="p-4 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setSelectedResource(resource)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(resource.type)}
                      <span className="text-xs capitalize text-muted-foreground">
                        {resource.type}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{resource.duration}</span>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm">{resource.title}</h5>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {resource.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(resource.difficulty)}>
                      {resource.difficulty}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Resource Detail Dialog */}
      <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedResource && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  {getTypeIcon(selectedResource.type)}
                  <DialogTitle>{selectedResource.title}</DialogTitle>
                  <Badge className={getDifficultyColor(selectedResource.difficulty)}>
                    {selectedResource.difficulty}
                  </Badge>
                </div>
              </DialogHeader>
              
              <div className="prose prose-sm max-w-none">
                {selectedResource.content ? (
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {selectedResource.content}
                  </pre>
                ) : (
                  <p>{selectedResource.description}</p>
                )}
              </div>

              {selectedResource.url && (
                <Button onClick={() => window.open(selectedResource.url, '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open External Resource
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};