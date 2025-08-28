import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Bell, Globe, Palette } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PreferencesTabProps {
  user: any;
}

export const PreferencesTab: React.FC<PreferencesTabProps> = ({ user }) => {
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: false,
      tasks: true,
      system: false,
    },
    workspace: {
      compactMode: false,
      showTips: true,
      autoSave: true,
    }
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      }
    }));
  };

  const handleWorkspaceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      workspace: {
        ...prev.workspace,
        [key]: value,
      }
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Preferences
        </h3>
        <p className="text-foreground-muted">
          Customize your experience and notification settings.
        </p>
      </div>

      {/* Appearance */}
      <Card className="glass-secondary p-6">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-medium text-foreground">Appearance</h4>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={preferences.theme} onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}>
              <SelectTrigger className="input-floating">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light" disabled>Light (Coming Soon)</SelectItem>
                <SelectItem value="auto" disabled>Auto (Coming Soon)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Localization */}
      <Card className="glass-secondary p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-medium text-foreground">Localization</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select value={preferences.language} onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}>
              <SelectTrigger className="input-floating">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es" disabled>Spanish (Coming Soon)</SelectItem>
                <SelectItem value="fr" disabled>French (Coming Soon)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select value={preferences.timezone} onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}>
              <SelectTrigger className="input-floating">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="EST">EST</SelectItem>
                <SelectItem value="PST">PST</SelectItem>
                <SelectItem value="CET">CET</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="glass-secondary p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-medium text-foreground">Notifications</h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-foreground-muted">Receive updates via email</p>
            </div>
            <Switch
              checked={preferences.notifications.email}
              onCheckedChange={(checked) => handleNotificationChange('email', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-sm text-foreground-muted">Browser push notifications</p>
            </div>
            <Switch
              checked={preferences.notifications.push}
              onCheckedChange={(checked) => handleNotificationChange('push', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Task Updates</Label>
              <p className="text-sm text-foreground-muted">Notifications about task changes</p>
            </div>
            <Switch
              checked={preferences.notifications.tasks}
              onCheckedChange={(checked) => handleNotificationChange('tasks', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>System Updates</Label>
              <p className="text-sm text-foreground-muted">Maintenance and system notices</p>
            </div>
            <Switch
              checked={preferences.notifications.system}
              onCheckedChange={(checked) => handleNotificationChange('system', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Workspace */}
      <Card className="glass-secondary p-6">
        <div className="flex items-center gap-3 mb-4">
          <Monitor className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-medium text-foreground">Workspace</h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Compact Mode</Label>
              <p className="text-sm text-foreground-muted">Use a more compact interface layout</p>
            </div>
            <Switch
              checked={preferences.workspace.compactMode}
              onCheckedChange={(checked) => handleWorkspaceChange('compactMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Tips</Label>
              <p className="text-sm text-foreground-muted">Display helpful tips and guides</p>
            </div>
            <Switch
              checked={preferences.workspace.showTips}
              onCheckedChange={(checked) => handleWorkspaceChange('showTips', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-Save</Label>
              <p className="text-sm text-foreground-muted">Automatically save your work</p>
            </div>
            <Switch
              checked={preferences.workspace.autoSave}
              onCheckedChange={(checked) => handleWorkspaceChange('autoSave', checked)}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};