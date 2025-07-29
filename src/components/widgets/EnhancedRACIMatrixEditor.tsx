import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, Users, Sparkles, Target, BarChart3, AlertCircle, CheckCircle, Plus, Trash2, Edit3, Save, X, Palette, Settings, FileText, History, Info } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  title: string;
  color: string;
  expertise: string[];
  workload: number;
  email: string;
  lastActivity: string;
}

interface CustomRole {
  id: string;
  name: string;
  color: string;
  permissions: string[];
  notifications: boolean;
  description: string;
}

interface RACIAssignment {
  memberId: string;
  roles: string[]; // Now supports multiple roles
  confidence: number;
  reason: string;
}

interface InterventionRACIMap {
  interventionId: string;
  assignments: RACIAssignment[];
}

interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  defaultAssignments: Record<string, string[]>; // intervention category -> role names
}

// Enhanced mock team members with contact info
const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Dr. Sarah Chen',
    avatar: '👩‍⚕️',
    title: 'Health Policy Champion',
    color: 'bg-teal-500',
    expertise: ['Health Policy', 'Population Studies', 'Implementation'],
    workload: 65,
    email: 'sarah.chen@org.gov',
    lastActivity: '2 hours ago'
  },
  {
    id: 'tm-2',
    name: 'Prof. Ahmed Hassan',
    avatar: '👨‍🎓',
    title: 'Education Analyst',
    color: 'bg-purple-500',
    expertise: ['Education Policy', 'Data Analysis', 'Research'],
    workload: 45,
    email: 'ahmed.hassan@org.gov',
    lastActivity: '1 day ago'
  },
  {
    id: 'tm-3',
    name: 'Maria Santos',
    avatar: '👩‍💼',
    title: 'Program Custodian',
    color: 'bg-blue-500',
    expertise: ['Program Management', 'Operations', 'Compliance'],
    workload: 80,
    email: 'maria.santos@org.gov',
    lastActivity: '30 minutes ago'
  },
  {
    id: 'tm-4',
    name: 'Dr. James Wilson',
    avatar: '👨‍💻',
    title: 'Data Science Juror',
    color: 'bg-green-500',
    expertise: ['Data Science', 'Evaluation', 'Monitoring'],
    workload: 55,
    email: 'james.wilson@org.gov',
    lastActivity: '4 hours ago'
  },
  {
    id: 'tm-5',
    name: 'Lisa Rodriguez',
    avatar: '👩‍🔬',
    title: 'Research Coordinator',
    color: 'bg-orange-500',
    expertise: ['Research', 'Stakeholder Management', 'Communication'],
    workload: 70,
    email: 'lisa.rodriguez@org.gov',
    lastActivity: '1 hour ago'
  }
];

// Default RACI roles with enhanced metadata
const defaultRoles: CustomRole[] = [
  { 
    id: 'responsible', 
    name: 'Responsible', 
    color: 'bg-green-500', 
    permissions: ['execute', 'update'], 
    notifications: true,
    description: 'Does the work to complete the task'
  },
  { 
    id: 'accountable', 
    name: 'Accountable', 
    color: 'bg-blue-500', 
    permissions: ['approve', 'delegate', 'monitor'], 
    notifications: true,
    description: 'Ultimately answerable for completion'
  },
  { 
    id: 'consulted', 
    name: 'Consulted', 
    color: 'bg-yellow-500', 
    permissions: ['review', 'advise'], 
    notifications: true,
    description: 'Provides input and expertise'
  },
  { 
    id: 'informed', 
    name: 'Informed', 
    color: 'bg-gray-500', 
    permissions: ['view'], 
    notifications: false,
    description: 'Kept up to date on progress'
  }
];

// Role templates for different bundle types
const roleTemplates: RoleTemplate[] = [
  {
    id: 'health-intervention',
    name: 'Health Intervention',
    description: 'Standard template for health policy bundles',
    defaultAssignments: {
      'Population': ['responsible', 'accountable'],
      'Healthcare': ['accountable', 'consulted'],
      'Prevention': ['responsible', 'informed']
    }
  },
  {
    id: 'education-policy',
    name: 'Education Policy',
    description: 'Template for education-focused interventions',
    defaultAssignments: {
      'Education': ['accountable', 'responsible'],
      'Development': ['responsible', 'consulted'],
      'Research': ['consulted', 'informed']
    }
  },
  {
    id: 'resource-management',
    name: 'Resource Management',
    description: 'Template for resource allocation bundles',
    defaultAssignments: {
      'Infrastructure': ['accountable', 'responsible'],
      'Economic': ['responsible', 'consulted'],
      'Environment': ['consulted', 'informed']
    }
  }
];

interface EnhancedRACIMatrixEditorProps {
  interventions: Array<{ id: string; name: string; category: string; }>;
  onAssignmentsChange: (assignments: InterventionRACIMap[]) => void;
}

