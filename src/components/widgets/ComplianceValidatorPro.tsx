import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle, FileText, ExternalLink, Zap } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface PolicyRule {
  id: string;
  name: string;
  description: string;
  category: 'Legal' | 'Ethical' | 'Budget' | 'Timeline' | 'Resource';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  source: string;
  documentation: string;
}

interface ComplianceViolation {
  ruleId: string;
  interventionId: string;
  interventionName: string;
  violation: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  suggestion: string;
  autoFixAvailable: boolean;
  estimatedFixTime: string;
}

interface ComplianceResult {
  overallScore: number;
  totalRules: number;
  passed: number;
  violations: ComplianceViolation[];
  warnings: ComplianceViolation[];
  lastChecked: Date;
}

const mockPolicyRules: PolicyRule[] = [
  {
    id: 'rule-1',
    name: 'Population Policy Framework 2024',
    description: 'All population interventions must align with national demographic transition goals',
    category: 'Legal',
    severity: 'Critical',
    source: 'Ministry of Health',
    documentation: 'https://gov.example.com/policy/population-2024'
  },
  {
    id: 'rule-2',
    name: 'Gender Equality Standards',
    description: 'Interventions must demonstrate gender-inclusive design and impact assessment',
    category: 'Ethical',
    severity: 'High',
    source: 'Gender Affairs Department',
    documentation: 'https://gov.example.com/gender/standards'
  },
  {
    id: 'rule-3',
    name: 'Budget Allocation Limits',
    description: 'Health interventions cannot exceed 40% of total development budget allocation',
    category: 'Budget',
    severity: 'Critical',
    source: 'Ministry of Finance',
    documentation: 'https://gov.example.com/finance/limits'
  },
  {
    id: 'rule-4',
    name: 'Environmental Impact Assessment',
    description: 'Infrastructure projects require environmental compliance certification',
    category: 'Legal',
    severity: 'High',
    source: 'Environmental Protection Agency',
    documentation: 'https://gov.example.com/environment/assessment'
  },
  {
    id: 'rule-5',
    name: 'Stakeholder Consultation Requirements',
    description: 'Community engagement protocols must be followed for social interventions',
    category: 'Ethical',
    severity: 'Medium',
    source: 'Community Affairs Office',
    documentation: 'https://gov.example.com/community/consultation'
  }
];

interface ComplianceValidatorProProps {
  interventions: Array<{ id: string; name: string; category: string; resourceCost: number; }>;
  onComplianceChange: (result: ComplianceResult) => void;
}

