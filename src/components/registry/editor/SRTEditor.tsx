import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

interface SRTEditorProps {
  loopId?: string;
}

export const SRTEditor: React.FC<SRTEditorProps> = ({ loopId }) => {
  const [srtData, setSrtData] = useState({
    window_start: '',
    window_end: '',
    reflex_horizon: '4',
    reflex_unit: 'hours',
    cadence: '1',
    cadence_unit: 'day'
  });

  const [warnings, setWarnings] = useState<string[]>([]);

  const handleFieldChange = (field: string, value: string) => {
    setSrtData(prev => ({ ...prev, [field]: value }));
    
    // Check for warnings
    const newWarnings: string[] = [];
    
    if (field === 'reflex_horizon' && parseInt(value) < 2) {
      newWarnings.push('Reflex horizon too short - may cause instability');
    }
    
    setWarnings(newWarnings);
  };

  const horizonOptions = [
    { value: '1', label: '1 hour' },
    { value: '2', label: '2 hours' },
    { value: '4', label: '4 hours' },
    { value: '8', label: '8 hours' },
    { value: '12', label: '12 hours' },
    { value: '24', label: '1 day' },
    { value: '72', label: '3 days' },
    { value: '168', label: '1 week' }
  ];

  const cadenceOptions = [
    { value: '15m', label: '15 minutes' },
    { value: '30m', label: '30 minutes' },
    { value: '1h', label: '1 hour' },
    { value: '4h', label: '4 hours' },
    { value: '1d', label: '1 day' },
    { value: '1w', label: '1 week' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">SRT & Cadence Configuration</h2>
        <Button>Save SRT Settings</Button>
      </div>

      {warnings.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <h4 className="font-medium text-orange-800">Configuration Warnings</h4>
                <ul className="text-sm text-orange-700 mt-1">
                  {warnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Window */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              SRT Time Window
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="window_start">Window Start</Label>
              <Input
                id="window_start"
                type="datetime-local"
                value={srtData.window_start}
                onChange={(e) => handleFieldChange('window_start', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="window_end">Window End</Label>
              <Input
                id="window_end"
                type="datetime-local"
                value={srtData.window_end}
                onChange={(e) => handleFieldChange('window_end', e.target.value)}
                className="mt-1"
              />
            </div>

            {srtData.window_start && srtData.window_end && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm">
                  <div className="font-medium">Window Duration</div>
                  <div className="text-muted-foreground">
                    {Math.round((new Date(srtData.window_end).getTime() - new Date(srtData.window_start).getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reflex Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Reflex Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="reflex_horizon">Reflex Horizon</Label>
              <Select
                value={srtData.reflex_horizon}
                onValueChange={(value) => handleFieldChange('reflex_horizon', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select horizon" />
                </SelectTrigger>
                <SelectContent>
                  {horizonOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Time window for reflex actions
              </p>
            </div>

            <div>
              <Label htmlFor="cadence">Evaluation Cadence</Label>
              <Select
                value={`${srtData.cadence}${srtData.cadence_unit.charAt(0)}`}
                onValueChange={(value) => {
                  const match = value.match(/^(\d+)([a-z])$/);
                  if (match) {
                    handleFieldChange('cadence', match[1]);
                    handleFieldChange('cadence_unit', match[2] === 'h' ? 'hour' : match[2] === 'd' ? 'day' : 'week');
                  }
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select cadence" />
                </SelectTrigger>
                <SelectContent>
                  {cadenceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                How often to evaluate for reflex actions
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Timeline Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Timeline visualization coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>SRT Configuration Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Time Window</h4>
              <p className="text-muted-foreground">
                Defines the active period for this SRT configuration. Loop behavior outside this window uses default settings.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Reflex Horizon</h4>
              <p className="text-muted-foreground">
                The time span for reflex actions. Shorter horizons react faster but may be less stable.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Cadence</h4>
              <p className="text-muted-foreground">
                How frequently the system evaluates conditions and triggers reflexes. Balance responsiveness with computational load.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};