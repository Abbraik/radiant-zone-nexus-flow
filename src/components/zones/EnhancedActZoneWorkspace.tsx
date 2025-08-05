import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  GripVertical, 
  Edit, 
  ChevronDown, 
  X,
  Check,
  Play,
  Users,
  Settings,
  Calendar,
  Shield,
  Target,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Network,
  ClipboardCheck
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import SequentialProgressBar from '../widgets/SequentialProgressBar';
import { toast } from '../../hooks/use-toast';
import { EnhancedRACIMatrixEditor } from '../widgets/EnhancedRACIMatrixEditor';

// Mock interventions for population & development
const populationInterventions = [
  {
    id: 'pop-1',
    name: 'Family Planning Programs',
    description: 'Comprehensive reproductive health education and services',
    icon: '👨‍👩‍👧‍👦',
    category: 'Population',
    effort: 'High',
    impact: 'High',
    resourceCost: 85,
    kpiImpact: 70
  },
  {
    id: 'pop-2',
    name: 'Education Access Initiative',
    description: 'Expand access to quality education, especially for girls',
    icon: '🎓',
    category: 'Development',
    effort: 'High',
    impact: 'Very High',
    resourceCost: 90,
    kpiImpact: 85
  },
  {
    id: 'pop-3',
    name: 'Healthcare Infrastructure',
    description: 'Build and improve maternal and child health facilities',
    icon: '🏥',
    category: 'Development',
    effort: 'Very High',
    impact: 'High',
    resourceCost: 95,
    kpiImpact: 75
  },
  {
    id: 'pop-4',
    name: 'Economic Empowerment',
    description: 'Job creation and microfinance programs',
    icon: '💼',
    category: 'Development',
    effort: 'Medium',
    impact: 'Medium',
    resourceCost: 60,
    kpiImpact: 55
  },
  {
    id: 'pop-5',
    name: 'Urban Planning Reform',
    description: 'Sustainable city development and housing policies',
    icon: '🏙️',
    category: 'Development',
    effort: 'High',
    impact: 'Medium',
    resourceCost: 80,
    kpiImpact: 60
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
    kpiImpact: 65
  }
];

const mockRoles = [
  {
    id: 'role-1',
    name: 'Dr. Sarah Chen',
    title: 'Champion',
    avatar: '👩‍⚕️',
    color: 'bg-teal-500',
    role: 'Responsible'
  },
  {
    id: 'role-2',
    name: 'Prof. Ahmed Hassan',
    title: 'Analyst',
    avatar: '👨‍🎓',
    color: 'bg-purple-500',
    role: 'Accountable'
  },
  {
    id: 'role-3',
    name: 'Maria Santos',
    title: 'Custodian',
    avatar: '👩‍💼',
    color: 'bg-blue-500',
    role: 'Consulted'
  }
];

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
}

interface BundleItem {
  id: string;
  intervention: Intervention;
  order: number;
  dependencies?: string[];
}

interface Dependency {
  from: string;
  to: string;
  type: 'soft' | 'hard';
}

