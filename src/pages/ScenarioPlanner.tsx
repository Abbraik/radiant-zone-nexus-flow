import React from 'react';
import { motion } from 'framer-motion';
import ScenarioPlanner from '../components/widgets/ScenarioPlanner';

export const ScenarioPlannerPage: React.FC = () => {
  // Mock task for standalone access
  const mockTask = {
    id: 'scenario-planner',
    title: 'Scenario Planning Studio',
    description: 'Interactive scenario planning and modeling tool',
    zone: 'think' as const,
    type: 'scenario_planning',
    status: 'in_progress' as const,
    priority: 'high' as const,
    assignee: 'current-user',
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    progress: 0,
    tags: ['modeling', 'analytics']
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background p-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Scenario Planning Studio
          </h1>
          <p className="text-muted-foreground">
            Test what-if scenarios by adjusting model parameters and observing real-time projections
          </p>
        </motion.div>
        
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <ScenarioPlanner task={mockTask} />
        </motion.div>
      </div>
    </motion.div>
  );
};