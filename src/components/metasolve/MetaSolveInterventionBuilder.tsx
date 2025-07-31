import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Building2, 
  Users, 
  Target, 
  Clock, 
  DollarSign, 
  Plus, 
  Trash2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { MetaSolveLayer, MacroVision, MesoLayer, MicroLayer, LeverageContext } from '../../types/metasolve';
import { EnhancedIntervention } from '../../types/intervention';

interface MetaSolveInterventionBuilderProps {
  leverageContext: LeverageContext;
  selectedSubLevers: string[];
  onInterventionCreate: (intervention: EnhancedIntervention) => void;
}

export const MetaSolveInterventionBuilder: React.FC<MetaSolveInterventionBuilderProps> = ({
  leverageContext,
  selectedSubLevers,
  onInterventionCreate
}) => {
  const [currentLayer, setCurrentLayer] = useState<'macro' | 'meso' | 'micro'>('macro');
  const [macroVision, setMacroVision] = useState<Partial<MacroVision>>({
    title: '',
    description: '',
    timeHorizon: '',
    successMetrics: [],
    leverageContext
  });
  
  const [mesoLayer, setMesoLayer] = useState<Partial<MesoLayer>>({
    institutionalOwners: [],
    governanceStructure: {
      governanceCell: [],
      decisionRights: [],
      escalationPaths: []
    },
    resourceAllocation: {
      budget: {
        totalBudget: 0,
        budgetByCategory: {},
        fundingSources: [],
        contingencyPercent: 10
      },
      staffing: {
        requiredFTE: 0,
        skillsRequired: [],
        trainingNeeds: [],
        hiringTimeline: ''
      },
      technology: {
        platformsRequired: [],
        dataRequirements: [],
        integrationsNeeded: [],
        securityRequirements: []
      }
    },
    coordinationMechanisms: []
  });

  const [microLayer, setMicroLayer] = useState<Partial<MicroLayer>>({
    frontlineUnits: [],
    pilotSites: [],
    deliveryMechanisms: [],
    microLoops: []
  });

  const handleCreateIntervention = () => {
    const intervention: EnhancedIntervention = {
      id: `intervention-${Date.now()}`,
      name: macroVision.title || 'New Intervention',
      description: macroVision.description || '',
      icon: '🎯',
      category: 'MetaSolve',
      selectedSubLevers,
      subLeverConfigurations: [],
      targetLoopVariables: [],
      expectedLoopImpact: {
        loopId: leverageContext.loopId,
        impactType: 'strengthen',
        targetVariables: [],
        expectedMagnitude: 5,
        confidenceLevel: 'medium',
        assumptions: []
      },
      parameters: [],
      microTasks: [],
      microLoops: microLayer.microLoops || [],
      budget: {
        totalBudget: mesoLayer.resourceAllocation?.budget?.totalBudget || 0,
        currency: 'USD',
        lineItems: [],
        contingency: (mesoLayer.resourceAllocation?.budget?.contingencyPercent || 10) / 100,
        contingencyPercent: mesoLayer.resourceAllocation?.budget?.contingencyPercent || 10,
        approvalStatus: 'draft'
      },
      resources: [
        {
          type: 'human',
          name: 'Staff Allocation',
          description: 'Human resource requirements',
          quantity: mesoLayer.resourceAllocation?.staffing?.requiredFTE || 0,
          unit: 'FTE',
          availability: 'available',
          cost: 0,
          alternatives: []
        }
      ],
      automationRules: [],
      effort: 'Medium',
      impact: 'High',
      complexity: 'Medium',
      timeToImpact: 'Medium',
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      lastModifiedBy: 'system'
    };

    onInterventionCreate(intervention);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">MetaSolve Intervention Builder</h3>
            <p className="text-sm text-muted-foreground">
              Design interventions across macro, meso, and micro levels
            </p>
          </div>
          <Badge variant="outline">
            {leverageContext.leveragePointName}
          </Badge>
        </div>

        <Tabs value={currentLayer} onValueChange={(value) => setCurrentLayer(value as 'macro' | 'meso' | 'micro')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="macro" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Macro (Strategic)
            </TabsTrigger>
            <TabsTrigger value="meso" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Meso (Institutional)
            </TabsTrigger>
            <TabsTrigger value="micro" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Micro (Frontline)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="macro" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-medium mb-3">Strategic Vision</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={macroVision.title}
                    onChange={(e) => setMacroVision(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Strategic intervention title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={macroVision.description}
                    onChange={(e) => setMacroVision(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="High-level strategic description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Time Horizon</label>
                  <Select 
                    value={macroVision.timeHorizon} 
                    onValueChange={(value) => setMacroVision(prev => ({ ...prev, timeHorizon: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time horizon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3 months">3 months</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="1 year">1 year</SelectItem>
                      <SelectItem value="2 years">2 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="meso" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-medium mb-3">Institutional Design</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Total Budget</label>
                  <Input
                    type="number"
                    value={mesoLayer.resourceAllocation?.budget?.totalBudget}
                    onChange={(e) => setMesoLayer(prev => ({
                      ...prev,
                      resourceAllocation: {
                        ...prev.resourceAllocation!,
                        budget: {
                          ...prev.resourceAllocation!.budget!,
                          totalBudget: Number(e.target.value)
                        }
                      }
                    }))}
                    placeholder="Total budget allocation"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Required FTE</label>
                  <Input
                    type="number"
                    value={mesoLayer.resourceAllocation?.staffing?.requiredFTE}
                    onChange={(e) => setMesoLayer(prev => ({
                      ...prev,
                      resourceAllocation: {
                        ...prev.resourceAllocation!,
                        staffing: {
                          ...prev.resourceAllocation!.staffing!,
                          requiredFTE: Number(e.target.value)
                        }
                      }
                    }))}
                    placeholder="Full-time equivalent staff needed"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="micro" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-medium mb-3">Frontline Delivery</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Pilot Sites</label>
                  <Input
                    placeholder="Number of pilot sites"
                    type="number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Delivery Channel</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="physical">Physical</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button variant="outline">
            Save Draft
          </Button>
          <Button onClick={handleCreateIntervention}>
            <Plus className="h-4 w-4 mr-2" />
            Create Intervention
          </Button>
        </div>
      </div>
    </Card>
  );
};