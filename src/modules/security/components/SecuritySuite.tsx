import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle,
  Key,
  FileText,
  Clock,
  Users,
  Database,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SecurityEvent {
  id: string;
  type: 'login' | 'permission_change' | 'data_access' | 'policy_update' | 'suspicious_activity';
  user: string;
  action: string;
  timestamp: Date;
  risk: 'low' | 'medium' | 'high';
  location: string;
  device: string;
}

interface ComplianceCheck {
  id: string;
  name: string;
  status: 'compliant' | 'warning' | 'violation';
  lastCheck: Date;
  nextCheck: Date;
  description: string;
}

interface SecuritySettings {
  mfaEnabled: boolean;
  sessionTimeout: number;
  auditLogging: boolean;
  encryptionLevel: string;
  accessControl: string;
  dataRetention: number;
}

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: 'event-1',
    type: 'login',
    user: 'sarah.chen@company.com',
    action: 'Successful SSO login',
    timestamp: new Date(Date.now() - 300000),
    risk: 'low',
    location: 'New York, US',
    device: 'Chrome on Windows'
  },
  {
    id: 'event-2',
    type: 'permission_change',
    user: 'admin@company.com',
    action: 'Updated user roles for governance team',
    timestamp: new Date(Date.now() - 1800000),
    risk: 'medium',
    location: 'San Francisco, US',
    device: 'Edge on Windows'
  },
  {
    id: 'event-3',
    type: 'data_access',
    user: 'mike.johnson@company.com',
    action: 'Exported TRI analytics report',
    timestamp: new Date(Date.now() - 3600000),
    risk: 'low',
    location: 'London, UK',
    device: 'Safari on macOS'
  },
  {
    id: 'event-4',
    type: 'suspicious_activity',
    user: 'unknown',
    action: 'Failed login attempts (5x)',
    timestamp: new Date(Date.now() - 7200000),
    risk: 'high',
    location: 'Unknown',
    device: 'Unknown'
  }
];

const mockComplianceChecks: ComplianceCheck[] = [
  {
    id: 'gdpr',
    name: 'GDPR Compliance',
    status: 'compliant',
    lastCheck: new Date(Date.now() - 86400000),
    nextCheck: new Date(Date.now() + 86400000 * 29),
    description: 'Data protection and privacy regulations'
  },
  {
    id: 'sox',
    name: 'SOX Compliance',
    status: 'compliant',
    lastCheck: new Date(Date.now() - 172800000),
    nextCheck: new Date(Date.now() + 86400000 * 90),
    description: 'Financial reporting and governance standards'
  },
  {
    id: 'iso27001',
    name: 'ISO 27001',
    status: 'warning',
    lastCheck: new Date(Date.now() - 604800000),
    nextCheck: new Date(Date.now() + 86400000 * 7),
    description: 'Information security management'
  },
  {
    id: 'hipaa',
    name: 'HIPAA',
    status: 'violation',
    lastCheck: new Date(Date.now() - 1209600000),
    nextCheck: new Date(Date.now() + 86400000 * 3),
    description: 'Health information privacy and security'
  }
];

const mockSecuritySettings: SecuritySettings = {
  mfaEnabled: true,
  sessionTimeout: 8,
  auditLogging: true,
  encryptionLevel: 'AES-256',
  accessControl: 'RBAC',
  dataRetention: 90
};

