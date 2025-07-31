import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  MapPin, 
  Target,
  ChevronRight,
  X,
  Plus,
  Settings,
  User,
  Calendar,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import type { 
  MetaSolveLayer, 
  InstitutionalOwner, 
  FrontlineUnit, 
  PilotSite,
  GovernanceCellRole,
  PersonAssignment 
} from '../../types/metasolve';

interface MetaSolveDetailFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mesoMicroConfig: Partial<MetaSolveLayer>) => void;
  initialData?: Partial<MetaSolveLayer>;
  macroVision?: {
    title: string;
    leverageContext: {
      leveragePointName: string;
      loopName: string;
      loopType: string;
    };
  };
}

export const MetaSolveDetailForm: React.FC<MetaSolveDetailFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  macroVision
}) => {
  // Default governance cell structure based on MetaSolve methodology
  const defaultGovernanceCell: GovernanceCellRole[] = [
    {
      cellFunction: 'Strategy',
      assignedPersons: [],
      responsibilities: ['Strategic direction', 'Policy alignment', 'Stakeholder engagement'],
      authorities: ['Approve strategic changes', 'Escalate to political level']
    },
    {
      cellFunction: 'Operations',
      assignedPersons: [],
      responsibilities: ['Day-to-day execution', 'Resource coordination', 'Issue resolution'],
      authorities: ['Operational decisions', 'Resource allocation within budget']
    },
    {
      cellFunction: 'Analytics',
      assignedPersons: [],
      responsibilities: ['Performance monitoring', 'Data analysis', 'Impact assessment'],
      authorities: ['Access to all data', 'Performance reporting']
    },
    {
      cellFunction: 'Engagement',
      assignedPersons: [],
      responsibilities: ['Stakeholder communication', 'Change management', 'Feedback collection'],
      authorities: ['External communications', 'Stakeholder coordination']
    },
    {
      cellFunction: 'Delivery',
      assignedPersons: [],
      responsibilities: ['Implementation oversight', 'Quality assurance', 'Timeline management'],
      authorities: ['Implementation decisions', 'Quality standards']
    }
  ];

  const [activeTab, setActiveTab] = useState<'meso' | 'micro'>('meso');
  const [institutionalOwners, setInstitutionalOwners] = useState<InstitutionalOwner[]>(
    initialData?.meso?.institutionalOwners || []
  );
  const [frontlineUnits, setFrontlineUnits] = useState<FrontlineUnit[]>(
    initialData?.micro?.frontlineUnits || []
  );
  const [pilotSites, setPilotSites] = useState<PilotSite[]>(
    initialData?.micro?.pilotSites || []
  );
  const [governanceCell, setGovernanceCell] = useState<GovernanceCellRole[]>(
    initialData?.meso?.governanceStructure?.governanceCell || defaultGovernanceCell
  );

  const mockAgencies = [
    { id: 'treasury', name: 'Department of Treasury', type: 'department' },
    { id: 'health', name: 'Ministry of Health', type: 'ministry' },
    { id: 'environment', name: 'Environmental Protection Agency', type: 'agency' },
    { id: 'transport', name: 'Department of Transportation', type: 'department' },
    { id: 'digital', name: 'Digital Transformation Office', type: 'office' }
  ];

  const mockFrontlineUnits = [
    { id: 'hospital-1', name: 'Central General Hospital', type: 'Healthcare Facility' },
    { id: 'school-1', name: 'Metro High School', type: 'Educational Institution' },
    { id: 'office-1', name: 'City Services Center', type: 'Government Office' },
    { id: 'center-1', name: 'Community Health Center', type: 'Community Facility' }
  ];

  const mockPersons = [
    { id: 'p1', name: 'Sarah Chen', title: 'Director of Policy', org: 'Treasury' },
    { id: 'p2', name: 'Marcus Johnson', title: 'Operations Manager', org: 'Health' },
    { id: 'p3', name: 'Elena Rodriguez', title: 'Data Analyst', org: 'Digital Office' },
    { id: 'p4', name: 'David Kim', title: 'Communications Lead', org: 'Transport' }
  ];

  const addInstitutionalOwner = () => {
    const newOwner: InstitutionalOwner = {
      id: `owner-${Date.now()}`,
      name: '',
      type: 'department',
      role: 'supporting',
      mandate: '',
      capabilities: [],
      constraints: []
    };
    setInstitutionalOwners([...institutionalOwners, newOwner]);
  };

  const addFrontlineUnit = () => {
    const newUnit: FrontlineUnit = {
      id: `unit-${Date.now()}`,
      name: '',
      type: '',
      location: '',
      capacity: 0,
      currentLoad: 0,
      capabilities: [],
      constraints: [],
      stakeholders: []
    };
    setFrontlineUnits([...frontlineUnits, newUnit]);
  };

  const addPilotSite = () => {
    const newSite: PilotSite = {
      id: `site-${Date.now()}`,
      name: '',
      type: '',
      location: '',
      population: 0,
      characteristics: [],
      readinessLevel: 'medium',
      riskFactors: [],
      successFactors: []
    };
    setPilotSites([...pilotSites, newSite]);
  };

  const assignPersonToGovernanceRole = (cellFunction: string, person: any, raciRole: 'R' | 'A' | 'C' | 'I') => {
    const assignment: PersonAssignment = {
      personId: person.id,
      name: person.name,
      title: person.title,
      organization: person.org,
      raciBadge: raciRole,
      timeCommitment: '20% FTE'
    };

    setGovernanceCell(prev => prev.map(cell => 
      cell.cellFunction === cellFunction 
        ? { ...cell, assignedPersons: [...cell.assignedPersons, assignment] }
        : cell
    ));
  };

  const handleSave = () => {
    const mesoMicroConfig: Partial<MetaSolveLayer> = {
      meso: {
        institutionalOwners,
        governanceStructure: {
          governanceCell,
          decisionRights: [],
          escalationPaths: []
        },
        resourceAllocation: {
          budget: { totalBudget: 0, budgetByCategory: {}, fundingSources: [], contingencyPercent: 10 },
          staffing: { requiredFTE: 0, skillsRequired: [], trainingNeeds: [], hiringTimeline: '' },
          technology: { platformsRequired: [], dataRequirements: [], integrationsNeeded: [], securityRequirements: [] }
        },
        coordinationMechanisms: []
      },
      micro: {
        frontlineUnits,
        pilotSites,
        deliveryMechanisms: [],
        microLoops: []
      }
    };

    onSave(mesoMicroConfig);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative glass-secondary rounded-2xl border border-border-subtle shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-subtle">
            <div>
              <h2 className="text-xl font-semibold text-foreground">MetaSolve Configuration</h2>
              {macroVision && (
                <p className="text-sm text-muted-foreground mt-1">
                  {macroVision.title} → {macroVision.leverageContext.leveragePointName}
                </p>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-border-subtle">
            <button
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'meso'
                  ? 'text-primary border-b-2 border-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('meso')}
            >
              <Building2 className="h-4 w-4 inline-block mr-2" />
              Meso Layer (Institutional)
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'micro'
                  ? 'text-primary border-b-2 border-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('micro')}
            >
              <MapPin className="h-4 w-4 inline-block mr-2" />
              Micro Layer (Frontline)
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'meso' && (
              <div className="p-6 space-y-6">
                {/* Governance Cell Roles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Governance Cell Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {governanceCell.map((cell) => (
                      <div key={cell.cellFunction} className="glass rounded-lg p-4">
                        <h4 className="font-medium text-foreground mb-2">{cell.cellFunction}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {cell.responsibilities.join(', ')}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {cell.assignedPersons.map((person, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              <span className={`w-4 h-4 rounded text-xs flex items-center justify-center ${
                                person.raciBadge === 'R' ? 'bg-primary text-primary-foreground' :
                                person.raciBadge === 'A' ? 'bg-accent text-accent-foreground' :
                                person.raciBadge === 'C' ? 'bg-warning text-black' :
                                'bg-info text-white'
                              }`}>
                                {person.raciBadge}
                              </span>
                              {person.name}
                            </Badge>
                          ))}
                        </div>

                        <Select onValueChange={(personId) => {
                          const person = mockPersons.find(p => p.id === personId);
                          if (person) assignPersonToGovernanceRole(cell.cellFunction, person, 'R');
                        }}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Assign person to role" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockPersons.map((person) => (
                              <SelectItem key={person.id} value={person.id}>
                                {person.name} - {person.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Institutional Owners */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Institutional Owners
                      </span>
                      <Button variant="outline" size="sm" onClick={addInstitutionalOwner}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Agency
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {institutionalOwners.map((owner, index) => (
                      <div key={owner.id} className="glass rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Agency/Department</Label>
                            <Select
                              value={owner.name}
                              onValueChange={(value) => {
                                const agency = mockAgencies.find(a => a.name === value);
                                setInstitutionalOwners(prev => prev.map((o, i) => 
                                  i === index ? { ...o, name: value, type: agency?.type as any || 'department' } : o
                                ));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select agency" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockAgencies.map((agency) => (
                                  <SelectItem key={agency.id} value={agency.name}>
                                    {agency.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Role</Label>
                            <Select
                              value={owner.role}
                              onValueChange={(value: 'lead' | 'supporting' | 'consulting' | 'informed') => {
                                setInstitutionalOwners(prev => prev.map((o, i) => 
                                  i === index ? { ...o, role: value } : o
                                ));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lead">Lead Agency</SelectItem>
                                <SelectItem value="supporting">Supporting</SelectItem>
                                <SelectItem value="consulting">Consulting</SelectItem>
                                <SelectItem value="informed">Informed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Mandate & Responsibilities</Label>
                          <Textarea
                            value={owner.mandate}
                            onChange={(e) => {
                              setInstitutionalOwners(prev => prev.map((o, i) => 
                                i === index ? { ...o, mandate: e.target.value } : o
                              ));
                            }}
                            placeholder="Describe the agency's mandate and specific responsibilities..."
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'micro' && (
              <div className="p-6 space-y-6">
                {/* Frontline Units */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Frontline Delivery Units
                      </span>
                      <Button variant="outline" size="sm" onClick={addFrontlineUnit}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Unit
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {frontlineUnits.map((unit, index) => (
                      <div key={unit.id} className="glass rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Unit Name</Label>
                            <Input
                              value={unit.name}
                              onChange={(e) => {
                                setFrontlineUnits(prev => prev.map((u, i) => 
                                  i === index ? { ...u, name: e.target.value } : u
                                ));
                              }}
                              placeholder="Unit name"
                            />
                          </div>
                          <div>
                            <Label>Type</Label>
                            <Input
                              value={unit.type}
                              onChange={(e) => {
                                setFrontlineUnits(prev => prev.map((u, i) => 
                                  i === index ? { ...u, type: e.target.value } : u
                                ));
                              }}
                              placeholder="Unit type"
                            />
                          </div>
                          <div>
                            <Label>Location</Label>
                            <Input
                              value={unit.location}
                              onChange={(e) => {
                                setFrontlineUnits(prev => prev.map((u, i) => 
                                  i === index ? { ...u, location: e.target.value } : u
                                ));
                              }}
                              placeholder="Location"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Pilot Sites */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Pilot Sites
                      </span>
                      <Button variant="outline" size="sm" onClick={addPilotSite}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Site
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pilotSites.map((site, index) => (
                      <div key={site.id} className="glass rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Site Name</Label>
                            <Input
                              value={site.name}
                              onChange={(e) => {
                                setPilotSites(prev => prev.map((s, i) => 
                                  i === index ? { ...s, name: e.target.value } : s
                                ));
                              }}
                              placeholder="Pilot site name"
                            />
                          </div>
                          <div>
                            <Label>Readiness Level</Label>
                            <Select
                              value={site.readinessLevel}
                              onValueChange={(value: 'low' | 'medium' | 'high') => {
                                setPilotSites(prev => prev.map((s, i) => 
                                  i === index ? { ...s, readinessLevel: value } : s
                                ));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low Readiness</SelectItem>
                                <SelectItem value="medium">Medium Readiness</SelectItem>
                                <SelectItem value="high">High Readiness</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border-subtle">
            <div className="text-sm text-muted-foreground">
              Configure institutional and frontline layers for systematic delivery
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Configuration
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MetaSolveDetailForm;