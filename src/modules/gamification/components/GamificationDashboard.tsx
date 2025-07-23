import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Crown, 
  Medal, 
  Award,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'governance' | 'collaboration' | 'innovation' | 'efficiency';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: Date;
  isLocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface UserStats {
  totalPoints: number;
  level: number;
  experienceToNext: number;
  maxExperience: number;
  streak: number;
  tasksCompleted: number;
  triImprovements: number;
  collaborationScore: number;
  rank: number;
  totalUsers: number;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
  badge: string;
  change: number;
}

const mockAchievements: Achievement[] = [
  {
    id: 'first-task',
    title: 'Getting Started',
    description: 'Complete your first task',
    icon: <CheckCircle className="h-6 w-6" />,
    category: 'governance',
    rarity: 'common',
    points: 50,
    unlockedAt: new Date(Date.now() - 86400000),
    isLocked: false
  },
  {
    id: 'tri-master',
    title: 'TRI Master',
    description: 'Achieve 90+ TRI score',
    icon: <Target className="h-6 w-6" />,
    category: 'governance',
    rarity: 'rare',
    points: 200,
    unlockedAt: new Date(Date.now() - 3600000),
    isLocked: false
  },
  {
    id: 'collaboration-hero',
    title: 'Collaboration Hero',
    description: 'Help 10 team members with tasks',
    icon: <Users className="h-6 w-6" />,
    category: 'collaboration',
    rarity: 'epic',
    points: 500,
    isLocked: false,
    progress: 7,
    maxProgress: 10
  },
  {
    id: 'innovation-streak',
    title: 'Innovation Streak',
    description: 'Submit 5 innovative solutions',
    icon: <Zap className="h-6 w-6" />,
    category: 'innovation',
    rarity: 'legendary',
    points: 1000,
    isLocked: true,
    progress: 2,
    maxProgress: 5
  },
  {
    id: 'efficiency-master',
    title: 'Efficiency Master',
    description: 'Reduce response time by 50%',
    icon: <TrendingUp className="h-6 w-6" />,
    category: 'efficiency',
    rarity: 'epic',
    points: 300,
    isLocked: true,
    progress: 35,
    maxProgress: 50
  }
];

const mockUserStats: UserStats = {
  totalPoints: 2750,
  level: 12,
  experienceToNext: 250,
  maxExperience: 1000,
  streak: 7,
  tasksCompleted: 23,
  triImprovements: 8,
  collaborationScore: 85,
  rank: 3,
  totalUsers: 127
};

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    avatar: '👩‍💼',
    points: 3200,
    level: 15,
    badge: 'TRI Champion',
    change: 2
  },
  {
    id: 'user-2',
    name: 'Alex Rodriguez',
    avatar: '🧑‍💻',
    points: 2950,
    level: 14,
    badge: 'Efficiency Expert',
    change: -1
  },
  {
    id: 'user-3',
    name: 'You',
    avatar: '🧑‍🎯',
    points: 2750,
    level: 12,
    badge: 'Rising Star',
    change: 1
  },
  {
    id: 'user-4',
    name: 'Mike Johnson',
    avatar: '🧑‍🔬',
    points: 2600,
    level: 11,
    badge: 'Data Wizard',
    change: 0
  }
];

