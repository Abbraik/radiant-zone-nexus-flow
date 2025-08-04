import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  GripVertical, 
  Calendar, 
  Edit, 
  ChevronDown, 
  X,
  Check,
  Play,
  Users,
  Settings,
  Sliders,
  GitBranch,
  FileText,
  Keyboard
} from 'lucide-react';
import LoopLeverageRecommendationPane from '../components/widgets/LoopLeverageRecommendationPane';
import SixLeverSelector from '../components/widgets/SixLeverSelector';
import MetaSolveDetailForm from '../components/widgets/MetaSolveDetailForm';
import EnhancedInterventionDetailEditor from '../components/widgets/EnhancedInterventionDetailEditor';
import AdvancedImpactSimulator from '../components/widgets/AdvancedImpactSimulator';
import EnhancedDependencyConfigurator from '../components/widgets/EnhancedDependencyConfigurator';
import BundleSummaryModal from '../components/widgets/BundleSummaryModal';
import LoadingStates from '../components/widgets/LoadingStates';
import useKeyboardNavigation, { ACT_ZONE_SHORTCUTS } from '../hooks/useKeyboardNavigation';
import { exportBundle } from '../utils/bundleExport';
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
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';

// Mock data
const availableInterventions = [
  {
    id: 'int-1',
    name: 'API Rate Limiting',
    description: 'Implement throttling for external API calls',
    icon: '🚦',
    category: 'Technology',
    effort: 'Medium',
    impact: 'High'
  },
  {
    id: 'int-2',
    name: 'Team Standup Restructure',
    description: 'Optimize daily sync format and timing',
    icon: '👥',
    category: 'Process',
    effort: 'Low',
    impact: 'Medium'
  },
  {
    id: 'int-3',
    name: 'Code Review Guidelines',
    description: 'Establish consistent review standards',
    icon: '📋',
    category: 'Governance',
    effort: 'Medium',
    impact: 'High'
  },
  {
    id: 'int-4',
    name: 'Performance Monitoring',
    description: 'Add real-time system health dashboards',
    icon: '📊',
    category: 'Technology',
    effort: 'High',
    impact: 'High'
  },
  {
    id: 'int-5',
    name: 'Customer Feedback Loop',
    description: 'Direct channel for user experience input',
    icon: '🔄',
    category: 'Process',
    effort: 'Medium',
    impact: 'High'
  }
];

const mockRoles = [
  {
    id: 'role-1',
    name: 'Alex Chen',
    title: 'Champion',
    avatar: '👨‍💻',
    color: 'bg-teal-500'
  },
  {
    id: 'role-2',
    name: 'Sarah Kim',
    title: 'Analyst',
    avatar: '👩‍💼',
    color: 'bg-purple-500'
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
}

import type { 
  EnhancedIntervention, 
  InterventionBundle,
  BundleDependency 
} from '../types/intervention';
import type { MetaSolveLayer } from '../types/metasolve';

interface BundleItem {
  id: string;
  intervention: Intervention;
  order: number;
}

// Sortable Intervention Card Component
const SortableInterventionCard: React.FC<{ 
  item: BundleItem;
  onRemove: (id: string) => void;
}> = ({ item, onRemove }) => {
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

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      layout
      className={`
        bg-white/10 rounded-lg p-3 flex items-center justify-between cursor-move
        border border-white/20 hover:bg-white/15 transition-all duration-200
        ${isDragging ? 'scale-105 shadow-xl' : ''}
      `}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center space-x-3">
        <span className="text-xl">{item.intervention.icon}</span>
        <div>
          <div className="text-white font-medium">{item.intervention.name}</div>
          <div className="text-gray-400 text-sm">{item.intervention.description}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="text-xs">
          {item.intervention.effort}
        </Badge>
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
    </motion.div>
  );
};

