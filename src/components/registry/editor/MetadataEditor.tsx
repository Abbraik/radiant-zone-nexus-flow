import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { LoopData } from '@/types/loop-registry';

interface MetadataEditorProps {
  data?: Partial<LoopData>;
  onChange: (data: Partial<LoopData>) => void;
}

const loopTypes = [
  { value: 'reactive', label: 'Reactive' },
  { value: 'structural', label: 'Structural' },
  { value: 'perceptual', label: 'Perceptual' }
];

const motifs = [
  { value: 'B', label: 'B - Balancing', description: 'Self-correcting behavior seeking equilibrium' },
  { value: 'R', label: 'R - Reinforcing', description: 'Self-amplifying growth or decline patterns' },
  { value: 'N', label: 'N - Saturation/Nonlinear', description: 'Capacity constraints and limits' },
  { value: 'C', label: 'C - Constraint/Bottleneck', description: 'System bottlenecks and restrictions' },
  { value: 'T', label: 'T - Transport/Delay', description: 'Time delays and information flow' }
];

const layers = [
  { value: 'meta', label: 'Meta', description: 'Meta-system governance and coordination' },
  { value: 'macro', label: 'Macro', description: 'Strategic system-wide patterns and policies' },
  { value: 'meso', label: 'Meso', description: 'Intermediate organizational and network structures' },
  { value: 'micro', label: 'Micro', description: 'Individual and local operational processes' }
];

const scales = [
  { value: 'micro', label: 'Micro' },
  { value: 'meso', label: 'Meso' },
  { value: 'macro', label: 'Macro' }
];

const leverageOptions = [
  { value: 'N', label: 'N - Narrative', description: 'Stories, beliefs, and mental models' },
  { value: 'P', label: 'P - Policy', description: 'Rules, procedures, and formal structures' },
  { value: 'S', label: 'S - Structure', description: 'Physical systems and infrastructure' }
];

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'Review' },
  { value: 'published', label: 'Published' },
  { value: 'deprecated', label: 'Deprecated' }
];

export const MetadataEditor: React.FC<MetadataEditorProps> = ({ data = {}, onChange }) => {
  const [newTag, setNewTag] = React.useState('');
  const tags = data.tags || [];

  const handleFieldChange = (field: keyof LoopData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      handleFieldChange('tags', [...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleFieldChange('tags', tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Loop Metadata</h2>
        <Badge variant="outline">Required for Publishing</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={data.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="Enter loop name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="synopsis">Synopsis</Label>
              <Textarea
                id="synopsis"
                value={data.synopsis || ''}
                onChange={(e) => handleFieldChange('synopsis', e.target.value)}
                placeholder="Brief description of the loop"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={data.notes || ''}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                placeholder="Additional notes"
                className="mt-1"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Classification */}
        <Card>
          <CardHeader>
            <CardTitle>Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="loop_type">Loop Type *</Label>
              <Select
                value={data.loop_type}
                onValueChange={(value) => handleFieldChange('loop_type', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select loop type" />
                </SelectTrigger>
                <SelectContent>
                  {loopTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="motif">Motif *</Label>
              <Select
                value={data.motif}
                onValueChange={(value) => handleFieldChange('motif', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select motif" />
                </SelectTrigger>
                <SelectContent>
                  {motifs.map((motif) => (
                    <SelectItem key={motif.value} value={motif.value}>
                      <div>
                        <div className="font-medium">{motif.label}</div>
                        <div className="text-xs text-muted-foreground">{motif.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="layer">Layer *</Label>
              <Select
                value={data.layer}
                onValueChange={(value) => handleFieldChange('layer', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select layer" />
                </SelectTrigger>
                <SelectContent>
                  {layers.map((layer) => (
                    <SelectItem key={layer.value} value={layer.value}>
                      <div>
                        <div className="font-medium">{layer.label}</div>
                        <div className="text-xs text-muted-foreground">{layer.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="scale">Scale</Label>
              <Select
                value={data.scale}
                onValueChange={(value) => handleFieldChange('scale', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select scale" />
                </SelectTrigger>
                <SelectContent>
                  {scales.map((scale) => (
                    <SelectItem key={scale.value} value={scale.value}>
                      {scale.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="leverage_default">Default Leverage</Label>
              <Select
                value={data.leverage_default}
                onValueChange={(value) => handleFieldChange('leverage_default', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select default leverage" />
                </SelectTrigger>
                <SelectContent>
                  {leverageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={data.status}
                onValueChange={(value) => handleFieldChange('status', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Current Tags ({tags.length}/10)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 w-4 h-4"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add new tag"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                disabled={tags.length >= 10}
              />
              <Button
                onClick={handleAddTag}
                disabled={!newTag.trim() || tags.includes(newTag.trim()) || tags.length >= 10}
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};