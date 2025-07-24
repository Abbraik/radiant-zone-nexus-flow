import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfWeek, differenceInDays, parseISO, isWithinInterval } from 'date-fns';
import { Plus, Minus, Calendar, Clock, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SprintDetailsDialog } from './sprint-details-dialog';

// Design tokens
export const tokens = {
  bgGlass: 'rgba(255,255,255,0.2)',
  blur: '20px',
  colorThink: '#30D158',
  colorAct: '#3B82F6',
  colorMonitor: '#FBBF24',
  colorInnovate: '#10B981',
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA'
};

interface Sprint {
  id: string;
  name: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  phase: 'think' | 'act' | 'monitor' | 'innovate';
  progress?: number;
  description?: string;
  objectives?: string[];
  team?: string[];
  status?: 'planning' | 'active' | 'completed' | 'blocked';
  milestones?: {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }[];
}

interface Deadline {
  taskId: string;
  title: string;
  dueDate: string; // ISO
  phase: 'think' | 'act' | 'monitor' | 'innovate';
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

interface TimelineChartProps {
  sprints: Sprint[];
  upcomingDeadlines: Deadline[];
  onSprintClick?: (sprintId: string) => void;
  onDeadlineClick?: (taskId: string) => void;
  className?: string;
}

interface Tooltip {
  show: boolean;
  x: number;
  y: number;
  content: React.ReactNode;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({
  sprints,
  upcomingDeadlines,
  onSprintClick,
  onDeadlineClick,
  className
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [tooltip, setTooltip] = useState<Tooltip>({ show: false, x: 0, y: 0, content: null });
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'think': return tokens.colorThink;
      case 'act': return tokens.colorAct;
      case 'monitor': return tokens.colorMonitor;
      case 'innovate': return tokens.colorInnovate;
      default: return tokens.colorAct;
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'think': return Calendar;
      case 'act': return Zap;
      case 'monitor': return Target;
      case 'innovate': return Clock;
      default: return Calendar;
    }
  };

  // Calculate timeline range
  const allDates = [
    ...sprints.flatMap(s => [parseISO(s.startDate), parseISO(s.endDate)]),
    ...upcomingDeadlines.map(d => parseISO(d.dueDate))
  ];
  
  const startDate = startOfWeek(new Date(Math.min(...allDates.map(d => d.getTime()))));
  const endDate = addDays(new Date(Math.max(...allDates.map(d => d.getTime()))), 14);
  const totalDays = differenceInDays(endDate, startDate);

  // Generate time axis ticks (weekly)
  const generateTicks = () => {
    const ticks = [];
    let current = startDate;
    while (current <= endDate) {
      ticks.push(current);
      current = addDays(current, 7);
    }
    return ticks;
  };

  const ticks = generateTicks();
  const chartWidth = totalDays * zoomLevel * 8; // 8px per day base width

  const getPositionAndWidth = (start: string, end: string) => {
    const startPos = differenceInDays(parseISO(start), startDate) * zoomLevel * 8;
    const duration = differenceInDays(parseISO(end), parseISO(start)) * zoomLevel * 8;
    return { left: startPos, width: Math.max(duration, 20) };
  };

