import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useLang } from "@/lib/lang/language.context";
import { fmt } from "@/lib/lang/language.formatters";
import { Settings, Activity } from "lucide-react";

export default function ControllerTuner() {
  const { t, x } = useLang();
  const [gain, setGain] = React.useState([0.6]);
  const [delay, setDelay] = React.useState([2]);

  // Mock oscillation data
  const oscillationLevel = 0.3;
  const isOscillating = oscillationLevel > 0.4;

  return (
    <div className="grid gap-4">
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5" />
            {t("concept.controller")}
          </CardTitle>
          <CardDescription>
            {x("concept.controller") || "Adjust how the system automatically responds to changes"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <Activity className={`h-5 w-5 ${isOscillating ? 'text-amber-600' : 'text-green-600'}`} />
              <div>
                <h4 className="text-sm font-medium">
                  {t("concept.oscillation")} Level
                </h4>
                <p className="text-lg font-semibold">
                  {fmt(oscillationLevel, { kind: "float", decimals: 2 })}
                  {isOscillating && (
                    <Badge variant="outline" className="ml-2 border-amber-500 text-amber-700">
                      {t("concept.oscillation")} detected
                    </Badge>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Gain Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium">Controller Gain</h5>
              <span className="text-sm text-muted-foreground">{gain[0].toFixed(1)}</span>
            </div>
            <Slider
              value={gain}
              onValueChange={setGain}
              max={1}
              min={0.1}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Lower values reduce {t("concept.oscillation").toLowerCase()}, higher values increase response speed
            </p>
          </div>

          {/* Delay Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium">{t("concept.lag")} (minutes)</h5>
              <span className="text-sm text-muted-foreground">{delay[0]}</span>
            </div>
            <Slider
              value={delay}
              onValueChange={setDelay}
              max={10}
              min={0}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Add delay to prevent rapid {t("concept.oscillation").toLowerCase()}
            </p>
          </div>

          {/* Presets */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium">Quick Presets</h5>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {setGain([0.3]); setDelay([5]);}}
              >
                Conservative
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {setGain([0.6]); setDelay([2]);}}
              >
                Balanced
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {setGain([0.9]); setDelay([0]);}}
              >
                Aggressive
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button size="sm">Apply Tuning</Button>
            <Button variant="outline" size="sm">Test Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}