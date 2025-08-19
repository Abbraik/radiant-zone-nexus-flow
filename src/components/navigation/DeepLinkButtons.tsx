import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Settings, Zap, Target, Eye, GitBranch } from 'lucide-react';
import { useGlue } from '@/hooks/useGlue';

interface DeepLinkButtonsProps {
  currentCapacity: string;
  loopId: string;
  taskId?: string;
  context?: any;
  className?: string;
}

export default function DeepLinkButtons({ 
  currentCapacity, 
  loopId, 
  taskId, 
  context,
  className = '' 
}: DeepLinkButtonsProps) {
  const { createTaskWithLink, logEvent } = useGlue();

  const handleDeepLink = (targetCapacity: string, linkType: string) => {
    logEvent.mutate({
      eventType: 'deep_link_click',
      loopId,
      taskId,
      capacity: targetCapacity,
      metadata: { 
        source_capacity: currentCapacity,
        link_type: linkType 
      }
    });

    createTaskWithLink.mutate({
      fromTaskId: taskId,
      capacity: targetCapacity,
      loopId,
      context: {
        ...context,
        link_type: linkType,
        source_capacity: currentCapacity
      }
    });
  };

  const getContextualLinks = () => {
    const links = [];

    switch (currentCapacity) {
      case 'responsive':
        // From Responsive, can suggest Reflexive retune
        if (context?.high_frequency_interventions || context?.recurring_issues) {
          links.push({
            target: 'reflexive',
            icon: Settings,
            label: 'Open Reflexive Retune',
            description: 'System needs parameter tuning',
            linkType: 'retune_needed'
          });
        }
        break;

      case 'reflexive':
        // From Reflexive, can suggest Deliberative if preview shows little improvement
        if (context?.preview_delta && context.preview_delta < 0.1) {
          links.push({
            target: 'deliberative',
            icon: Target,
            label: 'Open Deliberative Options',
            description: 'Small improvement predicted - need strategic analysis',
            linkType: 'low_impact_preview'
          });
        }
        break;

      case 'deliberative':
        // From Deliberative, can package to execution
        if (context?.option_set_ready) {
          links.push({
            target: 'responsive',
            icon: Zap,
            label: 'Package to Execution',
            description: 'Create responsive claims from selected options',
            linkType: 'package_execution'
          });
        }
        break;

      case 'anticipatory':
        // From Anticipatory, can create response tasks on watchpoint trip
        if (context?.watchpoint_tripped) {
          links.push({
            target: 'responsive',
            icon: Zap,
            label: 'Open Responsive Task',
            description: 'Immediate action needed for watchpoint breach',
            linkType: 'watchpoint_response'
          });
          
          links.push({
            target: 'reflexive',
            icon: Settings,
            label: 'Open Reflexive Retune',
            description: 'Adjust system to prevent future breaches',
            linkType: 'watchpoint_retune'
          });
        }
        break;

      case 'structural':
        // From Structural, can create rollout tasks
        links.push({
          target: 'responsive',
          icon: GitBranch,
          label: 'Create Rollout Tasks',
          description: 'Implement structural changes',
          linkType: 'structural_rollout'
        });
        
        links.push({
          target: 'reflexive',
          icon: Eye,
          label: 'Retune under New Regime',
          description: 'Optimize system with new structure',
          linkType: 'regime_retune'
        });
        break;
    }

    return links;
  };

  const links = getContextualLinks();

  if (links.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {links.map((link, index) => {
        const Icon = link.icon;
        return (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => handleDeepLink(link.target, link.linkType)}
            disabled={createTaskWithLink.isPending}
            className="w-full justify-start h-auto p-3"
          >
            <div className="flex items-start gap-3 w-full">
              <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{link.label}</span>
                  <ArrowRight className="h-3 w-3" />
                  <Badge variant="secondary" className="text-xs">
                    {link.target}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {link.description}
                </p>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
}