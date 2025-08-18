import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Database, Zap, Users, Target, Settings } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useFeatureFlags } from '../layout/FeatureFlagProvider';

export const ZoneAwareSystemStatus: React.FC = () => {
  const { flags } = useFeatureFlags();

  const systemFeatures = [
    {
      name: 'Zone Bundle System',
      status: flags.useZoneBundles,
      description: 'Dynamic loading of zone-specific task interfaces',
      icon: Target,
      details: ['Think Zone Bundle', 'Act Zone Bundle', 'Monitor Zone Bundle', 'Innovate Zone Bundle']
    },
    {
      name: 'Task Management',
      status: true,
      description: 'Full task lifecycle with zone awareness',
      icon: CheckCircle2,
      details: ['Claim tasks', 'Zone-based routing', 'Payload persistence', 'Real-time updates']
    },
    {
      name: 'Database Integration',
      status: true,
      description: 'Supabase-powered task storage and management',
      icon: Database,
      details: ['Task table with zones', 'Payload storage', 'Event tracking', 'RLS policies']
    },
    {
      name: 'Real-time Features',
      status: flags.realTimeCollab,
      description: 'Live collaboration and presence system',
      icon: Users,
      details: ['User presence', 'Live updates', 'Collaborative editing', 'Pair programming']
    },
    {
      name: 'Enhanced UI',
      status: flags.workspacePro,
      description: 'Modern workspace interface with animations',
      icon: Zap,
      details: ['Glass morphism', 'Smooth animations', 'Responsive design', 'Dark theme']
    },
    {
      name: 'Feature Flags',
      status: true,
      description: 'Gradual rollout and A/B testing capabilities',
      icon: Settings,
      details: ['Zone bundles toggle', 'Workspace features', 'Collaboration tools', 'UI enhancements']
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            Zone-Aware Dynamic Task View - Implementation Complete
          </CardTitle>
          <CardDescription>
            Comprehensive task management system with zone-specific interfaces and real-time capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 glass-secondary rounded-lg border border-border/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-primary" />
                      <h4 className="font-medium text-foreground text-sm">{feature.name}</h4>
                    </div>
                    <Badge 
                      variant={feature.status ? "default" : "secondary"}
                      className={`text-xs ${feature.status ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}`}
                    >
                      {feature.status ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{feature.description}</p>
                  <div className="space-y-1">
                    {feature.details.map((detail, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary/60" />
                        <span className="text-xs text-foreground-subtle">{detail}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Usage Instructions</CardTitle>
          <CardDescription>How to use the Zone-Aware Dynamic Task View system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">For Users:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary">1.</span>
                  <span>Browse available tasks in the sidebar organized by zone</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary">2.</span>
                  <span>Claim a task to automatically load the zone-specific interface</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary">3.</span>
                  <span>Complete task workflows using zone-optimized tools</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary">4.</span>
                  <span>Navigate automatically to appropriate zone workspaces</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">For Administrators:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary">1.</span>
                  <span>Enable/disable zone bundles via feature flags</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary">2.</span>
                  <span>Monitor task completion rates by zone</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary">3.</span>
                  <span>Analyze workflow efficiency and zone utilization</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary">4.</span>
                  <span>Configure zone-specific validation rules</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};