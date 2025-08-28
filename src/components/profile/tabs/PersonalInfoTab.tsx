import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/hooks/useProfile';

interface PersonalInfoTabProps {
  user: any;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ user }) => {
  const { profile, updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (profile) {
      const initialData = {
        display_name: profile.display_name || user.email?.split('@')[0] || '',
        bio: profile.bio || '',
      };
      setFormData(initialData);
    }
  }, [profile, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateProfile.mutate(formData);
    setHasChanges(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Personal Information
        </h3>
        <p className="text-foreground-muted">
          Update your profile information and bio.
        </p>
      </div>

      <div className="space-y-6">
        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="display_name" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Display Name
          </Label>
          <Input
            id="display_name"
            value={formData.display_name}
            onChange={(e) => handleInputChange('display_name', e.target.value)}
            placeholder="Enter your display name"
            className="input-floating"
          />
        </div>

        {/* Email (Read-only) */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </Label>
          <Input
            id="email"
            value={user.email}
            disabled
            className="input-floating opacity-60"
          />
          <p className="text-xs text-foreground-subtle">
            Email cannot be changed. Contact support if you need to update this.
          </p>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Bio
          </Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
            className="input-floating resize-none"
            maxLength={500}
          />
          <p className="text-xs text-foreground-subtle">
            {formData.bio.length}/500 characters
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateProfile.isPending}
            className="btn-primary"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};