// Sortable Intervention Card Component
const SortableInterventionCard: React.FC<{ 
  item: BundleItem;
  onRemove: (id: string) => void;
  onAddDependency: (fromId: string) => void;
  dependencies: Dependency[];
}> = ({ item, onRemove, onAddDependency, dependencies }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const itemDependencies = dependencies.filter(d => d.from === item.id || d.to === item.id);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      layout
      className={`
        bg-white/10 rounded-lg p-4 flex flex-col cursor-move
        border border-white/20 hover:bg-white/15 transition-all duration-200
        ${isDragging ? 'scale-105 shadow-xl z-50' : ''}
      `}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <span className="text-2xl">{item.intervention.icon}</span>
          <div className="flex-1">
            <div className="text-white font-medium">{item.intervention.name}</div>
            <div className="text-gray-400 text-sm">{item.intervention.description}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {item.intervention.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {item.intervention.effort} effort
              </Badge>
              <Badge variant="outline" className="text-xs">
                {item.intervention.impact} impact
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAddDependency(item.id)}
            className="p-1 hover:bg-blue-500/20 rounded text-gray-400 hover:text-blue-400 transition-colors"
            title="Add dependency"
          >
            <Network className="w-4 h-4" />
          </button>
          <button
            {...listeners}
            className="p-1 hover:bg-white/20 rounded text-gray-400 hover:text-white transition-colors"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Impact Preview */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>
          <div className="text-xs text-gray-400 mb-1">Resource Cost</div>
          <div className="flex items-center space-x-2">
            <Progress value={item.intervention.resourceCost} className="h-2 flex-1" />
            <span className="text-xs text-white">{item.intervention.resourceCost}%</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">KPI Impact</div>
          <div className="flex items-center space-x-2">
            <Progress value={item.intervention.kpiImpact} className="h-2 flex-1" />
            <span className="text-xs text-white">{item.intervention.kpiImpact}%</span>
          </div>
        </div>
      </div>

      {/* Dependencies indicator */}
      {itemDependencies.length > 0 && (
        <div className="mt-2 text-xs text-blue-400">
          {itemDependencies.length} dependencies
        </div>
      )}
    </motion.div>
  );
};

// Act Task Context Component
const ActTaskPopup: React.FC<{
  onComplete: () => void;
}> = ({ onComplete }) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-teal-500/10 to-blue-600/10 border-teal-500/30">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Target className="h-6 w-6 text-teal-400" />
          <h3 className="text-xl font-semibold text-white">Bundle Task Context</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-teal-300 mb-2">From Think Zone</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div>• Tension Signal: Population Growth Rate</div>
              <div>• DE-Band: 65-85% optimal range</div>
              <div>• SRT Horizon: 18 months</div>
              <div>• Leverage Point: Education & Healthcare</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-teal-300 mb-2">Goal Progress</h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Balance Population & Development</span>
                  <span className="text-white">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onComplete} className="bg-teal-500 hover:bg-teal-600">
            Start Bundle Assembly
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Impact Simulator Widget
const ImpactSimulatorWidget: React.FC<{
  bundleItems: BundleItem[];
}> = ({ bundleItems }) => {
  const totalResourceCost = bundleItems.reduce((sum, item) => sum + item.intervention.resourceCost, 0) / bundleItems.length || 0;
  const totalKpiImpact = bundleItems.reduce((sum, item) => sum + item.intervention.kpiImpact, 0) / bundleItems.length || 0;

  return (
    <Card className="p-4 bg-white/5 border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-purple-400" />
        <h4 className="text-white font-medium">Impact Simulation</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-xs text-gray-400">Average Resource Cost</div>
          <div className="text-2xl font-bold text-red-400">{Math.round(totalResourceCost)}%</div>
          <Progress value={totalResourceCost} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="text-xs text-gray-400">Average KPI Impact</div>
          <div className="text-2xl font-bold text-green-400">{Math.round(totalKpiImpact)}%</div>
          <Progress value={totalKpiImpact} className="h-2" />
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Efficiency Ratio: {bundleItems.length > 0 ? ((totalKpiImpact / totalResourceCost) * 100).toFixed(1) : 0}%
      </div>
    </Card>
  );
};

