import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Play, TrendingUp, AlertCircle, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';

const Index = () => {
  const navigate = useNavigate();
  
  // Mock data
  const currentSprint = {
    week: 2,
    totalWeeks: 6,
    dueIn: 28,
    progress: 33
  };

  const systemHealth = {
    healthy: 5,
    warnings: 2,
    critical: 1,
    nextCheck: 5
  };

  const recentInsights = [
    { title: "Population growth trend shows acceleration", timestamp: "2 hours ago" },
    { title: "Resource allocation optimization identified", timestamp: "4 hours ago" },
    { title: "Social tension indicators stabilizing", timestamp: "1 day ago" }
  ];

  const notifications = [
    { icon: AlertCircle, text: "Loop A breached DE-Band", time: "2 h ago", color: "text-red-400" },
    { icon: Users, text: "3 Juror approvals pending", time: "5 h ago", color: "text-yellow-400" },
    { icon: TrendingUp, text: "New anomaly detected in Resource loop", time: "1 d ago", color: "text-blue-400" }
  ];

  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="h-full w-full relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background-tertiary" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      <motion.div 
        className="relative z-10 h-full flex flex-col max-w-7xl mx-auto p-6"
        variants={containerAnimation}
        initial="hidden"
        animate="visible"
      >
        <div className="flex-1 flex flex-col justify-center space-y-8">
        {/* Top Row: Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sprint Status Card */}
          <motion.div variants={itemAnimation} className="lg:col-span-3">
            <Card className="glass p-8 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-semibold text-foreground mb-2">Current Sprint</h2>
                    <p className="text-foreground-muted text-lg">Week {currentSprint.week} of {currentSprint.totalWeeks}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 text-foreground-muted">
                    <Calendar className="w-5 h-5" />
                    <span className="text-base">Due in {currentSprint.dueIn} days</span>
                  </div>

                  <Button 
                    onClick={() => navigate('/think')}
                    className="btn-primary text-lg px-8 py-4 group"
                  >
                    Go to Think Zone
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Progress Ring */}
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - currentSprint.progress / 100) }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{currentSprint.progress}%</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* System Health Card */}
          <motion.div variants={itemAnimation} className="lg:col-span-2">
            <Card className="glass-secondary p-6 h-full">
              <h2 className="text-2xl font-semibold text-foreground mb-6">System Health</h2>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    {systemHealth.healthy} Healthy
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    {systemHealth.warnings} Warnings
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-sm font-medium">
                    <AlertCircle className="w-3 h-3" />
                    {systemHealth.critical} Critical
                  </span>
                </div>
                
                <div className="pt-4">
                  <p className="text-sm text-foreground-muted mb-4">Next check in {systemHealth.nextCheck} days</p>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/monitor')}
                    className="text-primary hover:text-primary-hover"
                  >
                    View Monitor Zone →
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Row: Actions & Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Actions Panel */}
          <motion.div variants={itemAnimation}>
            <Card className="glass-secondary p-6 h-full">
              <h3 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/think')}
                  className="btn-primary w-full justify-start"
                >
                  Start Sprint
                </Button>
                <Button 
                  onClick={() => navigate('/act')}
                  variant="outline"
                  className="w-full justify-start btn-secondary"
                >
                  Publish Bundle
                </Button>
                <Button 
                  onClick={() => navigate('/innovate')}
                  variant="outline"
                  className="w-full justify-start btn-secondary"
                >
                  Run Simulation
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Recent Insights Panel */}
          <motion.div variants={itemAnimation}>
            <Card className="glass-secondary p-6 h-full">
              <h3 className="text-xl font-semibold text-foreground mb-6">Recent Insights</h3>
              <div className="space-y-3">
                {recentInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="glass rounded-xl p-3 hover:glass-accent transition-all cursor-pointer group"
                  >
                    <p className="text-sm text-foreground mb-1">{insight.title}</p>
                    <p className="text-xs text-foreground-subtle mb-2">{insight.timestamp}</p>
                    <button className="text-primary text-sm group-hover:text-primary-hover transition-colors">
                      Try Experiment <Play className="inline w-3 h-3 ml-1" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Notifications Panel */}
          <motion.div variants={itemAnimation}>
            <Card className="glass-secondary p-6 h-full">
              <h3 className="text-xl font-semibold text-foreground mb-6">Notifications</h3>
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <notification.icon className={`w-4 h-4 mt-1 ${notification.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{notification.text}</p>
                      <p className="text-xs text-foreground-subtle mt-1">{notification.time}</p>
                    </div>
                  </motion.div>
                ))}
                <Button variant="ghost" className="text-primary text-sm mt-4">
                  View All →
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
