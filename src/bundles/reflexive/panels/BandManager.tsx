import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLang } from "@/lib/lang/language.context";
import { fmt } from "@/lib/lang/language.formatters";
import { Target, AlertTriangle } from "lucide-react";

export default function BandManager() {
  const { t, x } = useLang();
  const [upperBound, setUpperBound] = React.useState("45");
  const [lowerBound, setLowerBound] = React.useState("35");
  const [justification, setJustification] = React.useState("");

  // Mock data for band hits
  const mockData = {
    currentUpper: 45,
    currentLower: 35,
    recentHits: 12,
    falseAlarms: 3,
    missedEvents: 1,
    lastUpdate: "2024-01-15"
  };

  const hitsInRange = mockData.recentHits >= 5 && mockData.recentHits <= 15;

  return (
    <div className="grid gap-4">
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5" />
            {t("concept.band_tuning")}
          </CardTitle>
          <CardDescription>
            {x("concept.band_tuning") || "Adjust the safe operating ranges for indicators"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="rounded-lg bg-muted/50 p-4">
            <h4 className="text-sm font-medium mb-3">Current Performance</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{mockData.recentHits}</p>
                <p className="text-xs text-muted-foreground">{t("metric.band_hits")} (30d)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{mockData.falseAlarms}</p>
                <p className="text-xs text-muted-foreground">False alarms</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{mockData.missedEvents}</p>
                <p className="text-xs text-muted-foreground">Missed events</p>
              </div>
            </div>
            {!hitsInRange && (
              <div className="flex items-center gap-2 mt-3 p-2 rounded bg-amber-50 border border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-800">
                  Band hits outside optimal range (5-15 per month)
                </span>
              </div>
            )}
          </div>

          {/* Current Bounds */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium">Current {t("concept.safe_range")}</h5>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Upper Bound</label>
                <Input
                  value={upperBound}
                  onChange={(e) => setUpperBound(e.target.value)}
                  placeholder="45"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Lower Bound</label>
                <Input
                  value={lowerBound}
                  onChange={(e) => setLowerBound(e.target.value)}
                  placeholder="35"
                />
              </div>
            </div>
          </div>

          {/* Justification */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Justification Note</label>
            <Textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explain why these bounds are being changed..."
              rows={3}
            />
          </div>

          {/* Historic Preview */}
          <div className="rounded-lg border bg-card p-4">
            <h5 className="text-sm font-medium mb-2">Impact Preview</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">With new bounds:</span>
                <p>~8 {t("metric.band_hits").toLowerCase()} expected</p>
              </div>
              <div>
                <span className="text-muted-foreground">Last updated:</span>
                <p>{mockData.lastUpdate}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button size="sm" disabled={!justification.trim()}>
              Publish Band Change
            </Button>
            <Button variant="outline" size="sm">Preview Impact</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}