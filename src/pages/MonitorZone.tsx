import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MacroLoopPanel } from '@/components/monitor/panels/MacroLoopPanel';
import { MesoLoopPanel } from '@/components/monitor/panels/MesoLoopPanel';
import { MicroLoopPanel } from '@/components/monitor/panels/MicroLoopPanel';
import { ContextSidebar } from '@/components/monitor/panels/ContextSidebar';

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

  const handleItemSelect = (type: 'macro' | 'meso' | 'micro', id: string, data: any) => {
    setSelectedItem({ type, id, data });
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
            
            {/* Global Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search loops, bundles, or tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80 glass-secondary border-border/50"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
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
            <Button variant="outline" className="relative glass-secondary border-border/50">
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
                <DropdownMenuItem>Customize Dashboard</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      {/* Main Dashboard Grid */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Macro Loop Panel - 40% */}
        <motion.div 
          className="w-[40%] p-4"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <MacroLoopPanel
            searchQuery={searchQuery}
            onLoopSelect={(id, data) => handleItemSelect('macro', id, data)}
            selectedLoopId={selectedItem?.type === 'macro' ? selectedItem.id : null}
          />
        </motion.div>

        {/* Right Side - 45% */}
        <div className="w-[45%] flex flex-col p-4 space-y-4">
          {/* Meso Loop Panel - Top Half */}
          <motion.div 
            className="h-1/2"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <MesoLoopPanel
              onLoopSelect={(id, data) => handleItemSelect('meso', id, data)}
              selectedLoopId={selectedItem?.type === 'meso' ? selectedItem.id : null}
            />
          </motion.div>

          {/* Micro Loop + Community Pulse Panel - Bottom Half */}
          <motion.div 
            className="h-1/2"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <MicroLoopPanel
              onLoopSelect={(id, data) => handleItemSelect('micro', id, data)}
              selectedLoopId={selectedItem?.type === 'micro' ? selectedItem.id : null}
            />
          </motion.div>
        </div>

        {/* Context Sidebar - 15% */}
        <motion.div 
          className="w-[15%] border-l border-border/50"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <ContextSidebar selectedItem={selectedItem} />
        </motion.div>
      </div>
    </div>
  );
}