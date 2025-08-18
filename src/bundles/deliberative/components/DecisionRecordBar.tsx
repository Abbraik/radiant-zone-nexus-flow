import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Package, 
  RotateCcw, 
  AlertTriangle, 
  FileText,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface DecisionRecordBarProps {
  selectedOptions: any[];
  mcdaResult?: any;
  coverageResult?: any;
  onApproveOptionSet: () => void;
  onPackageForExecution: () => void;
  onSwitchMode: () => void;
  isPackaging?: boolean;
  readonly?: boolean;
}

export const DecisionRecordBar: React.FC<DecisionRecordBarProps> = ({
  selectedOptions,
  mcdaResult,
  coverageResult,
  onApproveOptionSet,
  onPackageForExecution,
  onSwitchMode,
  isPackaging = false,
  readonly = false
}) => {
  const { toast } = useToast();
  const [rationale, setRationale] = useState('');
  const [stakeholdersConsulted, setStakeholdersConsulted] = useState('');
  const [showApprovalForm, setShowApprovalForm] = useState(false);

  // Check requirements
  const hasSelectedOptions = selectedOptions.length > 0;
  const hasMCDAResult = !!mcdaResult;
  const hasRationale = rationale.length >= 180;
  const hasStakeholders = stakeholdersConsulted.trim().length > 0;
  const hasGaps = coverageResult?.gaps?.length > 0;

  const canApprove = hasSelectedOptions && hasMCDAResult && hasRationale && hasStakeholders && !hasGaps;
  const canPackage = canApprove; // Same requirements for now

  const handleApprove = () => {
    if (!canApprove) {
      toast({
        title: "Requirements not met",
        description: "Please complete all requirements before approval.",
        variant: "destructive"
      });
      return;
    }

    onApproveOptionSet();
    setShowApprovalForm(false);
    toast({
      title: "Option set approved",
      description: "Decision record has been created."
    });
  };

  const getCompletionPercentage = () => {
    const requirements = [hasSelectedOptions, hasMCDAResult, hasRationale, hasStakeholders, !hasGaps];
    const completed = requirements.filter(Boolean).length;
    return (completed / requirements.length) * 100;
  };

  const getRequirementStatus = (met: boolean) => ({
    icon: met ? CheckCircle : AlertTriangle,
    color: met ? 'text-green-600' : 'text-orange-600',
    bgColor: met ? 'bg-green-50 dark:bg-green-950/20' : 'bg-orange-50 dark:bg-orange-950/20'
  });

  if (showApprovalForm) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg"
      >
        <div className="container mx-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Decision Record</h3>
            <Button variant="ghost" onClick={() => setShowApprovalForm(false)}>
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rationale">
                  Decision Rationale <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="rationale"
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="Provide detailed rationale for the selected options, including analysis methodology, key trade-offs considered, and justification for the decision..."
                  className="min-h-[120px]"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {rationale.length}/180 characters minimum
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stakeholders">
                  Stakeholders Consulted <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="stakeholders"
                  value={stakeholdersConsulted}
                  onChange={(e) => setStakeholdersConsulted(e.target.value)}
                  placeholder="List stakeholders who were consulted during the decision process..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">Decision Context</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Selected Options:</span>
                    <span className="font-medium">{selectedOptions.length}</span>
                  </div>
                  
                  {mcdaResult && (
                    <div className="flex justify-between">
                      <span>Top Ranked Option:</span>
                      <span className="font-medium">
                        {mcdaResult.scores[0]?.name || 'N/A'}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Coverage Gaps:</span>
                    <span className={`font-medium ${hasGaps ? 'text-orange-600' : 'text-green-600'}`}>
                      {coverageResult?.gaps?.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Decision Date:</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Attached Evidence</h4>
                <div className="text-sm text-muted-foreground">
                  • MCDA Analysis Results
                  • Coverage Analysis Report
                  • Stakeholder Consultation Notes
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              This decision will be recorded and auditable
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowApprovalForm(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleApprove}
                disabled={!canApprove}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Record Decision
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg"
    >
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {/* Progress Section */}
              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Decision Progress</div>
                  <div className="flex items-center gap-2">
                    <Progress value={getCompletionPercentage()} className="w-32" />
                    <span className="text-xs text-muted-foreground">
                      {Math.round(getCompletionPercentage())}%
                    </span>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-12" />

                {/* Requirements Checklist */}
                <div className="flex items-center gap-3">
                  {[
                    { label: 'Options', met: hasSelectedOptions },
                    { label: 'MCDA', met: hasMCDAResult },
                    { label: 'Coverage', met: !hasGaps },
                    { label: 'Rationale', met: hasRationale },
                    { label: 'Stakeholders', met: hasStakeholders }
                  ].map((req, index) => {
                    const status = getRequirementStatus(req.met);
                    const Icon = status.icon;
                    return (
                      <div key={index} className="flex items-center gap-1">
                        <Icon className={`w-4 h-4 ${status.color}`} />
                        <span className={`text-xs ${req.met ? 'text-muted-foreground' : 'text-orange-600'}`}>
                          {req.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={onSwitchMode}
                  className="flex items-center gap-2"
                  disabled={readonly}
                >
                  <RotateCcw className="w-4 h-4" />
                  Switch Mode
                </Button>

                <Button
                  onClick={() => setShowApprovalForm(true)}
                  disabled={!hasSelectedOptions || readonly}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Option Set
                </Button>

                <Button
                  onClick={onPackageForExecution}
                  disabled={!canPackage || isPackaging || readonly}
                  className="flex items-center gap-2"
                  variant="default"
                >
                  {isPackaging ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <Package className="w-4 h-4" />
                  )}
                  Package for Execution
                </Button>
              </div>
            </div>

            {/* Warning about gaps */}
            {hasGaps && (
              <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Coverage gaps detected - create options for all loops before approval
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};