import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Clock, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown,
  Activity,
  Users
} from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface StatusBarProps {
  hasUnsavedChanges: boolean;
  currentScenario: string;
  scenarios: string[];
  onScenarioChange: (scenario: string) => void;
  simulationStatus: 'idle' | 'running' | 'completed' | 'error';
  lastRunTime?: Date;
  onSave: () => void;
  collaborators?: Array<{ id: string; name: string; color: string; cursor?: { x: number; y: number } }>;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  hasUnsavedChanges,
  currentScenario,
  scenarios,
  onScenarioChange,
  simulationStatus,
  lastRunTime,
  onSave,
  collaborators = []
}) => {
  const [showScenarios, setShowScenarios] = useState(false);
  const [saveAnimation, setSaveAnimation] = useState(false);

  const getStatusIcon = () => {
    switch (simulationStatus) {
      case 'running':
        return <Activity className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (simulationStatus) {
      case 'running':
        return 'Simulation running...';
      case 'completed':
        return lastRunTime ? `Last run: ${lastRunTime.toLocaleTimeString()}` : 'Simulation completed';
      case 'error':
        return 'Simulation failed';
      default:
        return 'Ready to simulate';
    }
  };

  const handleSave = () => {
    onSave();
    setSaveAnimation(true);
    setTimeout(() => setSaveAnimation(false), 1000);
  };

  return (
    <div className="h-10 bg-slate-800/90 backdrop-blur-sm border-t border-slate-600 flex items-center justify-between px-4 text-sm">
      {/* Left section - Save status */}
      <div className="flex items-center gap-4">
        <motion.div
          className="flex items-center gap-2"
          animate={saveAnimation ? { scale: [1, 1.1, 1] } : {}}
        >
          {hasUnsavedChanges ? (
            <>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-orange-400">Unsaved changes</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="h-6 px-2 text-xs text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
              >
                <Save className="w-3 h-3 mr-1" />
                Save
              </Button>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-green-400">All changes saved</span>
            </>
          )}
        </motion.div>

        {/* Scenario Selector */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Scenario:</span>
          <Select value={currentScenario} onValueChange={onScenarioChange}>
            <SelectTrigger className="h-6 min-w-32 bg-transparent border-slate-600 text-white text-xs focus:border-teal-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {scenarios.map(scenario => (
                <SelectItem 
                  key={scenario} 
                  value={scenario}
                  className="text-white hover:bg-slate-600 text-xs"
                >
                  {scenario}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Center section - Collaborators */}
      {collaborators.length > 0 && (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <div className="flex -space-x-1">
            {collaborators.slice(0, 3).map(collaborator => (
              <motion.div
                key={collaborator.id}
                className="w-6 h-6 rounded-full border-2 border-slate-800 flex items-center justify-center text-xs font-medium text-white"
                style={{ backgroundColor: collaborator.color }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.2, zIndex: 10 }}
                title={collaborator.name}
              >
                {collaborator.name.charAt(0).toUpperCase()}
              </motion.div>
            ))}
            {collaborators.length > 3 && (
              <div className="w-6 h-6 bg-slate-600 rounded-full border-2 border-slate-800 flex items-center justify-center text-xs font-medium text-white">
                +{collaborators.length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right section - Simulation status */}
      <div 
        className="flex items-center gap-2 cursor-pointer hover:bg-slate-700/50 px-2 py-1 rounded transition-colors"
        title={getStatusText()}
      >
        {getStatusIcon()}
        <span className="text-gray-300">{getStatusText()}</span>
      </div>

      {/* Real-time collaborator cursors */}
      <AnimatePresence>
        {collaborators.map(collaborator => 
          collaborator.cursor && (
            <motion.div
              key={`cursor-${collaborator.id}`}
              className="fixed pointer-events-none z-50"
              style={{
                left: collaborator.cursor.x,
                top: collaborator.cursor.y
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              {/* Cursor */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                className="text-white"
                style={{ color: collaborator.color }}
              >
                <path
                  d="M0 0l8 16 3-7 7-3L0 0z"
                  fill="currentColor"
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
              
              {/* Name badge */}
              <div
                className="absolute top-5 left-2 px-2 py-1 rounded text-xs text-white whitespace-nowrap shadow-lg"
                style={{ backgroundColor: collaborator.color }}
              >
                {collaborator.name}
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};