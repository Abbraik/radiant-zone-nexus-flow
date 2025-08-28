// TaskEngine V2 Widgets for 5C Workspace Integration
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, FileText, ChevronDown, ChevronUp, BarChart3, Settings, Lock, AlertTriangle } from 'lucide-react';
import { TaskTimeline } from '@/components/taskEngine/TaskTimeline';
import { TaskAssignmentPanel } from '@/components/taskEngine/TaskAssignmentPanel';
import { TaskSummaryCard } from '@/components/taskEngine/TaskSummaryCard';
import { useTaskEngine } from '@/hooks/useTaskEngine';
import type { EnhancedTask5C } from '@/5c/types';
interface TaskEngineWidgetsProps {
  activeTask5C?: EnhancedTask5C | null;
  isCollapsed?: boolean;
}
export const TaskEngineWidgets: React.FC<TaskEngineWidgetsProps> = ({
  activeTask5C,
  isCollapsed = false
}) => {
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);
  const {
    summary,
    tasks,
    activeTasks
  } = useTaskEngine();
  const toggleWidget = (widgetId: string) => {
    setExpandedWidget(expandedWidget === widgetId ? null : widgetId);
  };

  // Don't show if sidebar is collapsed
  if (isCollapsed) return null;
  return;
};