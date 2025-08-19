import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Plus, Search, ArrowRight, Trash2 } from 'lucide-react';

interface CascadeBuilderEditorProps {
  loopId?: string;
}

// Mock data for demonstration
const mockLoops = [
  {
    id: '1',
    name: 'Customer Satisfaction Loop',
    type: 'reactive',
    layer: 'meso'
  },
  {
    id: '2',
    name: 'Process Efficiency Loop',
    type: 'structural',
    layer: 'micro'
  },
  {
    id: '3',
    name: 'Strategic Planning Loop',
    type: 'perceptual',
    layer: 'macro'
  }
];

const cascadeTypes = [
  { value: 'amplifying', label: 'Amplifying', description: 'Strengthens the target loop' },
  { value: 'dampening', label: 'Dampening', description: 'Reduces target loop activity' },
  { value: 'triggering', label: 'Triggering', description: 'Initiates target loop activity' },
  { value: 'blocking', label: 'Blocking', description: 'Prevents target loop activity' }
];

const strengthLevels = [
  { value: 'weak', label: 'Weak (0.1 - 0.3)' },
  { value: 'moderate', label: 'Moderate (0.4 - 0.6)' },
  { value: 'strong', label: 'Strong (0.7 - 0.9)' },
  { value: 'dominant', label: 'Dominant (0.9+)' }
];

export const CascadeBuilderEditor: React.FC<CascadeBuilderEditorProps> = ({ loopId }) => {
  const [cascades, setCascades] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLoop, setSelectedLoop] = useState<string>('');
  const [cascadeType, setCascadeType] = useState<string>('');
  const [strength, setStrength] = useState<string>('moderate');
  const [note, setNote] = useState('');

  const filteredLoops = mockLoops.filter(loop =>
    loop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCascade = () => {
    if (selectedLoop && cascadeType) {
      const targetLoop = mockLoops.find(l => l.id === selectedLoop);
      if (targetLoop) {
        const newCascade = {
          id: Date.now().toString(),
          targetLoop,
          cascadeType,
          strength,
          note,
          viaSNL: 'shared-node-1' // Mock SNL connection
        };
        
        setCascades(prev => [...prev, newCascade]);
        
        // Reset form
        setSelectedLoop('');
        setCascadeType('');
        setStrength('moderate');
        setNote('');
      }
    }
  };

  const handleRemoveCascade = (cascadeId: string) => {
    setCascades(prev => prev.filter(c => c.id !== cascadeId));
  };

  const getCascadeTypeColor = (type: string) => {
    switch (type) {
      case 'amplifying': return 'bg-green-100 text-green-800';
      case 'dampening': return 'bg-red-100 text-red-800';
      case 'triggering': return 'bg-blue-100 text-blue-800';
      case 'blocking': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-yellow-100 text-yellow-800';
      case 'moderate': return 'bg-blue-100 text-blue-800';
      case 'strong': return 'bg-orange-100 text-orange-800';
      case 'dominant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cascade Builder</h2>
        <Button variant="outline">
          <Zap className="w-4 h-4 mr-2" />
          Auto-detect Cascades
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Cascade Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Cascade Relation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Search Target Loop</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search for target loop..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="max-h-32 overflow-y-auto border rounded-lg">
              {filteredLoops.map((loop) => (
                <div
                  key={loop.id}
                  className={`p-3 border-b last:border-b-0 cursor-pointer transition-colors ${
                    selectedLoop === loop.id
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedLoop(loop.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{loop.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{loop.type}</Badge>
                        <Badge variant="outline">{loop.layer}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium">Cascade Type</label>
              <Select value={cascadeType} onValueChange={setCascadeType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select cascade type" />
                </SelectTrigger>
                <SelectContent>
                  {cascadeTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Strength</label>
              <Select value={strength} onValueChange={setStrength}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {strengthLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Note</label>
              <Textarea
                placeholder="Describe the cascade mechanism..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <Button
              onClick={handleAddCascade}
              disabled={!selectedLoop || !cascadeType}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Cascade
            </Button>
          </CardContent>
        </Card>

        {/* Current Cascades */}
        <Card>
          <CardHeader>
            <CardTitle>Current Cascades ({cascades.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {cascades.length > 0 ? (
              <div className="space-y-4">
                {cascades.map((cascade) => (
                  <div
                    key={cascade.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">This Loop</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{cascade.targetLoop.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCascade(cascade.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCascadeTypeColor(cascade.cascadeType)}>
                        {cascade.cascadeType}
                      </Badge>
                      <Badge className={getStrengthColor(cascade.strength)}>
                        {cascade.strength}
                      </Badge>
                      <Badge variant="outline">via SNL</Badge>
                    </div>
                    
                    {cascade.note && (
                      <p className="text-sm text-muted-foreground">
                        {cascade.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No cascades defined</p>
                <p className="text-sm">Add cascade relations to show how this loop affects others</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cascade Map Visualization */}
      {cascades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cascade Network Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Interactive cascade map coming soon</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation & Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Cascade Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-800">No circular cascades detected</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-blue-800">
                Suggestion: Consider adding dampening cascade to Process Efficiency Loop
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};