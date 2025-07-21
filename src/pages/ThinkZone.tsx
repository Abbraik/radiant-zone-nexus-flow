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

  const currentSprint = sprints?.[0];
  const weekProgress = currentSprint ? (currentSprint.week / currentSprint.totalWeeks) * 100 : 0;

  const handleSubmit = () => {
    console.log('Starting sprint with data:', formData);
    // Here you would typically create a new sprint
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Decor - Parallax CLD Network */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/5 blur-xl"
          animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-accent/5 blur-xl"
          animate={{ y: [0, 15, 0], scale: [1, 0.95, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full bg-primary/3 blur-2xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Hero Panel */}
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="panel-hero"
      >
        <div className="space-y-6">
          {/* Sprint Progress - Circular Progress Ring */}
          {currentSprint && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6"
            >
              {/* Circular Progress Ring */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="hsl(var(--border))"
                      strokeWidth="4"
                      fill="none"
                      opacity="0.3"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="hsl(var(--primary))"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 45}`,
                        strokeDashoffset: `${2 * Math.PI * 45 * (1 - weekProgress / 100)}`
                      }}
                      initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - weekProgress / 100) }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    />
                  </svg>
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span 
                      className="text-2xl font-bold text-foreground"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring", bounce: 0.4 }}
                    >
                      {currentSprint.week}
                    </motion.span>
                    <span className="text-sm text-foreground-muted">of {currentSprint.totalWeeks}</span>
                  </div>
                </div>
              </div>

              {/* Status Info */}
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <p className="text-sm text-foreground-muted">Sprint Progress</p>
                  <p className="font-semibold text-foreground">{Math.round(weekProgress)}% Complete</p>
                </div>
                <div className="w-px h-8 bg-border opacity-50" />
                <TensionChip tension={currentSprint.tension} />
              </div>
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

          {/* Primary Action - Premium Button */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-4"
          >
            <motion.button
              onClick={handleSubmit}
              className="btn-primary w-full h-14 text-lg font-semibold flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="h-5 w-5" />
              Start Sprint
            </motion.button>
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
      </motion.div>
    </div>
  );
};