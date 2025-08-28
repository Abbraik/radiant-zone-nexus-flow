import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAchievements } from '@/hooks/useAchievements';

interface AchievementsTabProps {
  user: any;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ user }) => {
  const { 
    achievements,
    userAchievements, 
    achievementProgress,
    isLoading
  } = useAchievements();

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
            {isLoading ? '...' : userAchievements.length}
          </div>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Star" className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-foreground-muted">In Progress</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {achievementProgress.length}
          </div>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Award" className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground-muted">Total Available</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {isLoading ? '...' : achievements.length}
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
          <h3 className="text-lg font-semibold text-foreground mb-4">Achievement Progress</h3>
          <div className="space-y-4">
            {/* Show unlocked achievements first */}
            {userAchievements.map((userAchievement, index) => (
              <motion.div
                key={userAchievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-4 p-4 bg-success/10 border border-success/20 rounded-lg"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-success/20">
                  <span className="text-lg">{userAchievement.achievement_definitions.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{userAchievement.achievement_definitions.name}</h4>
                    <Badge variant="outline" className="text-success border-success/30">
                      Unlocked
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground-muted mb-1">{userAchievement.achievement_definitions.description}</p>
                  <div className="text-xs text-success">
                    Unlocked {new Date(userAchievement.unlocked_at).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Show achievements in progress */}
            {achievementProgress.map((progress, index) => (
              <motion.div
                key={progress.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (userAchievements.length + index) }}
                className="flex items-center gap-4 p-4 bg-background-secondary/30 rounded-lg"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-background-secondary">
                  <span className="text-lg opacity-60">{progress.achievement_definitions.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{progress.achievement_definitions.name}</h4>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                  <p className="text-sm text-foreground-muted mb-2">{progress.achievement_definitions.description}</p>
                  <div className="space-y-1">
                    <Progress 
                      value={(progress.current_progress / progress.target_progress) * 100} 
                      className="h-2" 
                    />
                    <div className="text-xs text-foreground-subtle">
                      {progress.current_progress} / {progress.target_progress} ({Math.round((progress.current_progress / progress.target_progress) * 100)}%)
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Show available achievements not yet started */}
            {achievements
              .filter(achievement => 
                !userAchievements.some(ua => ua.achievement_id === achievement.id) &&
                !achievementProgress.some(ap => ap.achievement_id === achievement.id)
              )
              .slice(0, 3)
              .map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (userAchievements.length + achievementProgress.length + index) }}
                  className="flex items-center gap-4 p-4 bg-background-secondary/20 border border-border/30 rounded-lg opacity-60"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-background-secondary">
                    <span className="text-lg grayscale">{achievement.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground">{achievement.name}</h4>
                      <Badge variant="outline">Available</Badge>
                    </div>
                    <p className="text-sm text-foreground-muted">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
          </div>
        </Card>
      </motion.div>

      {/* Achievement Categories */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Achievement Categories</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Group achievements by category */}
              {['general', 'performance', 'engagement'].map(category => {
                const categoryAchievements = achievements.filter(a => a.category === category);
                const unlockedCount = userAchievements.filter(ua => 
                  categoryAchievements.some(ca => ca.id === ua.achievement_id)
                ).length;
                
                return (
                  <motion.div
                    key={category}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-background-secondary/30 border border-border/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Icon name="Award" className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground capitalize">{category}</h4>
                        <p className="text-xs text-foreground-muted">
                          {unlockedCount} / {categoryAchievements.length} unlocked
                        </p>
                      </div>
                    </div>
                    <Progress 
                      value={categoryAchievements.length > 0 ? (unlockedCount / categoryAchievements.length) * 100 : 0}
                      className="h-2" 
                    />
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};