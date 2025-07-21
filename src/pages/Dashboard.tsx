import React from 'react';
import { motion } from 'framer-motion';
import { ProfileStats } from '../components/dashboard/ProfileStats';
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline';
import { PerformanceCharts } from '../components/dashboard/PerformanceCharts';
import { AchievementsBadges } from '../components/dashboard/AchievementsBadges';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Dashboard</h1>
          <p className="text-gray-300">Your personalized activity and performance overview</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile & Key Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <ProfileStats />
          </motion.div>

          {/* Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <ActivityTimeline />
          </motion.div>

          {/* Performance Charts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <PerformanceCharts />
          </motion.div>

          {/* Achievements & Badges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <AchievementsBadges />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;