export const ComplianceValidatorPro: React.FC<ComplianceValidatorProProps> = ({
  interventions,
  onComplianceChange
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [complianceResult, setComplianceResult] = useState<ComplianceResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock compliance validation engine
  const validateCompliance = async (): Promise<ComplianceResult> => {
    setIsValidating(true);
    
    // Simulate rule engine processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const violations: ComplianceViolation[] = [];
    const warnings: ComplianceViolation[] = [];

    // Check budget allocation rule
    const healthInterventions = interventions.filter(i => i.category === 'Population');
    const totalHealthCost = healthInterventions.reduce((sum, i) => sum + i.resourceCost, 0);
    const totalCost = interventions.reduce((sum, i) => sum + i.resourceCost, 0);
    
    if (totalCost > 0 && (totalHealthCost / totalCost) > 0.4) {
      violations.push({
        ruleId: 'rule-3',
        interventionId: 'bundle',
        interventionName: 'Bundle Allocation',
        violation: `Health interventions represent ${Math.round((totalHealthCost / totalCost) * 100)}% of budget (limit: 40%)`,
        severity: 'Critical',
        suggestion: 'Reduce health intervention costs or add more development interventions',
        autoFixAvailable: false,
        estimatedFixTime: '30 minutes'
      });
    }

    // Check infrastructure environmental compliance
    const infrastructureInterventions = interventions.filter(i => 
      i.name.toLowerCase().includes('infrastructure') || 
      i.name.toLowerCase().includes('urban')
    );
    
    infrastructureInterventions.forEach(intervention => {
      warnings.push({
        ruleId: 'rule-4',
        interventionId: intervention.id,
        interventionName: intervention.name,
        violation: 'Environmental impact assessment documentation not provided',
        severity: 'High',
        suggestion: 'Upload environmental impact assessment or request exemption',
        autoFixAvailable: false,
        estimatedFixTime: '2-3 days'
      });
    });

    // Check gender inclusion
    const nonGenderInterventions = interventions.filter(i => 
      !i.name.toLowerCase().includes('women') && 
      !i.name.toLowerCase().includes('girls') &&
      !i.name.toLowerCase().includes('gender')
    );

    if (nonGenderInterventions.length > 0) {
      warnings.push({
        ruleId: 'rule-2',
        interventionId: 'bundle',
        interventionName: 'Bundle Gender Assessment',
        violation: `${nonGenderInterventions.length} interventions lack explicit gender impact analysis`,
        severity: 'Medium',
        suggestion: 'Add gender impact statements to intervention documentation',
        autoFixAvailable: true,
        estimatedFixTime: '15 minutes'
      });
    }

    const totalViolations = violations.length + warnings.length;
    const passed = mockPolicyRules.length - totalViolations;
    const overallScore = Math.max(0, Math.round((passed / mockPolicyRules.length) * 100));

    const result: ComplianceResult = {
      overallScore,
      totalRules: mockPolicyRules.length,
      passed,
      violations,
      warnings,
      lastChecked: new Date()
    };

    setIsValidating(false);
    setComplianceResult(result);
    onComplianceChange(result);
    return result;
  };

  useEffect(() => {
    if (interventions.length > 0) {
      validateCompliance();
    }
  }, [interventions]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Low': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const autoFixViolation = (violationId: string) => {
    // Mock auto-fix implementation
    if (complianceResult) {
      const updatedWarnings = complianceResult.warnings.filter(w => 
        !(w.ruleId === 'rule-2' && w.autoFixAvailable)
      );
      
      const updatedResult = {
        ...complianceResult,
        warnings: updatedWarnings,
        passed: complianceResult.passed + 1,
        overallScore: Math.round(((complianceResult.passed + 1) / complianceResult.totalRules) * 100)
      };
      
      setComplianceResult(updatedResult);
      onComplianceChange(updatedResult);
    }
  };

  return (
    <Card className="p-6 bg-white/5 border-white/10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Shield className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Compliance Validator Pro</h3>
              <p className="text-sm text-gray-400">Real-time policy rule engine and conflict detection</p>
            </div>
          </div>
          
          <Button
            onClick={validateCompliance}
            disabled={isValidating || interventions.length === 0}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-50"
          >
            {isValidating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 mr-2"
              >
                <Shield className="w-4 h-4" />
              </motion.div>
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            {isValidating ? 'Validating...' : 'Re-validate'}
          </Button>
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {isValidating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/30 text-center"
            >
              <div className="space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center"
                >
                  <Shield className="w-8 h-8 text-green-400" />
                </motion.div>
                <div className="text-white font-medium">Running Compliance Validation</div>
                <div className="text-sm text-gray-400">
                  Checking {mockPolicyRules.length} policy rules against intervention bundle...
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-gray-400">Processing rule engine...</div>
                  <Progress value={65} className="h-1" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {complianceResult && !isValidating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Compliance Score</div>
                    <div className={`text-2xl font-bold ${getScoreColor(complianceResult.overallScore)}`}>
                      {complianceResult.overallScore}%
                    </div>
                  </div>
                  <Shield className="h-8 w-8 text-green-400" />
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Rules Passed</div>
                    <div className="text-2xl font-bold text-blue-400">
                      {complianceResult.passed}/{complianceResult.totalRules}
                    </div>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-400" />
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Violations</div>
                    <div className="text-2xl font-bold text-red-400">
                      {complianceResult.violations.length}
                    </div>
                  </div>
                  <XCircle className="h-8 w-8 text-red-400" />
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Warnings</div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {complianceResult.warnings.length}
                    </div>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-400" />
                </div>
              </Card>
            </div>

            {/* Detailed Analysis Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-white/10">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="violations">Violations</TabsTrigger>
                <TabsTrigger value="rules">Policy Rules</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {complianceResult.overallScore >= 90 ? (
                    <Card className="p-4 bg-gradient-to-r from-green-500/10 to-teal-500/10 border-green-500/30">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 text-green-400" />
                        <div>
                          <div className="text-white font-medium">Excellent Compliance</div>
                          <div className="text-sm text-gray-300">Bundle meets all policy requirements</div>
                        </div>
                      </div>
                    </Card>
                  ) : complianceResult.violations.length > 0 ? (
                    <Card className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30">
                      <div className="flex items-center gap-3">
                        <XCircle className="h-6 w-6 text-red-400" />
                        <div>
                          <div className="text-white font-medium">Critical Issues Found</div>
                          <div className="text-sm text-gray-300">
                            {complianceResult.violations.length} violations need immediate attention
                          </div>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-yellow-400" />
                        <div>
                          <div className="text-white font-medium">Minor Issues</div>
                          <div className="text-sm text-gray-300">
                            {complianceResult.warnings.length} warnings to address
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  <Card className="p-4 bg-white/5 border-white/10">
                    <div className="space-y-2">
                      <div className="text-white font-medium">Last Validation</div>
                      <div className="text-sm text-gray-400">
                        {complianceResult.lastChecked.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Rules engine version: 2.1.4
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="violations" className="space-y-4">
                <div className="space-y-3">
                  {/* Critical Violations */}
                  {complianceResult.violations.map((violation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg border border-red-500/30"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <XCircle className="h-5 w-5 text-red-400" />
                              <span className="text-white font-medium">{violation.interventionName}</span>
                              <Badge className={getSeverityColor(violation.severity)}>
                                {violation.severity}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-300 mb-2">{violation.violation}</div>
                            <div className="text-sm text-blue-300">{violation.suggestion}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-400">
                            Est. fix time: {violation.estimatedFixTime}
                          </div>
                          {violation.autoFixAvailable && (
                            <Button
                              size="sm"
                              onClick={() => autoFixViolation(violation.ruleId)}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              <Zap className="w-3 h-3 mr-1" />
                              Auto Fix
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Warnings */}
                  {complianceResult.warnings.map((warning, index) => (
                    <motion.div
                      key={`warning-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (complianceResult.violations.length + index) * 0.1 }}
                      className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-5 w-5 text-yellow-400" />
                              <span className="text-white font-medium">{warning.interventionName}</span>
                              <Badge className={getSeverityColor(warning.severity)}>
                                {warning.severity}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-300 mb-2">{warning.violation}</div>
                            <div className="text-sm text-blue-300">{warning.suggestion}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-400">
                            Est. fix time: {warning.estimatedFixTime}
                          </div>
                          {warning.autoFixAvailable && (
                            <Button
                              size="sm"
                              onClick={() => autoFixViolation(warning.ruleId)}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              <Zap className="w-3 h-3 mr-1" />
                              Auto Fix
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {complianceResult.violations.length === 0 && complianceResult.warnings.length === 0 && (
                    <div className="p-6 text-center text-gray-400">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                      <div className="text-white font-medium">All Clear!</div>
                      <div className="text-sm">No compliance issues detected</div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="rules" className="space-y-4">
                <div className="space-y-3">
                  {mockPolicyRules.map((rule, index) => (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-blue-400" />
                            <span className="text-white font-medium">{rule.name}</span>
                            <Badge className={getSeverityColor(rule.severity)}>
                              {rule.severity}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {rule.category}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-300 mb-2">{rule.description}</div>
                          <div className="text-xs text-gray-400">Source: {rule.source}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/30 text-white"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Docs
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

export default ComplianceValidatorPro;