import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Activity, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface ProfileOverviewProps {
  user: any;
}

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({ user }) => {
  const { profile, uploadAvatar } = useProfile();
  const { userRoles, isAdmin } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar.mutate(file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = profile?.display_name || user.email?.split('@')[0] || 'User';
  const joinDate = user.created_at ? new Date(user.created_at) : null;

  return (
    <Card className="glass p-6 sticky top-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        {/* Avatar */}
        <div className="relative mb-6">
          <Avatar 
            className="w-32 h-32 mx-auto border-4 border-primary/20 shadow-elevation cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-accent text-primary-foreground">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          
          <Button
            size="sm"
            variant="secondary"
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full p-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadAvatar.isPending}
          >
            📸
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>

        {/* User Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {displayName}
          </h2>
          <p className="text-foreground-muted mb-4">
            {user.email}
          </p>
          
          {profile?.bio && (
            <p className="text-sm text-foreground-subtle italic mb-4">
              "{profile.bio}"
            </p>
          )}

          {/* Role Badges */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {userRoles.map((role) => (
              <Badge
                key={role.id}
                variant={role.role === 'admin' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {role.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                {role.role}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-background-secondary/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground-muted">Joined</span>
            </div>
            <span className="text-sm font-medium">
              {joinDate ? format(joinDate, 'MMM yyyy') : 'Unknown'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-background-secondary/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-success" />
              <span className="text-sm text-foreground-muted">Status</span>
            </div>
            <Badge variant="outline" className="text-success border-success/30">
              Active
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-background-secondary/50 rounded-lg">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              <span className="text-sm text-foreground-muted">Profile</span>
            </div>
            <span className="text-sm font-medium">
              {profile ? '100%' : '60%'} Complete
            </span>
          </div>
        </div>
      </motion.div>
    </Card>
  );
};