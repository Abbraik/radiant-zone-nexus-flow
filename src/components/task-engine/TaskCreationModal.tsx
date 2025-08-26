import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTaskEngine } from '@/hooks/useTaskEngine';
import type { TaskPriority } from '@/types/taskEngine';

interface TaskCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskCreationModal = ({ open, onOpenChange }: TaskCreationModalProps) => {
  const { createTask, isCreating } = useTaskEngine();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    estimated_duration: '',
    due_date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority,
      estimated_duration: formData.estimated_duration ? parseInt(formData.estimated_duration) : undefined,
      due_date: formData.due_date || undefined
    };

    createTask(taskData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      estimated_duration: '',
      due_date: ''
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Priority</label>
            <Select value={formData.priority} onValueChange={(value: TaskPriority) => 
              setFormData(prev => ({ ...prev, priority: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Duration (minutes)</label>
              <Input
                type="number"
                value={formData.estimated_duration}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_duration: e.target.value }))}
                placeholder="60"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Due Date</label>
              <Input
                type="datetime-local"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !formData.title.trim()}>
              {isCreating ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};