import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Award, Target, Zap, Users, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileStats } from '../components/dashboard/ProfileStats';
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline';
import { PerformanceCharts } from '../components/dashboard/PerformanceCharts';
import { AchievementsBadges } from '../components/dashboard/AchievementsBadges';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'productivity' | 'collaboration' | 'innovation' | 'leadership';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

interface UserStats {
  totalPoints: number;
  level: number;
  experience: number;
  experienceToNext: number;
  streak: number;
  tasksCompleted: number;
  collaborationScore: number;
  innovationIndex: number;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
  rank: number;
  rankChange: number;
  isCurrentUser?: boolean;
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first task in the workspace',
    icon: Target,
    category: 'productivity',
    rarity: 'common',
    points: 100,
    progress: 100,
    isUnlocked: true,
    unlockedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Team Player',
    description: 'Collaborate on 10 different tasks',
    icon: Users,
    category: 'collaboration',
    rarity: 'rare',
    points: 250,
    progress: 70,
    isUnlocked: false
  },
  {
    id: '3',
    title: 'Innovation Champion',
    description: 'Submit 5 innovative ideas that get implemented',
    icon: Zap,
    category: 'innovation',
    rarity: 'epic',
    points: 500,
    progress: 40,
    isUnlocked: false
  },
  {
    id: '4',
    title: 'Governance Master',
    description: 'Lead 20 governance initiatives to completion',
    icon: Trophy,
    category: 'leadership',
    rarity: 'legendary',
    points: 1000,
    progress: 15,
    isUnlocked: false
  }
];

const mockUserStats: UserStats = {
  totalPoints: 2450,
  level: 8,
  experience: 1200,
  experienceToNext: 800,
  streak: 12,
  tasksCompleted: 47,
  collaborationScore: 85,
  innovationIndex: 72
};

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: '/placeholder.svg',
    points: 3200,
    level: 12,
    rank: 1,
    rankChange: 0
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    avatar: '/placeholder.svg',
    points: 2950,
    level: 10,
    rank: 2,
    rankChange: 1
  },
  {
    id: '3',
    name: 'You',
    avatar: '/placeholder.svg',
    points: 2450,
    level: 8,
    rank: 3,
    rankChange: -1,
    isCurrentUser: true
  }
];

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  const Icon = achievement.icon;
  
  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-foreground-subtle';
      case 'rare': return 'text-primary';
      case 'epic': return 'text-accent';
      case 'legendary': return 'text-success';
      default: return 'text-foreground-subtle';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative ${achievement.isUnlocked ? '' : 'opacity-60'}`}
    >
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Icon className={`h-8 w-8 ${getRarityColor(achievement.rarity)}`} />
            <Badge variant={achievement.isUnlocked ? 'default' : 'secondary'}>
              {achievement.points} pts
            </Badge>
          </div>
          <CardTitle className="text-lg">{achievement.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground-subtle mb-4">
            {achievement.description}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{achievement.progress}%</span>
            </div>
            <Progress value={achievement.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const UserStatsCard: React.FC<{ stats: UserStats }> = ({ stats }) => (
  <Card>
    <CardHeader>
      <CardTitle>Your Progress</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="text-center">
        <div className="text-3xl font-bold text-foreground mb-2">Level {stats.level}</div>
        <Progress value={(stats.experience / (stats.experience + stats.experienceToNext)) * 100} className="h-3" />
        <p className="text-sm text-foreground-subtle mt-2">
          {stats.experience} / {stats.experience + stats.experienceToNext} XP
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{stats.totalPoints}</div>
          <p className="text-sm text-foreground-subtle">Total Points</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">{stats.streak}</div>
          <p className="text-sm text-foreground-subtle">Day Streak</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm">Tasks Completed</span>
          <span className="text-sm font-medium">{stats.tasksCompleted}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Collaboration Score</span>
          <span className="text-sm font-medium">{stats.collaborationScore}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Innovation Index</span>
          <span className="text-sm font-medium">{stats.innovationIndex}%</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const LeaderboardCard: React.FC<{ entries: LeaderboardEntry[] }> = ({ entries }) => (
  <Card>
    <CardHeader>
      <CardTitle>Leaderboard</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              entry.isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-background-secondary'
            }`}
          >
            <div className="text-lg font-bold w-8">{entry.rank}</div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={entry.avatar} />
              <AvatarFallback>{entry.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">{entry.name}</div>
              <div className="text-sm text-foreground-subtle">Level {entry.level}</div>
            </div>
            <div className="text-right">
              <div className="font-medium">{entry.points} pts</div>
              <div className={`text-xs ${entry.rankChange > 0 ? 'text-success' : entry.rankChange < 0 ? 'text-destructive' : 'text-foreground-subtle'}`}>
                {entry.rankChange > 0 ? '↑' : entry.rankChange < 0 ? '↓' : '−'} {Math.abs(entry.rankChange)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('overview');

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background-tertiary" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className="flex items-center gap-4">
              <Trophy className="h-16 w-16 text-warning" />
              <Star className="h-12 w-12 text-primary animate-pulse" />
              <Award className="h-14 w-14 text-accent" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold text-foreground mb-4"
          >
            Dashboard
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-foreground-subtle max-w-2xl mx-auto"
          >
            Track your governance journey, unlock achievements, and monitor your performance. 
            Level up your governance skills and earn recognition for your contributions.
          </motion.p>
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent key={activeTab} value="overview" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <ProfileStats />
                <ActivityTimeline />
                <UserStatsCard stats={mockUserStats} />
                <LeaderboardCard entries={mockLeaderboard} />
              </motion.div>
            </TabsContent>

            <TabsContent key={activeTab} value="performance" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <PerformanceCharts />
                <AchievementsBadges />
                <ActivityTimeline />
                <UserStatsCard stats={mockUserStats} />
              </motion.div>
            </TabsContent>

            <TabsContent key={activeTab} value="achievements" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {mockAchievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent key={activeTab} value="leaderboard" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <LeaderboardCard entries={mockLeaderboard} />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;