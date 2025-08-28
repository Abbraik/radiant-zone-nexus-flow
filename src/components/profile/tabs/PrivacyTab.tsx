import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Download, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface PrivacyTabProps {
  user: any;
}

export const PrivacyTab: React.FC<PrivacyTabProps> = ({ user }) => {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    activityVisible: false,
    dataCollection: true,
    analyticsOptOut: false,
  });

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDataExport = () => {
    toast({
      title: 'Data Export Requested',
      description: 'Your data export will be prepared and emailed to you within 24 hours.',
    });
  };

  const handleAccountDeletion = () => {
    toast({
      title: 'Account Deletion',
      description: 'Please contact support to delete your account.',
      variant: 'destructive',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Privacy & Data
        </h3>
        <p className="text-foreground-muted">
          Manage your privacy settings and data preferences.
        </p>
      </div>

      {/* Profile Visibility */}
      <Card className="glass-secondary p-6">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-medium text-foreground">Profile Visibility</h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Public Profile</Label>
              <p className="text-sm text-foreground-muted">Make your profile visible to other users</p>
            </div>
            <Switch
              checked={privacySettings.profileVisible}
              onCheckedChange={(checked) => handlePrivacyChange('profileVisible', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Activity Status</Label>
              <p className="text-sm text-foreground-muted">Show when you were last active</p>
            </div>
            <Switch
              checked={privacySettings.activityVisible}
              onCheckedChange={(checked) => handlePrivacyChange('activityVisible', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Data Collection */}
      <Card className="glass-secondary p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-medium text-foreground">Data Collection</h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Analytics Data</Label>
              <p className="text-sm text-foreground-muted">Help improve our service with usage analytics</p>
            </div>
            <Switch
              checked={privacySettings.dataCollection}
              onCheckedChange={(checked) => handlePrivacyChange('dataCollection', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Opt-out of Analytics</Label>
              <p className="text-sm text-foreground-muted">Disable all analytics tracking</p>
            </div>
            <Switch
              checked={privacySettings.analyticsOptOut}
              onCheckedChange={(checked) => handlePrivacyChange('analyticsOptOut', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="glass-secondary p-6">
        <div className="flex items-center gap-3 mb-4">
          <Download className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-medium text-foreground">Data Management</h4>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-border/30">
            <div>
              <Label>Export Your Data</Label>
              <p className="text-sm text-foreground-muted">Download a copy of your personal data</p>
            </div>
            <Button 
              onClick={handleDataExport}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-destructive/30">
            <div>
              <Label className="text-destructive">Delete Account</Label>
              <p className="text-sm text-foreground-muted">Permanently delete your account and all data</p>
            </div>
            <Button 
              onClick={handleAccountDeletion}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Privacy Notice */}
      <Card className="glass-secondary p-6 border-info/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-info mt-0.5" />
          <div>
            <h4 className="text-lg font-medium text-foreground mb-2">Privacy Information</h4>
            <div className="text-foreground-muted space-y-2 text-sm">
              <p>
                We are committed to protecting your privacy and handling your data responsibly.
              </p>
              <p>
                Your profile information is only shared according to your visibility settings.
                We use analytics data to improve our service, but you can opt-out at any time.
              </p>
              <div className="flex gap-2 mt-4">
                <Badge variant="outline">
                  GDPR Compliant
                </Badge>
                <Badge variant="outline">
                  SOC 2 Certified
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};