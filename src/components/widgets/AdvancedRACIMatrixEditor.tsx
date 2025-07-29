import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Brain, History, Check, Edit, RotateCcw } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  title: string;
  color: string;
  expertise: string[];
  workload: number;
}

interface RACIAssignment {
  memberId: string;
  role: 'Responsible' | 'Accountable' | 'Consulted' | 'Informed';
  confidence: number;
  reason: string;
}

interface InterventionRACIMap {
  interventionId: string;
  assignments: RACIAssignment[];
}

const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Dr. Sarah Chen',
    avatar: '👩‍⚕️',
    title: 'Health Policy Champion',
    color: 'bg-teal-500',
    expertise: ['Health Policy', 'Population Studies', 'Implementation'],
    workload: 65
  },
  {
    id: 'tm-2',
    name: 'Prof. Ahmed Hassan',
    avatar: '👨‍🎓',
    title: 'Education Analyst',
    color: 'bg-purple-500',
    expertise: ['Education Policy', 'Data Analysis', 'Research'],
    workload: 45
  },
  {
    id: 'tm-3',
    name: 'Maria Santos',
    avatar: '👩‍💼',
    title: 'Program Custodian',
    color: 'bg-blue-500',
    expertise: ['Program Management', 'Operations', 'Compliance'],
    workload: 80
  },
  {
    id: 'tm-4',
    name: 'Dr. James Wilson',
    avatar: '👨‍💻',
    title: 'Data Science Juror',
    color: 'bg-green-500',
    expertise: ['Data Science', 'Evaluation', 'Monitoring'],
    workload: 55
  },
  {
    id: 'tm-5',
    name: 'Lisa Rodriguez',
    avatar: '👩‍🔬',
    title: 'Research Coordinator',
    color: 'bg-orange-500',
    expertise: ['Research', 'Stakeholder Management', 'Communication'],
    workload: 70
  }
];

const raciRoles = [
  { value: 'Responsible', label: 'Responsible', color: 'bg-green-500', description: 'Does the work' },
  { value: 'Accountable', label: 'Accountable', color: 'bg-blue-500', description: 'Owns the outcome' },
  { value: 'Consulted', label: 'Consulted', color: 'bg-yellow-500', description: 'Provides input' },
  { value: 'Informed', label: 'Informed', color: 'bg-gray-500', description: 'Kept updated' }
];

interface AdvancedRACIMatrixEditorProps {
  interventions: Array<{ id: string; name: string; category: string; }>;
  onAssignmentsChange: (assignments: InterventionRACIMap[]) => void;
}

