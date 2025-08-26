import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building, Users, MapPin, AlertTriangle, CheckCircle, Clock, Play } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdoptionMapProps {
  dossierId: string;
}

export const AdoptionMap: React.FC<AdoptionMapProps> = ({ dossierId }) => {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [isExceptionDialogOpen, setIsExceptionDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch adopting entities
  const { data: entities = [] } = useQuery({
    queryKey: ['adopting-entities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('adopting_entities')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });

  // Fetch adoptions for this dossier
  const { data: adoptions = [] } = useQuery({
    queryKey: ['structural-adoptions', dossierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('structural_adoptions')
        .select(`
          *,
          adopting_entities (name, kind)
        `)
        .eq('dossier_id', dossierId);
        
      if (error) throw error;
      return data;
    }
  });

  // Update adoption mutation
  const updateAdoptionMutation = useMutation({
    mutationFn: async ({ entityId, state, notes }: { entityId: string, state: string, notes?: string }) => {
      const { error } = await supabase
        .from('structural_adoptions')
        .upsert({
          dossier_id: dossierId,
          entity_id: entityId,
          state,
          notes,
          moved_at: new Date().toISOString()
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Adoption status updated');
      queryClient.invalidateQueries({ queryKey: ['structural-adoptions'] });
    }
  });

  // Mark exception mutation
  const markExceptionMutation = useMutation({
    mutationFn: async ({ entityId, notes }: { entityId: string, notes: string }) => {
      // Update adoption to exception state
      await updateAdoptionMutation.mutateAsync({ entityId, state: 'exception', notes });
      
      // Create deliberative task for addressing the exception
      const { error } = await supabase
        .from('app_tasks_queue')
        .insert({
          org_id: dossierId,
          capacity: 'deliberative',
          title: `Address Adoption Exception: ${getEntityName(entityId)}`,
          payload: {
            dossier_id: dossierId,
            entity_id: entityId,
            exception_notes: notes,
            type: 'adoption_exception'
          },
          due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Exception marked and deliberative task created');
      setIsExceptionDialogOpen(false);
    }
  });

  const getEntityName = (entityId: string) => {
    const entity = entities.find(e => e.entity_id === entityId);
    return entity?.name || 'Unknown Entity';
  };

  const getAdoptionForEntity = (entityId: string) => {
    return adoptions.find(a => a.entity_id === entityId);
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'not_started': return 'bg-gray-200 text-gray-700';
      case 'pilot': return 'bg-blue-200 text-blue-700';
      case 'partial': return 'bg-yellow-200 text-yellow-700';
      case 'full': return 'bg-green-200 text-green-700';
      case 'exception': return 'bg-red-200 text-red-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'not_started': return <Clock className="h-4 w-4" />;
      case 'pilot': return <Play className="h-4 w-4" />;
      case 'partial': return <CheckCircle className="h-4 w-4" />;
      case 'full': return <CheckCircle className="h-4 w-4" />;
      case 'exception': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getKindIcon = (kind: string) => {
    switch (kind) {
      case 'ministry': return <Building className="h-4 w-4" />;
      case 'agency': return <Building className="h-4 w-4" />;
      case 'region': return <MapPin className="h-4 w-4" />;
      case 'provider': return <Users className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  };

  // Calculate summary stats
  const stateCounts = adoptions.reduce((acc, adoption) => {
    acc[adoption.state] = (acc[adoption.state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalEntities = entities.length;
  const adoptionRate = totalEntities > 0 ? 
    ((stateCounts.full || 0) + (stateCounts.partial || 0)) / totalEntities * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Adoption Map</h2>
          <p className="text-muted-foreground">
            Track rollout progress across entities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{Math.round(adoptionRate)}% Adopted</Badge>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { key: 'not_started', label: 'Not Started', color: 'bg-gray-100' },
          { key: 'pilot', label: 'Pilot', color: 'bg-blue-100' },
          { key: 'partial', label: 'Partial', color: 'bg-yellow-100' },
          { key: 'full', label: 'Full', color: 'bg-green-100' },
          { key: 'exception', label: 'Exception', color: 'bg-red-100' }
        ].map(({ key, label, color }) => (
          <Card key={key} className={color}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stateCounts[key] || 0}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Entity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entities.map((entity) => {
          const adoption = getAdoptionForEntity(entity.entity_id);
          const state = adoption?.state || 'not_started';
          
          return (
            <Card key={entity.entity_id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getKindIcon(entity.kind)}
                    <div>
                      <h3 className="font-semibold">{entity.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {entity.kind}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStateColor(state)}>
                    {getStateIcon(state)}
                    <span className="ml-1 capitalize">{state.replace('_', ' ')}</span>
                  </Badge>
                </div>

                {adoption && (
                  <div className="space-y-2 mb-3">
                    {adoption.owner && (
                      <p className="text-sm">
                        <span className="font-medium">Owner:</span> {adoption.owner}
                      </p>
                    )}
                    {adoption.moved_at && (
                      <p className="text-sm">
                        <span className="font-medium">Last Updated:</span>{' '}
                        {new Date(adoption.moved_at).toLocaleDateString()}
                      </p>
                    )}
                    {adoption.notes && (
                      <p className="text-sm text-muted-foreground">
                        {adoption.notes}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Select
                    value={state}
                    onValueChange={(newState) => 
                      updateAdoptionMutation.mutate({ 
                        entityId: entity.entity_id, 
                        state: newState 
                      })
                    }
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="pilot">Pilot</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </SelectContent>
                  </Select>

                  <Dialog open={isExceptionDialogOpen} onOpenChange={setIsExceptionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEntity(entity.entity_id)}
                      >
                        Exception
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Mark Exception: {entity.name}</DialogTitle>
                      </DialogHeader>
                      <ExceptionForm
                        entityId={entity.entity_id}
                        onSubmit={(notes) => markExceptionMutation.mutate({ 
                          entityId: entity.entity_id, 
                          notes 
                        })}
                        onCancel={() => setIsExceptionDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Exception form component
const ExceptionForm: React.FC<{
  entityId: string;
  onSubmit: (notes: string) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notes.trim()) {
      onSubmit(notes);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Exception Reason
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe why this entity cannot adopt the dossier..."
          rows={4}
          required
        />
      </div>
      
      <div className="flex items-center gap-2 pt-4">
        <Button type="submit" disabled={!notes.trim()}>
          Mark Exception & Create Task
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};