import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, Building2, Users, Shield, Database, 
  BarChart3, Bell, Settings, Code, Key, FileText, Activity,
  ChevronLeft, ExternalLink
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

// Import section components
import { OverviewSection } from './sections/OverviewSection';
import { OrganizationSection } from './sections/OrganizationSection';
import { MembersSection } from './sections/MembersSection';
import { RolesSection } from './sections/RolesSection';
import { DataSourcesSection } from './sections/DataSourcesSection';
import { IndicatorsSection } from './sections/IndicatorsSection';
import { WatchpointsSection } from './sections/WatchpointsSection';
import { GuardrailsSection } from './sections/GuardrailsSection';
import { TemplatesSection } from './sections/TemplatesSection';
import { TokensSection } from './sections/TokensSection';
import { AuditLogSection } from './sections/AuditLogSection';
import { TelemetrySection } from './sections/TelemetrySection';

const adminSections = [
  { 
    id: 'overview', 
    label: 'Overview', 
    icon: LayoutDashboard, 
    path: '/admin#overview',
    component: OverviewSection 
  },
  { 
    id: 'org', 
    label: 'Organization', 
    icon: Building2, 
    path: '/admin#org',
    component: OrganizationSection 
  },
  { 
    id: 'members', 
    label: 'Members', 
    icon: Users, 
    path: '/admin#members',
    component: MembersSection 
  },
  { 
    id: 'roles', 
    label: 'Roles & Mandates', 
    icon: Shield, 
    path: '/admin#roles',
    component: RolesSection 
  },
  { 
    id: 'sources', 
    label: 'Data Sources', 
    icon: Database, 
    path: '/admin#sources',
    component: DataSourcesSection 
  },
  { 
    id: 'indicators', 
    label: 'Indicators & Bands', 
    icon: BarChart3, 
    path: '/admin#indicators',
    component: IndicatorsSection 
  },
  { 
    id: 'watch', 
    label: 'Watchpoints & Triggers', 
    icon: Bell, 
    path: '/admin#watch',
    component: WatchpointsSection 
  },
  { 
    id: 'guardrails', 
    label: 'Guardrails & SLAs', 
    icon: Settings, 
    path: '/admin#guardrails',
    component: GuardrailsSection 
  },
  { 
    id: 'templates', 
    label: 'Templates & Playbooks', 
    icon: Code, 
    path: '/admin#templates',
    component: TemplatesSection 
  },
  { 
    id: 'tokens', 
    label: 'API Tokens', 
    icon: Key, 
    path: '/admin#tokens',
    component: TokensSection 
  },
  { 
    id: 'audit', 
    label: 'Audit Log', 
    icon: FileText, 
    path: '/admin#audit',
    component: AuditLogSection 
  },
  { 
    id: 'telemetry', 
    label: 'Telemetry', 
    icon: Activity, 
    path: '/admin#telemetry',
    component: TelemetrySection 
  },
];

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current tab from hash
  const currentTab = location.hash.replace('#', '') || 'overview';
  
  const handleTabChange = (value: string) => {
    navigate(`/admin#${value}`, { replace: true });
  };

  const currentSection = adminSections.find(section => section.id === currentTab);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background-secondary/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex h-16 items-center px-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Workspace
          </Button>
          
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Admin Console</h1>
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              System Administration
            </Badge>
            <Button variant="ghost" size="sm" asChild>
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Supabase
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-background-secondary/30 border-r border-border">
          <div className="p-4">
            <nav className="space-y-2">
              {adminSections.map((section) => {
                const Icon = section.icon;
                const isActive = currentTab === section.id;
                
                return (
                  <Button
                    key={section.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start h-10 ${
                      isActive 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'hover:bg-secondary/50'
                    }`}
                    onClick={() => handleTabChange(section.id)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    <span className="text-sm">{section.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs value={currentTab} onValueChange={handleTabChange}>
            {adminSections.map((section) => {
              const Component = section.component;
              return (
                <TabsContent key={section.id} value={section.id} className="m-0">
                  <div className="p-6">
                    <Component />
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </div>
  );
};