import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  component?: React.ComponentType<any>;
  badge?: string | number;
  disabled?: boolean;
}

interface TabNavProps {
  tabs: readonly Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const TabNav: React.FC<TabNavProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className
}) => {
  const activeTabRef = React.useRef<HTMLButtonElement>(null);

  // Scroll active tab into view
  React.useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [activeTab]);

  return (
    <div className={cn("sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border", className)}>
      <div className="relative">
        <nav className="flex gap-1 overflow-x-auto scrollbar-hide px-1 py-2" role="tablist">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            const isDisabled = tab.disabled;
            
            return (
              <Button
                key={tab.id}
                ref={isActive ? activeTabRef : undefined}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                disabled={isDisabled}
                onClick={() => !isDisabled && onTabChange(tab.id)}
                className={cn(
                  "relative whitespace-nowrap transition-all duration-200",
                  isActive && "bg-primary text-primary-foreground shadow-sm",
                  !isActive && "hover:bg-muted/50",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  {tab.badge && (
                    <Badge 
                      variant={isActive ? "secondary" : "outline"} 
                      className="h-4 px-1.5 text-xs"
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-md border border-primary/20"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </Button>
            );
          })}
        </nav>

        {/* Tab content indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    </div>
  );
};