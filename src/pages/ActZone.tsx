import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Plus, Users, Calendar, GripVertical, Trash2, Edit3, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { useMockInterventions, useMockRoles } from '../hooks/use-mock-data';
import type { Intervention, Role } from '../types';

interface BundleItem extends Intervention {
  order: number;
}

export const ActZone: React.FC = () => {
  const { data: interventions = [], isLoading: interventionsLoading } = useMockInterventions();
  const { data: roles = [], isLoading: rolesLoading } = useMockRoles();
  
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dueDate, setDueDate] = useState('');

  const filteredInterventions = interventions.filter(intervention =>
    intervention.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intervention.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToBunde = (intervention: Intervention) => {
    const newItem: BundleItem = {
      ...intervention,
      order: bundleItems.length
    };
    setBundleItems(prev => [...prev, newItem]);
  };

  const removeFromBundle = (id: string) => {
    setBundleItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleRole = (role: Role) => {
    setSelectedRoles(prev => {
      const exists = prev.find(r => r.id === role.id);
      if (exists) {
        return prev.filter(r => r.id !== role.id);
      } else {
        return [...prev, role];
      }
    });
  };

  const handlePublish = () => {
    console.log('Publishing bundle:', {
      interventions: bundleItems,
      roles: selectedRoles,
      dueDate
    });
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
          <Send className="h-8 w-8 text-primary" />
          Act Zone
        </h1>
        <p className="text-foreground-muted max-w-2xl mx-auto">
          Create intervention bundles, assign roles, and orchestrate implementation
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Intervention Picker */}
        <Card className="zone-panel-wide lg:max-w-none p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Available Interventions</h3>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {interventions.length} Available
              </Badge>
            </div>

            <Input
              placeholder="Search interventions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-secondary"
            />

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredInterventions.map((intervention) => (
                <motion.div
                  key={intervention.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-glass-secondary rounded-lg hover:bg-glass-accent transition-colors border border-border-subtle"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {intervention.name}
                      </h4>
                      <p className="text-sm text-foreground-muted mt-1 line-clamp-2">
                        {intervention.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {intervention.type}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            intervention.impact === 'high' ? 'border-success text-success' :
                            intervention.impact === 'medium' ? 'border-warning text-warning' :
                            'border-muted text-muted-foreground'
                          }`}
                        >
                          {intervention.impact} impact
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToBunde(intervention)}
                      disabled={bundleItems.some(item => item.id === intervention.id)}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* Right Panel - Bundle Builder */}
        <Card className="zone-panel-wide lg:max-w-none p-6">
          <div className="space-y-4">
            {/* Bundle Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Sprint Bundle</h3>
                <p className="text-sm text-foreground-muted">
                  {bundleItems.length} interventions • Due in{' '}
                  {dueDate ? new Date(dueDate).toLocaleDateString() : 'TBD'}
                </p>
              </div>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {bundleItems.length} Items
              </Badge>
            </div>

            {/* Due Date */}
            <div>
              <Label className="text-sm">Due Date</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="glass-secondary mt-2"
              />
            </div>

            {/* Bundle Items - Reorderable */}
            <div className="space-y-2">
              <Label className="text-sm">Interventions (drag to reorder)</Label>
              <Reorder.Group
                axis="y"
                values={bundleItems}
                onReorder={setBundleItems}
                className="space-y-2"
              >
                {bundleItems.map((item) => (
                  <Reorder.Item
                    key={item.id}
                    value={item}
                    className="p-3 bg-glass-secondary rounded-lg border border-border-subtle cursor-grab active:cursor-grabbing"
                    whileDrag={{ scale: 1.02, boxShadow: '0 8px 25px rgba(0,0,0,0.3)' }}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-foreground-muted" />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-foreground text-sm truncate">
                          {item.name}
                        </h5>
                        <p className="text-xs text-foreground-muted">
                          {item.type} • {item.effort} effort
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromBundle(item.id)}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>

              {bundleItems.length === 0 && (
                <div className="text-center py-8 text-foreground-muted">
                  <Send className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Add interventions to create a bundle</p>
                </div>
              )}
            </div>

            {/* Role Assignment */}
            <div className="space-y-3">
              <Label className="text-sm">Smart Roles Assignment</Label>
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <motion.button
                    key={role.id}
                    onClick={() => toggleRole(role)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-fast
                      ${selectedRoles.find(r => r.id === role.id)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-glass-secondary text-foreground-muted hover:text-foreground'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {role.avatar || role.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{role.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Publish Button */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handlePublish}
                disabled={bundleItems.length === 0 || selectedRoles.length === 0}
                size="lg"
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3 rounded-xl shadow-lg"
              >
                <Send className="h-5 w-5 mr-2" />
                Publish Bundle
              </Button>
            </motion.div>
          </div>
        </Card>
      </div>
    </div>
  );
};