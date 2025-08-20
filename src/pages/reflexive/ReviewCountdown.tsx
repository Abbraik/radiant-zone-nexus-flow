import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface ReviewCountdownProps {
  reviewDate: Date;
}

export const ReviewCountdown: React.FC<ReviewCountdownProps> = ({
  reviewDate
}) => {
  const now = new Date();
  const diffMs = reviewDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  const getVariant = () => {
    if (diffDays < 1) return 'destructive';
    if (diffDays < 3) return 'outline';
    return 'secondary';
  };

  const getDisplayText = () => {
    if (diffDays < 0) {
      return `${Math.abs(diffDays)}d overdue`;
    } else if (diffDays === 0) {
      return `${diffHours}h left`;
    } else {
      return `${diffDays}d left`;
    }
  };

  return (
    <Badge variant={getVariant()} className="flex items-center gap-1">
      <Clock className="h-3 w-3" />
      <span className="text-xs">Review: {getDisplayText()}</span>
    </Badge>
  );
};