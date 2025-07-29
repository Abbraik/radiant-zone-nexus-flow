import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, User, Tag, AlertCircle, Calendar, FileText } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface LoopMetadata {
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  tags: string[];
  stakeholders: string[];
  governanceContext: string;
  riskLevel: 'high' | 'medium' | 'low';
  complianceRequired: boolean;
  estimatedDuration: string;
  businessUnit: string;
}

interface LoopMetadataFormProps {
  value?: Partial<LoopMetadata>;
  onChange: (metadata: LoopMetadata) => void;
  onComplete: () => void;
}

const priorityOptions = [
  { value: 'critical', label: 'Critical', color: 'bg-red-500', description: 'Immediate attention required' },
  { value: 'high', label: 'High', color: 'bg-orange-500', description: 'High impact on system' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500', description: 'Moderate impact' },
  { value: 'low', label: 'Low', color: 'bg-green-500', description: 'Low urgency' }
];

const predefinedTags = [
  'Pilot', 'Critical', 'Innovation', 'Compliance', 'Customer-Facing', 
  'Internal', 'Strategic', 'Operational', 'Technical', 'Process'
];

const stakeholderRoles = [
  'System Owner', 'Technical Lead', 'Business Analyst', 'Product Manager',
  'Data Scientist', 'Compliance Officer', 'Stakeholder Representative'
];

const LoopMetadataForm: React.FC<LoopMetadataFormProps> = ({ 
  value = {}, 
  onChange, 
  onComplete 
}) => {
  const [metadata, setMetadata] = useState<LoopMetadata>({
    title: value.title || '',
    description: value.description || '',
    priority: value.priority || 'medium',
    tags: value.tags || [],
    stakeholders: value.stakeholders || [],
    governanceContext: value.governanceContext || '',
    riskLevel: value.riskLevel || 'medium',
    complianceRequired: value.complianceRequired || false,
    estimatedDuration: value.estimatedDuration || '',
    businessUnit: value.businessUnit || ''
  });

  const [newTag, setNewTag] = useState('');
  const [newStakeholder, setNewStakeholder] = useState('');

  const updateMetadata = (updates: Partial<LoopMetadata>) => {
    const updated = { ...metadata, ...updates };
    setMetadata(updated);
    onChange(updated);
  };

  const addTag = (tag: string) => {
    if (tag && !metadata.tags.includes(tag)) {
      updateMetadata({ tags: [...metadata.tags, tag] });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateMetadata({ tags: metadata.tags.filter(tag => tag !== tagToRemove) });
  };

  const addStakeholder = (stakeholder: string) => {
    if (stakeholder && !metadata.stakeholders.includes(stakeholder)) {
      updateMetadata({ stakeholders: [...metadata.stakeholders, stakeholder] });
      setNewStakeholder('');
    }
  };

  const removeStakeholder = (stakeholderToRemove: string) => {
    updateMetadata({ 
      stakeholders: metadata.stakeholders.filter(s => s !== stakeholderToRemove) 
    });
  };

  const isFormValid = () => {
    return metadata.title.trim() && metadata.description.trim() && metadata.businessUnit.trim();
  };

  const getPriorityColor = (priority: string) => {
    const option = priorityOptions.find(p => p.value === priority);
    return option?.color || 'bg-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <Label className="text-lg font-medium text-white mb-4 block">
          Loop Metadata & Documentation
        </Label>
        <p className="text-sm text-gray-400 mb-4">
          Assign comprehensive metadata for search, filtering, and governance context.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Loop Title *
            </Label>
            <Input
              value={metadata.title}
              onChange={(e) => updateMetadata({ title: e.target.value })}
              placeholder="Enter descriptive loop title..."
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Description *
            </Label>
            <Textarea
              value={metadata.description}
              onChange={(e) => updateMetadata({ description: e.target.value })}
              placeholder="Detailed description of the loop's purpose and scope..."
              rows={4}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Priority */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Priority Level
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateMetadata({ priority: option.value as any })}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-200 text-left
                    ${metadata.priority === option.value
                      ? 'border-teal-500 bg-teal-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                    <span className="text-white text-sm font-medium">{option.label}</span>
                  </div>
                  <p className="text-xs text-gray-400">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Business Unit */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Business Unit *
            </Label>
            <Select value={metadata.businessUnit} onValueChange={(value) => updateMetadata({ businessUnit: value })}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select business unit..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20">
                <SelectItem value="engineering" className="text-white">Engineering</SelectItem>
                <SelectItem value="product" className="text-white">Product</SelectItem>
                <SelectItem value="operations" className="text-white">Operations</SelectItem>
                <SelectItem value="finance" className="text-white">Finance</SelectItem>
                <SelectItem value="marketing" className="text-white">Marketing</SelectItem>
                <SelectItem value="hr" className="text-white">Human Resources</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Tags */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Tags
            </Label>
            
            {/* Predefined Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {predefinedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className={`
                    px-2 py-1 text-xs rounded-full border transition-all duration-200
                    ${metadata.tags.includes(tag)
                      ? 'bg-teal-500 border-teal-500 text-white'
                      : 'border-white/30 text-gray-300 hover:border-teal-500'
                    }
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add custom tag..."
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                onKeyDown={(e) => e.key === 'Enter' && addTag(newTag)}
              />
              <Button
                onClick={() => addTag(newTag)}
                variant="outline"
                size="sm"
                className="border-teal-500 text-teal-300 hover:bg-teal-500 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Selected Tags */}
            {metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {metadata.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-teal-500 text-white"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-white/20 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Stakeholders */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Stakeholders
            </Label>
            
            <div className="flex gap-2 mb-3">
              <Select value={newStakeholder} onValueChange={setNewStakeholder}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Add stakeholder..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  {stakeholderRoles.map((role) => (
                    <SelectItem key={role} value={role} className="text-white">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => addStakeholder(newStakeholder)}
                variant="outline"
                size="sm"
                className="border-teal-500 text-teal-300 hover:bg-teal-500 hover:text-white"
              >
                <User className="w-4 h-4" />
              </Button>
            </div>

            {/* Selected Stakeholders */}
            {metadata.stakeholders.length > 0 && (
              <div className="space-y-2">
                {metadata.stakeholders.map((stakeholder) => (
                  <div
                    key={stakeholder}
                    className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10"
                  >
                    <span className="text-white text-sm">{stakeholder}</span>
                    <button
                      onClick={() => removeStakeholder(stakeholder)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Risk Level & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-white mb-2 block">
                Risk Level
              </Label>
              <Select value={metadata.riskLevel} onValueChange={(value) => updateMetadata({ riskLevel: value as any })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="high" className="text-white">High Risk</SelectItem>
                  <SelectItem value="medium" className="text-white">Medium Risk</SelectItem>
                  <SelectItem value="low" className="text-white">Low Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-white mb-2 block">
                Duration
              </Label>
              <Input
                value={metadata.estimatedDuration}
                onChange={(e) => updateMetadata({ estimatedDuration: e.target.value })}
                placeholder="e.g., 3-6 months"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Governance Context */}
          <div>
            <Label className="text-sm font-medium text-white mb-2 block">
              Governance Context
            </Label>
            <Textarea
              value={metadata.governanceContext}
              onChange={(e) => updateMetadata({ governanceContext: e.target.value })}
              placeholder="Regulatory requirements, compliance needs, approval processes..."
              rows={3}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Validation Summary */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-teal-400" />
          <span className="text-sm font-medium text-white">Metadata Summary</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-gray-400">Priority:</span>
            <Badge variant="secondary" className={`ml-1 ${getPriorityColor(metadata.priority)} text-white`}>
              {metadata.priority}
            </Badge>
          </div>
          <div>
            <span className="text-gray-400">Tags:</span>
            <span className="text-white ml-1">{metadata.tags.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Stakeholders:</span>
            <span className="text-white ml-1">{metadata.stakeholders.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Risk:</span>
            <span className="text-white ml-1 capitalize">{metadata.riskLevel}</span>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <Button 
        onClick={onComplete}
        disabled={!isFormValid()}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FileText className="w-4 h-4 mr-2" />
        Confirm Loop Metadata
      </Button>
    </motion.div>
  );
};

export default LoopMetadataForm;