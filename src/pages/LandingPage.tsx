import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { useFeatureFlags } from '@/components/layout/FeatureFlagProvider';
import { 
  Zap, 
  Brain, 
  Building2, 
  RefreshCw, 
  Telescope, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Settings,
  Database,
  GitBranch,
  Briefcase,
  BarChart3,
  Users,
  Target,
  Gauge,
  TrendingUp,
  Shield
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { myTasks, availableTasks } = useTasks();
  const { flags, isEnabled } = useFeatureFlags();

  const handleGetStarted = () => {
    if (user) {
      navigate('/workspace');
    } else {
      navigate('/auth');
    }
  };

  const handleExploreFeatures = () => {
    navigate('/registry');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-primary/20">
              <Gauge className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Next-Gen Governance OS</span>
              <Badge variant="secondary" className="text-xs">v2.0</Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent mb-6 leading-tight">
              RGS Ultimate
              <span className="block text-4xl md:text-6xl mt-2 text-foreground/80">Governance Platform</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto mb-12 leading-relaxed">
              Harness the power of the 5C Capacity Framework with real-time system dynamics, 
              intelligent task orchestration, and adaptive governance workflows.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="text-lg px-8 py-4 bg-gradient-primary hover:shadow-elegant transition-all duration-300"
              >
                {user ? (
                  <>
                    <Briefcase className="mr-2 w-5 h-5" />
                    Enter Workspace
                  </>
                ) : (
                  <>
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleExploreFeatures}
                className="text-lg px-8 py-4 glass backdrop-blur-md border-border-subtle hover:bg-glass-accent transition-all duration-300"
              >
                <Database className="mr-2 w-4 h-4" />
                Explore Registry
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="container mx-auto px-4 mt-20"
          >
            <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
              <div className="glass backdrop-blur-md rounded-2xl p-4 border border-border-subtle min-w-32 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{myTasks.length}</div>
                <div className="text-sm text-foreground-muted">My Tasks</div>
              </div>
              <div className="glass backdrop-blur-md rounded-2xl p-4 border border-border-subtle min-w-32 text-center">
                <div className="text-2xl font-bold text-accent mb-1">{availableTasks.length}</div>
                <div className="text-sm text-foreground-muted">Available</div>
              </div>
              <div className="glass backdrop-blur-md rounded-2xl p-4 border border-border-subtle min-w-32 text-center">
                <div className="text-2xl font-bold text-info mb-1">5</div>
                <div className="text-sm text-foreground-muted">Capacities</div>
              </div>
              <div className="glass backdrop-blur-md rounded-2xl p-4 border border-border-subtle min-w-32 text-center">
                <div className="text-2xl font-bold text-success mb-1">32</div>
                <div className="text-sm text-foreground-muted">Atlas Loops</div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-background/50 to-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powered by the 5C Framework
            </h2>
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
              Experience next-generation governance through five integrated capacity modes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
            {[
              {
                capacity: 'Responsive',
                icon: <Zap className="h-6 w-6" />,
                description: 'Immediate crisis response and emergency protocols',
                color: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
                iconBg: 'bg-orange-500/20 text-orange-600'
              },
              {
                capacity: 'Reflexive', 
                icon: <RefreshCw className="h-6 w-6" />,
                description: 'Adaptive learning and continuous improvement',
                color: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
                iconBg: 'bg-green-500/20 text-green-600'
              },
              {
                capacity: 'Deliberative',
                icon: <Brain className="h-6 w-6" />,
                description: 'Collaborative decision-making and consensus building',
                color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
                iconBg: 'bg-blue-500/20 text-blue-600'
              },
              {
                capacity: 'Anticipatory',
                icon: <Telescope className="h-6 w-6" />,
                description: 'Future scenario planning and risk management',
                color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30',
                iconBg: 'bg-purple-500/20 text-purple-600'
              },
              {
                capacity: 'Structural',
                icon: <Building2 className="h-6 w-6" />,
                description: 'Long-term system design and institutional change',
                color: 'from-gray-500/20 to-slate-500/20 border-gray-500/30',
                iconBg: 'bg-gray-500/20 text-gray-600'
              }
            ].map((item, index) => (
              <motion.div
                key={item.capacity}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <Card className={`h-full hover:shadow-elegant transition-all duration-300 bg-gradient-to-br ${item.color} backdrop-blur-sm`}>
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center mb-3`}>
                      {item.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold">{item.capacity}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground-muted">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Advanced Technology Stack
            </h2>
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
              Built with cutting-edge technologies for reliability, scalability, and performance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: "Real-time Analytics",
                description: "Live system monitoring with instant feedback loops and performance metrics"
              },
              {
                icon: <Database className="h-8 w-8" />,
                title: "SNL Integration", 
                description: "Shared Node Layer connecting 50+ domain entities across all system loops"
              },
              {
                icon: <GitBranch className="h-8 w-8" />,
                title: "Dynamic Workflows",
                description: "Auto-generated process flows based on capacity requirements and system state"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Enterprise Security",
                description: "Bank-grade security with role-based access and audit trails"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-elegant transition-all duration-300 glass backdrop-blur-md border-border-subtle">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-primary/10 flex items-center justify-center mb-4">
                      <div className="text-primary">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground-muted">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* System Status Dashboard */}
      <section className="py-20 bg-gradient-to-br from-muted/20 to-background/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="glass backdrop-blur-xl border-border-subtle shadow-elegant">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                  System Status Dashboard
                </CardTitle>
                <p className="text-foreground-muted">Real-time system health and performance metrics</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-2">98%</div>
                    <div className="text-sm text-foreground-muted">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">32</div>
                    <div className="text-sm text-foreground-muted">Atlas Loops</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">5</div>
                    <div className="text-sm text-foreground-muted">Capacities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-info mb-2">247</div>
                    <div className="text-sm text-foreground-muted">Active Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning mb-2">12ms</div>
                    <div className="text-sm text-foreground-muted">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-success mb-2">
                      <Clock className="w-8 h-8" />
                    </div>
                    <div className="text-sm text-foreground-muted">Real-time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Transform Your Governance?
            </h2>
            <p className="text-lg text-foreground-muted mb-8">
              Join organizations worldwide using RGS Ultimate to build more responsive, 
              adaptive, and effective governance systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="text-lg px-8 py-4 bg-gradient-primary hover:shadow-elegant"
              >
                {user ? 'Go to Workspace' : 'Get Started Today'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/demo')}
                className="text-lg px-8 py-4 glass backdrop-blur-md border-border-subtle hover:bg-glass-accent"
              >
                <TrendingUp className="mr-2 w-4 h-4" />
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border-subtle bg-background/80">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center"
          >
            <p className="text-foreground-muted">
              Powered by NCF-PAGS Atlas • Built for Next-Generation Governance
            </p>
            <div className="flex justify-center items-center gap-6 mt-6">
              {Object.entries(flags).map(([key, enabled]) => (
                <Badge 
                  key={key}
                  variant={enabled ? "default" : "secondary"}
                  className="text-xs"
                >
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};