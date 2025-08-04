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
  Settings
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
import { toast } from '../../hooks/use-toast';

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
        glass rounded-lg p-3 flex items-center justify-between cursor-move
        border border-border-subtle hover:bg-glass-accent transition-all duration-200
        ${isDragging ? 'scale-105 shadow-xl' : ''}
      `}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center space-x-3">
        <span className="text-xl">{item.intervention.icon}</span>
        <div>
          <div className="text-foreground font-medium">{item.intervention.name}</div>
          <div className="text-foreground-subtle text-sm">{item.intervention.description}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="text-xs">
          {item.intervention.effort}
        </Badge>
        <button
          {...listeners}
          className="p-1 hover:bg-glass-accent rounded text-foreground-subtle hover:text-foreground transition-colors"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="p-1 hover:bg-destructive/20 rounded text-foreground-subtle hover:text-destructive transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export const ActZoneWorkspace: React.FC = () => {
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

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
    <motion.div
      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                      <SortableInterventionCard
                        key={item.id}
                        item={item}
                        onRemove={removeIntervention}
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

      {/* Smart Roles Panel */}
      <motion.div
        className="mt-6 p-4 bg-white/10 rounded-xl border border-white/10"
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {mockRoles.map((role) => (
              <motion.div
                key={role.id}
                className="flex items-center space-x-2 group"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className={`w-10 h-10 ${role.color} rounded-full flex items-center justify-center text-white font-medium`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {role.avatar}
                </motion.div>
                <div>
                  <div className="text-white font-medium">{role.name}</div>
                  <div className="text-gray-400 text-sm">{role.title}</div>
                </div>
                <motion.button
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <Edit className="w-4 h-4 text-gray-400" />
                </motion.button>
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-gray-400">Role defaults based on last sprint.</p>
        </div>
      </motion.div>

      {/* Primary Action Bar */}
      <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-xl -mx-8 -mb-8 px-8 py-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-teal-300 underline text-base hover:text-teal-200 transition-colors"
          >
            Advanced Settings
          </button>
          
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleValidate}
              className="bg-gray-600 hover:bg-gray-700 text-white rounded-full py-3 px-8 text-lg font-semibold flex items-center gap-3 shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Check className="w-5 h-5" />
              Validate Bundle
            </motion.button>
            
            <motion.button
              onClick={handlePublish}
              className="bg-teal-500 hover:bg-teal-600 text-white rounded-full py-3 px-8 text-lg font-semibold flex items-center gap-3 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={bundleItems.length === 0}
              whileHover={{ scale: bundleItems.length > 0 ? 1.03 : 1 }}
              whileTap={{ scale: bundleItems.length > 0 ? 0.97 : 1 }}
            >
              <Play className="w-5 h-5" />
              Publish Bundle
            </motion.button>
          </div>
        </div>

        {/* Advanced Settings Accordion */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-6"
            >
              <div className="bg-white/5 rounded-lg p-6 space-y-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Advanced Settings</h3>
                  <motion.div
                    animate={{ rotate: showAdvanced ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">RACI Matrix</h4>
                    <p className="text-gray-400 text-sm">Automatically assign roles based on intervention types.</p>
                    <Button variant="outline" className="border-white/30 text-white w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure RACI
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Scheduling Overrides</h4>
                    <p className="text-gray-400 text-sm">Set custom timing for intervention rollout.</p>
                    <Button variant="outline" className="border-white/30 text-white w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Set Schedule
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};