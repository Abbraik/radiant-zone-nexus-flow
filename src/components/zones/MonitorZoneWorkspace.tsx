import React, { useState } from 'react';
import PrecedenceBanner from '../shared/PrecedenceBanner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Eye, 
  Wrench, 
  ChevronDown, 
  X,
  Filter,
  Calendar,
  Download,
  Bell
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { MultiLevelLoopHealthDashboard } from '../monitor/MultiLevelLoopHealthDashboard';
import { AlertSystem } from '../monitor/AlertSystem';
import { SubLeverPerformancePanel } from '../monitor/SubLeverPerformancePanel';
import { MicroLoopAlertRail } from '../monitor/MicroLoopAlertRail';
import { AdvancedAnalyticsSuite } from '../monitor/AdvancedAnalyticsSuite';
import { CommunityPulseDashboard } from '../monitor/CommunityPulseDashboard';
import { LearningPathRecommendations } from '../monitor/LearningPathRecommendations';
import { CollaborativeInsightsEngine } from '../monitor/CollaborativeInsightsEngine';
import { EnhancedLoop } from '../../types/monitor';
import { AnalyticsInsight, MicroLoopAlert } from '../../types/analytics';
import TransparencyScoreTile from '../monitor/TransparencyScoreTile';
import MetricsStrip from '../monitor/MetricsStrip';

// Mock data
const mockLoops = [
  {
    id: 'loop-1',
    name: 'Customer Onboarding',
    triScore: 8.5,
    deBand: 'green',
    trend: [7.2, 7.8, 8.1, 8.3, 8.5],
    status: 'healthy',
    lastCheck: '2 hours ago'
  },
  {
    id: 'loop-2', 
    name: 'API Performance',
    triScore: 6.2,
    deBand: 'yellow',
    trend: [7.1, 6.8, 6.5, 6.3, 6.2],
    status: 'warning',
    lastCheck: '1 hour ago'
  },
  {
    id: 'loop-3',
    name: 'Payment Processing',
    triScore: 3.1,
    deBand: 'red', 
    trend: [5.2, 4.8, 4.1, 3.5, 3.1],
    status: 'critical',
    lastCheck: '30 minutes ago'
  },
  {
    id: 'loop-4',
    name: 'User Engagement',
    triScore: 7.8,
    deBand: 'green',
    trend: [7.0, 7.2, 7.5, 7.6, 7.8],
    status: 'healthy',
    lastCheck: '1 hour ago'
  },
  {
    id: 'loop-5',
    name: 'Data Pipeline',
    triScore: 5.4,
    deBand: 'yellow',
    trend: [6.1, 5.9, 5.7, 5.6, 5.4],
    status: 'warning',
    lastCheck: '45 minutes ago'
  }
];

const TrendSparkline: React.FC<{ data: number[]; status: string }> = ({ data, status }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * 80,
    y: 20 - ((value - min) / range) * 16
  }));

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  const strokeColor = status === 'critical' ? '#ef4444' : 
                     status === 'warning' ? '#f59e0b' : '#10b981';

  return (
    <svg width="80" height="24" className="overflow-visible">
      <motion.path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      {points.map((point, index) => (
        <motion.circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="2"
          fill={strokeColor}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        />
      ))}
    </svg>
  );
};

