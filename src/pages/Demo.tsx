import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { createCapacityService } from '@/services/capacity-api';
import { useFeatureFlags } from '@/components/layout/FeatureFlagProvider';
import { MandateGate } from '@/features/mandateGate/MandateGate';
import { EquilibriumScorecard } from '@/features/scorecards/EquilibriumScorecard';
import { RELCadence } from '@/features/rel/RELCadence';
import { 
  Settings, 
  Database, 
  Zap,
  Brain,
  Building,
  RefreshCw,
  Telescope
} from 'lucide-react';

export const Demo: React.FC = () => {
  const { flags } = useFeatureFlags();
  const [isLoading, setIsLoading] = React.useState(false);
  const [demoData, setDemoData] = React.useState<any>(null);

  const capacityService = createCapacityService(flags.SUPABASE_LIVE);

  const createDemoLoop = async () => {
    setIsLoading(true);
    try {
      const loop = await capacityService.createLoop({
        name: 'Demo Supply Chain Loop',
        description: 'Demonstration loop for capacity-mode architecture',
        loop_type: 'structural',
        scale: 'macro',
        leverage_default: 'S',
        metadata: {
          demo: true,
          created_by: 'system'
        },
        user_id: 'demo-user'
      });

      const triEvent = await capacityService.createTRIEvent({
        loop_id: loop.id,
        t_value: 75,
        r_value: 82,
        i_value: 68,
        user_id: 'demo-user'
      });

      setDemoData({ loop, triEvent });
    } catch (error) {
      console.error('Failed to create demo data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMandateCheck = async (actor: string, leverage: string) => {
    return await capacityService.evaluateMandate(actor, leverage);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-4">
          Capacity-Mode Architecture Demo
        </h1>
        <p className="text-muted-foreground mb-6">
          Explore the five capacities and their specialized tools
        </p>
        
        <Button 
          onClick={createDemoLoop} 
          disabled={isLoading}
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
              Creating Demo Data...
            </>
          ) : (
            <>
              <Database className="w-4 h-4 mr-2" />
              Create Demo Loop
            </>
          )}
        </Button>
      </motion.div>

      {/* Capacity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { name: 'Responsive', icon: Zap, color: 'text-orange-500', desc: 'Rapid response' },
          { name: 'Reflexive', icon: RefreshCw, color: 'text-green-500', desc: 'Adaptive learning' },
          { name: 'Deliberative', icon: Brain, color: 'text-blue-500', desc: 'Strategic analysis' },
          { name: 'Anticipatory', icon: Telescope, color: 'text-indigo-500', desc: 'Future planning' },
          { name: 'Structural', icon: Building, color: 'text-purple-500', desc: 'System design' }
        ].map((capacity) => (
          <Card key={capacity.name} className="text-center hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <capacity.icon className={`w-8 h-8 mx-auto ${capacity.color}`} />
              <CardTitle className="text-lg">{capacity.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{capacity.desc}</p>
              <Badge variant="outline" className="mt-2">Available</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Demonstrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mandate Gate Demo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold mb-4">Mandate Gate System</h3>
          <MandateGate
            actor="system-admin"
            leverage="S"
            mandate="structural-changes"
            onMandateCheck={handleMandateCheck}
          />
        </motion.div>

        {/* Equilibrium Scorecard Demo */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-4">Equilibrium Scorecard</h3>
          <EquilibriumScorecard
            loopId={demoData?.loop?.id || 'demo-loop'}
            scorecard={{
              last_tri: { T: 75, R: 82, I: 68 },
              de_state: 'stable',
              claim_velocity: 2.4,
              fatigue: 25
            }}
          />
        </motion.div>
      </div>

      {/* REL Cadence Demo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              REL Cadence Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Real-time Equilibrium Level monitoring for system health
                </p>
                <RELCadence loopId={demoData?.loop?.id || 'demo-loop'} interval={3000} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-500">94.2%</div>
                <div className="text-sm text-muted-foreground">System Health</div>
                <Progress value={94.2} className="w-32 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Demo Data Display */}
      {demoData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Demo Data Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Loop Created</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Name:</strong> {demoData.loop.name}<br />
                    <strong>Type:</strong> {demoData.loop.loop_type}<br />
                    <strong>Scale:</strong> {demoData.loop.scale}<br />
                    <strong>ID:</strong> {demoData.loop.id}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">TRI Event Created</h4>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-500">{demoData.triEvent.t_value}</div>
                      <div className="text-xs text-muted-foreground">Tension</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-500">{demoData.triEvent.r_value}</div>
                      <div className="text-xs text-muted-foreground">Resonance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-500">{demoData.triEvent.i_value}</div>
                      <div className="text-xs text-muted-foreground">Impact</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Feature Flags Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Feature Flags Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { flag: 'CAPACITY_WORKSPACE', label: 'Capacity Workspace' },
                { flag: 'META_LOOP_CONSOLE', label: 'Meta-Loop Console' },
                { flag: 'MANDATE_GATE', label: 'Mandate Gate' },
                { flag: 'EQUILIBRIUM_SCORECARD', label: 'Equilibrium Scorecard' },
                { flag: 'REL_CADENCE', label: 'REL Cadence' },
                { flag: 'SUPABASE_LIVE', label: 'Supabase Live' },
                { flag: 'LEGACY_TAMLI', label: 'Legacy TAMLI' }
              ].map(({ flag, label }) => (
                <div key={flag} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">{label}</span>
                  <Badge variant={flags[flag as keyof typeof flags] ? 'default' : 'secondary'}>
                    {flags[flag as keyof typeof flags] ? 'ON' : 'OFF'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};