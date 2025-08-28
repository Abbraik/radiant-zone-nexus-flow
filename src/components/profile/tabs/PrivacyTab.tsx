import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { usePrivacySettings } from '@/hooks/usePrivacySettings';
import { Loader2, Shield, Eye, BarChart3, Database, Users } from 'lucide-react';

interface PrivacyTabProps {
  user: any;
}

export const PrivacyTab: React.FC<PrivacyTabProps> = ({ user }) => {
  const { privacySettings, isLoading, updatePrivacySettings } = usePrivacySettings();
  const [localSettings, setLocalSettings] = React.useState(privacySettings);

  React.useEffect(() => {
    setLocalSettings(privacySettings);
  }, [privacySettings]);

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings(prev => prev ? { ...prev, [key]: value } : null);
  };

  const handleSave = async () => {
    if (!localSettings) return;

    const updates = {
      profile_visibility: localSettings.profile_visibility,
      show_activity: localSettings.show_activity,
      show_achievements: localSettings.show_achievements,
      show_performance: localSettings.show_performance,
      data_sharing_consent: localSettings.data_sharing_consent,
      analytics_tracking: localSettings.analytics_tracking,
    };

    updatePrivacySettings.mutate(updates);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Profile Visibility */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Profile Visibility
          </CardTitle>
          <CardDescription>
            Control who can see your profile and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-visibility">Profile Visibility</Label>
            <Select
              value={localSettings?.profile_visibility || 'public'}
              onValueChange={(value) => handleSettingChange('profile_visibility', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Public - Anyone can view
                  </div>
                </SelectItem>
                <SelectItem value="team">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Team - Only team members
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Private - Only you
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity & Performance */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Activity & Performance
          </CardTitle>
          <CardDescription>
            Choose what information to display on your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-activity">Show Activity</Label>
              <p className="text-sm text-foreground-muted">
                Display your recent tasks and actions
              </p>
            </div>
            <Switch
              id="show-activity"
              checked={localSettings?.show_activity ?? true}
              onCheckedChange={(checked) => handleSettingChange('show_activity', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-achievements">Show Achievements</Label>
              <p className="text-sm text-foreground-muted">
                Display your unlocked badges and achievements
              </p>
            </div>
            <Switch
              id="show-achievements"
              checked={localSettings?.show_achievements ?? true}
              onCheckedChange={(checked) => handleSettingChange('show_achievements', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-performance">Show Performance Metrics</Label>
              <p className="text-sm text-foreground-muted">
                Display completion rates and performance statistics
              </p>
            </div>
            <Switch
              id="show-performance"
              checked={localSettings?.show_performance ?? true}
              onCheckedChange={(checked) => handleSettingChange('show_performance', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Analytics */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data & Analytics
          </CardTitle>
          <CardDescription>
            Manage how your data is used and shared
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="analytics-tracking">Analytics Tracking</Label>
              <p className="text-sm text-foreground-muted">
                Allow collection of usage analytics to improve the platform
              </p>
            </div>
            <Switch
              id="analytics-tracking"
              checked={localSettings?.analytics_tracking ?? true}
              onCheckedChange={(checked) => handleSettingChange('analytics_tracking', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="data-sharing">Data Sharing Consent</Label>
              <p className="text-sm text-foreground-muted">
                Allow anonymized data sharing for research and improvement
              </p>
            </div>
            <Switch
              id="data-sharing"
              checked={localSettings?.data_sharing_consent ?? false}
              onCheckedChange={(checked) => handleSettingChange('data_sharing_consent', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="glass border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Shield className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Manage your personal data and account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              Download My Data
            </Button>
            <p className="text-xs text-foreground-muted">
              Download a copy of all your data stored on the platform
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
            <p className="text-xs text-destructive">
              Permanently delete your account and all associated data
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={updatePrivacySettings.isPending}
          className="glass"
        >
          {updatePrivacySettings.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Privacy Settings'
          )}
        </Button>
      </div>
    </motion.div>
  );
};