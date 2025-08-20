import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Save, AlertTriangle, TrendingUp } from 'lucide-react';
import type { SignalReading } from '@/services/capacity-decision/types';

interface BandsWeightsStudioProps {
  reading: SignalReading;
  onSave: () => void;
  rationale: string;
  onRationaleChange: (value: string) => void;
  busy: boolean;
}

export const BandsWeightsStudio: React.FC<BandsWeightsStudioProps> = ({
  reading,
  onSave,
  rationale,
  onRationaleChange,
  busy
}) => {
  const [tierWeights, setTierWeights] = useState({
    T1: 50,
    T2: 30,
    T3: 20
  });

  const [bands, setBands] = useState([
    { 
      indicator: 'Composite Error (Tier-1)', 
      lower: 0.2, 
      upper: 0.8, 
      smoothing: 0.3, 
      hitFreq: 12, 
      renewals: 1 
    },
    { 
      indicator: 'Dispersion Index (T2/T3)', 
      lower: 0.1, 
      upper: 0.6, 
      smoothing: 0.25, 
      hitFreq: 8, 
      renewals: 0 
    },
    { 
      indicator: 'Hub Saturation', 
      lower: 0.3, 
      upper: 0.85, 
      smoothing: 0.4, 
      hitFreq: 15, 
      renewals: 2 
    }
  ]);

  const updateTierWeight = (tier: 'T1' | 'T2' | 'T3', value: number) => {
    setTierWeights(prev => ({ ...prev, [tier]: value }));
  };

  const totalWeight = tierWeights.T1 + tierWeights.T2 + tierWeights.T3;
  const needsReview = bands.some(b => b.renewals > 0);

  const dispersionHeatmap = [
    { tier: 'T1', indicators: [0.2, 0.1, 0.3, 0.4, 0.2] },
    { tier: 'T2', indicators: [0.5, 0.6, 0.3, 0.2, 0.7] },
    { tier: 'T3', indicators: [0.3, 0.4, 0.8, 0.5, 0.4] }
  ];

  return (
    <div className="space-y-6">
      {/* Policy Ribbon */}
      {needsReview && (
        <Alert className="border-warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Changes require review in 14 days (META-L01). Some bands have been renewed without evaluation.
          </AlertDescription>
        </Alert>
      )}

      {/* Tier Weights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tier Weights
          </CardTitle>
          <CardDescription>
            Adjust the relative importance of each tier. Total must equal 100%.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {Object.entries(tierWeights).map(([tier, weight]) => (
              <div key={tier} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">{tier}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono min-w-[3ch]">{weight}%</span>
                    <Badge variant={weight < 10 ? 'destructive' : 'secondary'} className="text-xs">
                      {weight < 10 ? 'Low' : weight > 60 ? 'High' : 'Normal'}
                    </Badge>
                  </div>
                </div>
                <Slider
                  value={[weight]}
                  onValueChange={([value]) => updateTierWeight(tier as any, value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Weight</span>
            <Badge variant={totalWeight === 100 ? 'secondary' : 'destructive'}>
              {totalWeight}%
            </Badge>
          </div>

          {totalWeight !== 100 && (
            <Alert className="border-warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Total weight must equal 100%. Currently {totalWeight}%.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Dispersion Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Dispersion Heatmap</CardTitle>
          <CardDescription>
            Visual representation of dispersion across tiers and indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {dispersionHeatmap.map((row) => (
              <div key={row.tier} className="flex items-center gap-2">
                <div className="w-8 text-sm font-medium">{row.tier}</div>
                <div className="flex gap-1 flex-1">
                  {row.indicators.map((value, i) => (
                    <div
                      key={i}
                      className="h-4 flex-1 rounded-sm"
                      style={{
                        backgroundColor: `hsl(${120 - value * 120}, 60%, ${50 + value * 30}%)`
                      }}
                      title={`Indicator ${i + 1}: ${value.toFixed(2)}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DE-Band Editor */}
      <Card>
        <CardHeader>
          <CardTitle>DE-Band Editor</CardTitle>
          <CardDescription>
            Configure decision engine band parameters and monitoring thresholds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Indicator</TableHead>
                <TableHead>Lower</TableHead>
                <TableHead>Upper</TableHead>
                <TableHead>Smoothing α</TableHead>
                <TableHead>Hit Freq</TableHead>
                <TableHead>Renewals</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bands.map((band, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{band.indicator}</TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{band.lower.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{band.upper.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{band.smoothing.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={band.hitFreq > 10 ? 'destructive' : 'secondary'}>
                      {band.hitFreq}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={band.renewals > 0 ? 'destructive' : 'secondary'}>
                      {band.renewals}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={onSave}
          disabled={busy || !rationale.trim() || totalWeight !== 100}
          className="min-w-[160px]"
        >
          <Save className="mr-2 h-4 w-4" />
          {busy ? 'Saving...' : 'Save Band/Weight Changes'}
        </Button>
      </div>
    </div>
  );
};