import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Clock, User, Edit, Eye, Download, Filter, Search } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface AuditEvent {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userAvatar: string;
  action: 'create' | 'modify' | 'delete' | 'approve' | 'reject' | 'comment' | 'assign';
  entityType: 'intervention' | 'bundle' | 'dependency' | 'role' | 'comment' | 'compliance';
  entityId: string;
  entityName: string;
  description: string;
  oldValue?: any;
  newValue?: any;
  metadata: {
    ipAddress: string;
    userAgent: string;
    sessionId: string;
  };
  impact: 'low' | 'medium' | 'high' | 'critical';
}

interface AuditFilter {
  dateRange: 'today' | 'week' | 'month' | 'all';
  userId: string;
  action: string;
  entityType: string;
  impact: string;
}

const mockAuditEvents: AuditEvent[] = [
  {
    id: 'audit-1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    userId: 'user-1',
    userName: 'Dr. Sarah Chen',
    userAvatar: '👩‍⚕️',
    action: 'approve',
    entityType: 'bundle',
    entityId: 'bundle-1',
    entityName: 'Population Development Bundle V1',
    description: 'Approved bundle for publication with 6 interventions',
    metadata: {
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_abc123'
    },
    impact: 'critical'
  },
  {
    id: 'audit-2',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    userId: 'user-2',
    userName: 'Prof. Ahmed Hassan',
    userAvatar: '👨‍🎓',
    action: 'modify',
    entityType: 'dependency',
    entityId: 'dep-1',
    entityName: 'Family Planning → Education Dependency',
    description: 'Changed dependency type from soft to hard',
    oldValue: { type: 'soft' },
    newValue: { type: 'hard' },
    metadata: {
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      sessionId: 'sess_def456'
    },
    impact: 'medium'
  },
  {
    id: 'audit-3',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    userId: 'user-3',
    userName: 'Maria Santos',
    userAvatar: '👩‍💼',
    action: 'assign',
    entityType: 'role',
    entityId: 'role-1',
    entityName: 'RACI Assignment - Health Infrastructure',
    description: 'Assigned Responsible role to Dr. James Wilson',
    newValue: { role: 'Responsible', assignee: 'Dr. James Wilson' },
    metadata: {
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
      sessionId: 'sess_ghi789'
    },
    impact: 'medium'
  },
  {
    id: 'audit-4',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    userId: 'user-1',
    userName: 'Dr. Sarah Chen',
    userAvatar: '👩‍⚕️',
    action: 'create',
    entityType: 'intervention',
    entityId: 'pop-6',
    entityName: 'Agricultural Innovation Program',
    description: 'Added new intervention to bundle with 70% resource cost',
    newValue: {
      name: 'Agricultural Innovation Program',
      category: 'Development',
      resourceCost: 70,
      kpiImpact: 65
    },
    metadata: {
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_abc123'
    },
    impact: 'high'
  },
  {
    id: 'audit-5',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    userId: 'user-4',
    userName: 'System AI',
    userAvatar: '🤖',
    action: 'create',
    entityType: 'compliance',
    entityId: 'comp-1',
    entityName: 'Compliance Validation Report',
    description: 'AI compliance validator identified 2 policy violations',
    newValue: { violations: 2, warnings: 3, score: 75 },
    metadata: {
      ipAddress: '127.0.0.1',
      userAgent: 'Internal System Process',
      sessionId: 'sys_auto'
    },
    impact: 'high'
  },
  {
    id: 'audit-6',
    timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
    userId: 'user-2',
    userName: 'Prof. Ahmed Hassan',
    userAvatar: '👨‍🎓',
    action: 'comment',
    entityType: 'intervention',
    entityId: 'pop-1',
    entityName: 'Family Planning Programs',
    description: 'Added comment about timeline overlap concerns',
    newValue: { comment: 'We should consider the timeline overlap with the health infrastructure project' },
    metadata: {
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      sessionId: 'sess_def456'
    },
    impact: 'low'
  }
];

interface AuditTrailSystemProps {
  onExportAudit: () => void;
}

