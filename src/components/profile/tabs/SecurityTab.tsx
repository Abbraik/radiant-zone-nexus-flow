import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Shield, Smartphone, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SecurityTabProps {
  user: any;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ user }) => {
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordChange = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (passwordForm.new.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Password updated successfully',
      });

      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update password',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak' };
    if (password.length < 10) return { strength: 2, label: 'Fair' };
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 4, label: 'Strong' };
    }
    return { strength: 3, label: 'Good' };
  };

  const passwordStrength = getPasswordStrength(passwordForm.new);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Security Settings
        </h3>
        <p className="text-foreground-muted">
          Manage your account security and authentication methods.
        </p>
      </div>

      {/* Password Change Section */}
      <Card className="glass-secondary p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-medium text-foreground">Change Password</h4>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_password">Current Password</Label>
            <Input
              id="current_password"
              type="password"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
              placeholder="Enter current password"
              className="input-floating"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <Input
              id="new_password"
              type="password"
              value={passwordForm.new}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
              placeholder="Enter new password"
              className="input-floating"
            />
            {passwordForm.new && (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-background-secondary rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      passwordStrength.strength === 1 ? 'bg-destructive w-1/4' :
                      passwordStrength.strength === 2 ? 'bg-warning w-1/2' :
                      passwordStrength.strength === 3 ? 'bg-info w-3/4' :
                      passwordStrength.strength === 4 ? 'bg-success w-full' : 'w-0'
                    }`}
                  />
                </div>
                <span className="text-xs text-foreground-muted">
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirm New Password</Label>
            <Input
              id="confirm_password"
              type="password"
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
              placeholder="Confirm new password"
              className="input-floating"
            />
          </div>

          <Button
            onClick={handlePasswordChange}
            disabled={!passwordForm.current || !passwordForm.new || !passwordForm.confirm || isUpdatingPassword}
            className="btn-primary"
          >
            {isUpdatingPassword ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="glass-secondary p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-primary" />
            <h4 className="text-lg font-medium text-foreground">Two-Factor Authentication</h4>
          </div>
          <Badge variant="outline" className="text-warning border-warning/30">
            Not Enabled
          </Badge>
        </div>

        <p className="text-foreground-muted mb-4">
          Add an extra layer of security to your account with two-factor authentication.
        </p>

        <Button variant="outline" disabled>
          <Shield className="w-4 h-4 mr-2" />
          Enable 2FA (Coming Soon)
        </Button>
      </Card>

      {/* Security Notice */}
      <Card className="glass-secondary p-6 border-warning/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
          <div>
            <h4 className="text-lg font-medium text-foreground mb-2">Security Tips</h4>
            <ul className="text-foreground-muted space-y-1 text-sm">
              <li>• Use a strong, unique password for your account</li>
              <li>• Enable two-factor authentication when available</li>
              <li>• Regularly review your account activity</li>
              <li>• Never share your login credentials</li>
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};