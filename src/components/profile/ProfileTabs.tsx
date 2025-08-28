import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { PersonalInfoTab } from './tabs/PersonalInfoTab';
import { SecurityTab } from './tabs/SecurityTab';
import { PreferencesTab } from './tabs/PreferencesTab';
import { ActivityTab } from './tabs/ActivityTab';
import { PrivacyTab } from './tabs/PrivacyTab';
import { 
  User, 
  Shield, 
  Settings, 
  Activity, 
  Lock 
} from 'lucide-react';

interface ProfileTabsProps {
  user: any;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ user }) => {
  return (
    <Card className="glass p-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5 glass-secondary">
          <TabsTrigger 
            value="personal" 
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="security"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="preferences"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="activity"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="privacy"
            className="flex items-center gap-2 data-[state=active]:bg-primary/10"
          >
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Privacy</span>
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
        </div>
      </Tabs>
    </Card>
  );
};