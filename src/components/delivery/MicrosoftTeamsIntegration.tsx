import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  Zap,
  Link,
  Bell,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export const MicrosoftTeamsIntegration: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [settings, setSettings] = useState({
    autoCreateChannels: true,
    taskNotifications: true,
    dailyStandups: false,
    sprintReports: true,
    fileSync: true
  });
  const { toast } = useToast();

  const handleConnect = async () => {
    setConnectionStatus('connecting');
    
    // Simulate connection process
    setTimeout(() => {
      setConnectionStatus('connected');
      setIsConnected(true);
      toast({
        title: "Microsoft Teams Connected",
        description: "Successfully integrated with your Teams workspace",
      });
    }, 2000);
  };

  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
    setIsConnected(false);
    toast({
      title: "Microsoft Teams Disconnected",
      description: "Integration has been disabled",
      variant: "destructive"
    });
  };

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            Microsoft Teams Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                'bg-gray-400'
              }`} />
              <div>
                <p className="font-medium">
                  {connectionStatus === 'connected' ? 'Connected' :
                   connectionStatus === 'connecting' ? 'Connecting...' :
                   'Not Connected'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {connectionStatus === 'connected' ? 'Teams integration is active and ready' :
                   connectionStatus === 'connecting' ? 'Establishing connection to Teams...' :
                   'Connect to enable team collaboration features'}
                </p>
              </div>
            </div>

            {!isConnected ? (
              <Button 
                onClick={handleConnect}
                disabled={connectionStatus === 'connecting'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {connectionStatus === 'connecting' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Link className="h-4 w-4 mr-2" />
                )}
                {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect Teams'}
              </Button>
            ) : (
              <Button 
                onClick={handleDisconnect}
                variant="outline"
              >
                Disconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isConnected && (
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
          </TabsList>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-green-800">Auto Channel Creation</h3>
                      <p className="text-sm text-green-700">
                        Automatically creates Teams channels for new sprints with relevant team members
                      </p>
                      <Badge className="bg-green-600 text-white mt-2">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Bell className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-blue-800">Task Notifications</h3>
                      <p className="text-sm text-blue-700">
                        Real-time notifications for task updates, assignments, and completions
                      </p>
                      <Badge className="bg-blue-600 text-white mt-2">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-purple-800">Sprint Reports</h3>
                      <p className="text-sm text-purple-700">
                        Automated sprint progress reports and analytics shared in Teams
                      </p>
                      <Badge className="bg-purple-600 text-white mt-2">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-orange-800">Meeting Integration</h3>
                      <p className="text-sm text-orange-700">
                        Schedule and join sprint meetings directly from the platform
                      </p>
                      <Badge variant="outline" className="mt-2">Available</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Integration Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-channels" className="text-sm font-medium">
                      Auto-create Channels
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically create Teams channels for new sprints
                    </p>
                  </div>
                  <Switch
                    id="auto-channels"
                    checked={settings.autoCreateChannels}
                    onCheckedChange={(checked) => updateSetting('autoCreateChannels', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="task-notifications" className="text-sm font-medium">
                      Task Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Send notifications for task updates and assignments
                    </p>
                  </div>
                  <Switch
                    id="task-notifications"
                    checked={settings.taskNotifications}
                    onCheckedChange={(checked) => updateSetting('taskNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="daily-standups" className="text-sm font-medium">
                      Daily Standup Reminders
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automated daily standup meeting reminders
                    </p>
                  </div>
                  <Switch
                    id="daily-standups"
                    checked={settings.dailyStandups}
                    onCheckedChange={(checked) => updateSetting('dailyStandups', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sprint-reports" className="text-sm font-medium">
                      Sprint Progress Reports
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Weekly progress reports shared in Teams
                    </p>
                  </div>
                  <Switch
                    id="sprint-reports"
                    checked={settings.sprintReports}
                    onCheckedChange={(checked) => updateSetting('sprintReports', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="file-sync" className="text-sm font-medium">
                      File Synchronization
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Sync files and documents with Teams SharePoint
                    </p>
                  </div>
                  <Switch
                    id="file-sync"
                    checked={settings.fileSync}
                    onCheckedChange={(checked) => updateSetting('fileSync', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security & Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span>Encrypted communication channels</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span>Role-based access control</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span>Audit logging enabled</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span>Compliance with organizational policies</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Active Sprint Channels</h3>
                <p className="text-sm text-muted-foreground">
                  Teams channels created for current sprints
                </p>
              </div>
              <Button size="sm">
                <Users className="h-4 w-4 mr-2" />
                Create Channel
              </Button>
            </div>

            <div className="space-y-3">
              {[
                {
                  name: 'Heat Stress Response Sprint',
                  members: 8,
                  messages: 47,
                  status: 'active',
                  lastActivity: '2 minutes ago'
                },
                {
                  name: 'Fertility Policy Analysis',
                  members: 5,
                  messages: 12,
                  status: 'planning',
                  lastActivity: '1 hour ago'
                }
              ].map((channel, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">{channel.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{channel.members} members</span>
                            <span>{channel.messages} messages</span>
                            <span>Last activity: {channel.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={channel.status === 'active' ? 'default' : 'outline'}>
                          {channel.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Connection Help */}
      {!isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-semibold mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium">Connect Your Teams Account</p>
                  <p className="text-muted-foreground">
                    Click "Connect Teams" to authenticate with your Microsoft Teams workspace
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-semibold mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium">Configure Settings</p>
                  <p className="text-muted-foreground">
                    Customize notifications, channel creation, and collaboration features
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-semibold mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium">Start Collaborating</p>
                  <p className="text-muted-foreground">
                    Create sprints and automatically generate Teams channels for seamless collaboration
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};