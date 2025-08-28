import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { PersonalInfoTab } from './tabs/PersonalInfoTab';
import { SecurityTab } from './tabs/SecurityTab';
import { PreferencesTab } from './tabs/PreferencesTab';
import { ActivityTab } from './tabs/ActivityTab';
import { PrivacyTab } from './tabs/PrivacyTab';
import { PerformanceTab } from './tabs/PerformanceTab';
import { AchievementsTab } from './tabs/AchievementsTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { Icon } from '@/components/ui/icon';

interface ProfileTabsProps {
  user: any;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ user }) => {
  return (
    <Card className="glass p-4 max-w-none w-full">
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-8 glass-secondary min-w-fit">
          <TabsTrigger 
            value="personal" 
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <Icon name="User" className="w-4 h-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="security"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <Icon name="Shield" className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="preferences"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <Icon name="Settings" className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="activity"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <Icon name="Activity" className="w-4 h-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="privacy"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <Icon name="Lock" className="w-4 h-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>

          <TabsTrigger 
            value="performance"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <Icon name="TrendingUp" className="w-4 h-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>

          <TabsTrigger 
            value="achievements"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <Icon name="Trophy" className="w-4 h-4" />
            <span className="hidden sm:inline">Achievements</span>
          </TabsTrigger>

          <TabsTrigger 
            value="analytics"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <Icon name="BarChart3" className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="personal">
            <PersonalInfoTab user={user} />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab user={user} />
          </TabsContent>

          <TabsContent value="preferences">
            <PreferencesTab user={user} />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityTab user={user} />
          </TabsContent>

          <TabsContent value="privacy">
            <PrivacyTab user={user} />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceTab user={user} />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsTab user={user} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab user={user} />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};