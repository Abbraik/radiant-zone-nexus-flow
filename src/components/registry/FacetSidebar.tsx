import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  X,
  Filter,
  Database,
  Clock,
  Settings
} from 'lucide-react';
import { RegistryFilters } from '@/types/registry-ui';

interface FacetSidebarProps {
  filters: RegistryFilters;
  onChange: (filters: Partial<RegistryFilters>) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

const LOOP_TYPES = [
  { value: 'reactive', label: 'Reactive', description: 'Responds to immediate events' },
  { value: 'structural', label: 'Structural', description: 'Addresses system architecture' },
  { value: 'perceptual', label: 'Perceptual', description: 'Changes mental models' },
  { value: 'anticipatory', label: 'Anticipatory', description: 'Proactive system responses' }
];

const MOTIFS = [
  { value: 'B', label: 'Balancing', description: 'Self-correcting behavior' },
  { value: 'R', label: 'Reinforcing', description: 'Self-amplifying patterns' },
  { value: 'N', label: 'Saturation', description: 'Capacity constraints' },
  { value: 'C', label: 'Constraint', description: 'System bottlenecks' },
  { value: 'T', label: 'Transport', description: 'Time delays' }
];

const LAYERS = [
  { value: 'meta', label: 'Meta', description: 'System governance' },
  { value: 'macro', label: 'Macro', description: 'Strategic patterns' },
  { value: 'meso', label: 'Meso', description: 'Organizational structures' },
  { value: 'micro', label: 'Micro', description: 'Operational processes' }
];

const STATUSES = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-500/20 text-gray-300' },
  { value: 'review', label: 'Review', color: 'bg-yellow-500/20 text-yellow-300' },
  { value: 'published', label: 'Published', color: 'bg-green-500/20 text-green-300' },
  { value: 'active', label: 'Active', color: 'bg-blue-500/20 text-blue-300' },
  { value: 'deprecated', label: 'Deprecated', color: 'bg-red-500/20 text-red-300' }
];

interface FacetSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FacetSection: React.FC<FacetSectionProps> = ({ 
  title, 
  icon, 
  children, 
  defaultOpen = true 
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto font-medium text-left"
        >
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm">{title}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const FacetSidebar: React.FC<FacetSidebarProps> = ({
  filters,
  onChange,
  onClear,
  hasActiveFilters
}) => {
  const handleArrayFilter = (key: keyof RegistryFilters, value: string) => {
    const currentValues = filters[key] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onChange({ [key]: newValues });
  };

  const handleBooleanFilter = (key: keyof RegistryFilters) => {
    onChange({ [key]: !filters[key] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-6"
    >
      <Card className="glass-secondary">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4" />
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="h-7 px-2 text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Loop Type */}
          <FacetSection
            title="Loop Type"
            icon={<Database className="w-4 h-4" />}
          >
            <div className="space-y-2">
              {LOOP_TYPES.map(type => (
                <div key={type.value} className="flex items-start gap-2">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={filters.loop_type.includes(type.value)}
                    onCheckedChange={() => handleArrayFilter('loop_type', type.value)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`type-${type.value}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {type.label}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FacetSection>

          <Separator />

          {/* Motif */}
          <FacetSection
            title="Motif"
            icon={<div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-xs">M</div>}
          >
            <div className="space-y-2">
              {MOTIFS.map(motif => (
                <div key={motif.value} className="flex items-start gap-2">
                  <Checkbox
                    id={`motif-${motif.value}`}
                    checked={filters.motif.includes(motif.value)}
                    onCheckedChange={() => handleArrayFilter('motif', motif.value)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`motif-${motif.value}`}
                      className="text-sm font-medium cursor-pointer flex items-center gap-2"
                    >
                      <Badge variant="outline" className="text-xs">
                        {motif.value}
                      </Badge>
                      {motif.label}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {motif.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FacetSection>

          <Separator />

          {/* Layer */}
          <FacetSection
            title="Layer"
            icon={<div className="w-4 h-4 rounded bg-accent/20 flex items-center justify-center text-xs">L</div>}
          >
            <div className="space-y-2">
              {LAYERS.map(layer => (
                <div key={layer.value} className="flex items-start gap-2">
                  <Checkbox
                    id={`layer-${layer.value}`}
                    checked={filters.layer.includes(layer.value)}
                    onCheckedChange={() => handleArrayFilter('layer', layer.value)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`layer-${layer.value}`}
                      className="text-sm font-medium cursor-pointer capitalize"
                    >
                      {layer.label}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {layer.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FacetSection>

          <Separator />

          {/* Status */}
          <FacetSection
            title="Status"
            icon={<Clock className="w-4 h-4" />}
          >
            <div className="space-y-2">
              {STATUSES.map(status => (
                <div key={status.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={filters.status.includes(status.value)}
                    onCheckedChange={() => handleArrayFilter('status', status.value)}
                  />
                  <label
                    htmlFor={`status-${status.value}`}
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
                    <Badge className={status.color}>
                      {status.label}
                    </Badge>
                  </label>
                </div>
              ))}
            </div>
          </FacetSection>

          <Separator />

          {/* Feature Toggles */}
          <FacetSection
            title="Features"
            icon={<Settings className="w-4 h-4" />}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="has-snl"
                  checked={filters.has_snl}
                  onCheckedChange={() => handleBooleanFilter('has_snl')}
                />
                <label htmlFor="has-snl" className="text-sm font-medium cursor-pointer">
                  Has Shared Nodes
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  id="has-de-band"
                  checked={filters.has_de_band}
                  onCheckedChange={() => handleBooleanFilter('has_de_band')}
                />
                <label htmlFor="has-de-band" className="text-sm font-medium cursor-pointer">
                  Has DE-Bands
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  id="has-srt"
                  checked={filters.has_srt}
                  onCheckedChange={() => handleBooleanFilter('has_srt')}
                />
                <label htmlFor="has-srt" className="text-sm font-medium cursor-pointer">
                  Has SRT Windows
                </label>
              </div>
            </div>
          </FacetSection>
        </CardContent>
      </Card>
    </motion.div>
  );
};