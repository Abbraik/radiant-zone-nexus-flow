import { useState } from 'react';

export interface Automation {
  id: string;
  name: string;
  description: string;
  type: 'schedule' | 'trigger' | 'workflow';
  enabled: boolean;
  schedule?: string;
  conditions?: any[];
  actions?: any[];
  lastRun?: Date;
  runCount?: number;
  createdAt: Date;
}

export const useAutomation = () => {
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: '1',
      name: 'Daily TRI Review Reminder',
      description: 'Send notification for pending TRI reviews every morning',
      type: 'schedule',
      enabled: true,
      schedule: 'Daily at 9:00 AM',
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
      runCount: 15,
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Critical Task Alert',
      description: 'Alert when tasks become critical (due within 24h)',
      type: 'trigger',
      enabled: true,
      runCount: 8,
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Bundle Publishing Workflow',
      description: 'Auto-generate reports and notifications on bundle publish',
      type: 'workflow',
      enabled: false,
      runCount: 3,
      createdAt: new Date()
    },
    {
      id: '4',
      name: 'Weekly Performance Summary',
      description: 'Generate and distribute weekly performance reports',
      type: 'schedule',
      enabled: true,
      schedule: 'Fridays at 5:00 PM',
      lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      runCount: 4,
      createdAt: new Date()
    }
  ]);

  const toggleAutomation = (id: string) => {
    setAutomations(prev =>
      prev.map(automation =>
        automation.id === id
          ? { ...automation, enabled: !automation.enabled }
          : automation
      )
    );
  };

  const createAutomation = () => {
    // This would open a dialog/modal to create new automation
    console.log('Create new automation workflow');
  };

  const runAutomation = (id: string) => {
    setAutomations(prev =>
      prev.map(automation =>
        automation.id === id
          ? { 
              ...automation, 
              lastRun: new Date(),
              runCount: (automation.runCount || 0) + 1
            }
          : automation
      )
    );
  };

  return {
    automations,
    toggleAutomation,
    createAutomation,
    runAutomation
  };
};