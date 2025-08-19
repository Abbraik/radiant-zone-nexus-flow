// Workspace 5C - Pixel-Parity Duplicate Using Capacity Bundles
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getTask5CById } from '@/5c/services';
import { QUERY_KEYS_5C } from '@/5c/types';
import { use5cStore } from '@/5c/state/use5cStore';
import { WORKSPACE_SHELL_CLASSES } from '@/5c/utils/uiParity';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

// Capacity Bundle Components (to be created)
const ResponsiveBundle = React.lazy(() => import('@/5c/bundles/responsive'));
const ReflexiveBundle = React.lazy(() => import('@/5c/bundles/reflexive'));
const DeliberativeBundle = React.lazy(() => import('@/5c/bundles/deliberative'));
const AnticipatoryBundle = React.lazy(() => import('@/5c/bundles/anticipatory'));
const StructuralBundle = React.lazy(() => import('@/5c/bundles/structural'));

const BUNDLE_MAP = {
  responsive: ResponsiveBundle,
  reflexive: ReflexiveBundle,
  deliberative: DeliberativeBundle,
  anticipatory: AnticipatoryBundle,
  structural: StructuralBundle
} as const;

export default function Workspace5C() {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('task5c');
  const { sidebarCollapsed } = use5cStore();

  const { data: task, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS_5C.task(taskId!),
    queryFn: () => getTask5CById(taskId!),
    enabled: !!taskId
  });

  if (!taskId) {
    return (
      <div className={WORKSPACE_SHELL_CLASSES.container}>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">No Task Selected</h2>
            <p className="text-muted-foreground">Select a 5C task to get started</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={WORKSPACE_SHELL_CLASSES.container}>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className={WORKSPACE_SHELL_CLASSES.container}>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 text-destructive">Task Not Found</h2>
            <p className="text-muted-foreground">The requested 5C task could not be loaded</p>
          </div>
        </div>
      </div>
    );
  }

  const Bundle = BUNDLE_MAP[task.capacity];

  return (
    <div className={WORKSPACE_SHELL_CLASSES.container}>
      <Header />
      <div className={WORKSPACE_SHELL_CLASSES.main}>
        {!sidebarCollapsed && (
          <div className={WORKSPACE_SHELL_CLASSES.sidebar}>
            <Sidebar />
          </div>
        )}
        <div className={WORKSPACE_SHELL_CLASSES.content}>
          <div className={WORKSPACE_SHELL_CLASSES.toolbar}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold">{task.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {task.capacity.charAt(0).toUpperCase() + task.capacity.slice(1)} Capacity
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  task.status === 'active' ? 'bg-green-100 text-green-800' :
                  task.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                  task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </span>
              </div>
            </div>
          </div>
          <div className={WORKSPACE_SHELL_CLASSES.workspace}>
            <React.Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            }>
              <Bundle task={task} />
            </React.Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}