// Security Event Component
const SecurityEventCard: React.FC<{ event: SecurityEvent }> = ({ event }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return <UserCheck className="h-4 w-4" />;
      case 'permission_change': return <Settings className="h-4 w-4" />;
      case 'data_access': return <Database className="h-4 w-4" />;
      case 'policy_update': return <FileText className="h-4 w-4" />;
      case 'suspicious_activity': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High Risk</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-xs text-warning border-warning">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs text-success border-success">Low Risk</Badge>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 p-3 rounded-lg bg-glass-primary/30 border border-border-subtle/20"
    >
      <div className={`p-2 rounded-lg ${
        event.risk === 'high' ? 'bg-destructive/20 text-destructive' :
        event.risk === 'medium' ? 'bg-warning/20 text-warning' :
        'bg-success/20 text-success'
      }`}>
        {getEventIcon(event.type)}
      </div>
      
      <div className="flex-1">
        <div className="flex items-start justify-between mb-1">
          <div className="text-sm font-medium text-foreground">
            {event.action}
          </div>
          {getRiskBadge(event.risk)}
        </div>
        
        <div className="text-xs text-foreground-subtle space-y-1">
          <div>User: {event.user}</div>
          <div>Location: {event.location} • {event.device}</div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {event.timestamp.toLocaleString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Compliance Dashboard
const ComplianceDashboard: React.FC<{ checks: ComplianceCheck[] }> = ({ checks }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'violation': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-foreground-subtle" />;
    }
  };

  const complianceScore = Math.round(
    (checks.filter(c => c.status === 'compliant').length / checks.length) * 100
  );

  return (
    <Card className="glass-secondary border-border-subtle/20">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Compliance Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground-subtle">Compliance Score</span>
            <span className="font-medium">{complianceScore}%</span>
          </div>
          <Progress value={complianceScore} className="h-3" />
        </div>

        {/* Individual Checks */}
        <div className="space-y-3">
          {checks.map((check) => (
            <div key={check.id} className="flex items-center justify-between p-3 rounded-lg bg-glass-primary/30">
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <div className="text-sm font-medium text-foreground">{check.name}</div>
                  <div className="text-xs text-foreground-subtle">{check.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-foreground-subtle">
                  Next: {check.nextCheck.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Security Settings Panel
const SecuritySettingsPanel: React.FC<{
  settings: SecuritySettings;
  onSettingChange: (key: keyof SecuritySettings, value: any) => void;
}> = ({ settings, onSettingChange }) => {
  return (
    <Card className="glass-secondary border-border-subtle/20">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Security Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* MFA Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">Multi-Factor Authentication</div>
            <div className="text-xs text-foreground-subtle">Require 2FA for all users</div>
          </div>
          <Switch
            checked={settings.mfaEnabled}
            onCheckedChange={(checked) => onSettingChange('mfaEnabled', checked)}
          />
        </div>

        {/* Audit Logging */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">Audit Logging</div>
            <div className="text-xs text-foreground-subtle">Log all user activities</div>
          </div>
          <Switch
            checked={settings.auditLogging}
            onCheckedChange={(checked) => onSettingChange('auditLogging', checked)}
          />
        </div>

        {/* Security Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-subtle/20">
          <div>
            <div className="text-xs text-foreground-subtle">Session Timeout</div>
            <div className="text-sm font-medium">{settings.sessionTimeout}h</div>
          </div>
          <div>
            <div className="text-xs text-foreground-subtle">Encryption</div>
            <div className="text-sm font-medium">{settings.encryptionLevel}</div>
          </div>
          <div>
            <div className="text-xs text-foreground-subtle">Access Control</div>
            <div className="text-sm font-medium">{settings.accessControl}</div>
          </div>
          <div>
            <div className="text-xs text-foreground-subtle">Data Retention</div>
            <div className="text-sm font-medium">{settings.dataRetention} days</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Security Suite Component
export const SecuritySuite: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [securityEvents] = useState<SecurityEvent[]>(mockSecurityEvents);
  const [complianceChecks] = useState<ComplianceCheck[]>(mockComplianceChecks);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(mockSecuritySettings);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'compliance' | 'settings'>('overview');

  const handleSettingChange = (key: keyof SecuritySettings, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  const securityScore = 85; // Mock security score
  const highRiskEvents = securityEvents.filter(e => e.risk === 'high').length;
  const complianceViolations = complianceChecks.filter(c => c.status === 'violation').length;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-4 z-50 glass rounded-3xl border border-border-subtle/30 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border-subtle/20">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Shield className="h-7 w-7 text-primary" />
            Security & Compliance
          </h1>
          <Button variant="ghost" onClick={onClose}>
            <Shield className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'events', label: 'Audit Log' },
            { key: 'compliance', label: 'Compliance' },
            { key: 'settings', label: 'Settings' }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Security Score */}
            <Card className="glass-secondary border-border-subtle/20">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{securityScore}%</div>
                  <Progress value={securityScore} className="h-3 mb-4" />
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-medium text-destructive">{highRiskEvents}</div>
                      <div className="text-foreground-subtle">High Risk Events</div>
                    </div>
                    <div>
                      <div className="font-medium text-warning">{complianceViolations}</div>
                      <div className="text-foreground-subtle">Compliance Issues</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <Card className="glass-secondary border-border-subtle/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-8 w-8 text-success" />
                    <div>
                      <div className="text-lg font-bold text-foreground">247</div>
                      <div className="text-xs text-foreground-subtle">Active Users</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-secondary border-border-subtle/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Lock className="h-8 w-8 text-info" />
                    <div>
                      <div className="text-lg font-bold text-foreground">98.5%</div>
                      <div className="text-xs text-foreground-subtle">MFA Adoption</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-secondary border-border-subtle/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Database className="h-8 w-8 text-accent" />
                    <div>
                      <div className="text-lg font-bold text-foreground">2.3TB</div>
                      <div className="text-xs text-foreground-subtle">Encrypted Data</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-secondary border-border-subtle/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Eye className="h-8 w-8 text-warning" />
                    <div>
                      <div className="text-lg font-bold text-foreground">1,247</div>
                      <div className="text-xs text-foreground-subtle">Audit Events</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Security Events</h2>
              <Badge variant="outline" className="text-xs">
                Last 24 hours
              </Badge>
            </div>
            {securityEvents.map((event) => (
              <SecurityEventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {activeTab === 'compliance' && (
          <ComplianceDashboard checks={complianceChecks} />
        )}

        {activeTab === 'settings' && (
          <SecuritySettingsPanel
            settings={securitySettings}
            onSettingChange={handleSettingChange}
          />
        )}
      </div>
    </motion.div>
  );
};