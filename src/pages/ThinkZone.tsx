import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Settings, Play, Lightbulb } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { ProgressBar } from '../components/ui/progress-bar';
import { TensionChip } from '../components/ui/tension-chip';
import { useMockSprints } from '../hooks/use-mock-data';
import type { TensionLevel, LeverageType, ThinkFormData } from '../types';

const leverageOptions = [
  {
    value: 'high-leverage' as LeverageType,
    label: 'High Leverage',
    description: 'Maximum impact, system-wide changes',
    icon: '🚀'
  },
  {
    value: 'medium-leverage' as LeverageType,
    label: 'Medium Leverage',
    description: 'Moderate impact, focused improvements',
    icon: '⚡'
  },
  {
    value: 'low-leverage' as LeverageType,
    label: 'Low Leverage',
    description: 'Targeted fixes, specific issues',
    icon: '🔧'
  }
];

export const ThinkZone: React.FC = () => {
  const { data: sprints, isLoading } = useMockSprints();
  const [formData, setFormData] = useState<ThinkFormData>({
    tension: 'medium',
    srt: 12,
    leverage: 'medium-leverage'
  });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const currentSprint = sprints?.[0];
  const weekProgress = currentSprint ? (currentSprint.week / currentSprint.totalWeeks) * 100 : 0;

  const handleSubmit = () => {
    console.log('Starting sprint with data:', formData);
    // Here you would typically create a new sprint
  };

  return (
    <div className="space-y-6 animate-entrance">
      {/* Header */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
          <Lightbulb className="h-8 w-8 text-primary" />
          Think Zone
        </h1>
        <p className="text-foreground-muted max-w-2xl mx-auto">
          Plan your sprint by analyzing tension levels, setting rhythm timelines, and selecting leverage strategies
        </p>
      </motion.div>

      {/* Main Panel */}
      <Card className="zone-panel">
        <div className="space-y-6">
          {/* Sprint Progress */}
          {currentSprint && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Week {currentSprint.week}/{currentSprint.totalWeeks}
                  </h3>
                  <p className="text-sm text-foreground-muted">Current Sprint Progress</p>
                </div>
                <TensionChip tension={currentSprint.tension} />
              </div>
              <ProgressBar
                value={currentSprint.week}
                max={currentSprint.totalWeeks}
                label="Sprint Timeline"
                variant={currentSprint.tension === 'high' ? 'danger' : 'default'}
              />
            </motion.div>
          )}

          {/* Tension Analysis */}
          <div className="space-y-4">
            <Label className="text-base font-medium text-foreground">Tension Level</Label>
            <Select
              value={formData.tension}
              onValueChange={(value: TensionLevel) => 
                setFormData(prev => ({ ...prev, tension: value }))
              }
            >
              <SelectTrigger className="glass-secondary">
                <SelectValue placeholder="Select tension level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">🔥 High Tension - Critical issues</SelectItem>
                <SelectItem value="medium">⚡ Medium Tension - Important improvements</SelectItem>
                <SelectItem value="low">🟢 Low Tension - Optimization opportunities</SelectItem>
                <SelectItem value="neutral">⚪ Neutral - Maintenance mode</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-foreground-muted">
              High tension indicates critical system stress requiring immediate intervention
            </p>
          </div>

          {/* SRT Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium text-foreground">
                Sprint Rhythm Time (SRT)
              </Label>
              <span className="text-sm font-medium text-primary">
                {formData.srt} months
              </span>
            </div>
            <Slider
              value={[formData.srt]}
              onValueChange={([value]) => 
                setFormData(prev => ({ ...prev, srt: value }))
              }
              min={1}
              max={24}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-foreground-muted">
              Optimal rhythm for sustainable improvement cycles
            </p>
          </div>

          {/* Leverage Strategy */}
          <div className="space-y-4">
            <Label className="text-base font-medium text-foreground">Leverage Strategy</Label>
            <div className="grid gap-3">
              {leverageOptions.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => setFormData(prev => ({ ...prev, leverage: option.value }))}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-fast text-left
                    ${formData.leverage === option.value
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border hover:border-border-accent bg-glass-secondary text-foreground-muted hover:text-foreground'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm opacity-75">{option.description}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Primary Action */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={handleSubmit}
              size="lg"
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3 rounded-xl shadow-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Sprint
            </Button>
          </motion.div>

          {/* Advanced Options */}
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced" className="border-border-subtle">
              <AccordionTrigger className="text-foreground-muted hover:text-foreground">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Advanced Configuration
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {/* DE-Band Configuration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">DE-Band Lower Bound</Label>
                    <Input
                      type="number"
                      placeholder="0.0"
                      className="glass-secondary mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">DE-Band Upper Bound</Label>
                    <Input
                      type="number"
                      placeholder="10.0"
                      className="glass-secondary mt-2"
                    />
                  </div>
                </div>

                {/* Loop Metadata */}
                <div>
                  <Label className="text-sm">Loop ID</Label>
                  <Input
                    placeholder="auto-generated-id"
                    className="glass-secondary mt-2"
                  />
                </div>

                <div>
                  <Label className="text-sm">Tags</Label>
                  <Input
                    placeholder="platform, critical, customer-facing"
                    className="glass-secondary mt-2"
                  />
                </div>

                {/* CLD Studio Link */}
                <Button variant="outline" className="w-full">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Open CLD Studio
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Card>
    </div>
  );
};