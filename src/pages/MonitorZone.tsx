import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Filter, TrendingUp, TrendingDown, Minus, Download, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Sparkline } from '../components/ui/sparkline';
import { useMockLoops, useMockMetrics } from '../hooks/use-mock-data';
import type { TensionLevel, DEBandLevel } from '../types';

const pulseFilterItems = [
  { id: 'green', label: 'Healthy', emoji: '🟢', color: 'text-success' },
  { id: 'yellow', label: 'Warning', emoji: '🟡', color: 'text-warning' },
  { id: 'red', label: 'Critical', emoji: '🔴', color: 'text-destructive' },
  { id: 'scheduled', label: 'Scheduled', emoji: '📅', color: 'text-info' }
];

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-success" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-destructive" />;
    default:
      return <Minus className="h-4 w-4 text-foreground-muted" />;
  }
};

const getDEBandEmoji = (band: DEBandLevel) => {
  switch (band) {
    case 'red': return '🔴';
    case 'orange': return '🟠';
    case 'yellow': return '🟡';
    case 'green': return '🟢';
    default: return '⚪';
  }
};

export const MonitorZone: React.FC = () => {
  const { data: loops = [] } = useMockLoops();
  const { data: metrics = [] } = useMockMetrics();
  const [showLowTRI, setShowLowTRI] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const filteredLoops = loops.filter(loop => {
    if (showLowTRI && loop.triScore > 3) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-entrance">
      {/* Header */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          Monitor Zone
        </h1>
        <p className="text-foreground-muted max-w-2xl mx-auto">
          Track loop performance, monitor TRI scores, and analyze system health indicators
        </p>
      </motion.div>

      {/* Main Panel */}
      <Card className="zone-panel-full">
        <div className="space-y-6">
          {/* PulseBar - Status Filters */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-glass-secondary rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-foreground">System Pulse</h3>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="low-tri"
                  checked={showLowTRI}
                  onCheckedChange={setShowLowTRI}
                />
                <Label htmlFor="low-tri" className="text-sm text-foreground-muted">
                  Show TRI ≤ 3 only
                </Label>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {pulseFilterItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => toggleFilter(item.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-fast
                    ${activeFilters.includes(item.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-glass-primary text-foreground-muted hover:text-foreground hover:bg-glass-accent'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                  <Badge variant="secondary" className="ml-1 bg-white/20 text-xs">
                    {Math.floor(Math.random() * 10 + 1)}
                  </Badge>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Loop Performance Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Loop Performance</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm">
                  Review TRI
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left py-3 px-4 text-sm font-medium text-foreground-muted">Loop Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-foreground-muted">Performance</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-foreground-muted">DE-Band</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-foreground-muted">TRI Score</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-foreground-muted">Trend</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-foreground-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoops.map((loop, index) => {
                    const loopMetrics = metrics.filter(m => m.loopId === loop.id);
                    const primaryMetric = loopMetrics[0];

                    return (
                      <motion.tr
                        key={loop.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-border-subtle hover:bg-glass-secondary/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-foreground">{loop.name}</div>
                            <div className="text-sm text-foreground-muted">
                              SRT: {loop.srt}mo • {loop.status}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {primaryMetric && (
                            <div className="flex items-center gap-3">
                              <Sparkline
                                data={primaryMetric.sparklineData}
                                width={80}
                                height={30}
                                color={primaryMetric.trend === 'up' ? '#10b981' : 
                                       primaryMetric.trend === 'down' ? '#ef4444' : '#6b7280'}
                                className="opacity-80"
                              />
                              <div className="text-sm">
                                <div className="font-medium text-foreground">
                                  {primaryMetric.value} {primaryMetric.unit}
                                </div>
                                <div className="text-foreground-muted">
                                  Target: {primaryMetric.target}
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant="outline"
                            className={`de-band-${loop.deBand} border-current`}
                          >
                            {getDEBandEmoji(loop.deBand)} {loop.deBand.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-lg ${
                              loop.triScore <= 3 ? 'text-destructive' :
                              loop.triScore <= 6 ? 'text-warning' :
                              'text-success'
                            }`}>
                              {loop.triScore}
                            </span>
                            {loop.triScore <= 3 && (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {primaryMetric && getTrendIcon(primaryMetric.trend)}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={loop.status === 'active' ? 'default' : 'secondary'}
                            className={loop.status === 'active' ? 'bg-success/20 text-success border-success/30' : ''}
                          >
                            {loop.status}
                          </Badge>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredLoops.length === 0 && (
              <div className="text-center py-12 text-foreground-muted">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No loops match the current filters</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-glass-secondary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Active Loops</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loops.filter(l => l.status === 'active').length}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  🔄
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-glass-secondary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Avg TRI Score</p>
                  <p className="text-2xl font-bold text-foreground">
                    {(loops.reduce((sum, l) => sum + l.triScore, 0) / loops.length).toFixed(1)}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
                  📊
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-glass-secondary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">High Tension</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loops.filter(l => l.tension === 'high').length}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                  🔥
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-glass-secondary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">In Red Band</p>
                  <p className="text-2xl font-bold text-foreground">
                    {loops.filter(l => l.deBand === 'red').length}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                  🔴
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};