export const MonitorZoneWorkspace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowTRI, setShowLowTRI] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedLoop, setSelectedLoop] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredLoops = mockLoops.filter(loop => {
    const matchesSearch = loop.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !showLowTRI || loop.triScore <= 3;
    const matchesStatus = !activeFilter || loop.status === activeFilter;
    return matchesSearch && matchesFilter && matchesStatus;
  });

  const statusCounts = {
    healthy: mockLoops.filter(l => l.status === 'healthy').length,
    warning: mockLoops.filter(l => l.status === 'warning').length,
    critical: mockLoops.filter(l => l.status === 'critical').length
  };

  const handleRowClick = (loopId: string) => {
    setSelectedLoop(loopId);
  };

  const handleLoopSelect = (loop: EnhancedLoop) => {
    console.log('Selected loop:', loop);
    // TODO: Navigate to detailed loop view or open sidebar
  };

  const handleMicroLoopAlert = (alert: MicroLoopAlert) => {
    console.log('Micro-loop alert clicked:', alert);
    // TODO: Navigate to task or intervention detail
  };

  const handleAnalyticsInsight = (insight: AnalyticsInsight) => {
    console.log('Analytics insight clicked:', insight);
    // TODO: Open insight detail modal or navigate to relevant view
  };

  return (
    <div className="space-y-6">
      <PrecedenceBanner />
      {/* Phase 2: Micro-Loop Alert Rail */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <MicroLoopAlertRail 
          workspaceType="monitor"
          onAlertClick={handleMicroLoopAlert}
          maxVisible={3}
        />
      </motion.div>

      {/* Metrics Strip and Additional Components */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-4 flex flex-wrap gap-4 items-start"
      >
        <MetricsStrip />
        <div className="max-w-md">
          <TransparencyScoreTile />
        </div>
      </motion.div>

      {/* Phase 1: Multi-Level Loop Health Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <MultiLevelLoopHealthDashboard onLoopSelect={handleLoopSelect} />
      </motion.div>

      {/* Phase 2: Sub-Lever Performance Panel & Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sub-Lever Performance Panel (2/3 width) */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SubLeverPerformancePanel
            onAdjustParameters={(subLeverId) => console.log('Adjust parameters for:', subLeverId)}
            onCreateCorrectiveTask={(subLever, gap) => console.log('Create corrective task:', subLever.name, gap)}
          />
        </motion.div>

        {/* Right Column: Advanced Analytics & Transparency */}
        <div className="space-y-6">
          {/* Advanced Analytics Suite */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AdvancedAnalyticsSuite
              onExportData={(query) => console.log('Export data:', query)}
              onConfigureAlert={() => console.log('Configure analytics alerts')}
              onViewInsight={handleAnalyticsInsight}
            />
          </motion.div>

          {/* Transparency Score Tile */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <TransparencyScoreTile />
          </motion.div>
        </div>
      </div>

      {/* Alert System */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <AlertSystem />
      </motion.div>

      {/* Phase 3: Community Pulse Integration & Continuous Learning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <CommunityPulseDashboard />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <LearningPathRecommendations />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <CollaborativeInsightsEngine />
      </motion.div>

      {/* Legacy System Pulse Overview - Now Secondary */}
      <motion.div
        className="w-full p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Legacy Loop Monitoring</h2>
          
          <div className="flex items-center space-x-4">
            {[
              { status: 'healthy', icon: '🟢', count: statusCounts.healthy, label: 'Healthy' },
              { status: 'warning', icon: '🟡', count: statusCounts.warning, label: 'Warning' },
              { status: 'critical', icon: '🔴', count: statusCounts.critical, label: 'Critical' },
            ].map((chip, index) => (
              <motion.button
                key={chip.status}
                onClick={() => setActiveFilter(activeFilter === chip.status ? null : chip.status)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-full border border-white/20 transition-all duration-200
                  ${activeFilter === chip.status ? 'bg-white/20 border-teal-500' : 'bg-white/10 hover:bg-white/15'}
                `}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-xl">{chip.icon}</span>
                <span className="text-white font-medium">{chip.count} {chip.label}</span>
              </motion.button>
            ))}
            
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full border border-white/20">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-white text-sm">Next check in 5 days</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter & Search Bar */}
      <motion.div
        className="p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search loops..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-full w-80"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={showLowTRI}
                onCheckedChange={setShowLowTRI}
              />
              <span className="text-white text-sm">Show TRI ≤ 3</span>
            </div>
          </div>

          {(searchQuery || showLowTRI || activeFilter) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowLowTRI(false);
                setActiveFilter(null);
              }}
              className="text-teal-300 underline text-sm hover:text-teal-200 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </motion.div>

      {/* Core Loop Table */}
      <motion.div
        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 p-4 border-b border-white/20 text-gray-300 font-medium">
          <div className="col-span-2">Loop Name</div>
          <div className="text-center">Trend</div>
          <div className="text-center">DE-Band</div>
          <div className="text-center">TRI Score</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-white/10">
          {filteredLoops.map((loop, index) => (
            <motion.div
              key={loop.id}
              className="grid grid-cols-5 gap-4 p-4 hover:bg-white/10 cursor-pointer transition-all duration-150"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.2)' }}
              onClick={() => handleRowClick(loop.id)}
            >
              <div className="col-span-2">
                <div className="text-white font-medium">{loop.name}</div>
                <div className="text-gray-400 text-sm">Last check: {loop.lastCheck}</div>
              </div>
              
              <div className="flex justify-center">
                <TrendSparkline data={loop.trend} status={loop.status} />
              </div>
              
              <div className="flex justify-center">
                <div 
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-sm
                    ${loop.deBand === 'green' ? 'bg-green-500' :
                      loop.deBand === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}
                  `}
                  title={loop.deBand === 'green' ? 'Within band' : 
                         loop.deBand === 'yellow' ? 'Warning threshold' : 'Critical breach'}
                >
                  {loop.deBand === 'green' ? '🟢' : 
                   loop.deBand === 'yellow' ? '🟡' : '🔴'}
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="bg-teal-500 text-white rounded-full w-10 h-8 flex items-center justify-center text-sm font-medium">
                  {loop.triScore}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Advanced Settings Link */}
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-teal-300 underline text-sm hover:text-teal-200 transition-colors"
          >
            Advanced Analytics
          </button>
        </div>

        {/* Advanced Settings Accordion */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-white/10"
            >
              <div className="p-6 space-y-6 bg-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Advanced Analytics</h3>
                  <motion.div
                    animate={{ rotate: showAdvanced ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Historical Data Export</h4>
                    <div className="flex space-x-2">
                      <Input type="date" className="bg-white/10 border-white/20 text-white" />
                      <Input type="date" className="bg-white/10 border-white/20 text-white" />
                      <Button variant="outline" className="border-white/30 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Alert Rules</h4>
                    <div className="space-y-2">
                      <Input 
                        placeholder="Notify when TRI < 3 for 2 days"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                      <Button variant="outline" className="border-white/30 text-white w-full">
                        <Bell className="w-4 h-4 mr-2" />
                        Set Alert Rule
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};