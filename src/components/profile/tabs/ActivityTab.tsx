import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, MapPin, Monitor } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useActivity } from '@/hooks/useProfile';
import { format, formatDistanceToNow } from 'date-fns';

interface ActivityTabProps {
  user: any;
}

export const ActivityTab: React.FC<ActivityTabProps> = ({ user }) => {
  const { data: activities, isLoading } = useActivity();

  const getActivityIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
      case 'logout':
        return <Monitor className="w-4 h-4" />;
      case 'update':
        return <Activity className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return 'text-success';
      case 'logout':
        return 'text-warning';
      case 'update':
        return 'text-info';
      case 'delete':
        return 'text-destructive';
      default:
        return 'text-foreground-muted';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="glass-secondary p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Recent Activity
        </h3>
        <p className="text-foreground-muted">
          Your recent account activity and actions.
        </p>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-secondary p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-foreground-muted">Total Actions</p>
              <p className="text-xl font-semibold text-foreground">
                {activities?.length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="glass-secondary p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-foreground-muted">Last Active</p>
              <p className="text-sm font-semibold text-foreground">
                {activities?.[0]?.created_at 
                  ? formatDistanceToNow(new Date(activities[0].created_at), { addSuffix: true })
                  : 'Never'
                }
              </p>
            </div>
          </div>
        </Card>

        <Card className="glass-secondary p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-info/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-foreground-muted">Last Location</p>
              <p className="text-sm font-semibold text-foreground">
                Web App
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card className="glass-secondary p-6">
        <h4 className="text-lg font-medium text-foreground mb-4">Activity Timeline</h4>
        
        {activities && activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 p-4 rounded-lg bg-background/30 border border-border/30"
              >
                <div className={`w-8 h-8 rounded-full bg-background flex items-center justify-center ${getActivityColor(activity.action)}`}>
                  {getActivityIcon(activity.action)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-foreground">
                    {String(activity.action).charAt(0).toUpperCase() + String(activity.action).slice(1)}
                  </p>
                    <Badge variant="outline" className="text-xs">
                      {String(activity.resource_type)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-foreground-muted mb-2">
                    Resource: {String(activity.resource_id || 'N/A')}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-foreground-subtle">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(activity.created_at), 'MMM d, yyyy')}
                    </span>
                    <span>
                      {format(new Date(activity.created_at), 'h:mm a')}
                    </span>
                    {activity.ip_address && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {String(activity.ip_address)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
            <p className="text-foreground-muted">No recent activity found</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};