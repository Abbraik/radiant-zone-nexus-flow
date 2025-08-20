import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, FileText, Save } from 'lucide-react';

interface TransparencyDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TransparencyDrawer: React.FC<TransparencyDrawerProps> = ({
  open,
  onOpenChange
}) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [affectedGroups, setAffectedGroups] = useState<string[]>([]);
  const [qaItems, setQaItems] = useState<{ question: string; answer: string }[]>([
    { question: '', answer: '' }
  ]);

  const groupOptions = [
    'Operations Team',
    'End Users',
    'Compliance',
    'Management',
    'External Partners',
    'Auditors'
  ];

  const toggleGroup = (group: string) => {
    setAffectedGroups(prev =>
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const addQaItem = () => {
    setQaItems(prev => [...prev, { question: '', answer: '' }]);
  };

  const updateQaItem = (index: number, field: 'question' | 'answer', value: string) => {
    setQaItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeQaItem = (index: number) => {
    setQaItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Save transparency pack logic
    console.log('Saving transparency pack:', {
      title,
      summary,
      affectedGroups,
      qaItems: qaItems.filter(item => item.question.trim() && item.answer.trim())
    });
    
    // Reset form
    setTitle('');
    setSummary('');
    setAffectedGroups([]);
    setQaItems([{ question: '', answer: '' }]);
    
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] max-w-[90vw]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Prepare Transparency Pack
          </SheetTitle>
          <SheetDescription>
            Create documentation for stakeholder review and consent requirements
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="tp-title">Title</Label>
            <Input
              id="tp-title"
              placeholder="e.g., Controller Tuning Changes - Impact Assessment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="tp-summary">Executive Summary</Label>
            <Textarea
              id="tp-summary"
              placeholder="Brief overview of changes, rationale, and expected impact..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Affected Groups */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Affected Groups
            </Label>
            <div className="flex flex-wrap gap-2">
              {groupOptions.map((group) => (
                <Badge
                  key={group}
                  variant={affectedGroups.includes(group) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleGroup(group)}
                >
                  {group}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Q&A Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Questions & Answers</Label>
              <Button variant="outline" size="sm" onClick={addQaItem}>
                Add Q&A
              </Button>
            </div>

            <div className="space-y-4">
              {qaItems.map((item, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor={`q-${index}`}>Question</Label>
                    <Input
                      id={`q-${index}`}
                      placeholder="What question might stakeholders have?"
                      value={item.question}
                      onChange={(e) => updateQaItem(index, 'question', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`a-${index}`}>Answer</Label>
                    <Textarea
                      id={`a-${index}`}
                      placeholder="Clear, honest answer addressing the concern..."
                      value={item.answer}
                      onChange={(e) => updateQaItem(index, 'answer', e.target.value)}
                      className="min-h-[60px] resize-none"
                    />
                  </div>

                  {qaItems.length > 1 && (
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQaItem(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title.trim() || !summary.trim() || affectedGroups.length === 0}
              className="flex-1"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Pack
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};