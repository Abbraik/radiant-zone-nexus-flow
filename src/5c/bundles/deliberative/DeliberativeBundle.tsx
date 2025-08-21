import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { DeliberativeAnalysisProps, AnalysisFrameworkItem } from "./types.ui";
import { subtle } from "./ui.utils";
import { Info, Users, Play } from "lucide-react";

export default function DeliberativeBundle(props: DeliberativeAnalysisProps) {
  const {
    title,
    description,
    mode,
    modeDescription,
    timeframe,
    stakeholderGroup,
    objectives,
    analysisFramework,
    onTimeframeChange,
    onStakeholderGroupChange,
    onObjectivesChange,
    onFrameworkToggle,
    onInviteStakeholders,
    onBeginAnalysis,
    busy = false,
    fullScreenMode = false
  } = props;

  const timeframeOptions = [
    "1 week",
    "2 weeks", 
    "1 month",
    "2 months",
    "3 months"
  ];

  const stakeholderOptions = [
    "Core Team",
    "Extended Team",
    "Department Heads",
    "All Stakeholders"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {fullScreenMode && (
              <Badge variant="outline" className="ml-2">Full Screen Mode</Badge>
            )}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{description}</div>
        </div>
      </div>

      {/* Analysis Mode */}
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
            <div>
              <h3 className="font-medium text-foreground">{mode}</h3>
              <p className="text-sm text-muted-foreground mt-1">{modeDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Form */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Analysis Timeframe */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Analysis Timeframe</label>
          <select
            value={timeframe}
            onChange={(e) => onTimeframeChange(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={busy}
          >
            {timeframeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Stakeholder Groups */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Stakeholder Groups</label>
          <select
            value={stakeholderGroup}
            onChange={(e) => onStakeholderGroupChange(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={busy}
          >
            {stakeholderOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Strategic Objectives */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Strategic Objectives</label>
        <textarea
          value={objectives}
          onChange={(e) => onObjectivesChange(e.target.value)}
          placeholder="Define the key strategic objectives and success criteria..."
          className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          disabled={busy}
        />
      </div>

      {/* Analysis Framework */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Analysis Framework</label>
        <div className="grid md:grid-cols-2 gap-3">
          {analysisFramework.map(item => (
            <label key={item.id} className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={(e) => onFrameworkToggle(item.id, e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
                disabled={busy}
              />
              <span className="text-foreground">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={onInviteStakeholders}
          disabled={busy}
          className="flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          Invite Stakeholders
        </Button>
        <Button
          onClick={onBeginAnalysis}
          disabled={busy}
          className="flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Begin Analysis
        </Button>
      </div>
    </div>
  );
}