import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useBadges } from '@/hooks/useUserStats';
import { useUpdatedDashboardData } from '@/hooks/useUpdatedDashboardData';

interface AchievementsTabProps {
  user: any;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ user }) => {
  const { data: badges, isLoading } = useBadges();
  const { achievements } = useUpdatedDashboardData();

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Trophy" className="w-5 h-5 text-warning" />
            <span className="text-sm font-medium text-foreground-muted">Unlocked</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {isLoading ? '...' : badges?.unlocked?.length || 0}
          </div>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Star" className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-foreground-muted">In Progress</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {achievements.filter(a => !a.unlockedAt && a.progress > 0).length}
          </div>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Award" className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground-muted">Total Available</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {isLoading ? '...' : (badges?.unlocked?.length || 0) + (badges?.locked?.length || 0)}
          </div>
        </Card>
      </motion.div>

      {/* Real-time Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Current Progress</h3>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-4 p-4 bg-background-secondary/30 rounded-lg"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  achievement.unlockedAt ? 'bg-success/20' : 'bg-background-secondary'
                }`}>
                  {achievement.unlockedAt ? 
                     <Icon name="Trophy" className="w-5 h-5 text-success" /> :
                     <Icon name="Star" className="w-5 h-5 text-foreground-muted" />
                   }
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{achievement.title}</h4>
                    {achievement.unlockedAt && (
                      <Badge variant="outline" className="text-success border-success/30">
                        Unlocked
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-foreground-muted mb-2">{achievement.description}</p>
                  {!achievement.unlockedAt && (
                    <div className="space-y-1">
                      <Progress value={achievement.progress} className="h-2" />
                      <div className="text-xs text-foreground-subtle">
                        {Math.round(achievement.progress)}% complete
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Badge Collection */}
      {!isLoading && badges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Badge Collection</h3>
            
            {/* Unlocked Badges */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground-muted mb-3">Unlocked Badges</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {badges.unlocked.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-success/10 border border-success/20 rounded-lg text-center"
                  >
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <h5 className="font-medium text-foreground text-sm mb-1">{badge.name}</h5>
                    <p className="text-xs text-foreground-muted mb-2">{badge.description}</p>
                    {badge.unlockedAt && (
                      <div className="text-xs text-success">
                        {new Date(badge.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Locked Badges */}
            <div>
              <h4 className="text-sm font-medium text-foreground-muted mb-3">Available Badges</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {badges.locked.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-background-secondary/30 border border-border/50 rounded-lg text-center opacity-60"
                  >
                    <div className="text-2xl mb-2 grayscale">{badge.icon}</div>
                    <h5 className="font-medium text-foreground text-sm mb-1">{badge.name}</h5>
                    <p className="text-xs text-foreground-muted mb-2">{badge.description}</p>
                    <div className="flex items-center justify-center gap-1 text-xs text-foreground-subtle">
                      <Icon name="Lock" className="w-3 h-3" />
                      <span>{badge.criteria}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};