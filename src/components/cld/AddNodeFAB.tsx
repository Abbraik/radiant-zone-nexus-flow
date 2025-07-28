import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Database, 
  Activity, 
  Settings, 
  Target,
  TrendingUp,
  Clock,
  Users,
  Zap
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { CLDPosition, CLDNodeType } from '../../types/cld';

interface NodeTemplate {
  id: string;
  type: CLDNodeType;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  defaultValue?: number;
}

interface AddNodeFABProps {
  onAddNode: (position: CLDPosition, template: NodeTemplate) => void;
}

const nodeTemplates: NodeTemplate[] = [
  {
    id: 'customer_satisfaction',
    type: 'stock',
    label: 'Customer Satisfaction',
    description: 'Customer satisfaction score',
    icon: Target,
    category: 'Customer',
    defaultValue: 75
  },
  {
    id: 'revenue',
    type: 'stock',
    label: 'Revenue',
    description: 'Monthly recurring revenue',
    icon: TrendingUp,
    category: 'Financial',
    defaultValue: 100000
  },
  {
    id: 'team_capacity',
    type: 'stock',
    label: 'Team Capacity',
    description: 'Available development capacity',
    icon: Users,
    category: 'Team',
    defaultValue: 100
  },
  {
    id: 'technical_debt',
    type: 'stock',
    label: 'Technical Debt',
    description: 'Accumulated technical debt',
    icon: Database,
    category: 'Technical',
    defaultValue: 20
  },
  {
    id: 'feature_delivery_rate',
    type: 'flow',
    label: 'Feature Delivery Rate',
    description: 'Rate of feature delivery',
    icon: Activity,
    category: 'Delivery',
    defaultValue: 5
  },
  {
    id: 'bug_fix_rate',
    type: 'flow',
    label: 'Bug Fix Rate',
    description: 'Rate of bug resolution',
    icon: Settings,
    category: 'Quality',
    defaultValue: 8
  },
  {
    id: 'learning_rate',
    type: 'auxiliary',
    label: 'Learning Rate',
    description: 'Team learning velocity',
    icon: Zap,
    category: 'Team',
    defaultValue: 0.8
  },
  {
    id: 'time_pressure',
    type: 'auxiliary',
    label: 'Time Pressure',
    description: 'Urgency and deadline pressure',
    icon: Clock,
    category: 'Environment',
    defaultValue: 0.6
  }
];

export const AddNodeFAB: React.FC<AddNodeFABProps> = ({ onAddNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedTemplate, setDraggedTemplate] = useState<NodeTemplate | null>(null);

  const filteredTemplates = nodeTemplates.filter(template =>
    template.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(nodeTemplates.map(t => t.category)));

  const handleTemplateClick = (template: NodeTemplate) => {
    // Add node at center of screen
    const position: CLDPosition = { x: 400, y: 300 };
    onAddNode(position, template);
    setIsOpen(false);
  };

  const handleDragStart = (template: NodeTemplate, e: React.DragEvent) => {
    setDraggedTemplate(template);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedTemplate(null);
  };

  return (
    <>
      {/* FAB Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', bounce: 0.6 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-500/25 border-2 border-teal-400/30"
          size="lg"
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-teal-500/20 blur-xl -z-10 animate-pulse" />
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-2xl border border-slate-600 shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-600">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Add Node</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </Button>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search node templates..."
                    className="pl-10 bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-96">
                <div className="text-sm text-gray-400 mb-4">
                  Click to add at center, or drag onto canvas
                </div>

                {categories.map(category => {
                  const categoryTemplates = filteredTemplates.filter(t => t.category === category);
                  if (categoryTemplates.length === 0) return null;

                  return (
                    <div key={category} className="mb-6">
                      <h3 className="text-white font-medium mb-3 text-sm uppercase tracking-wide">
                        {category}
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {categoryTemplates.map(template => {
                          const Icon = template.icon;
                          
                          return (
                            <motion.div
                              key={template.id}
                              className={`
                                bg-slate-700 rounded-lg p-4 cursor-pointer border border-slate-600
                                hover:border-teal-500 hover:bg-slate-600 transition-all duration-200
                                ${draggedTemplate?.id === template.id ? 'opacity-50' : ''}
                              `}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleTemplateClick(template)}
                              draggable
                              onDragStart={(e) => handleDragStart(template, e as any)}
                              onDragEnd={handleDragEnd}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Icon className="w-4 h-4 text-white" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-white font-medium text-sm mb-1 truncate">
                                    {template.label}
                                  </h4>
                                  <p className="text-gray-400 text-xs leading-tight">
                                    {template.description}
                                  </p>
                                  
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2 py-1 bg-slate-600 rounded text-xs text-gray-300">
                                      {template.type}
                                    </span>
                                    {template.defaultValue && (
                                      <span className="text-xs text-gray-400">
                                        Default: {template.defaultValue}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {filteredTemplates.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No templates found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-600 bg-slate-700/50">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-2 h-2 bg-teal-500 rounded-full" />
                  <span>Tip: Use keyboard shortcut 'N' to quickly add nodes</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};