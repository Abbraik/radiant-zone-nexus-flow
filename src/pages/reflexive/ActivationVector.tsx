import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ActivationVectorProps {
  currentCapacity: string;
}

export const ActivationVector: React.FC<ActivationVectorProps> = ({
  currentCapacity
}) => {
  const capacities = [
    { id: 'responsive', label: 'R', activation: 25, color: 'bg-red-500' },
    { id: 'reflexive', label: 'Re', activation: 85, color: 'bg-blue-500' },
    { id: 'deliberative', label: 'D', activation: 40, color: 'bg-green-500' },
    { id: 'anticipatory', label: 'A', activation: 30, color: 'bg-purple-500' },
    { id: 'structural', label: 'S', activation: 20, color: 'bg-orange-500' }
  ];

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground mr-2">5C:</span>
      {capacities.map((capacity) => (
        <div key={capacity.id} className="relative">
          <div 
            className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs font-medium text-white ${capacity.color} ${
              currentCapacity === capacity.id ? 'ring-2 ring-primary ring-offset-1' : 'opacity-60'
            }`}
            title={`${capacity.label}: ${capacity.activation}% activation`}
          >
            {capacity.label}
          </div>
          {currentCapacity === capacity.id && (
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
};