import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Activity, Shield, Trophy, Target, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useUpdatedDashboardData } from '@/hooks/useUpdatedDashboardData';
import { useBadges } from '@/hooks/useUserStats';
import { format } from 'date-fns';

interface ProfileOverviewProps {
  user: any;
}

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({ user }) => {
  const { profile, uploadAvatar } = useProfile();
  const { userRoles, isAdmin } = useAuth();
  const { userStats, achievements, systemHealth, isLoading } = useUpdatedDashboardData();
  const { data: badges } = useBadges();
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

        {/* Dashboard Stats Preview */}
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-medium text-foreground-muted">Performance Overview</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground-muted">Active Loops</span>
              </div>
              <span className="text-sm font-bold text-primary">
                {isLoading ? '...' : userStats.activeLoops}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm text-foreground-muted">Completed Tasks</span>
              </div>
              <span className="text-sm font-bold text-success">
                {isLoading ? '...' : userStats.completedTasks}
              </span>
            </div>

            <div className="p-3 bg-accent/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground-muted">TRI Score</span>
                </div>
                <span className="text-sm font-bold text-accent">
                  {isLoading ? '...' : `${Math.round(userStats.avgTRI * 100)}%`}
                </span>
              </div>
              <Progress value={userStats.avgTRI * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Achievement Preview */}
        {badges && badges.unlocked && badges.unlocked.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-foreground-muted mb-3">Recent Achievements</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {badges.unlocked.slice(0, 3).map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.1 }}
                  className="p-2 bg-success/10 border border-success/20 rounded-lg text-center"
                  title={badge.description}
                >
                  <div className="text-lg">{badge.icon}</div>
                  <div className="text-xs text-success font-medium mt-1">
                    {badge.name}
                  </div>
                </motion.div>
              ))}
            </div>
            {badges.unlocked.length > 3 && (
              <div className="text-center mt-2">
                <span className="text-xs text-foreground-subtle">
                  +{badges.unlocked.length - 3} more achievements
                </span>
              </div>
            )}
          </div>
        )}

        {/* System Health Indicator */}
        <div className="mt-6">
          <div className={`p-3 rounded-lg border ${
            systemHealth.status === 'healthy' ? 'bg-success/10 border-success/20' :
            systemHealth.status === 'warning' ? 'bg-warning/10 border-warning/20' :
            'bg-destructive/10 border-destructive/20'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                systemHealth.status === 'healthy' ? 'bg-success' :
                systemHealth.status === 'warning' ? 'bg-warning' :
                'bg-destructive'
              }`} />
              <span className="text-xs font-medium">
                {systemHealth.status === 'healthy' ? 'All Systems Operational' :
                 systemHealth.status === 'warning' ? 'Minor Issues Detected' :
                 'Critical Issues Present'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Card>
  );
};