export const EnhancedRACIMatrixEditor: React.FC<EnhancedRACIMatrixEditorProps> = ({
  interventions,
  onAssignmentsChange
}) => {
  const [assignments, setAssignments] = useState<InterventionRACIMap[]>([]);
  const [customRoles, setCustomRoles] = useState<CustomRole[]>(defaultRoles);
  const [showAIRecommendations, setShowAIRecommendations] = useState(true);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [draggedMember, setDraggedMember] = useState<string | null>(null);
  const [showRoleEditor, setShowRoleEditor] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', color: 'bg-indigo-500', description: '' });

  // Validation: Check for required roles
  const validateAssignments = () => {
    const validation = interventions.map(intervention => {
      const interventionAssignments = assignments.find(a => a.interventionId === intervention.id);
      const hasAccountable = interventionAssignments?.assignments.some(a => a.roles.includes('accountable'));
      const hasResponsible = interventionAssignments?.assignments.some(a => a.roles.includes('responsible'));
      
      return {
        interventionId: intervention.id,
        interventionName: intervention.name,
        hasAccountable,
        hasResponsible,
        isValid: hasAccountable && hasResponsible
      };
    });
    
    return validation;
  };

  // Apply role template
  const applyTemplate = (templateId: string) => {
    const template = roleTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newAssignments = interventions.map(intervention => {
      const categoryRoles = template.defaultAssignments[intervention.category] || [];
      const assignments: RACIAssignment[] = [];

      // Auto-assign based on expertise and workload
      categoryRoles.forEach(roleId => {
        const role = customRoles.find(r => r.id === roleId);
        if (!role) return;

        // Find best member for this role
        const bestMember = mockTeamMembers
          .filter(member => member.workload < 85) // Don't overload
          .sort((a, b) => {
            // Score based on expertise match and current workload
            const aScore = a.expertise.filter(exp => 
              exp.toLowerCase().includes(intervention.category.toLowerCase())
            ).length - (a.workload / 100);
            
            const bScore = b.expertise.filter(exp => 
              exp.toLowerCase().includes(intervention.category.toLowerCase())
            ).length - (b.workload / 100);
            
            return bScore - aScore;
          })[0];

        if (bestMember) {
          const existingAssignment = assignments.find(a => a.memberId === bestMember.id);
          if (existingAssignment) {
            existingAssignment.roles.push(roleId);
          } else {
            assignments.push({
              memberId: bestMember.id,
              roles: [roleId],
              confidence: 85,
              reason: `Template-based assignment for ${intervention.category} intervention`
            });
          }
        }
      });

      return {
        interventionId: intervention.id,
        assignments
      };
    });

    setAssignments(newAssignments);
    onAssignmentsChange(newAssignments);
  };

  // Toggle role assignment
  const toggleRole = (interventionId: string, memberId: string, roleId: string) => {
    const newAssignments = [...assignments];
    const interventionIndex = newAssignments.findIndex(a => a.interventionId === interventionId);

    if (interventionIndex >= 0) {
      const memberIndex = newAssignments[interventionIndex].assignments.findIndex(a => a.memberId === memberId);
      
      if (memberIndex >= 0) {
        const roles = newAssignments[interventionIndex].assignments[memberIndex].roles;
        if (roles.includes(roleId)) {
          // Remove role
          newAssignments[interventionIndex].assignments[memberIndex].roles = roles.filter(r => r !== roleId);
          // Remove assignment if no roles left
          if (newAssignments[interventionIndex].assignments[memberIndex].roles.length === 0) {
            newAssignments[interventionIndex].assignments.splice(memberIndex, 1);
          }
        } else {
          // Add role
          newAssignments[interventionIndex].assignments[memberIndex].roles.push(roleId);
        }
      } else {
        // Create new assignment
        newAssignments[interventionIndex].assignments.push({
          memberId,
          roles: [roleId],
          confidence: 75,
          reason: 'Manual assignment'
        });
      }
    } else {
      // Create new intervention assignment
      newAssignments.push({
        interventionId,
        assignments: [{
          memberId,
          roles: [roleId],
          confidence: 75,
          reason: 'Manual assignment'
        }]
      });
    }

    setAssignments(newAssignments);
    onAssignmentsChange(newAssignments);
  };

  // Get member's roles for an intervention
  const getMemberRoles = (interventionId: string, memberId: string): string[] => {
    const interventionAssignments = assignments.find(a => a.interventionId === interventionId);
    const memberAssignment = interventionAssignments?.assignments.find(a => a.memberId === memberId);
    return memberAssignment?.roles || [];
  };

  // Add custom role
  const addCustomRole = () => {
    if (!newRole.name.trim()) return;
    
    const role: CustomRole = {
      id: newRole.name.toLowerCase().replace(/\s+/g, '-'),
      name: newRole.name,
      color: newRole.color,
      permissions: ['view'], // Default permissions
      notifications: true,
      description: newRole.description
    };
    
    setCustomRoles([...customRoles, role]);
    setNewRole({ name: '', color: 'bg-indigo-500', description: '' });
    setShowRoleEditor(false);
  };

  // Bulk assignment functions
  const assignRoleToAllInterventions = (roleId: string, memberId: string) => {
    interventions.forEach(intervention => {
      toggleRole(intervention.id, memberId, roleId);
    });
  };

  const validation = validateAssignments();
  const validationErrors = validation.filter(v => !v.isValid);

  return (
    <Card className="p-6 bg-white/5 border-white/10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Grid className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Enhanced RACI Matrix</h3>
              <p className="text-sm text-gray-400">Customizable role assignment with drag-and-drop</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRoleEditor(!showRoleEditor)}
              className="border-white/30 text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Roles
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIRecommendations(!showAIRecommendations)}
              className="border-white/30 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Assist
            </Button>
          </div>
        </div>

        {/* Role Management Panel */}
        <AnimatePresence>
          {showRoleEditor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <h4 className="text-white font-medium mb-3">Manage Roles</h4>
              
              {/* Existing Roles */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {customRoles.map(role => (
                  <div key={role.id} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${role.color}`} />
                      <span className="text-white text-sm">{role.name}</span>
                    </div>
                    {!defaultRoles.find(r => r.id === role.id) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCustomRoles(customRoles.filter(r => r.id !== role.id))}
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add New Role */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-white text-sm">Role Name</Label>
                    <Input
                      value={newRole.name}
                      onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                      placeholder="e.g., Coordinator"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white text-sm">Color</Label>
                    <Select value={newRole.color} onValueChange={(value) => setNewRole({...newRole, color: value})}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'].map(color => (
                          <SelectItem key={color} value={color}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${color}`} />
                              {color.replace('bg-', '').replace('-500', '')}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white text-sm">Description</Label>
                    <Input
                      value={newRole.description}
                      onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                      placeholder="Role description"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <Button onClick={addCustomRole} className="bg-green-500 hover:bg-green-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Role
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Templates & Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Label className="text-white text-sm">Template:</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Choose template" />
              </SelectTrigger>
              <SelectContent>
                {roleTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectedTemplate && applyTemplate(selectedTemplate)}
              disabled={!selectedTemplate}
              className="border-white/30 text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Apply
            </Button>
          </div>

          {/* Validation Status */}
          {validationErrors.length > 0 && (
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{validationErrors.length} interventions need required roles</span>
            </div>
          )}
        </div>

        {/* Team Member Palette */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Team Members (Drag to Assign)</h4>
          <div className="flex flex-wrap gap-3">
            {mockTeamMembers.map(member => (
              <motion.div
                key={member.id}
                draggable
                onDragStart={() => setDraggedMember(member.id)}
                onDragEnd={() => setDraggedMember(null)}
                className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10 cursor-move hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileDrag={{ scale: 0.95 }}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={`${member.color} text-white text-sm`}>
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-white text-sm font-medium">{member.name}</div>
                  <div className="text-gray-400 text-xs">{member.title}</div>
                </div>
                <Badge variant="outline" className={`${member.workload > 85 ? 'text-red-400 border-red-400' : 'text-green-400 border-green-400'}`}>
                  {member.workload}%
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enhanced RACI Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-3 text-white font-medium min-w-[200px]">
                  <div className="flex items-center gap-2">
                    Intervention
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      title="RACI roles explained"
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                  </div>
                </th>
                {customRoles.map(role => (
                  <th key={role.id} className="text-center p-3 min-w-[150px]">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-4 h-4 rounded-full ${role.color}`} />
                      <div className="text-white text-sm font-medium">{role.name}</div>
                      <div className="text-gray-400 text-xs">{role.description}</div>
                    </div>
                  </th>
                ))}
                <th className="text-center p-3 text-white font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {interventions.map(intervention => {
                const interventionValidation = validation.find(v => v.interventionId === intervention.id);
                return (
                  <motion.tr
                    key={intervention.id}
                    className="border-b border-white/5 hover:bg-white/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="p-3">
                      <div className="text-white font-medium">{intervention.name}</div>
                      <div className="text-gray-400 text-xs">{intervention.category}</div>
                    </td>
                    {customRoles.map(role => (
                      <td key={role.id} className="p-3">
                        <div className="space-y-2">
                          {mockTeamMembers.map(member => {
                            const memberRoles = getMemberRoles(intervention.id, member.id);
                            const hasRole = memberRoles.includes(role.id);
                            
                            return (
                              <div key={member.id} className="flex items-center gap-2">
                                <Checkbox
                                  checked={hasRole}
                                  onCheckedChange={() => toggleRole(intervention.id, member.id, role.id)}
                                  className="border-white/30"
                                />
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className={`${member.color} text-white text-xs`}>
                                    {member.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-white text-xs">{member.name.split(' ')[0]}</span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    ))}
                    <td className="p-3 text-center">
                      {interventionValidation?.isValid ? (
                        <div className="flex items-center justify-center gap-1 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Complete</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-red-400">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs">Missing roles</span>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              {assignments.length} of {interventions.length} interventions assigned
            </div>
            <div className="text-sm text-gray-400">
              {validation.filter(v => v.isValid).length} validated
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssignments([])}
              className="border-white/30 text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedRACIMatrixEditor;
