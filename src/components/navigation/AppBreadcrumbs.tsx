import React from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbData {
  loop?: { id: string; name: string };
  task?: { id: string; name: string; capacity?: string };
  claim?: { id: string };
  entity?: { type: string; name: string };
}

export default function AppBreadcrumbs() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const taskId = searchParams.get('task');
  const loopId = location.pathname.includes('/registry/') 
    ? location.pathname.split('/registry/')[1] 
    : null;
  const claimId = location.pathname.includes('/claims/') 
    ? location.pathname.split('/claims/')[1] 
    : null;

  // Fetch breadcrumb data
  const { data: breadcrumbData } = useQuery({
    queryKey: ['breadcrumbs', { taskId, loopId, claimId }],
    queryFn: async (): Promise<BreadcrumbData> => {
      const result: BreadcrumbData = {};

      // Get task data
      if (taskId) {
        const { data: task } = await supabase
          .from('tasks')
          .select('id, title, capacity, loop_id')
          .eq('id', taskId)
          .single();
        
        if (task) {
          result.task = { id: task.id, name: task.title, capacity: task.capacity };
          // Also get loop for this task
          if (task.loop_id) {
            const { data: loop } = await supabase
              .from('loops')
              .select('id, name')
              .eq('id', task.loop_id)
              .single();
            if (loop) result.loop = loop;
          }
        }
      }

      // Get loop data directly
      if (loopId && !result.loop) {
        const { data: loop } = await supabase
          .from('loops')
          .select('id, name')
          .eq('id', loopId)
          .single();
        if (loop) result.loop = loop;
      }

      // Get claim data
      if (claimId) {
        const { data: claim } = await supabase
          .from('claims')
          .select('id, task_id, loop_id')
          .eq('id', claimId)
          .single();
        
        if (claim) {
          result.claim = claim;
          // Get associated loop
          if (claim.loop_id) {
            const { data: loop } = await supabase
              .from('loops')
              .select('id, name')
              .eq('id', claim.loop_id)
              .single();
            if (loop) result.loop = loop;
          }
        }
      }

      return result;
    },
    enabled: !!(taskId || loopId || claimId)
  });

  const getCapacityColor = (capacity?: string) => {
    switch (capacity) {
      case 'responsive': return 'bg-red-100 text-red-800 border-red-200';
      case 'reflexive': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'deliberative': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'anticipatory': return 'bg-green-100 text-green-800 border-green-200';
      case 'structural': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const renderBreadcrumbs = () => {
    const crumbs = [];

    // Home/Registry
    if (location.pathname === '/registry' || location.pathname.startsWith('/registry/')) {
      crumbs.push(
        <Link 
          key="registry" 
          to="/registry" 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          <span className="ml-1">Registry</span>
        </Link>
      );
    } else {
      crumbs.push(
        <Link 
          key="workspace" 
          to="/workspace" 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          <span className="ml-1">Workspace</span>
        </Link>
      );
    }

    // Loop
    if (breadcrumbData?.loop) {
      crumbs.push(
        <React.Fragment key="sep1">
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        </React.Fragment>
      );
      crumbs.push(
        <Link 
          key="loop"
          to={`/registry/${breadcrumbData.loop.id}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {breadcrumbData.loop.name}
        </Link>
      );
    }

    // Capacity Badge
    if (breadcrumbData?.task?.capacity) {
      crumbs.push(
        <React.Fragment key="sep2">
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        </React.Fragment>
      );
      crumbs.push(
        <Badge 
          key="capacity"
          variant="outline" 
          className={`text-xs ${getCapacityColor(breadcrumbData.task.capacity)}`}
        >
          {breadcrumbData.task.capacity}
        </Badge>
      );
    }

    // Entity (Task/Claim)
    if (breadcrumbData?.task) {
      crumbs.push(
        <React.Fragment key="sep3">
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        </React.Fragment>
      );
      crumbs.push(
        <span key="task" className="text-sm font-medium text-foreground">
          {breadcrumbData.task.name}
        </span>
      );
    } else if (breadcrumbData?.claim) {
      crumbs.push(
        <React.Fragment key="sep3">
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
        </React.Fragment>
      );
      crumbs.push(
        <span key="claim" className="text-sm font-medium text-foreground">
          Claim #{breadcrumbData.claim.id.slice(0, 8)}
        </span>
      );
    }

    return crumbs;
  };

  const crumbs = renderBreadcrumbs();
  
  if (crumbs.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 px-2 py-1 text-sm bg-background/95 backdrop-blur border-b border-border/40">
      {crumbs}
    </div>
  );
}