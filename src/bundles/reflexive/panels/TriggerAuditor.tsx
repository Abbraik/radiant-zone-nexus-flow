import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/lang/language.context";
import { fmt } from "@/lib/lang/language.formatters";
import { AlertCircle, Clock, RefreshCcw } from "lucide-react";

export default function TriggerAuditor() {
  const { t, x } = useLang();

  // Mock trigger data
  const mockTriggers = [
    {
      id: "trigger-001",
      name: "High Wait Times",
      frequency: 15,
      expected: 5,
      autoRenewals: 8,
      lastFired: "2024-01-20T14:30:00Z",
      status: "too_frequent"
    },
    {
      id: "trigger-002", 
      name: "Capacity Alert",
      frequency: 2,
      expected: 8,
      autoRenewals: 0,
      lastFired: "2024-01-10T09:15:00Z", 
      status: "too_late"
    },
    {
      id: "trigger-003",
      name: "Quality Drop",
      frequency: 6,
      expected: 6,
      autoRenewals: 12,
      lastFired: "2024-01-21T11:45:00Z",
      status: "auto_renewal"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "too_frequent": return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "too_late": return <Clock className="h-4 w-4 text-amber-600" />;
      case "auto_renewal": return <RefreshCcw className="h-4 w-4 text-blue-600" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "too_frequent": return "Too frequent";
      case "too_late": return "Late triggers";
      case "auto_renewal": return "Auto-renewal";
      default: return "Normal";
    }
  };

  return (
    <div className="grid gap-4">
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">{t("concept.guardrail_audit")}</CardTitle>
          <CardDescription>
            {x("concept.guardrail_audit") || "Review and optimize trigger performance"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">1</p>
              <p className="text-xs text-muted-foreground">Too frequent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">1</p>
              <p className="text-xs text-muted-foreground">Late triggers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">1</p>
              <p className="text-xs text-muted-foreground">Auto-renewals</p>
            </div>
          </div>

          {/* Trigger List */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium">Recent Triggers (30 days)</h5>
            {mockTriggers.map((trigger) => (
              <div key={trigger.id} className="rounded-lg border bg-card p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(trigger.status)}
                      <h6 className="font-medium">{trigger.name}</h6>
                      <Badge variant="outline" className="text-xs">
                        {getStatusText(trigger.status)}
                      </Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span>Frequency: </span>
                        <span className={trigger.frequency > trigger.expected ? 'text-red-600 font-medium' : 
                                       trigger.frequency < trigger.expected * 0.5 ? 'text-amber-600 font-medium' : ''}>
                          {trigger.frequency}
                        </span>
                        <span> (expected ~{trigger.expected})</span>
                      </div>
                      <div>
                        <span>{t("metric.renewal_rate")}: </span>
                        <span className={trigger.autoRenewals > 5 ? 'text-blue-600 font-medium' : ''}>
                          {trigger.autoRenewals}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Last fired: {new Date(trigger.lastFired).toLocaleDateString()}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Adjust
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button size="sm">Batch Retune</Button>
            <Button variant="outline" size="sm">Export Audit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}