import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, AlertTriangle, Users, Key, Database, Lock, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
  status: 'success' | 'failed' | 'warning';
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
  }
];

const mockAuditEntries: AuditEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    user: 'admin@company.com',
    action: 'LOGIN',
    resource: 'Security Dashboard',
    ip: '192.168.1.100',
    status: 'success'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    user: 'user@company.com',
    action: 'ACCESS_DENIED',
    resource: 'Admin Panel',
    ip: '192.168.1.105',
    status: 'failed'
  }
];

const SecurityOps: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="container mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Security Operations</h1>
          </div>
          <p className="text-foreground-subtle max-w-2xl mx-auto">
            Monitor security metrics, audit logs, and system health
          </p>
        </motion.div>

        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Audit Logs
            </TabsTrigger>
            <TabsTrigger value="threats" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Threats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockSecurityMetrics.map((metric) => (
                <Card key={metric.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Progress value={(metric.value / metric.maxValue) * 100} className="flex-1" />
                        <span className="text-sm font-medium">{metric.value}%</span>
                      </div>
                      <p className="text-xs text-foreground-subtle">{metric.description}</p>
                      <Badge variant={metric.status === 'good' ? 'default' : metric.status === 'warning' ? 'secondary' : 'destructive'}>
                        {metric.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Audit Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAuditEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{entry.action}</span>
                          <Badge variant={entry.status === 'success' ? 'default' : 'destructive'}>
                            {entry.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground-subtle">
                          {entry.user} • {entry.resource} • {entry.ip}
                        </p>
                      </div>
                      <span className="text-sm text-foreground-subtle">
                        {entry.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threats" className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No active threats detected. System monitoring is operational.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SecurityOps;