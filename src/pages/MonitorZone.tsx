import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, ChevronDown, Settings, Download, Share, Layout, Filter, AlertTriangle, Eye, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MacroLoopPanel } from '@/components/monitor/panels/MacroLoopPanel';
import { MesoLoopPanel } from '@/components/monitor/panels/MesoLoopPanel';
import { MicroLoopPanel } from '@/components/monitor/panels/MicroLoopPanel';
import { ContextSidebar } from '@/components/monitor/panels/ContextSidebar';
import { AlertSystem } from '@/components/monitor/AlertSystem';
import { DashboardCustomizer } from '@/components/monitor/DashboardCustomizer';
import { ExportSharePanel } from '@/components/monitor/ExportSharePanel';
import { GlobalSearchPanel } from '@/components/monitor/GlobalSearchPanel';
import { LearningModeToggle } from '@/components/monitor/LearningModeToggle';

type UserRole = 'C-Suite' | 'Ops Manager' | 'Analyst';

interface SelectedItem {
  type: 'macro' | 'meso' | 'micro';
  id: string;
  data: any;
}

export default function MonitorZone() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('Ops Manager');
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [alertCount] = useState(7);
  const [showAlerts, setShowAlerts] = useState(false);
  const [dashboardLayout, setDashboardLayout] = useState('grid');
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const [macroLoopFilters, setMacroLoopFilters] = useState({ 
    type: 'all' as 'all' | 'reinforcing' | 'balancing',
    showMiniCLD: false 
  });
  const [panelVisibility, setPanelVisibility] = useState({
    'macro-panel': true,
    'meso-panel': true,
    'micro-panel': true,
    'alerts-panel': true
  });

  const handleItemSelect = (type: 'macro' | 'meso' | 'micro', id: string, data: any) => {
    setSelectedItem({ type, id, data });
  };

  const handleGlobalSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchResultSelect = (result: any) => {
    // Navigate to the specific loop/bundle/task
    handleItemSelect(result.type, result.id, result);
  };

  const handleAlertAction = (action: string, alertId?: string) => {
    switch (action) {
      case 'acknowledge':
        console.log('Acknowledging alert:', alertId);
        break;
      case 'jumpTo':
        console.log('Jumping to alert context:', alertId);
        break;
      case 'spawnSprint':
        console.log('Spawning sprint for alert:', alertId);
        break;
    }
  };

  const handleExportShare = (action: string, options?: any) => {
    switch (action) {
      case 'export':
        console.log('Exporting dashboard:', options);
        break;
      case 'share':
        console.log('Sharing dashboard:', options);
        break;
    }
  };

  const handleMacroLoopAction = (action: string, loopId?: string, data?: any) => {
    switch (action) {
      case 'filter':
        setMacroLoopFilters(prev => ({ ...prev, ...data }));
        break;
      case 'hoverCLD':
        console.log('Show mini-CLD for:', loopId);
        break;
      case 'focus':
        handleItemSelect('macro', loopId!, data);
        break;
    }
  };

  const handleMesoLoopAction = (action: string, loopId?: string, data?: any) => {
    switch (action) {
      case 'select':
        handleItemSelect('meso', loopId!, data);
        break;
      case 'bulkAction':
        console.log('Performing bulk action:', action, data);
        break;
    }
  };

  const handleMicroLoopAction = (action: string, loopId?: string, data?: any) => {
    switch (action) {
      case 'reviewGauge':
        console.log('Reviewing micro-gauge:', loopId);
        break;
      case 'viewFeedback':
        console.log('Viewing feedback stream:', loopId);
        break;
      case 'spawnTask':
        console.log('Spawning corrective task:', loopId, data);
        break;
      case 'adjustParameters':
        console.log('Adjusting parameters:', loopId, data);
        break;
      case 'acknowledgeAlert':
        console.log('Acknowledging micro-loop alert:', loopId);
        break;
    }
  };

  const handlePanelToggle = (panelId: string) => {
    setPanelVisibility(prev => ({
      ...prev,
      [panelId]: !prev[panelId]
    }));
  };

  const handleSavePreset = (name: string, layout: any) => {
    console.log('Saving preset:', name, layout);
    // Here you could save to localStorage or send to backend
    localStorage.setItem(`dashboard-preset-${name}`, JSON.stringify(layout));
  };

  const getLayoutClasses = () => {
    switch (dashboardLayout) {
      case 'list':
        return 'flex flex-col space-y-4';
      case 'hybrid':
        return 'grid grid-cols-2 gap-4';
      default: // grid
        return 'flex'; // Keep current flex layout as default
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
      {/* Persistent Top Navigation */}
      <motion.header 
        className="h-16 border-b border-border/50 glass-secondary sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-semibold text-foreground">Monitor Zone</h1>
            
            {/* Enhanced Global Search */}
            <GlobalSearchPanel
              query={searchQuery}
              onQueryChange={handleGlobalSearch}
              onResultSelect={handleSearchResultSelect}
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Learning Mode Toggle */}
            <LearningModeToggle />

            {/* Dashboard Customization */}
            <DashboardCustomizer
              currentLayout={dashboardLayout}
              onLayoutChange={setDashboardLayout}
              onPanelToggle={handlePanelToggle}
              onSavePreset={handleSavePreset}
            />

            {/* Export & Share */}
            <ExportSharePanel />

            {/* Role Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="glass-secondary border-border/50">
                  {userRole}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass border-border/50">
                <DropdownMenuItem onClick={() => setUserRole('C-Suite')}>
                  C-Suite
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole('Ops Manager')}>
                  Ops Manager
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserRole('Analyst')}>
                  Analyst
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Alerts */}
            <Button 
              variant="outline" 
              className="relative glass-secondary border-border/50"
              onClick={() => setShowAlerts(!showAlerts)}
            >
              <Bell className="h-4 w-4" />
              {alertCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-destructive">
                  {alertCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="glass-secondary border-border/50">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass border-border/50">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsCustomizeMode(!isCustomizeMode)}>
                  <Layout className="h-4 w-4 mr-2" />
                  Dashboard Layout
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  Save View Preset
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      {/* Alert System Overlay */}
      <AnimatePresence>
        {showAlerts && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 z-40 p-4"
          >
            <AlertSystem />
          </motion.div>
        )}
      </AnimatePresence>


      {/* Main Dashboard with Resizable Layout */}
      <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-4rem)]">
        {/* Main Content Area */}
        <ResizablePanel defaultSize={75} minSize={50} maxSize={85}>
          <div className={`h-full p-4 ${getLayoutClasses()}`}>
            {/* Macro Loop Panel */}
            {panelVisibility['macro-panel'] && (
              <motion.div 
                className={dashboardLayout === 'list' ? 'w-full' : dashboardLayout === 'hybrid' ? 'col-span-1' : 'w-[47%]'}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <MacroLoopPanel
                  searchQuery={searchQuery}
                  onLoopSelect={(id, data) => handleMacroLoopAction('focus', id, data)}
                  selectedLoopId={selectedItem?.type === 'macro' ? selectedItem.id : null}
                />
              </motion.div>
            )}

            {/* Right Side Panels Container */}
            {(panelVisibility['meso-panel'] || panelVisibility['micro-panel']) && (
              <div className={`flex flex-col space-y-4 ${
                dashboardLayout === 'list' ? 'w-full' : 
                dashboardLayout === 'hybrid' ? 'col-span-1' : 
                'w-[53%]'
              }`}>
                {/* Meso Loop Panel */}
                {panelVisibility['meso-panel'] && (
                  <motion.div 
                    className={dashboardLayout === 'list' ? 'w-full' : 'h-1/2'}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <MesoLoopPanel
                      onLoopSelect={(id, data) => handleMesoLoopAction('select', id, data)}
                      selectedLoopId={selectedItem?.type === 'meso' ? selectedItem.id : null}
                    />
                  </motion.div>
                )}

                {/* Micro Loop Panel */}
                {panelVisibility['micro-panel'] && (
                  <motion.div 
                    className={dashboardLayout === 'list' ? 'w-full' : 'h-1/2'}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <MicroLoopPanel
                      onLoopSelect={(id, data) => handleMicroLoopAction('reviewGauge', id, data)}
                      selectedLoopId={selectedItem?.type === 'micro' ? selectedItem.id : null}
                    />
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle withHandle className="bg-border/50 hover:bg-border data-[resize-handle-state=hover]:bg-primary/20 transition-colors" />

        {/* Context Sidebar - Resizable */}
        <ResizablePanel defaultSize={25} minSize={15} maxSize={50}>
          <motion.div 
            className="h-full border-l border-border/50 bg-background/30"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ScrollArea className="h-full">
              <ContextSidebar selectedItem={selectedItem} />
            </ScrollArea>
          </motion.div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}