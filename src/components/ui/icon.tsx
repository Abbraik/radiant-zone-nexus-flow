import React from 'react';
import { LucideProps } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Common icons used throughout the app
const iconMap = {
  // Profile & User
  User: LucideIcons.User,
  UserPlus: LucideIcons.UserPlus,
  Users: LucideIcons.Users,
  UserCheck: LucideIcons.UserCheck,
  
  // Actions & Controls
  Activity: LucideIcons.Activity,
  Settings: LucideIcons.Settings,
  Shield: LucideIcons.Shield,
  Lock: LucideIcons.Lock,
  Eye: LucideIcons.Eye,
  Plus: LucideIcons.Plus,
  X: LucideIcons.X,
  Check: LucideIcons.Check,
  Edit: LucideIcons.Edit,
  Save: LucideIcons.Save,
  Copy: LucideIcons.Copy,
  Download: LucideIcons.Download,
  Upload: LucideIcons.Upload,
  RefreshCw: LucideIcons.RefreshCw,
  
  // Analytics & Charts
  BarChart3: LucideIcons.BarChart3,
  TrendingUp: LucideIcons.TrendingUp,
  TrendingDown: LucideIcons.TrendingDown,
  PieChart: LucideIcons.PieChart,
  Target: LucideIcons.Target,
  Gauge: LucideIcons.Gauge,
  
  // Status & Alerts
  AlertTriangle: LucideIcons.AlertTriangle,
  AlertCircle: LucideIcons.AlertCircle,
  CheckCircle: LucideIcons.CheckCircle,
  Info: LucideIcons.Info,
  Bell: LucideIcons.Bell,
  
  // Time & Calendar
  Clock: LucideIcons.Clock,
  Calendar: LucideIcons.Calendar,
  
  // Achievement & Rewards
  Trophy: LucideIcons.Trophy,
  Award: LucideIcons.Award,
  Star: LucideIcons.Star,
  
  // System & Technical
  Database: LucideIcons.Database,
  Server: LucideIcons.Server,
  Network: LucideIcons.Network,
  Zap: LucideIcons.Zap,
  Brain: LucideIcons.Brain,
  
  // Navigation
  Home: LucideIcons.Home,
  ArrowRight: LucideIcons.ArrowRight,
  ArrowLeft: LucideIcons.ArrowLeft,
  ChevronDown: LucideIcons.ChevronDown,
  ExternalLink: LucideIcons.ExternalLink,
  
  // Files & Content
  FileText: LucideIcons.FileText,
  File: LucideIcons.File,
  Folder: LucideIcons.Folder,
  
  // Media & Communication
  Mail: LucideIcons.Mail,
  Phone: LucideIcons.Phone,
  MessageSquare: LucideIcons.MessageSquare,
  
  // Loading
  Loader2: LucideIcons.Loader2,
  
  // Tools & Actions
  Search: LucideIcons.Search,
  Filter: LucideIcons.Filter,
  Grid: LucideIcons.Grid,
  List: LucideIcons.List,
  
  // Business & Organization
  Building2: LucideIcons.Building2,
  Briefcase: LucideIcons.Briefcase,
  
  // Miscellaneous
  Key: LucideIcons.Key,
  Bug: LucideIcons.Bug,
  Lightbulb: LucideIcons.Lightbulb,
  Play: LucideIcons.Play,
  Pause: LucideIcons.Pause
} as const;

export type IconName = keyof typeof iconMap;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = iconMap[name];
  
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return <LucideIcons.HelpCircle {...props} />;
  }
  
  return <LucideIcon {...props} />;
};

// Export individual icons for backward compatibility
export const {
  User,
  Users,
  Activity,
  Settings,
  Shield,
  Lock,
  TrendingUp,
  Trophy,
  BarChart3,
  Target,
  Brain,
  Clock,
  AlertTriangle,
  Star,
  Award,
  Loader2
} = iconMap;