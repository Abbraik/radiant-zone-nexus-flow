import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, TrendingUp, CheckCircle, AlertCircle, Users, FileText, Download, Share2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

interface RACIAssignment {
  memberId: string;
  roles: string[];
}

interface InterventionRACIMap {
  interventionId: string;
  assignments: RACIAssignment[];
}

interface Intervention {
  id: string;
  name: string;
  category: string;
  cost: number;
  triImpact: number;
}

interface BundleSummaryData {
  name: string;
  description: string;
  interventions: Intervention[];
  assignments: InterventionRACIMap[];
  sprintStart: Date;
  sprintEnd: Date;
  totalCost: number;
  expectedTRIImprovement: number;
  complianceStatus: 'passed' | 'warning' | 'failed';
  complianceChecks: Array<{ name: string; status: 'passed' | 'warning' | 'failed'; message: string; }>;
}

interface BundleSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  bundleData: BundleSummaryData;
  teamMembers: TeamMember[];
  customRoles: Array<{ id: string; name: string; color: string; description: string; }>;
  onConfirmPublish: () => void;
}

export const BundleSummaryModal: React.FC<BundleSummaryModalProps> = ({
  isOpen,
  onClose,
  bundleData,
  teamMembers,
  customRoles,
  onConfirmPublish
}) => {
  // Helper to get member by ID
  const getMember = (memberId: string) => teamMembers.find(m => m.id === memberId);
  
  // Helper to get role by ID
  const getRole = (roleId: string) => customRoles.find(r => r.id === roleId);

  // Generate RACI table data
  const raciTableData = bundleData.interventions.map(intervention => {
    const assignments = bundleData.assignments.find(a => a.interventionId === intervention.id);
    const roleMap: Record<string, string[]> = {};
    
    // Organize assignments by role
    assignments?.assignments.forEach(assignment => {
      assignment.roles.forEach(roleId => {
        if (!roleMap[roleId]) roleMap[roleId] = [];
        const member = getMember(assignment.memberId);
        if (member) roleMap[roleId].push(member.name);
      });
    });

    return {
      intervention,
      roleMap
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-400 border-green-400';
      case 'warning': return 'text-yellow-400 border-yellow-400';
      case 'failed': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4" />;
      case 'warning': case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            Bundle Summary: "{bundleData.name}"
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-white/5 border-white/10">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="text-sm text-gray-400">Sprint Duration</div>
                  <div className="text-white font-medium">
                    {Math.ceil((bundleData.sprintEnd.getTime() - bundleData.sprintStart.getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/5 border-white/10">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-green-400" />
                <div>
                  <div className="text-sm text-gray-400">Total Cost</div>
                  <div className="text-white font-medium">{formatCurrency(bundleData.totalCost)}</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/5 border-white/10">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                <div>
                  <div className="text-sm text-gray-400">TRI Impact</div>
                  <div className="text-white font-medium">+{bundleData.expectedTRIImprovement}%</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/5 border-white/10">
              <div className="flex items-center gap-3">
                {getComplianceIcon(bundleData.complianceStatus)}
                <div>
                  <div className="text-sm text-gray-400">Compliance</div>
                  <Badge variant="outline" className={getComplianceColor(bundleData.complianceStatus)}>
                    {bundleData.complianceStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Sprint Schedule */}
          <Card className="p-4 bg-white/5 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              Sprint Schedule
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Start Date</div>
                <div className="text-white font-medium">{bundleData.sprintStart.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">End Date</div>
                <div className="text-white font-medium">{bundleData.sprintEnd.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</div>
              </div>
            </div>
          </Card>

          {/* RACI Matrix Table */}
          <Card className="p-4 bg-white/5 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-green-400" />
              Interventions & Role Assignments
            </h3>
            
            {/* RACI Legend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {customRoles.map(role => (
                <div key={role.id} className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/10">
                  <div className={`w-3 h-3 rounded-full ${role.color}`} />
                  <div>
                    <div className="text-white text-sm font-medium">{role.name}</div>
                    <div className="text-gray-400 text-xs">{role.description}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3 text-white font-medium">Intervention</th>
                    {customRoles.map(role => (
                      <th key={role.id} className="text-center p-3 text-white font-medium min-w-[120px]">
                        <div className="flex items-center justify-center gap-1">
                          <div className={`w-3 h-3 rounded-full ${role.color}`} />
                          {role.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {raciTableData.map(({ intervention, roleMap }) => (
                    <tr key={intervention.id} className="border-b border-white/5">
                      <td className="p-3">
                        <div className="text-white font-medium">{intervention.name}</div>
                        <div className="text-gray-400 text-xs">{intervention.category}</div>
                      </td>
                      {customRoles.map(role => (
                        <td key={role.id} className="p-3 text-center">
                          <div className="flex flex-wrap justify-center gap-1">
                            {roleMap[role.id]?.map((memberName, index) => {
                              const member = teamMembers.find(m => m.name === memberName);
                              return (
                                <div key={index} className="flex items-center gap-1">
                                  {member && (
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className={`${member.color} text-white text-xs`}>
                                        {member.avatar}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                  <span className="text-white text-xs">{memberName.split(' ')[0]}</span>
                                </div>
                              );
                            }) || <span className="text-gray-500 text-xs">—</span>}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Compliance Status */}
          <Card className="p-4 bg-white/5 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              {getComplianceIcon(bundleData.complianceStatus)}
              Compliance Status
            </h3>
            <div className="space-y-2">
              {bundleData.complianceChecks.map((check, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                  <div className="flex items-center gap-2">
                    {getComplianceIcon(check.status)}
                    <span className="text-white text-sm">{check.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">{check.message}</span>
                    <Badge variant="outline" className={getComplianceColor(check.status)}>
                      {check.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Resource Impact */}
          <Card className="p-4 bg-white/5 border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              Resource Impact Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{formatCurrency(bundleData.totalCost)}</div>
                <div className="text-sm text-gray-400">Total Investment</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">+{bundleData.expectedTRIImprovement}%</div>
                <div className="text-sm text-gray-400">Expected TRI Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{bundleData.interventions.length}</div>
                <div className="text-sm text-gray-400">Total Interventions</div>
              </div>
            </div>
          </Card>

          <Separator className="bg-white/10" />

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-white/30 text-white">
                <Download className="w-4 h-4 mr-2" />
                Export Summary
              </Button>
              <Button variant="outline" className="border-white/30 text-white">
                <Share2 className="w-4 h-4 mr-2" />
                Share with Team
              </Button>
              <Button variant="outline" className="border-white/30 text-white">
                <Eye className="w-4 h-4 mr-2" />
                Preview Bundle
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose} className="border-white/30 text-white">
                Cancel
              </Button>
              <Button 
                onClick={onConfirmPublish}
                className="bg-green-500 hover:bg-green-600 text-white"
                disabled={bundleData.complianceStatus === 'failed'}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm & Publish Bundle
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BundleSummaryModal;