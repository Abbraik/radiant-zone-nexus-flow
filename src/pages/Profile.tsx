import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ProfileOverview } from '@/components/profile/ProfileOverview';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { Card } from '@/components/ui/card';

const Profile: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="glass p-6 animate-pulse">
              <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4"></div>
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded"></div>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card className="glass p-6 animate-pulse">
              <div className="h-8 bg-muted rounded mb-4"></div>
              <div className="h-64 bg-muted rounded"></div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-4">
          Authentication Required
        </h1>
        <p className="text-foreground-muted">
          Please sign in to access your profile.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Profile Settings
        </h1>
        <p className="text-foreground-muted">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left Panel - Profile Overview */}
        <div className="xl:col-span-1">
          <ProfileOverview user={user} />
        </div>

        {/* Right Panel - Management Tabs */}
        <div className="xl:col-span-3">
          <ProfileTabs user={user} />
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;