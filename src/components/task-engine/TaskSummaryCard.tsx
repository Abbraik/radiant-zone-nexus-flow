import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TaskSummaryCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  variant?: 'default' | 'destructive';
}

export const TaskSummaryCard = ({ title, value, icon, trend, variant = 'default' }: TaskSummaryCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <Badge variant={variant === 'destructive' ? 'destructive' : 'secondary'} className="text-xs mt-1">
            {trend}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};