// Achievement Showcase Component
const AchievementCard: React.FC<{ 
  achievement: Achievement; 
  onUnlock?: () => void;
}> = ({ achievement, onUnlock }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50/10';
      case 'rare': return 'border-blue-400 bg-blue-50/10';
      case 'epic': return 'border-purple-400 bg-purple-50/10';
      case 'legendary': return 'border-amber-400 bg-amber-50/10';
      default: return 'border-gray-400 bg-gray-50/10';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'shadow-blue-500/20';
      case 'epic': return 'shadow-purple-500/20';
      case 'legendary': return 'shadow-amber-500/20';
      default: return '';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-xl border-2 ${getRarityColor(achievement.rarity)} ${
        !achievement.isLocked ? `shadow-lg ${getRarityGlow(achievement.rarity)}` : ''
      } transition-all duration-300`}
    >
      <Card className="bg-transparent border-none shadow-none">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg ${achievement.isLocked ? 'grayscale opacity-50' : ''}`}>
              {achievement.icon}
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                achievement.rarity === 'legendary' ? 'text-amber-300 border-amber-300' :
                achievement.rarity === 'epic' ? 'text-purple-300 border-purple-300' :
                achievement.rarity === 'rare' ? 'text-blue-300 border-blue-300' :
                'text-gray-300 border-gray-300'
              }`}
            >
              {achievement.rarity}
            </Badge>
          </div>
          <CardTitle className={`text-sm ${achievement.isLocked ? 'text-gray-500' : 'text-foreground'}`}>
            {achievement.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-xs mb-3 ${achievement.isLocked ? 'text-gray-600' : 'text-foreground-subtle'}`}>
            {achievement.description}
          </p>
          
          {achievement.progress !== undefined && achievement.maxProgress && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-foreground-subtle mb-1">
                <span>Progress</span>
                <span>{achievement.progress}/{achievement.maxProgress}</span>
              </div>
              <Progress 
                value={(achievement.progress / achievement.maxProgress) * 100} 
                className="h-2"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${achievement.isLocked ? 'text-gray-500' : 'text-primary'}`}>
              {achievement.points} points
            </span>
            {achievement.unlockedAt && (
              <span className="text-xs text-success">
                Unlocked!
              </span>
            )}
          </div>
        </CardContent>
      </Card>
      
      {!achievement.isLocked && achievement.unlockedAt && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute top-2 right-2"
        >
          <Crown className="h-4 w-4 text-amber-400" />
        </motion.div>
      )}
    </motion.div>
  );
};

// User Stats Dashboard
const UserStatsCard: React.FC<{ stats: UserStats }> = ({ stats }) => {
  return (
    <Card className="glass-secondary border-border-subtle/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-400" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level & Experience */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Level {stats.level}</span>
            <span className="text-xs text-foreground-subtle">
              {stats.maxExperience - stats.experienceToNext} / {stats.maxExperience} XP
            </span>
          </div>
          <Progress 
            value={((stats.maxExperience - stats.experienceToNext) / stats.maxExperience) * 100} 
            className="h-3"
          />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalPoints}</div>
            <div className="text-xs text-foreground-subtle">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success flex items-center justify-center gap-1">
              {stats.streak}
              <Flame className="h-4 w-4" />
            </div>
            <div className="text-xs text-foreground-subtle">Day Streak</div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-subtle/20">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <div>
              <div className="text-sm font-medium">{stats.tasksCompleted}</div>
              <div className="text-xs text-foreground-subtle">Tasks Done</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-info" />
            <div>
              <div className="text-sm font-medium">{stats.triImprovements}</div>
              <div className="text-xs text-foreground-subtle">TRI Boosts</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-accent" />
            <div>
              <div className="text-sm font-medium">{stats.collaborationScore}%</div>
              <div className="text-xs text-foreground-subtle">Collab Score</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Medal className="h-4 w-4 text-amber-400" />
            <div>
              <div className="text-sm font-medium">#{stats.rank}</div>
              <div className="text-xs text-foreground-subtle">Global Rank</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Leaderboard Component
const LeaderboardCard: React.FC<{ entries: LeaderboardEntry[] }> = ({ entries }) => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-5 w-5 text-amber-400" />;
      case 1: return <Medal className="h-5 w-5 text-gray-400" />;
      case 2: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-foreground-subtle">#{index + 1}</span>;
    }
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-success" />;
    if (change < 0) return <TrendingUp className="h-3 w-3 text-destructive rotate-180" />;
    return <span className="text-xs text-foreground-subtle">-</span>;
  };

  return (
    <Card className="glass-secondary border-border-subtle/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                entry.name === 'You' ? 'bg-primary/10 border border-primary/20' : 'bg-glass-primary/30'
              }`}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(index)}
              </div>
              
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {entry.avatar}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    entry.name === 'You' ? 'text-primary' : 'text-foreground'
                  }`}>
                    {entry.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    L{entry.level}
                  </Badge>
                </div>
                <div className="text-xs text-foreground-subtle">{entry.badge}</div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  {entry.points.toLocaleString()}
                </div>
                <div className="flex items-center justify-end gap-1">
                  {getChangeIndicator(entry.change)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Gamification Dashboard
export const GamificationDashboard: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [achievements] = useState<Achievement[]>(mockAchievements);
  const [userStats] = useState<UserStats>(mockUserStats);
  const [leaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'leaderboard'>('overview');

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-4 z-50 glass rounded-3xl border border-border-subtle/30 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border-subtle/20">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Star className="h-7 w-7 text-amber-400" />
            Achievement Center
          </h1>
          <Button variant="ghost" onClick={onClose}>
            <Star className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'achievements', label: 'Achievements' },
            { key: 'leaderboard', label: 'Leaderboard' }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-1">
                <UserStatsCard stats={userStats} />
              </div>
              <div className="lg:col-span-2">
                <LeaderboardCard entries={leaderboard} />
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <LeaderboardCard entries={leaderboard} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};