export const AdvancedRACIMatrixEditor: React.FC<AdvancedRACIMatrixEditorProps> = ({
  interventions,
  onAssignmentsChange
}) => {
  const [assignments, setAssignments] = useState<InterventionRACIMap[]>([]);
  const [showAIRecommendations, setShowAIRecommendations] = useState(true);
  const [selectedIntervention, setSelectedIntervention] = useState<string>('');

  // Mock AI recommendations based on historical patterns
  const generateAIRecommendations = (interventionId: string): RACIAssignment[] => {
    const intervention = interventions.find(i => i.id === interventionId);
    if (!intervention) return [];

    // Mock logic based on intervention category and team expertise
    const recommendations: RACIAssignment[] = [];

    if (intervention.category === 'Population') {
      recommendations.push({
        memberId: 'tm-1',
        role: 'Accountable',
        confidence: 92,
        reason: 'Health policy expertise and previous family planning program leadership'
      });
      recommendations.push({
        memberId: 'tm-3',
        role: 'Responsible',
        confidence: 88,
        reason: 'Program management experience and operational oversight'
      });
    } else if (intervention.category === 'Development') {
      recommendations.push({
        memberId: 'tm-2',
        role: 'Accountable',
        confidence: 90,
        reason: 'Education policy specialization and analytical background'
      });
      recommendations.push({
        memberId: 'tm-5',
        role: 'Responsible',
        confidence: 85,
        reason: 'Research coordination and stakeholder management'
      });
    }

    // Add consulted and informed roles
    recommendations.push({
      memberId: 'tm-4',
      role: 'Consulted',
      confidence: 82,
      reason: 'Data science expertise for monitoring and evaluation'
    });

    return recommendations;
  };

  const applyAIRecommendations = (interventionId: string) => {
    const recommendations = generateAIRecommendations(interventionId);
    const newAssignments = [...assignments];
    const existingIndex = newAssignments.findIndex(a => a.interventionId === interventionId);

    if (existingIndex >= 0) {
      newAssignments[existingIndex].assignments = recommendations;
    } else {
      newAssignments.push({
        interventionId,
        assignments: recommendations
      });
    }

    setAssignments(newAssignments);
    onAssignmentsChange(newAssignments);
  };

  const updateAssignment = (interventionId: string, memberId: string, role: string) => {
    const newAssignments = [...assignments];
    const interventionIndex = newAssignments.findIndex(a => a.interventionId === interventionId);

    if (interventionIndex >= 0) {
      const memberIndex = newAssignments[interventionIndex].assignments.findIndex(a => a.memberId === memberId);
      if (memberIndex >= 0) {
        newAssignments[interventionIndex].assignments[memberIndex].role = role as any;
      } else {
        newAssignments[interventionIndex].assignments.push({
          memberId,
          role: role as any,
          confidence: 75,
          reason: 'Manual assignment'
        });
      }
    } else {
      newAssignments.push({
        interventionId,
        assignments: [{
          memberId,
          role: role as any,
          confidence: 75,
          reason: 'Manual assignment'
        }]
      });
    }

    setAssignments(newAssignments);
    onAssignmentsChange(newAssignments);
  };

  const getAssignment = (interventionId: string, memberId: string): RACIAssignment | undefined => {
    const interventionAssignments = assignments.find(a => a.interventionId === interventionId);
    return interventionAssignments?.assignments.find(a => a.memberId === memberId);
  };

  const getWorkloadDistribution = () => {
    const workload = mockTeamMembers.map(member => {
      const responsibleCount = assignments.reduce((count, intervention) => {
        const assignment = intervention.assignments.find(a => 
          a.memberId === member.id && (a.role === 'Responsible' || a.role === 'Accountable')
        );
        return assignment ? count + 1 : count;
      }, 0);

      return {
        ...member,
        assignedInterventions: responsibleCount,
        projectedWorkload: member.workload + (responsibleCount * 15)
      };
    });

    return workload;
  };

  const workloadData = getWorkloadDistribution();

  return (
    <Card className="p-6 bg-white/5 border-white/10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Users className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Advanced RACI Matrix</h3>
              <p className="text-sm text-gray-400">AI-powered role assignment with workload optimization</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIRecommendations(!showAIRecommendations)}
              className="border-white/30 text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Assist
            </Button>
          </div>
        </div>

        {/* RACI Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {raciRoles.map(role => (
            <div key={role.value} className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className={`w-3 h-3 rounded-full ${role.color}`} />
              <div>
                <div className="text-white text-sm font-medium">{role.label}</div>
                <div className="text-gray-400 text-xs">{role.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Workload Overview */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Team Workload Distribution</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {workloadData.map(member => (
              <div key={member.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className={`${member.color} text-white text-xs`}>
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-white text-sm font-medium truncate">{member.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Workload</span>
                    <span className={`${member.projectedWorkload > 90 ? 'text-red-400' : member.projectedWorkload > 75 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {member.projectedWorkload}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    +{member.assignedInterventions} interventions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RACI Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-3 text-white font-medium">Intervention</th>
                {mockTeamMembers.map(member => (
                  <th key={member.id} className="text-center p-3 min-w-[120px]">
                    <div className="flex flex-col items-center gap-1">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={`${member.color} text-white text-sm`}>
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-white text-xs font-medium">{member.name.split(' ')[0]}</div>
                      <div className="text-gray-400 text-xs">{member.title.split(' ')[0]}</div>
                    </div>
                  </th>
                ))}
                <th className="text-center p-3 text-white font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {interventions.map(intervention => (
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
                  {mockTeamMembers.map(member => {
                    const assignment = getAssignment(intervention.id, member.id);
                    return (
                      <td key={member.id} className="p-3 text-center">
                        <Select
                          value={assignment?.role || ''}
                          onValueChange={(value) => updateAssignment(intervention.id, member.id, value)}
                        >
                          <SelectTrigger className="w-full bg-white/10 border-white/20 text-white text-xs">
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {raciRoles.map(role => (
                              <SelectItem key={role.value} value={role.value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${role.color}`} />
                                  {role.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {assignment && showAIRecommendations && assignment.confidence > 80 && (
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-300">
                              AI: {assignment.confidence}%
                            </Badge>
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td className="p-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyAIRecommendations(intervention.id)}
                      className="border-white/30 text-white text-xs"
                    >
                      <Brain className="w-3 h-3 mr-1" />
                      Auto
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Recommendations Panel */}
        <AnimatePresence>
          {showAIRecommendations && selectedIntervention && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30"
            >
              <h4 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Recommendations
              </h4>
              <div className="space-y-2 text-sm">
                {generateAIRecommendations(selectedIntervention).map((rec, index) => {
                  const member = mockTeamMembers.find(m => m.id === rec.memberId);
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className={`${member?.color} text-white text-xs`}>
                            {member?.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white">{member?.name}</span>
                        <Badge className={raciRoles.find(r => r.value === rec.role)?.color}>
                          {rec.role}
                        </Badge>
                      </div>
                      <div className="text-blue-300">{rec.confidence}% confidence</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                interventions.forEach(intervention => {
                  applyAIRecommendations(intervention.id);
                });
              }}
              className="border-white/30 text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              Auto-assign All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssignments([])}
              className="border-white/30 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          </div>
          
          <div className="text-sm text-gray-400">
            {assignments.length} of {interventions.length} interventions assigned
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AdvancedRACIMatrixEditor;