export const AuditTrailSystem: React.FC<AuditTrailSystemProps> = ({
  onExportAudit
}) => {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(mockAuditEvents);
  const [filteredEvents, setFilteredEvents] = useState<AuditEvent[]>(mockAuditEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AuditFilter>({
    dateRange: 'all',
    userId: '',
    action: '',
    entityType: '',
    impact: ''
  });
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  // Apply filters
  useEffect(() => {
    let filtered = auditEvents;

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoff = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(event => event.timestamp >= cutoff);
    }

    // Other filters
    if (filters.userId) {
      filtered = filtered.filter(event => event.userId === filters.userId);
    }
    
    if (filters.action) {
      filtered = filtered.filter(event => event.action === filters.action);
    }
    
    if (filters.entityType) {
      filtered = filtered.filter(event => event.entityType === filters.entityType);
    }
    
    if (filters.impact) {
      filtered = filtered.filter(event => event.impact === filters.impact);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [auditEvents, filters, searchQuery]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-500/20 text-green-300';
      case 'modify': return 'bg-blue-500/20 text-blue-300';
      case 'delete': return 'bg-red-500/20 text-red-300';
      case 'approve': return 'bg-purple-500/20 text-purple-300';
      case 'reject': return 'bg-orange-500/20 text-orange-300';
      case 'comment': return 'bg-yellow-500/20 text-yellow-300';
      case 'assign': return 'bg-teal-500/20 text-teal-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return timestamp.toLocaleDateString();
  };

  const uniqueUsers = Array.from(new Set(auditEvents.map(e => e.userId)))
    .map(id => auditEvents.find(e => e.userId === id))
    .filter(Boolean);

  const uniqueActions = Array.from(new Set(auditEvents.map(e => e.action)));
  const uniqueEntityTypes = Array.from(new Set(auditEvents.map(e => e.entityType)));
  const uniqueImpacts = Array.from(new Set(auditEvents.map(e => e.impact)));

  return (
    <Card className="p-6 bg-white/5 border-white/10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-500/20 rounded-lg">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Audit Trail System</h3>
              <p className="text-sm text-gray-400">Complete activity logging and compliance tracking</p>
            </div>
          </div>
          
          <Button
            onClick={onExportAudit}
            className="bg-gray-600 hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Audit Log
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit events..."
                className="pl-10 bg-white/10 border-white/20 text-white text-sm"
              />
            </div>
          </div>

          <Select
            value={filters.dateRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value as any }))}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.userId}
            onValueChange={(value) => setFilters(prev => ({ ...prev, userId: value }))}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white text-sm">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Users</SelectItem>
              {uniqueUsers.map(user => (
                <SelectItem key={user!.userId} value={user!.userId}>
                  {user!.userName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.action}
            onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white text-sm">
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Actions</SelectItem>
              {uniqueActions.map(action => (
                <SelectItem key={action} value={action}>
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.impact}
            onValueChange={(value) => setFilters(prev => ({ ...prev, impact: value }))}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white text-sm">
              <SelectValue placeholder="All Impact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Impact</SelectItem>
              {uniqueImpacts.map(impact => (
                <SelectItem key={impact} value={impact}>
                  {impact.charAt(0).toUpperCase() + impact.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Showing {filteredEvents.length} of {auditEvents.length} audit events
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <span className="text-gray-400">Critical: {filteredEvents.filter(e => e.impact === 'critical').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full" />
              <span className="text-gray-400">High: {filteredEvents.filter(e => e.impact === 'high').length}</span>
            </div>
          </div>
        </div>

        {/* Audit Events */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.02 }}
                className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-gray-600 text-white text-sm">
                      {event.userAvatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white font-medium">{event.userName}</span>
                      <Badge className={getActionColor(event.action)}>
                        {event.action}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {event.entityType}
                      </Badge>
                      <Badge className={`${getImpactColor(event.impact)} text-xs border`}>
                        {event.impact}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-2">{event.description}</div>
                    <div className="text-sm text-blue-300 mb-2">{event.entityName}</div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(event.timestamp)}
                        <span className="mx-1">•</span>
                        <span>{event.metadata.ipAddress}</span>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                        className="border-white/30 text-white text-xs h-6"
                      >
                        {expandedEvent === event.id ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <Edit className="w-3 h-3 mr-1" />
                            Show Details
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedEvent === event.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 p-3 bg-white/5 rounded border border-white/10"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                              <h6 className="text-white font-medium mb-2">Event Details</h6>
                              <div className="space-y-1">
                                <div><span className="text-gray-400">Event ID:</span> <span className="text-white">{event.id}</span></div>
                                <div><span className="text-gray-400">Entity ID:</span> <span className="text-white">{event.entityId}</span></div>
                                <div><span className="text-gray-400">Session ID:</span> <span className="text-white">{event.metadata.sessionId}</span></div>
                                <div><span className="text-gray-400">User Agent:</span> <span className="text-white truncate">{event.metadata.userAgent.substring(0, 50)}...</span></div>
                              </div>
                            </div>
                            
                            {(event.oldValue || event.newValue) && (
                              <div>
                                <h6 className="text-white font-medium mb-2">Data Changes</h6>
                                {event.oldValue && (
                                  <div className="mb-2">
                                    <span className="text-red-400">Old Value:</span>
                                    <pre className="text-gray-300 text-xs mt-1 p-2 bg-red-500/10 rounded">
                                      {JSON.stringify(event.oldValue, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {event.newValue && (
                                  <div>
                                    <span className="text-green-400">New Value:</span>
                                    <pre className="text-gray-300 text-xs mt-1 p-2 bg-green-500/10 rounded">
                                      {JSON.stringify(event.newValue, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )))}
          </AnimatePresence>
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No audit events match your filters</p>
              <p className="text-sm mt-1">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AuditTrailSystem;
