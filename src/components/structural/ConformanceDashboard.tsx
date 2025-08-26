import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertTriangle, Play, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ConformanceDashboardProps {
  dossierId: string;
}

export const ConformanceDashboard: React.FC<ConformanceDashboardProps> = ({ dossierId }) => {
  const queryClient = useQueryClient();

  // Fetch latest conformance run
  const { data: latestRun, isLoading: runLoading } = useQuery({
    queryKey: ['conformance-run', dossierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conformance_runs')
        .select('*')
        .eq('dossier_id', dossierId)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    }
  });

  // Fetch conformance rules
  const { data: rules = [] } = useQuery({
    queryKey: ['conformance-rules', dossierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conformance_rules')
        .select('*')
        .eq('dossier_id', dossierId)
        .order('created_at');
        
      if (error) throw error;
      return data;
    }
  });

  // Fetch findings for latest run
  const { data: findings = [] } = useQuery({
    queryKey: ['conformance-findings', latestRun?.run_id],
    queryFn: async () => {
      if (!latestRun?.run_id) return [];
      
      const { data, error } = await supabase
        .from('conformance_findings')
        .select(`
          *,
          conformance_rules (
            rule_title,
            severity,
            rule_expr
          )
        `)
        .eq('run_id', latestRun.run_id);
        
      if (error) throw error;
      return data;
    },
    enabled: !!latestRun?.run_id
  });

  // Run conformance check mutation
  const runCheckMutation = useMutation({
    mutationFn: async () => {
      const response = await supabase.functions.invoke('struct-conformance-runner', {
        body: { dossier_id: dossierId }
      });
      
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      toast.success('Conformance check completed');
      queryClient.invalidateQueries({ queryKey: ['conformance-run'] });
      queryClient.invalidateQueries({ queryKey: ['conformance-findings'] });
    },
    onError: (error: any) => {
      toast.error(`Conformance check failed: ${error.message}`);
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warn':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'text-green-600 bg-green-50';
      case 'warn': return 'text-yellow-600 bg-yellow-50';
      case 'fail': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const passRate = latestRun?.summary?.pass_rate || 0;
  const mustRules = rules.filter(r => r.severity === 'must').length;
  const shouldRules = rules.filter(r => r.severity === 'should').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Conformance Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor compliance with standards and requirements
          </p>
        </div>
        <Button
          onClick={() => runCheckMutation.mutate()}
          disabled={runCheckMutation.isPending}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          {runCheckMutation.isPending ? 'Running...' : 'Run Check'}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {getStatusIcon(latestRun?.status || 'unknown')}
              <div>
                <p className="text-2xl font-bold">
                  {latestRun?.status?.toUpperCase() || 'UNKNOWN'}
                </p>
                <p className="text-sm text-muted-foreground">Overall Status</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{Math.round(passRate * 100)}%</span>
                <Badge variant="outline">Pass Rate</Badge>
              </div>
              <Progress value={passRate * 100} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {latestRun?.summary?.passed_rules || 0} of {latestRun?.summary?.total_rules || 0} rules
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-red-600">
                  {latestRun?.summary?.failed_must_rules || 0}
                </span>
                <Badge variant="destructive">MUST Failures</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {mustRules} MUST rules, {shouldRules} SHOULD rules
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-sm">Last Run</span>
              </div>
              <p className="text-sm font-medium">
                {latestRun?.finished_at 
                  ? new Date(latestRun.finished_at).toLocaleString()
                  : 'Never'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Conformance Rules</CardTitle>
        </CardHeader>
        <CardContent>
          {findings.length > 0 ? (
            <div className="space-y-3">
              {findings.map((finding) => {
                const rule = finding.conformance_rules;
                return (
                  <div
                    key={finding.finding_id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {finding.passed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{rule?.rule_title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={rule?.severity === 'must' ? 'destructive' : 'secondary'}>
                            {rule?.severity?.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {rule?.rule_expr?.type || 'unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={finding.passed ? 'text-green-600' : 'text-red-600'}
                      >
                        {finding.passed ? 'PASS' : 'FAIL'}
                      </Badge>
                      {finding.detail && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {finding.detail.error || 
                           finding.detail.current_value ||
                           finding.detail.status ||
                           'Details available'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {runLoading ? 'Loading...' : 'No conformance data available. Run a check to get started.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Run History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {latestRun ? (
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {getStatusIcon(latestRun.status)}
                  <div>
                    <p className="font-medium">
                      {new Date(latestRun.started_at).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {latestRun.summary?.total_rules || 0} rules evaluated
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(latestRun.status)}>
                  {latestRun.status?.toUpperCase()}
                </Badge>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                No runs yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};