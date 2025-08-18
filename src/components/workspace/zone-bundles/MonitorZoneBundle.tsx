import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Monitor, AlertTriangle, Play, Users } from 'lucide-react';
import { MultiLevelLoopHealthDashboard } from '@/components/monitor/MultiLevelLoopHealthDashboard';
import { CommunityPulseDashboard } from '@/components/monitor/CommunityPulseDashboard';
import type { ZoneBundleProps } from '@/types/zone-bundles';

interface MonitorZoneBundleProps extends ZoneBundleProps {}

const MonitorZoneBundle: React.FC<MonitorZoneBundleProps> = ({
  taskId,
  taskData,
  payload,
  onPayloadUpdate,
  onValidationChange,
  readonly = false
}) => {
  const [activeTab, setActiveTab] = useState('breach');
  const [breachData, setBreachData] = useState(payload?.breach || { acknowledged: false });
  const [triageDecision, setTriageDecision] = useState(payload?.triage || { decision: null });
  const [selectedPlaybook, setSelectedPlaybook] = useState(payload?.playbook || { id: null });
  const [assignedOwner, setAssignedOwner] = useState(payload?.owner || { id: null, deadline: null });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Mock playbooks data
  const availablePlaybooks = [
    { id: 'pb-001', name: 'Standard Breach Response', description: 'Standard protocol for metric breaches' },
    { id: 'pb-002', name: 'Critical Alert Escalation', description: 'High-priority escalation protocol' },
    { id: 'pb-003', name: 'Community Engagement', description: 'Community-focused response protocol' },
    { id: 'pb-004', name: 'Technical Investigation', description: 'Deep technical analysis protocol' }
  ];

  // Update payload when data changes
  const updatePayload = useCallback((updates: any) => {
    const newPayload = {
      ...payload,
      ...updates,
      lastModified: new Date().toISOString()
    };
    onPayloadUpdate(newPayload);
  }, [payload, onPayloadUpdate]);

  // Handle breach acknowledgment
  const handleBreachAcknowledge = useCallback(() => {
    const updatedBreach = { ...breachData, acknowledged: true, acknowledgedAt: new Date().toISOString() };
    setBreachData(updatedBreach);
    updatePayload({ breach: updatedBreach });
  }, [breachData, updatePayload]);

  // Handle triage decision
  const handleTriageDecision = useCallback((decision: string) => {
    const updatedTriage = { ...triageDecision, decision, decidedAt: new Date().toISOString() };
    setTriageDecision(updatedTriage);
    updatePayload({ triage: updatedTriage });
  }, [triageDecision, updatePayload]);

  // Handle playbook selection
  const handlePlaybookSelect = useCallback((playbook: any) => {
    setSelectedPlaybook(playbook);
    updatePayload({ playbook });
  }, [updatePayload]);

  // Handle owner assignment
  const handleOwnerAssign = useCallback((owner: any) => {
    setAssignedOwner(owner);
    updatePayload({ owner });
  }, [updatePayload]);

  // Validate the current state
  const validateState = useCallback(() => {
    const errors: string[] = [];
    
    // Check breach acknowledgment
    if (!breachData.acknowledged) {
      errors.push('Breach must be acknowledged');
    }

    // Check triage decision
    if (!triageDecision.decision) {
      errors.push('Triage decision must be made');
    }

    // Check playbook selection
    if (!selectedPlaybook.id) {
      errors.push('Playbook must be assigned');
    }

    // Check owner assignment
    if (!assignedOwner.id || !assignedOwner.deadline) {
      errors.push('Owner and deadline must be assigned');
    }

    setValidationErrors(errors);
    const isValid = errors.length === 0;
    onValidationChange(isValid);
    
    return isValid;
  }, [breachData, triageDecision, selectedPlaybook, assignedOwner, onValidationChange]);

  // Run validation when dependencies change
  useEffect(() => {
    validateState();
  }, [validateState]);

  // Initialize from payload
  useEffect(() => {
    if (payload?.breach) {
      setBreachData(payload.breach);
    }
    if (payload?.triage) {
      setTriageDecision(payload.triage);
    }
    if (payload?.playbook) {
      setSelectedPlaybook(payload.playbook);
    }
    if (payload?.owner) {
      setAssignedOwner(payload.owner);
    }
  }, [payload]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <Monitor className="h-5 w-5 text-cyan-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">MONITOR Zone Bundle</h2>
            <p className="text-sm text-muted-foreground">
              Breach Response & Alert Management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="outline" className="text-cyan-500 border-cyan-500/30">
            MONITOR
          </Badge>
          {validationErrors.length === 0 ? (
            <Badge variant="outline" className="text-green-500 border-green-500/30">
              Valid
            </Badge>
          ) : (
            <Badge variant="outline" className="text-red-500 border-red-500/30">
              {validationErrors.length} Issues
            </Badge>
          )}
          {breachData.acknowledged && (
            <Badge variant="outline" className="text-green-500 border-green-500/30">
              Acknowledged
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="breach" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Breach Triage
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Loop Health
            </TabsTrigger>
            <TabsTrigger value="playbook" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Playbooks
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="breach" className="h-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Breach Triage Console</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Breach Acknowledgment */}
                <div className="p-4 border border-border/50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Breach Acknowledgment</h4>
                    {breachData.acknowledged ? (
                      <Badge variant="outline" className="text-green-500 border-green-500/30">
                        Acknowledged
                      </Badge>
                    ) : (
                      <Button onClick={handleBreachAcknowledge} size="sm">
                        Acknowledge Breach
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {taskData?.description || 'Metric has exceeded acceptable thresholds and requires immediate attention.'}
                  </p>
                </div>

                {/* Triage Decision */}
                <div className="p-4 border border-border/50 rounded-lg">
                  <h4 className="font-medium mb-4">Triage Decision</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['escalate', 'investigate', 'contain', 'monitor'].map((decision) => (
                      <Button
                        key={decision}
                        variant={triageDecision.decision === decision ? 'default' : 'outline'}
                        onClick={() => handleTriageDecision(decision)}
                        className="capitalize"
                      >
                        {decision}
                      </Button>
                    ))}
                  </div>
                  {triageDecision.decision && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Decision: <span className="font-medium capitalize">{triageDecision.decision}</span>
                    </p>
                  )}
                </div>

                {/* Owner Assignment */}
                <div className="p-4 border border-border/50 rounded-lg">
                  <h4 className="font-medium mb-4">Owner Assignment</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Assigned Owner</label>
                      <input
                        type="text"
                        placeholder="Enter owner name or ID"
                        value={assignedOwner.id || ''}
                        onChange={(e) => handleOwnerAssign({ ...assignedOwner, id: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-border/50 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Deadline</label>
                      <input
                        type="datetime-local"
                        value={assignedOwner.deadline || ''}
                        onChange={(e) => handleOwnerAssign({ ...assignedOwner, deadline: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-border/50 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="h-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Multi-Level Loop Health</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <MultiLevelLoopHealthDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="playbook" className="h-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Response Playbooks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {availablePlaybooks.map((playbook) => (
                  <div
                    key={playbook.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPlaybook.id === playbook.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border/50 hover:border-border'
                    }`}
                    onClick={() => handlePlaybookSelect(playbook)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{playbook.name}</h4>
                      {selectedPlaybook.id === playbook.id && (
                        <Badge variant="outline" className="text-primary border-primary/30">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {playbook.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="h-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Community Pulse</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <CommunityPulseDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="p-4 border-t border-border/50">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <h4 className="text-sm font-medium text-red-600 mb-2">
              Validation Issues ({validationErrors.length})
            </h4>
            <ul className="space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-xs text-red-600">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MonitorZoneBundle;