import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, Zap, Target, AlertTriangle, CheckCircle, Lightbulb, BarChart3 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Intervention {
  id: string;
  name: string;
  category: string;
  resourceCost: number;
  kpiImpact: number;
  timeToImpact: string;
  synergies: string[];
  conflicts: string[];
}

interface OptimizationResult {
  score: number;
  efficiency: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendations: string[];
  synergies: Array<{ from: string; to: string; benefit: string; impact: number; }>;
  conflicts: Array<{ from: string; to: string; issue: string; severity: 'Low' | 'Medium' | 'High'; }>;
  alternatives: Array<{ intervention: Intervention; reason: string; improvement: number; }>;
}

interface AIBundleOptimizerProps {
  interventions: Intervention[];
  onOptimizationChange: (result: OptimizationResult) => void;
}

export const AIBundleOptimizer: React.FC<AIBundleOptimizerProps> = ({
  interventions,
  onOptimizationChange
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock AI optimization algorithm
  const analyzeBundle = async (): Promise<OptimizationResult> => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Calculate efficiency metrics
    const totalCost = interventions.reduce((sum, i) => sum + i.resourceCost, 0);
    const totalImpact = interventions.reduce((sum, i) => sum + i.kpiImpact, 0);
    const efficiency = interventions.length > 0 ? (totalImpact / totalCost) * 100 : 0;

    // Detect synergies
    const synergies = [
      {
        from: 'Family Planning Programs',
        to: 'Girls Education Initiative',
        benefit: 'Educational empowerment reinforces reproductive health choices',
        impact: 25
      },
      {
        from: 'Maternal Health Infrastructure',
        to: 'Family Planning Programs',
        benefit: 'Shared healthcare delivery channels reduce costs',
        impact: 18
      },
      {
        from: 'Women Economic Empowerment',
        to: 'Family Planning Programs',
        benefit: 'Economic independence correlates with family planning adoption',
        impact: 22
      }
    ].filter(s => 
      interventions.some(i => i.name === s.from) && 
      interventions.some(i => i.name === s.to)
    );

    // Detect conflicts
    const conflicts = [
      {
        from: 'Urban Planning Reform',
        to: 'Agricultural Innovation',
        issue: 'Resource allocation competition between urban and rural programs',
        severity: 'Medium' as const
      }
    ].filter(c => 
      interventions.some(i => i.name === c.from) && 
      interventions.some(i => i.name === c.to)
    );

    // Generate recommendations
    const recommendations = [
      'Consider phasing interventions to maximize synergies',
      'Family planning and education programs show strong positive correlation',
      'Maternal health infrastructure provides foundation for other health interventions',
      'Economic empowerment programs amplify impact of reproductive health initiatives'
    ];

    // Calculate risk level
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    if (totalCost > 400) riskLevel = 'High';
    else if (totalCost > 250) riskLevel = 'Medium';

    // Generate alternatives
    const alternatives = [
      {
        intervention: {
          id: 'alt-1',
          name: 'Digital Health Services',
          category: 'Technology',
          resourceCost: 45,
          kpiImpact: 50,
          timeToImpact: '6-12 months',
          synergies: ['Family Planning Programs'],
          conflicts: []
        },
        reason: 'Lower cost alternative with faster implementation',
        improvement: 15
      }
    ];

    const result: OptimizationResult = {
      score: Math.min(95, 60 + (synergies.length * 10) - (conflicts.length * 5)),
      efficiency: Math.round(efficiency),
      riskLevel,
      recommendations,
      synergies,
      conflicts,
      alternatives
    };

    setIsAnalyzing(false);
    setOptimization(result);
    onOptimizationChange(result);
    return result;
  };

  useEffect(() => {
    if (interventions.length > 0) {
      analyzeBundle();
    }
  }, [interventions]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/20 text-green-300';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'High': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <Card className="p-6 bg-white/5 border-white/10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">AI Bundle Optimizer</h3>
              <p className="text-sm text-gray-400">ML-powered intervention analysis and recommendations</p>
            </div>
          </div>
          
          <Button
            onClick={analyzeBundle}
            disabled={isAnalyzing || interventions.length === 0}
            className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 mr-2"
              >
                <Brain className="w-4 h-4" />
              </motion.div>
            ) : (
              <Brain className="w-4 h-4 mr-2" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Re-analyze Bundle'}
          </Button>
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/30 text-center"
            >
              <div className="space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center"
                >
                  <Brain className="w-8 h-8 text-purple-400" />
                </motion.div>
                <div className="text-white font-medium">AI Analysis in Progress</div>
                <div className="text-sm text-gray-400">
                  Analyzing interventions, detecting synergies, and optimizing resource allocation...
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-gray-400">Processing synergies...</div>
                  <Progress value={33} className="h-1" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {optimization && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Optimization Score</div>
                    <div className={`text-2xl font-bold ${getScoreColor(optimization.score)}`}>
                      {optimization.score}/100
                    </div>
                  </div>
                  <Target className="h-8 w-8 text-purple-400" />
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Efficiency Ratio</div>
                    <div className="text-2xl font-bold text-green-400">
                      {optimization.efficiency}%
                    </div>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-400" />
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Risk Level</div>
                    <Badge className={getRiskColor(optimization.riskLevel)}>
                      {optimization.riskLevel}
                    </Badge>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-400" />
                </div>
              </Card>
            </div>

            {/* Detailed Analysis Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-white/10">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="synergies">Synergies</TabsTrigger>
                <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
                <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-400" />
                    AI Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {optimization.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="synergies" className="space-y-4">
                <div className="space-y-3">
                  {optimization.synergies.map((synergy, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-white font-medium mb-1">
                            {synergy.from} → {synergy.to}
                          </div>
                          <div className="text-sm text-gray-300 mb-2">{synergy.benefit}</div>
                          <Badge className="bg-green-500/20 text-green-300">
                            +{synergy.impact}% impact boost
                          </Badge>
                        </div>
                        <TrendingUp className="h-5 w-5 text-green-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="conflicts" className="space-y-4">
                <div className="space-y-3">
                  {optimization.conflicts.length > 0 ? (
                    optimization.conflicts.map((conflict, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg border border-red-500/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-white font-medium mb-1">
                              {conflict.from} ⚡ {conflict.to}
                            </div>
                            <div className="text-sm text-gray-300 mb-2">{conflict.issue}</div>
                            <Badge className={getRiskColor(conflict.severity)}>
                              {conflict.severity} severity
                            </Badge>
                          </div>
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-400">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                      <div className="text-white font-medium">No conflicts detected</div>
                      <div className="text-sm">Your intervention bundle is well-aligned</div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="alternatives" className="space-y-4">
                <div className="space-y-3">
                  {optimization.alternatives.map((alt, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-white font-medium mb-1">{alt.intervention.name}</div>
                          <div className="text-sm text-gray-300 mb-2">{alt.reason}</div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-500/20 text-blue-300">
                              {alt.intervention.category}
                            </Badge>
                            <Badge className="bg-green-500/20 text-green-300">
                              +{alt.improvement}% improvement
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-white/30 text-white">
                          Consider
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default AIBundleOptimizer;