  const handleSprintHover = (event: React.MouseEvent, sprint: Sprint) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      content: (
        <div className="text-sm">
          <div className="font-semibold text-white">{sprint.name}</div>
          <div className="text-gray-300">
            {format(parseISO(sprint.startDate), 'MMM dd')} - {format(parseISO(sprint.endDate), 'MMM dd')}
          </div>
          <div className="text-xs text-gray-400 capitalize">{sprint.phase} phase</div>
          {sprint.progress && (
            <div className="text-xs text-gray-400">{sprint.progress}% complete</div>
          )}
        </div>
      )
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, content: null });
  };

  const handleSprintClick = (sprint: Sprint) => {
    setSelectedSprint(sprint);
    setIsDialogOpen(true);
    setTooltip({ show: false, x: 0, y: 0, content: null }); // Hide tooltip when opening dialog
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSprint(null);
  };

  const zoomIn = () => setZoomLevel(prev => Math.min(prev * 1.5, 4));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev / 1.5, 0.5));

  return (
    <div className={cn("bg-white/5 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/10", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Mission Timeline</h3>
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
            aria-label="Zoom out"
          >
            <Minus className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={zoomIn}
            className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
            aria-label="Zoom in"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Gantt Chart */}
        <div className="flex-1 overflow-x-auto" ref={chartRef}>
          <div className="relative w-full" style={{ minWidth: Math.max(chartWidth, 600), height: 300 }}>
            {/* Time Axis */}
            <div className="absolute top-0 left-0 right-0 h-8 border-b border-white/20">
              {ticks.map((tick, index) => (
                <div
                  key={index}
                  className="absolute flex flex-col items-center"
                  style={{ left: differenceInDays(tick, startDate) * zoomLevel * 8 }}
                >
                  <div className="text-sm text-gray-400 font-medium">
                    {format(tick, 'MMM dd')}
                  </div>
                  {/* Gridline */}
                  <div 
                    className="absolute top-8 w-px h-64 border-l border-dashed border-white/20"
                    style={{ height: '250px' }}
                  />
                </div>
              ))}
            </div>

            {/* Sprint Bars */}
            <div className="absolute top-12 left-0 right-0">
              {sprints.map((sprint, index) => {
                const { left, width } = getPositionAndWidth(sprint.startDate, sprint.endDate);
                const phaseColor = getPhaseColor(sprint.phase);
                
                return (
                  <motion.div
                    key={sprint.id}
                    className="absolute cursor-pointer group"
                    style={{
                      left,
                      top: index * 40 + 20,
                      width,
                      height: 24
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Sprint ${sprint.name}: ${format(parseISO(sprint.startDate), 'MMM dd')} to ${format(parseISO(sprint.endDate), 'MMM dd')}`}
                    onMouseEnter={(e) => handleSprintHover(e, sprint)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleSprintClick(sprint)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSprintClick(sprint)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Sprint Bar */}
                    <div 
                      className="w-full h-full rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-150 shadow-lg border border-white/20"
                      style={{ backgroundColor: phaseColor }}
                    >
                      {/* Progress indicator */}
                      {sprint.progress && (
                        <div 
                          className="h-full bg-white/30 rounded-lg transition-all duration-300"
                          style={{ width: `${sprint.progress}%` }}
                        />
                      )}
                    </div>
                    
                    {/* Sprint Label */}
                    <div className="absolute left-2 top-1 text-xs font-medium text-white truncate max-w-full">
                      {sprint.name}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Deadline Markers */}
            {upcomingDeadlines.map((deadline, index) => {
              const position = differenceInDays(parseISO(deadline.dueDate), startDate) * zoomLevel * 8;
              const phaseColor = getPhaseColor(deadline.phase);
              
              return (
                <div
                  key={deadline.taskId}
                  className="absolute cursor-pointer"
                  style={{
                    left: position - 1,
                    top: 12,
                    height: '250px'
                  }}
                  onClick={() => onDeadlineClick?.(deadline.taskId)}
                >
                  {/* Deadline Line */}
                  <div 
                    className="w-0.5 h-full opacity-70 hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: phaseColor }}
                  />
                  
                  {/* Deadline Marker */}
                  <div 
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white"
                    style={{ backgroundColor: phaseColor }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Deadlines Sidebar */}
        <div className="w-64 ml-6 space-y-2">
          <h4 className="text-sm font-semibold text-white mb-3">Upcoming Deadlines</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {upcomingDeadlines.map((deadline) => {
              const PhaseIcon = getPhaseIcon(deadline.phase);
              const phaseColor = getPhaseColor(deadline.phase);
              
              return (
                <motion.div
                  key={deadline.taskId}
                  className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors duration-200 border border-white/10"
                  onClick={() => onDeadlineClick?.(deadline.taskId)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                    style={{ backgroundColor: phaseColor }}
                  />
                  <PhaseIcon className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {deadline.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {format(parseISO(deadline.dueDate), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  {deadline.priority && (
                    <div className={cn(
                      "text-xs px-2 py-1 rounded-full flex-shrink-0",
                      deadline.priority === 'critical' && "bg-red-500/20 text-red-300",
                      deadline.priority === 'high' && "bg-orange-500/20 text-orange-300",
                      deadline.priority === 'medium' && "bg-yellow-500/20 text-yellow-300",
                      deadline.priority === 'low' && "bg-gray-500/20 text-gray-300"
                    )}>
                      {deadline.priority}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip.show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-50 bg-gray-800 text-white p-3 rounded-lg shadow-xl border border-white/20 pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
            </div>
            {tooltip.content}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sprint Details Dialog */}
      <SprintDetailsDialog
        sprint={selectedSprint}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default TimelineChart;