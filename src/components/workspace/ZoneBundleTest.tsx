import React from 'react';
import { motion } from 'framer-motion';
import { DynamicZoneBundleLoader } from './DynamicZoneBundleLoader';
import { useFeatureFlags } from '../layout/FeatureFlagProvider';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

// Test component to verify zone bundle integration
export const ZoneBundleTest: React.FC = () => {
  const { flags } = useFeatureFlags();
  const [testResults, setTestResults] = React.useState<{[key: string]: boolean}>({});
  const [validationResults, setValidationResults] = React.useState<{[key: string]: {isValid: boolean, errors?: string[]}}>({});

  const testCases = [
    {
      zone: 'think' as const,
      taskType: 'loop_design' as const,
      taskId: 'test-think-1',
      taskData: { title: 'Test Think Task', description: 'Testing think zone bundle' }
    },
    {
      zone: 'act' as const,
      taskType: 'sprint_planning' as const,
      taskId: 'test-act-1',
      taskData: { title: 'Test Act Task', description: 'Testing act zone bundle' }
    },
    {
      zone: 'monitor' as const,
      taskType: 'breach_response' as const,
      taskId: 'test-monitor-1',
      taskData: { title: 'Test Monitor Task', description: 'Testing monitor zone bundle' }
    },
    {
      zone: 'innovate-learn' as const,
      taskType: 'experiment_design' as const,
      taskId: 'test-innovate-1',
      taskData: { title: 'Test Innovate Task', description: 'Testing innovate zone bundle' }
    }
  ];

  const handlePayloadUpdate = (zoneTaskId: string) => (payload: any) => {
    console.log(`${zoneTaskId} payload updated:`, payload);
    setTestResults(prev => ({ ...prev, [zoneTaskId]: true }));
  };

  const handleValidationChange = (zoneTaskId: string) => (isValid: boolean, errors?: string[]) => {
    console.log(`${zoneTaskId} validation:`, { isValid, errors });
    setValidationResults(prev => ({ ...prev, [zoneTaskId]: { isValid, errors } }));
  };

  if (!flags.useZoneBundles) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 glass rounded-lg border border-border/50"
      >
        <h3 className="text-lg font-semibold text-foreground mb-2">Zone Bundle Integration Test</h3>
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
          Feature Flag Disabled
        </Badge>
        <p className="text-sm text-muted-foreground mt-2">
          Enable the 'useZoneBundles' feature flag to test zone bundle integration.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="p-6 glass rounded-lg border border-border/50">
        <h3 className="text-lg font-semibold text-foreground mb-4">Zone Bundle Integration Test</h3>
        <Badge variant="default" className="bg-green-500/20 text-green-300 mb-4">
          Feature Flag Enabled
        </Badge>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testCases.map((testCase) => {
            const testKey = `${testCase.zone}-${testCase.taskType}`;
            const hasPayloadUpdate = testResults[testKey];
            const validation = validationResults[testKey];
            
            return (
              <div key={testKey} className="p-4 glass-secondary rounded-lg border border-border/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-foreground">{testCase.zone} Zone</h4>
                  <div className="flex items-center gap-2">
                    {hasPayloadUpdate ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                    )}
                    {validation && (
                      <Badge 
                        variant={validation.isValid ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {validation.isValid ? 'Valid' : 'Invalid'}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <DynamicZoneBundleLoader
                  zone={testCase.zone}
                  taskType={testCase.taskType}
                  taskId={testCase.taskId}
                  taskData={testCase.taskData}
                  payload={{}}
                  onPayloadUpdate={handlePayloadUpdate(testKey)}
                  onValidationChange={handleValidationChange(testKey)}
                  readonly={true}
                />
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};