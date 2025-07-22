import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Calendar, 
  Clock, 
  Zap, 
  Settings,
  Plus,
  Bell
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Switch } from '../../../components/ui/switch';
import { useAutomation } from '../hooks/useAutomation';

export const AutomationPanel: React.FC = () => {
  const { automations, toggleAutomation, createAutomation } = useAutomation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-4 bg-glass/70 backdrop-blur-20 border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Automation</h3>
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
            {automations.filter(a => a.enabled).length} active
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {automations.slice(0, isExpanded ? undefined : 3).map((automation) => (
          <motion.div
            key={automation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-white">
                    {automation.name}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      automation.type === 'schedule' 
                        ? 'border-blue-500/50 text-blue-300'
                        : automation.type === 'trigger'
                        ? 'border-green-500/50 text-green-300'
                        : 'border-purple-500/50 text-purple-300'
                    }`}
                  >
                    {automation.type}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-400 mb-2">
                  {automation.description}
                </p>
                
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {automation.schedule && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{automation.schedule}</span>
                    </div>
                  )}
                  
                  {automation.lastRun && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Last: {automation.lastRun.toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    <span>{automation.runCount || 0} runs</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={automation.enabled}
                  onCheckedChange={() => toggleAutomation(automation.id)}
                />
                {automation.enabled && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => createAutomation()}
            className="w-full border-teal-500/50 text-teal-300 hover:bg-teal-500/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Automation
          </Button>
        </motion.div>
      )}
    </Card>
  );
};