import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Eye, FileText, AlertTriangle, CheckCircle, Users, Activity, Key, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  maxValue: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

interface AuditEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  ip: string;
  userAgent: string;
  status: 'success' | 'failed' | 'warning';
}

interface ComplianceItem {
  id: string;
  standard: string;
  requirement: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  lastAudit: Date;
  nextAudit: Date;
}

interface Threat {
  id: string;
  type: 'malware' | 'phishing' | 'unauthorized_access' | 'data_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  status: 'detected' | 'investigating' | 'resolved' | 'false_positive';
  affectedUsers?: number;
}

const mockSecurityMetrics: SecurityMetric[] = [
  {
    id: '1',
    name: 'Password Strength',
    value: 85,
    maxValue: 100,
    status: 'good',
    description: 'Average password strength across all users'
  },
  {
    id: '2',
    name: 'Two-Factor Authentication',
    value: 72,
    maxValue: 100,
    status: 'warning',
    description: 'Percentage of users with 2FA enabled'
  },
  {
    id: '3',
    name: 'Data Encryption',
    value: 100,
    maxValue: 100,
    status: 'good',
    description: 'Data encryption coverage'
  },
  {
    id: '4',
    name: 'Access Control',
    value: 94,
    maxValue: 100,
    status: 'good',
    description: 'Proper access controls implementation'
  }
];

const mockAuditEntries: AuditEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    user: 'sarah.chen@company.com',
    action: 'LOGIN',
    resource: 'Workspace Dashboard',
    ip: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0',
    status: 'success'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    user: 'marcus.johnson@company.com',
    action: 'FILE_DOWNLOAD',
    resource: 'governance-policy.pdf',
    ip: '192.168.1.105',
    userAgent: 'Firefox 121.0.0.0',
    status: 'success'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    user: 'unknown@suspicious.com',
    action: 'LOGIN_ATTEMPT',
    resource: 'Admin Panel',
    ip: '45.123.456.789',
    userAgent: 'Bot/1.0',
    status: 'failed'
  }
];

const mockComplianceItems: ComplianceItem[] = [
  {
    id: '1',
    standard: 'SOC 2',
    requirement: 'Access Control Management',
    status: 'compliant',
    lastAudit: new Date('2024-01-15'),
    nextAudit: new Date('2024-07-15')
  },
  {
    id: '2',
    standard: 'GDPR',
    requirement: 'Data Protection Impact Assessment',
    status: 'partial',
    lastAudit: new Date('2024-02-01'),
    nextAudit: new Date('2024-05-01')
  },
  {
    id: '3',
    standard: 'ISO 27001',
    requirement: 'Information Security Management',
    status: 'compliant',
    lastAudit: new Date('2024-01-20'),
    nextAudit: new Date('2024-07-20')
  }
];

const mockThreats: Threat[] = [
  {
    id: '1',
    type: 'unauthorized_access',
    severity: 'high',
    description: 'Multiple failed login attempts detected from suspicious IP',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: 'investigating',
    affectedUsers: 0
  },
  {
    id: '2',
    type: 'phishing',
    severity: 'medium',
    description: 'Suspicious email campaign targeting user credentials',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'resolved',
    affectedUsers: 3
  }
];

const SecurityMetricsCard: React.FC<{ metrics: SecurityMetric[] }> = ({ metrics }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Security Overview
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      {metrics.map((metric) => (
        <div key={metric.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{metric.name}</span>
            <Badge variant={
              metric.status === 'good' ? 'default' : 
              metric.status === 'warning' ? 'secondary' : 'destructive'
            }>
              {metric.value}%
            </Badge>
          </div>
          <Progress 
            value={(metric.value / metric.maxValue) * 100} 
            className="h-2"
          />
          <p className="text-xs text-foreground-subtle">{metric.description}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

const AuditTrailCard: React.FC<{ entries: AuditEntry[] }> = ({ entries }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Eye className="h-5 w-5" />
        Audit Trail
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg bg-background-secondary">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              entry.status === 'success' ? 'bg-success' :
              entry.status === 'warning' ? 'bg-warning' : 'bg-destructive'
            }`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{entry.action}</span>
                <Badge variant={
                  entry.status === 'success' ? 'default' :
                  entry.status === 'warning' ? 'secondary' : 'destructive'
                }>
                  {entry.status}
                </Badge>
              </div>
              <p className="text-xs text-foreground-subtle truncate">
                {entry.user} • {entry.resource} • {entry.ip}
              </p>
              <p className="text-xs text-foreground-subtle">
                {entry.timestamp.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ComplianceCard: React.FC<{ items: ComplianceItem[] }> = ({ items }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Compliance Status
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-3 rounded-lg bg-background-secondary">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{item.standard}</span>
              <Badge variant={
                item.status === 'compliant' ? 'default' :
                item.status === 'partial' ? 'secondary' : 'destructive'
              }>
                {item.status}
              </Badge>
            </div>
            <p className="text-sm text-foreground-subtle mb-2">{item.requirement}</p>
            <div className="flex justify-between text-xs text-foreground-subtle">
              <span>Last: {item.lastAudit.toLocaleDateString()}</span>
              <span>Next: {item.nextAudit.toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ThreatMonitoringCard: React.FC<{ threats: Threat[] }> = ({ threats }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        Threat Monitoring
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {threats.map((threat) => (
          <Alert key={threat.id} className={
            threat.severity === 'critical' ? 'border-destructive' :
            threat.severity === 'high' ? 'border-warning' : ''
          }>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium capitalize">{threat.type.replace('_', ' ')}</span>
                <div className="flex gap-2">
                  <Badge variant={
                    threat.severity === 'critical' ? 'destructive' :
                    threat.severity === 'high' ? 'secondary' : 'outline'
                  }>
                    {threat.severity}
                  </Badge>
                  <Badge variant={
                    threat.status === 'resolved' ? 'default' :
                    threat.status === 'investigating' ? 'secondary' : 'outline'
                  }>
                    {threat.status}
                  </Badge>
                </div>
              </div>
              <p className="text-sm mb-2">{threat.description}</p>
              <div className="flex justify-between text-xs text-foreground-subtle">
                <span>{threat.timestamp.toLocaleString()}</span>
                {threat.affectedUsers !== undefined && (
                  <span>{threat.affectedUsers} users affected</span>
                )}
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </CardContent>
  </Card>
);

interface SecuritySuiteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecuritySuite: React.FC<SecuritySuiteProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = React.useState('overview');

  if (!isOpen) return null;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent key={activeTab} value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <SecurityMetricsCard metrics={mockSecurityMetrics} />
              <ThreatMonitoringCard threats={mockThreats} />
            </motion.div>
          </TabsContent>

          <TabsContent key={activeTab} value="audit" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <AuditTrailCard entries={mockAuditEntries} />
            </motion.div>
          </TabsContent>

          <TabsContent key={activeTab} value="compliance" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <ComplianceCard items={mockComplianceItems} />
            </motion.div>
          </TabsContent>

          <TabsContent key={activeTab} value="threats" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <ThreatMonitoringCard threats={mockThreats} />
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};