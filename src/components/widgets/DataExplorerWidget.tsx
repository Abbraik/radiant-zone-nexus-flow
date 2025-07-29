import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, LineChart, Download, Filter, Calendar, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { generateSparklineData } from '../../services/mock/data';

interface DataPoint {
  date: string;
  value: number;
  category?: string;
}

interface DataExplorerWidgetProps {
  selectedSignal?: string;
  onComplete: () => void;
}

const DataExplorerWidget: React.FC<DataExplorerWidgetProps> = ({ 
  selectedSignal = 'customer_satisfaction',
  onComplete 
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('chart');
  const [timeRange, setTimeRange] = useState('3m');
  const [groupBy, setGroupBy] = useState('week');
  const [showFilters, setShowFilters] = useState(false);

  // Generate mock historical data
  const generateHistoricalData = (signal: string, range: string): DataPoint[] => {
    const points = range === '1m' ? 30 : range === '3m' ? 90 : range === '6m' ? 180 : 365;
    const baseValue = signal === 'customer_satisfaction' ? 7.5 : 
                     signal === 'system_performance' ? 250 : 
                     signal === 'team_velocity' ? 45 : 65;
    
    const data: DataPoint[] = [];
    const now = new Date();
    
    for (let i = points; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const seasonality = Math.sin((i / points) * Math.PI * 4) * (baseValue * 0.1);
      const trend = (points - i) * 0.02;
      const noise = (Math.random() - 0.5) * (baseValue * 0.2);
      const value = Math.max(0, baseValue + seasonality + trend + noise);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value * 100) / 100,
        category: i % 7 === 0 ? 'weekend' : 'weekday'
      });
    }
    
    return data;
  };

  const data = generateHistoricalData(selectedSignal, timeRange);
  
  const getStatistics = (data: DataPoint[]) => {
    const values = data.map(d => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const sortedValues = [...values].sort((a, b) => a - b);
    const median = sortedValues[Math.floor(sortedValues.length / 2)];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const stdDev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length);
    
    // Calculate trend
    const recentValues = values.slice(-7);
    const oldValues = values.slice(-14, -7);
    const recentAvg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    const oldAvg = oldValues.reduce((a, b) => a + b, 0) / oldValues.length;
    const trend = ((recentAvg - oldAvg) / oldAvg) * 100;
    
    return { mean, median, min, max, stdDev, trend };
  };

  const stats = getStatistics(data);

  const generateChartPath = (points: DataPoint[]) => {
    if (points.length === 0) return '';
    
    const values = points.map(p => p.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    
    return points.map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - ((point.value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');
  };

  const exportData = () => {
    const csv = [
      'Date,Value,Category',
      ...data.map(d => `${d.date},${d.value},${d.category || ''}`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedSignal}_data_${timeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 2) return TrendingUp;
    if (trend < -2) return TrendingDown;
    return Activity;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 2) return 'text-green-400';
    if (trend < -2) return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <Label className="text-lg font-medium text-white mb-4 block">
          Explore Historical Data
        </Label>
        <p className="text-sm text-gray-400 mb-4">
          Validate chosen parameters against historical time series data for {selectedSignal.replace('_', ' ')}.
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-white/20">
            <SelectItem value="1m" className="text-white">Last Month</SelectItem>
            <SelectItem value="3m" className="text-white">Last 3 Months</SelectItem>
            <SelectItem value="6m" className="text-white">Last 6 Months</SelectItem>
            <SelectItem value="1y" className="text-white">Last Year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={groupBy} onValueChange={setGroupBy}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-white/20">
            <SelectItem value="day" className="text-white">Daily</SelectItem>
            <SelectItem value="week" className="text-white">Weekly</SelectItem>
            <SelectItem value="month" className="text-white">Monthly</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'chart' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('chart')}
            className="flex-1"
          >
            <LineChart className="w-4 h-4 mr-1" />
            Chart
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="flex-1"
          >
            <BarChart className="w-4 h-4 mr-1" />
            Table
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={exportData}
          className="border-teal-500 text-teal-300 hover:bg-teal-500 hover:text-white"
        >
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'Mean', value: stats.mean.toFixed(2), color: 'text-blue-400' },
          { label: 'Median', value: stats.median.toFixed(2), color: 'text-green-400' },
          { label: 'Min', value: stats.min.toFixed(2), color: 'text-gray-400' },
          { label: 'Max', value: stats.max.toFixed(2), color: 'text-gray-400' },
          { label: 'Std Dev', value: stats.stdDev.toFixed(2), color: 'text-yellow-400' },
          { 
            label: 'Trend', 
            value: `${stats.trend > 0 ? '+' : ''}${stats.trend.toFixed(1)}%`, 
            color: getTrendColor(stats.trend),
            icon: getTrendIcon(stats.trend)
          }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2">
                {Icon && <Icon className={`w-4 h-4 ${stat.color}`} />}
                <span className="text-xs text-gray-400">{stat.label}</span>
              </div>
              <p className={`text-lg font-bold ${stat.color} mt-1`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
        {viewMode === 'chart' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Time Series Chart</h3>
              <Badge variant="outline" className="text-xs">
                {data.length} data points
              </Badge>
            </div>
            
            <div className="w-full h-64 bg-gray-900 rounded-lg p-4">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
                
                {/* Data line */}
                <polyline
                  points={generateChartPath(data)}
                  fill="none"
                  stroke="url(#chartGradient)"
                  strokeWidth="1"
                />
                
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="text-xs text-gray-400 text-center">
              Historical data shows {stats.trend > 0 ? 'upward' : stats.trend < 0 ? 'downward' : 'stable'} trend 
              over {timeRange} period
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Data Table</h3>
              <Badge variant="outline" className="text-xs">
                Showing last 10 entries
              </Badge>
            </div>
            
            <div className="overflow-auto max-h-64">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-gray-400">Date</th>
                    <th className="text-left py-2 text-gray-400">Value</th>
                    <th className="text-left py-2 text-gray-400">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(-10).map((row, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className="py-2 text-gray-300">{row.date}</td>
                      <td className="py-2 text-white font-mono">{row.value}</td>
                      <td className="py-2">
                        <Badge variant="outline" className="text-xs">
                          {row.category}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="p-4 bg-teal-500/10 rounded-lg border border-teal-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-teal-400" />
          <span className="text-sm font-medium text-teal-300">Data Insights</span>
        </div>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Average value is {stats.mean.toFixed(2)} with {stats.stdDev.toFixed(2)} standard deviation</li>
          <li>• {stats.trend > 2 ? 'Strong upward' : stats.trend < -2 ? 'Strong downward' : 'Stable'} trend detected</li>
          <li>• Data quality appears {stats.stdDev / stats.mean < 0.2 ? 'consistent' : 'variable'} over time period</li>
          <li>• Recommended DE-Band range: {(stats.mean - stats.stdDev).toFixed(1)} - {(stats.mean + stats.stdDev).toFixed(1)}</li>
        </ul>
      </div>

      {/* Confirm Button */}
      <Button 
        onClick={onComplete}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white"
      >
        <Calendar className="w-4 h-4 mr-2" />
        Confirm Data Validation
      </Button>
    </motion.div>
  );
};

export default DataExplorerWidget;