export const ActZone: React.FC = () => {
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showMetaSolveForm, setShowMetaSolveForm] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<EnhancedIntervention | null>(null);
  const [metaSolveConfig, setMetaSolveConfig] = useState<Partial<MetaSolveLayer> | null>(null);
  const [enhancedInterventions, setEnhancedInterventions] = useState<EnhancedIntervention[]>([]);
  const [dependencies, setDependencies] = useState<BundleDependency[]>([]);
  const [showDependencyManager, setShowDependencyManager] = useState(false);
  const [showBundleSummary, setShowBundleSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredInterventions = availableInterventions.filter(
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

  const handleValidate = () => {
    if (bundleItems.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one intervention to the bundle.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Bundle Validated",
      description: "All interventions are compatible and ready for publication.",
    });
  };

  const handlePublish = () => {
    if (bundleItems.length === 0) {
      return;
    }
    
    toast({
      title: "Bundle Published",
      description: `Successfully published bundle with ${bundleItems.length} interventions.`,
    });
  };

  return (
    <div className="h-full relative overflow-hidden">
      {/* Full-Bleed Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
        {/* Animated Network Mesh */}
        <div className="absolute inset-0 opacity-5">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-primary/30 blur-3xl"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-secondary/30 blur-3xl"
            animate={{ 
              x: [0, -60, 0],
              y: [0, 30, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 7 }}
          />
        </div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Hero Ribbon */}
        <motion.div
          className="w-full glass h-20 flex items-center justify-between px-8 shadow-elegant border-b border-border-subtle"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="flex items-center space-x-4">
            <span className="text-3xl">🍲</span>
            <span className="text-2xl font-semibold text-foreground">
              {bundleItems.length} interventions
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-foreground-subtle" />
            <span className="text-base text-foreground">Due in 6 weeks</span>
          </div>

          <div className="flex items-center space-x-3">
            {mockRoles.map((role) => (
              <div key={role.id} className="flex items-center space-x-2">
                <div className={`w-10 h-10 ${role.color} rounded-full flex items-center justify-center text-foreground font-medium`}>
                  {role.avatar}
                </div>
                <span className="text-sm text-foreground-subtle">{role.title}</span>
              </div>
            ))}
            <button className="w-10 h-10 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center hover:border-teal-400 transition-colors">
              <Plus className="w-4 h-4 text-foreground-subtle" />
            </button>
            <button className="text-accent underline text-sm hover:text-accent/80 transition-colors ml-2">
              Edit Roles
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="glass-secondary rounded-2xl border border-border-subtle shadow-2xl p-8"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Loop-Leverage-Lever Recommendation Pane */}
                <div className="lg:col-span-1">
                  <LoopLeverageRecommendationPane
                    loopContext={{
                      loopId: 'loop-001',
                      loopName: 'Innovation Adoption Feedback',
                      loopType: 'Reinforcing',
                      leveragePointRank: 6,
                      leveragePointName: 'Rules (incentives, punishments, constraints)',
                      deBandStatus: 'yellow',
                      recommendedLevers: ['economic-fiscal', 'legal-institutional', 'information-communications']
                    }}
                    onLeverRecommendationClick={(leverId) => {
                      console.log('Recommended lever clicked:', leverId);
                      // TODO: Filter Six Lever Selector by this lever
                    }}
                  />
                </div>

                {/* Six Lever Selector */}
                <div className="lg:col-span-2">
                  <SixLeverSelector
                    selectedSubLevers={[]}
                    onSubLeverSelect={(subLeverId) => {
                      console.log('Sub-lever selected:', subLeverId);
                      // TODO: Add to bundle
                    }}
                    onSubLeverDeselect={(subLeverId) => {
                      console.log('Sub-lever deselected:', subLeverId);
                      // TODO: Remove from bundle  
                    }}
                    loopType="Reinforcing"
                    leveragePointRank={6}
                    multiSelect={true}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Intervention Picker */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Add Interventions</h3>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search interventions..."
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-full focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredInterventions.map((intervention) => (
                      <motion.div
                        key={intervention.id}
                        className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer border border-white/10 hover:border-white/20 transition-all duration-200 group"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{intervention.icon}</span>
                            <div>
                              <div className="text-white font-medium">{intervention.name}</div>
                              <div className="text-gray-400 text-sm">{intervention.description}</div>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {intervention.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {intervention.effort} effort
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <motion.button
                            onClick={() => {
                              addIntervention(intervention);
                              // Convert to enhanced intervention
                              const enhancedIntervention: EnhancedIntervention = {
                                id: intervention.id,
                                name: intervention.name,
                                description: intervention.description,
                                icon: intervention.icon,
                                category: intervention.category,
                                selectedSubLevers: [],
                                subLeverConfigurations: [],
                                targetLoopVariables: [],
                                expectedLoopImpact: {
                                  loopId: 'loop-001',
                                  impactType: 'strengthen',
                                  targetVariables: [],
                                  expectedMagnitude: 5,
                                  confidenceLevel: 'medium',
                                  assumptions: []
                                },
                                parameters: [],
                                microTasks: [],
                                microLoops: [],
                                budget: {
                                  totalBudget: 0,
                                  currency: 'USD',
                                  lineItems: [],
                                  contingency: 0,
                                  contingencyPercent: 10,
                                  approvalStatus: 'draft'
                                },
                                resources: [],
                                automationRules: [],
                                effort: intervention.effort as 'Low' | 'Medium' | 'High',
                                impact: intervention.impact as 'Low' | 'Medium' | 'High',
                                complexity: 'Medium',
                                timeToImpact: 'Medium',
                                status: 'draft',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                createdBy: 'current-user',
                                lastModifiedBy: 'current-user'
                              };
                              setEnhancedInterventions(prev => [...prev, enhancedIntervention]);
                            }}
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
                  <h3 className="text-lg font-medium text-white">Bundle Preview</h3>
                  
                  <div className="bg-white/5 rounded-xl p-4 min-h-64 border border-white/10">
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
                              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                              <p>Add interventions to build your bundle</p>
                            </div>
                          ) : (
                            bundleItems.map((item) => (
                              <div key={item.id} className="flex items-center justify-between p-3 glass rounded-lg border border-border-subtle hover:bg-glass-accent/30 transition-colors">
                                <div className="flex items-center gap-3">
                                  <span className="text-xl">{item.intervention.icon}</span>
                                  <div>
                                    <div className="text-foreground font-medium">{item.intervention.name}</div>
                                    <div className="text-muted-foreground text-sm">{item.intervention.description}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const enhanced = enhancedInterventions.find(ei => ei.id === item.intervention.id);
                                      if (enhanced) setSelectedIntervention(enhanced);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeIntervention(item.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
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
              {/* Enhanced Dependency & Summary Management */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Dependency Management */}
                <motion.div
                  className="glass rounded-xl p-6 border border-border-subtle hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => setShowDependencyManager(true)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <GitBranch className="h-6 w-6 text-accent" />
                    <h4 className="font-medium text-foreground">Dependency Management</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure intervention dependencies and view Gantt timeline
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                        {dependencies.length} dependencies
                      </span>
                      <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded">
                        {dependencies.filter(d => d.criticalPath).length} critical
                      </span>
                    </div>
                    <span className="text-accent text-sm">Manage →</span>
                  </div>
                </motion.div>

                {/* Bundle Summary */}
                <motion.div
                  className="glass rounded-xl p-6 border border-border-subtle hover:border-success/30 transition-colors cursor-pointer"
                  onClick={() => setShowBundleSummary(true)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-6 w-6 text-success" />
                    <h4 className="font-medium text-foreground">Bundle Summary</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Review complete bundle and generate impact narrative
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-success/20 text-success px-2 py-1 rounded">
                        {enhancedInterventions.length} interventions
                      </span>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        Ready to publish
                      </span>
                    </div>
                    <span className="text-success text-sm">Review →</span>
                  </div>
                </motion.div>
              </div>

              {/* MetaSolve Configuration & Impact Simulation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* MetaSolve Detail Form Trigger */}
                <motion.div
                  className="glass rounded-xl p-6 border border-border-subtle hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => setShowMetaSolveForm(true)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Sliders className="h-6 w-6 text-primary" />
                    <h4 className="font-medium text-foreground">MetaSolve Configuration</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure institutional (Meso) and frontline (Micro) delivery layers
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {metaSolveConfig?.meso?.institutionalOwners?.length ? (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          {metaSolveConfig.meso.institutionalOwners.length} agencies
                        </span>
                      ) : null}
                      {metaSolveConfig?.micro?.frontlineUnits?.length ? (
                        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                          {metaSolveConfig.micro.frontlineUnits.length} units
                        </span>
                      ) : null}
                    </div>
                    <span className="text-primary text-sm">Configure →</span>
                  </div>
                </motion.div>

                {/* Advanced Impact Simulator */}
                <div className="lg:col-span-1">
                  <AdvancedImpactSimulator
                    interventions={enhancedInterventions}
                    loopContext={{
                      loopId: 'loop-001',
                      loopName: 'Innovation Adoption Feedback',
                      loopType: 'Reinforcing',
                      currentState: {
                        efficiency: 0.7,
                        satisfaction: 0.75,
                        cost: 100
                      }
                    }}
                  />
                </div>
              </div>

              {/* Primary Action Bar */}
              <div className="mt-8 glass rounded-b-2xl -mx-8 -mb-8 px-8 py-6 border-t border-border-subtle">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="text-primary underline text-base hover:text-primary-hover transition-colors"
                    >
                      {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
                    </button>
                    <button
                      onClick={() => setShowKeyboardHelp(true)}
                      className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <Keyboard className="h-4 w-4" />
                      <span className="text-sm">Shortcuts</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <motion.button
                      onClick={() => setShowDependencyManager(true)}
                      className="btn-secondary flex items-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <GitBranch className="w-4 h-4" />
                      <span>Dependencies</span>
                    </motion.button>

                    <motion.button
                      onClick={handleValidate}
                      className="btn-secondary flex items-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Check className="w-4 h-4" />
                      <span>Validate</span>
                    </motion.button>

                    <motion.button
                      onClick={() => setShowBundleSummary(true)}
                      disabled={enhancedInterventions.length === 0}
                      className={`btn-primary flex items-center space-x-2 ${
                        enhancedInterventions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      whileHover={enhancedInterventions.length > 0 ? { scale: 1.02 } : {}}
                      whileTap={enhancedInterventions.length > 0 ? { scale: 0.98 } : {}}
                    >
                      <Play className="w-4 h-4" />
                      <span>Review & Publish</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Advanced Settings Panel */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              className="mt-6 p-6 glass-secondary rounded-2xl border border-border-subtle"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-4 glass rounded-xl border border-border-subtle">
                  <h4 className="font-medium text-foreground mb-2">RACI Matrix</h4>
                  <p className="text-sm text-muted-foreground">Define roles and responsibilities</p>
                </div>
                <div className="p-4 glass rounded-xl border border-border-subtle">
                  <h4 className="font-medium text-foreground mb-2">Policy Standards</h4>
                  <p className="text-sm text-muted-foreground">Compliance and standards module</p>
                </div>
                <div className="p-4 glass rounded-xl border border-border-subtle">
                  <h4 className="font-medium text-foreground mb-2">Scheduling</h4>
                  <p className="text-sm text-muted-foreground">Timeline and resource scheduling</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MetaSolve Detail Form Modal */}
        <MetaSolveDetailForm
          isOpen={showMetaSolveForm}
          onClose={() => setShowMetaSolveForm(false)}
          onSave={(config) => {
            setMetaSolveConfig(config);
            setShowMetaSolveForm(false);
          }}
          initialData={metaSolveConfig || undefined}
          macroVision={{
            title: "Digital Government Transformation",
            leverageContext: {
              leveragePointName: "Rules (incentives, punishments, constraints)",
              loopName: "Innovation Adoption Feedback",
              loopType: "Reinforcing"
            }
          }}
        />

        {/* Enhanced Dependency Configurator Modal */}
        {showDependencyManager && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDependencyManager(false)}
            />
            <motion.div
              className="relative glass-secondary rounded-2xl border border-border-subtle shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-border-subtle">
                <h2 className="text-xl font-semibold text-foreground">Dependency Management</h2>
                <button
                  onClick={() => setShowDependencyManager(false)}
                  className="p-2 hover:bg-muted/20 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
                <EnhancedDependencyConfigurator
                  interventions={enhancedInterventions}
                  dependencies={dependencies}
                  onDependenciesChange={setDependencies}
                  bundle={{
                    id: 'current-bundle',
                    name: 'Current Bundle',
                    description: 'Current intervention bundle',
                    interventions: enhancedInterventions,
                    totalBudget: enhancedInterventions.reduce((sum, int) => sum + int.budget.totalBudget, 0),
                    totalTimelineWeeks: 26,
                    riskLevel: 'medium',
                    dependencies,
                    conflicts: [],
                    status: 'draft',
                    workflowStage: 'design',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    createdBy: 'current-user',
                    owner: 'current-user',
                    stakeholders: [],
                    macroVision: 'macro-vision-1',
                    mesoConfiguration: 'meso-config-1',
                    microConfiguration: 'micro-config-1'
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Bundle Summary Modal */}
        <BundleSummaryModal
          isOpen={showBundleSummary}
          onClose={() => setShowBundleSummary(false)}
          bundleData={{
            name: 'Digital Government Transformation Bundle',
            description: 'Comprehensive intervention bundle for digital transformation',
            interventions: enhancedInterventions.map(int => ({
              id: int.id,
              name: int.name,
              category: int.category,
              cost: int.budget.totalBudget,
              triImpact: 0.15
            })),
            assignments: [],
            sprintStart: new Date(),
            sprintEnd: new Date(Date.now() + 26 * 7 * 24 * 60 * 60 * 1000),
            totalCost: enhancedInterventions.reduce((sum, int) => sum + int.budget.totalBudget, 0),
            expectedTRIImprovement: 0.25,
            complianceStatus: 'passed',
            complianceChecks: []
          }}
          teamMembers={[]}
          customRoles={[]}
          onConfirmPublish={() => {
            handlePublish();
            setShowBundleSummary(false);
            exportBundle(
              'json',
              'Digital Government Transformation Bundle',
              enhancedInterventions,
              dependencies
            );
          }}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingStates.ActZoneLoadingSkeleton />
          </motion.div>
        )}

        {/* Keyboard Help Modal */}
        {showKeyboardHelp && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowKeyboardHelp(false)}
            />
            <motion.div
              className="relative glass-secondary rounded-xl border border-border-subtle shadow-2xl w-full max-w-2xl p-6"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Keyboard Shortcuts</h3>
                <button
                  onClick={() => setShowKeyboardHelp(false)}
                  className="p-2 hover:bg-muted/20 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {Object.entries(ACT_ZONE_SHORTCUTS).map(([category, shortcuts]) => (
                  <div key={category}>
                    <h4 className="font-medium text-foreground mb-3 capitalize">{category.replace('_', ' ')}</h4>
                    <div className="space-y-2">
                      {shortcuts.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between p-2 glass rounded">
                          <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                          <code className="text-xs bg-muted/30 px-2 py-1 rounded font-mono">
                            {shortcut.ctrlKey ? 'Ctrl+' : ''}{shortcut.shiftKey ? 'Shift+' : ''}{shortcut.altKey ? 'Alt+' : ''}{shortcut.key.toUpperCase()}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Intervention Detail Editor Modal */}
        {selectedIntervention && (
          <EnhancedInterventionDetailEditor
            intervention={selectedIntervention}
            isOpen={!!selectedIntervention}
            onClose={() => setSelectedIntervention(null)}
            onSave={(updatedIntervention) => {
              setEnhancedInterventions(prev => 
                prev.map(ei => ei.id === updatedIntervention.id ? updatedIntervention : ei)
              );
              setSelectedIntervention(null);
            }}
          />
        )}
      </div>
    </div>
  );
};