// Dependency Configurator
const DependencyConfigurator: React.FC<{
  bundleItems: BundleItem[];
  dependencies: Dependency[];
  onAddDependency: (from: string, to: string, type: 'soft' | 'hard') => void;
  onRemoveDependency: (from: string, to: string) => void;
}> = ({ bundleItems, dependencies, onAddDependency, onRemoveDependency }) => {
  const [selectedFrom, setSelectedFrom] = useState<string>('');
  const [selectedTo, setSelectedTo] = useState<string>('');
  const [dependencyType, setDependencyType] = useState<'soft' | 'hard'>('soft');

  const handleAddDependency = () => {
    if (selectedFrom && selectedTo && selectedFrom !== selectedTo) {
      onAddDependency(selectedFrom, selectedTo, dependencyType);
      setSelectedFrom('');
      setSelectedTo('');
    }
  };

  return (
    <Card className="p-4 bg-white/5 border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Network className="h-5 w-5 text-blue-400" />
        <h4 className="text-white font-medium">Configure Dependencies</h4>
      </div>
      
      <div className="space-y-4">
        {bundleItems.length >= 2 ? (
          <div className="grid grid-cols-2 gap-2">
            <select 
              value={selectedFrom}
              onChange={(e) => setSelectedFrom(e.target.value)}
              className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
            >
              <option value="">Select prerequisite</option>
              {bundleItems.map(item => (
                <option key={item.id} value={item.id}>{item.intervention.name}</option>
              ))}
            </select>
            
            <select 
              value={selectedTo}
              onChange={(e) => setSelectedTo(e.target.value)}
              className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
            >
              <option value="">Select dependent</option>
              {bundleItems.filter(item => item.id !== selectedFrom).map(item => (
                <option key={item.id} value={item.id}>{item.intervention.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="text-sm text-gray-400 text-center py-4">
            Add at least 2 interventions to configure dependencies
          </div>
        )}

        {selectedFrom && selectedTo && (
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant={dependencyType === 'soft' ? 'default' : 'outline'}
              onClick={() => setDependencyType('soft')}
            >
              Soft
            </Button>
            <Button 
              size="sm" 
              variant={dependencyType === 'hard' ? 'default' : 'outline'}
              onClick={() => setDependencyType('hard')}
            >
              Hard
            </Button>
            <Button size="sm" onClick={handleAddDependency} className="ml-auto">
              Add Dependency
            </Button>
          </div>
        )}

        {dependencies.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-gray-400">Existing Dependencies:</div>
            {dependencies.map((dep, index) => {
              const fromItem = bundleItems.find(item => item.id === dep.from);
              const toItem = bundleItems.find(item => item.id === dep.to);
              return (
                <div key={index} className="flex items-center justify-between text-sm bg-white/5 rounded px-3 py-2">
                  <span className="text-white">
                    {fromItem?.intervention.name} → {toItem?.intervention.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant={dep.type === 'hard' ? 'destructive' : 'secondary'}>
                      {dep.type}
                    </Badge>
                    <button
                      onClick={() => onRemoveDependency(dep.from, dep.to)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

// Enhanced RACI Assignment Component - now just a wrapper for our enhanced editor

export const EnhancedActZoneWorkspace: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [sprintStartDate, setSprintStartDate] = useState('');
  const [sprintEndDate, setSprintEndDate] = useState('');
  const [selectedDependencyFrom, setSelectedDependencyFrom] = useState<string>('');
  const [raciAssignments, setRaciAssignments] = useState<any[]>([]); // Store RACI assignments

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Step configuration for Sprint Planning workflow
  const steps = [
    { id: 'bundle-review', title: 'Review Bundle Context', completed: currentStep > 1, active: currentStep === 1 },
    { id: 'sprint-substeps', title: 'Design Sprint Sub-Steps', completed: currentStep > 2, active: currentStep === 2 },
    { id: 'preview-impact', title: 'Preview Sprint Impact', completed: currentStep > 3, active: currentStep === 3 },
    { id: 'configure-dependencies', title: 'Configure Sub-Step Dependencies', completed: currentStep > 4, active: currentStep === 4 },
    { id: 'assign-roles', title: 'Assign Sprint Roles', completed: currentStep > 5, active: currentStep === 5 },
    { id: 'schedule-sprint', title: 'Schedule Sprint Timeline', completed: currentStep > 6, active: currentStep === 6 },
    { id: 'validate-compliance', title: 'Validate Sprint Compliance', completed: currentStep > 7, active: currentStep === 7 },
    { id: 'publish-sprint', title: 'Publish Sprint Plan', completed: currentStep > 8, active: currentStep === 8 },
  ];

  const filteredInterventions = populationInterventions.filter(
    intervention =>
      intervention.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intervention.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addIntervention = (intervention: Intervention) => {
    if (bundleItems.some(item => item.intervention.id === intervention.id)) {
      toast({
        title: "Already Added",
        description: "This intervention is already in your bundle.",
        variant: "destructive"
      });
      return;
    }

    const newItem: BundleItem = {
      id: `bundle-${intervention.id}`,
      intervention,
      order: bundleItems.length
    };

    setBundleItems(prev => [...prev, newItem]);
  };

  const removeIntervention = (id: string) => {
    setBundleItems(prev => prev.filter(item => item.id !== id));
    // Remove dependencies involving this item
    setDependencies(prev => prev.filter(dep => dep.from !== id && dep.to !== id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setBundleItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const addDependency = (from: string, to: string, type: 'soft' | 'hard') => {
    const exists = dependencies.some(dep => dep.from === from && dep.to === to);
    if (!exists) {
      setDependencies(prev => [...prev, { from, to, type }]);
    }
  };

  const removeDependency = (from: string, to: string) => {
    setDependencies(prev => prev.filter(dep => !(dep.from === from && dep.to === to)));
  };

  const handleNext = () => {
    if (canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle RACI assignments change
  const handleRaciAssignmentsChange = (assignments: any[]) => {
    setRaciAssignments(assignments);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return true; // Bundle review
      case 2: return bundleItems.length > 0; // Design sprint sub-steps
      case 3: return true; // Preview sprint impact
      case 4: return true; // Configure sub-step dependencies (optional)
      case 5: return raciAssignments.length > 0; // Assign sprint roles
      case 6: return sprintStartDate && sprintEndDate; // Schedule sprint timeline
      case 7: return true; // Validate sprint compliance
      case 8: return bundleItems.length > 0; // Publish sprint plan
      default: return false;
    }
  };

  const handleValidate = () => {
    toast({
      title: "Compliance Validated",
      description: "All interventions comply with population development policies.",
    });
  };

  const handlePublish = () => {
    toast({
      title: "Sprint Plan Published",
      description: `Successfully published sprint plan with ${bundleItems.length} sub-steps. Monitor tasks created.`,
    });
  };

  return (
    <motion.div
      className="w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Act Zone - Sprint Planning</h2>
          <p className="text-gray-300">Transform Bundle design into time-boxed execution sprints</p>
        </div>

        {/* Progress Bar */}
        <SequentialProgressBar steps={steps} className="mb-8" />

        {/* Sequential Content */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="bundle-review"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <ActTaskPopup onComplete={() => setCurrentStep(2)} />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="design-sprint-substeps"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Sprint Sub-Steps Library */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Sprint Sub-Steps Design</h3>
                    
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search sprint sub-steps..."
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {filteredInterventions.map((intervention) => (
                        <motion.div
                          key={intervention.id}
                          className="p-4 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer border border-white/10 hover:border-white/20 transition-all duration-200 group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <span className="text-2xl">{intervention.icon}</span>
                              <div className="flex-1">
                                <div className="text-white font-medium">{intervention.name}</div>
                                <div className="text-gray-400 text-sm">{intervention.description}</div>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {intervention.category}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {intervention.impact} impact
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <motion.button
                              onClick={() => addIntervention(intervention)}
                              className="bg-teal-500 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-teal-600"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Bundle Canvas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Bundle Canvas</h3>
                    
                    <div className="bg-white/5 rounded-xl p-4 min-h-96 border border-white/10">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={bundleItems.map(item => item.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-3">
                            {bundleItems.length === 0 ? (
                              <div className="text-center py-12 text-gray-400">
                                <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Add interventions to build your bundle</p>
                                <p className="text-sm mt-2">Drag interventions from the library</p>
                              </div>
                            ) : (
                              bundleItems.map((item) => (
                                <SortableInterventionCard
                                  key={item.id}
                                  item={item}
                                  onRemove={removeIntervention}
                                  onAddDependency={setSelectedDependencyFrom}
                                  dependencies={dependencies}
                                />
                              ))
                            )}
                          </div>
                        </SortableContext>

                        <DragOverlay>
                          {activeId ? (
                            <div className="bg-white/10 rounded-lg p-3 border border-white/20 shadow-xl">
                              {bundleItems.find(item => item.id === activeId)?.intervention.name}
                            </div>
                          ) : null}
                        </DragOverlay>
                      </DndContext>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="preview-impact"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <ImpactSimulatorWidget bundleItems={bundleItems} />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="configure-dependencies"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <DependencyConfigurator
                  bundleItems={bundleItems}
                  dependencies={dependencies}
                  onAddDependency={addDependency}
                  onRemoveDependency={removeDependency}
                />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="assign-roles"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <EnhancedRACIMatrixEditor
                  interventions={bundleItems.map(item => ({
                    id: item.intervention.id,
                    name: item.intervention.name,
                    category: item.intervention.category
                  }))}
                  onAssignmentsChange={handleRaciAssignmentsChange}
                />
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div
                key="schedule-sprint"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/5 border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="h-6 w-6 text-orange-400" />
                    <h3 className="text-xl font-semibold text-white">Schedule Sprint</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                      <Input
                        type="date"
                        value={sprintStartDate}
                        onChange={(e) => setSprintStartDate(e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                      <Input
                        type="date"
                        value={sprintEndDate}
                        onChange={(e) => setSprintEndDate(e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="text-sm text-blue-300">
                      💡 Recommended duration: 18 months based on SRT horizon from Think Zone
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {currentStep === 7 && (
              <motion.div
                key="validate-compliance"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/5 border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-6 w-6 text-green-400" />
                    <h3 className="text-xl font-semibold text-white">Validate Compliance</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="h-4 w-4 text-green-400" />
                          <span className="text-green-300 font-medium">Policy Alignment</span>
                        </div>
                        <div className="text-sm text-gray-300">All interventions align with population development framework</div>
                      </div>
                      
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="h-4 w-4 text-green-400" />
                          <span className="text-green-300 font-medium">Resource Constraints</span>
                        </div>
                        <div className="text-sm text-gray-300">Bundle fits within allocated budget limits</div>
                      </div>
                    </div>
                    
                    <Button onClick={handleValidate} className="w-full bg-green-600 hover:bg-green-700">
                      <ClipboardCheck className="w-4 h-4 mr-2" />
                      Run Compliance Check
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {currentStep === 8 && (
              <motion.div
                key="publish-bundle"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-gradient-to-br from-teal-500/10 to-blue-600/10 border-teal-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Play className="h-6 w-6 text-teal-400" />
                    <h3 className="text-xl font-semibold text-white">Publish Bundle</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Bundle Summary</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Interventions:</span>
                          <span className="text-white ml-2">{bundleItems.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Dependencies:</span>
                          <span className="text-white ml-2">{dependencies.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Duration:</span>
                          <span className="text-white ml-2">18 months</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Team Members:</span>
                          <span className="text-white ml-2">{mockRoles.length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handlePublish} 
                      className="w-full bg-teal-500 hover:bg-teal-600 text-lg py-6"
                      disabled={bundleItems.length === 0}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Publish Bundle & Create Monitor Tasks
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Bar */}
        <motion.div
          className="sticky bottom-0 flex items-center justify-between pt-6 border-t border-white/10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
          </div>

          <div className="text-sm text-gray-400">
            Step {currentStep} of {steps.length}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < steps.length && (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-teal-500 hover:bg-teal-600 disabled:opacity-50"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};