import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Save, RefreshCw } from 'lucide-react';
import { useLoopRegistry } from '@/hooks/useLoopRegistry';
import { LoopData } from '@/types/loop-registry';
import { useToast } from '@/hooks/use-toast';

interface LoopEditorProps {
  loop: LoopData;
}

export const LoopEditor: React.FC<LoopEditorProps> = ({ loop }) => {
  const { updateLoop } = useLoopRegistry();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: loop.name,
    loop_type: loop.loop_type,
    scale: loop.scale,
    leverage_default: loop.leverage_default || '',
    notes: loop.notes || '',
    controller: JSON.stringify(loop.controller, null, 2),
    thresholds: JSON.stringify(loop.thresholds, null, 2),
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const originalData = {
      name: loop.name,
      loop_type: loop.loop_type,
      scale: loop.scale,
      leverage_default: loop.leverage_default || '',
      notes: loop.notes || '',
      controller: JSON.stringify(loop.controller, null, 2),
      thresholds: JSON.stringify(loop.thresholds, null, 2),
    };
    
    setHasChanges(JSON.stringify(formData) !== JSON.stringify(originalData));
  }, [formData, loop]);

  const handleSave = async () => {
    try {
      // Validate JSON fields
      let controller, thresholds;
      try {
        controller = JSON.parse(formData.controller);
        thresholds = JSON.parse(formData.thresholds);
      } catch (error) {
        toast({
          title: "Validation Error",
          description: "Invalid JSON in controller or thresholds field.",
          variant: "destructive",
        });
        return;
      }

      const updates = {
        name: formData.name,
        loop_type: formData.loop_type as 'reactive' | 'structural' | 'perceptual',
        scale: formData.scale as 'micro' | 'meso' | 'macro',
        leverage_default: formData.leverage_default as 'N' | 'P' | 'S' | undefined,
        notes: formData.notes,
        controller,
        thresholds,
      };

      updateLoop.mutate({ id: loop.id, updates });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save loop changes.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      name: loop.name,
      loop_type: loop.loop_type,
      scale: loop.scale,
      leverage_default: loop.leverage_default || '',
      notes: loop.notes || '',
      controller: JSON.stringify(loop.controller, null, 2),
      thresholds: JSON.stringify(loop.thresholds, null, 2),
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-xl font-semibold">Edit Loop</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateLoop.isPending}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {updateLoop.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Loop Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter loop name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loop_type">Loop Type</Label>
              <Select
                value={formData.loop_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, loop_type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select loop type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reactive">Reactive</SelectItem>
                  <SelectItem value="structural">Structural</SelectItem>
                  <SelectItem value="perceptual">Perceptual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scale">Scale</Label>
              <Select
                value={formData.scale}
                onValueChange={(value) => setFormData(prev => ({ ...prev, scale: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select scale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="micro">Micro</SelectItem>
                  <SelectItem value="meso">Meso</SelectItem>
                  <SelectItem value="macro">Macro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leverage_default">Default Leverage</Label>
              <Select
                value={formData.leverage_default}
                onValueChange={(value) => setFormData(prev => ({ ...prev, leverage_default: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select default leverage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="N">N (Narrow)</SelectItem>
                  <SelectItem value="P">P (Policy)</SelectItem>
                  <SelectItem value="S">S (Structural)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Description</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter loop description"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* JSON Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="controller">Controller (JSON)</Label>
              <Textarea
                id="controller"
                value={formData.controller}
                onChange={(e) => setFormData(prev => ({ ...prev, controller: e.target.value }))}
                placeholder="Enter controller configuration as JSON"
                rows={6}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thresholds">Thresholds (JSON)</Label>
              <Textarea
                id="thresholds"
                value={formData.thresholds}
                onChange={(e) => setFormData(prev => ({ ...prev, thresholds: e.target.value }))}
                placeholder="Enter thresholds configuration as JSON"
                rows={6}
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Status indicator */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg"
        >
          You have unsaved changes
        </motion.div>
      )}
    </div>
  );
};