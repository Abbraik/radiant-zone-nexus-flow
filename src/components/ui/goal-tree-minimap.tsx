import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Badge } from './badge';
import type { GoalTreeNode } from '../../pages/missionControl/types';

interface GoalTreeMinimapProps {
  goalTree: GoalTreeNode[];
  onNodeClick?: (node: GoalTreeNode) => void;
  className?: string;
  size?: number;
}

export const GoalTreeMinimap: React.FC<GoalTreeMinimapProps> = ({
  goalTree,
  onNodeClick,
  className = '',
  size = 150
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const getNodeColor = (status: GoalTreeNode['status']) => {
    switch (status) {
      case 'completed': return '#22c55e'; // emerald-500
      case 'in-progress': return 'hsl(var(--primary))';
      case 'blocked': return 'hsl(var(--destructive))';
      case 'not-started': return 'hsl(var(--muted))';
      default: return 'hsl(var(--muted))';
    }
  };

  const getNodeSize = (type: GoalTreeNode['type']) => {
    switch (type) {
      case 'goal': return 12;
      case 'okr': return 8;
      case 'task': return 6;
      default: return 6;
    }
  };

  const getPriorityStroke = (priority: GoalTreeNode['priority']) => {
    switch (priority) {
      case 'critical': return 'hsl(var(--destructive))';
      case 'high': return '#f59e0b'; // amber-500
      case 'medium': return 'hsl(var(--primary))';
      case 'low': return 'hsl(var(--muted))';
      default: return 'hsl(var(--muted))';
    }
  };

  // Flatten tree structure for layout
  const flattenTree = (nodes: GoalTreeNode[], level = 0, parentX = size / 2, parentY = 20): Array<{
    node: GoalTreeNode;
    x: number;
    y: number;
    level: number;
    parentX?: number;
    parentY?: number;
  }> => {
    const result: Array<{
      node: GoalTreeNode;
      x: number;
      y: number;
      level: number;
      parentX?: number;
      parentY?: number;
    }> = [];

    nodes.forEach((node, index) => {
      const x = parentX + (index - (nodes.length - 1) / 2) * (40 / (level + 1));
      const y = 20 + level * 40;

      result.push({
        node,
        x: Math.max(15, Math.min(x, size - 15)),
        y: Math.min(y, size - 15),
        level,
        parentX: level > 0 ? parentX : undefined,
        parentY: level > 0 ? parentY : undefined
      });

      if (node.children) {
        result.push(...flattenTree(node.children, level + 1, x, y));
      }
    });

    return result;
  };

  const layoutNodes = flattenTree(goalTree);

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        width={size}
        height={size}
        className="border border-border/30 rounded-lg bg-background/20 overflow-hidden"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Connection lines */}
        {layoutNodes.map((item, index) => {
          if (item.parentX !== undefined && item.parentY !== undefined) {
            return (
              <motion.line
                key={`line-${index}`}
                x1={item.parentX}
                y1={item.parentY}
                x2={item.x}
                y2={item.y}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            );
          }
          return null;
        })}

        {/* Nodes */}
        {layoutNodes.map((item, index) => {
          const nodeSize = getNodeSize(item.node.type);
          const progress = item.node.progress || 0;

          return (
            <g key={item.node.id}>
              {/* Progress ring */}
              <motion.circle
                cx={item.x}
                cy={item.y}
                r={nodeSize + 2}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="1"
                opacity={0.3}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              />
              
              {progress > 0 && (
                <motion.circle
                  cx={item.x}
                  cy={item.y}
                  r={nodeSize + 2}
                  fill="none"
                  stroke={getNodeColor(item.node.status)}
                  strokeWidth="1"
                  strokeDasharray={`${2 * Math.PI * (nodeSize + 2)}`}
                  strokeDashoffset={`${2 * Math.PI * (nodeSize + 2) * (1 - progress / 100)}`}
                  transform={`rotate(-90 ${item.x} ${item.y})`}
                  initial={{ strokeDashoffset: `${2 * Math.PI * (nodeSize + 2)}` }}
                  animate={{ strokeDashoffset: `${2 * Math.PI * (nodeSize + 2) * (1 - progress / 100)}` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              )}

              {/* Main node */}
              <motion.circle
                cx={item.x}
                cy={item.y}
                r={nodeSize}
                fill={getNodeColor(item.node.status)}
                stroke={getPriorityStroke(item.node.priority)}
                strokeWidth="1.5"
                className="cursor-pointer"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onNodeClick?.(item.node)}
              />

              {/* Type indicator */}
              <text
                x={item.x}
                y={item.y + 2}
                textAnchor="middle"
                fontSize="6"
                fill="white"
                className="pointer-events-none select-none font-bold"
              >
                {item.node.type === 'goal' ? 'G' : item.node.type === 'okr' ? 'O' : 'T'}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Done</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Active</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-muted-foreground">Blocked</span>
        </div>
      </div>

      {/* Summary stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-2 right-2 bg-background/80 rounded px-2 py-1 text-xs"
      >
        <div className="text-center">
          <div className="font-medium text-foreground">{goalTree.length}</div>
          <div className="text-muted-foreground">Goals</div>
        </div>
      </motion.div>
    </div>
  );
};