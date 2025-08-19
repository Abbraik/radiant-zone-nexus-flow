import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Plus, 
  RefreshCw, 
  AlertCircle,
  Filter,
  Database
} from 'lucide-react';

interface EmptyStateProps {
  hasQuery: boolean;
  hasFilters: boolean;
  onClear: () => void;
  onNew: () => void;
}

interface ErrorStateProps {
  onRetry: () => void;
  error?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasQuery,
  hasFilters,
  onClear,
  onNew
}) => {
  if (hasQuery || hasFilters) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <Card className="glass-secondary max-w-md mx-auto text-center">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-muted/20">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No loops match your search
            </h3>
            
            <p className="text-muted-foreground mb-6">
              {hasQuery 
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "No loops match the selected filters. Try adjusting your criteria."
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={onClear}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Clear {hasFilters && hasQuery ? 'All' : hasFilters ? 'Filters' : 'Search'}
              </Button>
              
              <Button
                onClick={onNew}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Loop
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <Card className="glass-secondary max-w-md mx-auto text-center">
        <CardContent className="pt-8 pb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Database className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Welcome to the Loop Registry
          </h3>
          
          <p className="text-muted-foreground mb-6">
            Start building system dynamics loops to model complex relationships and behaviors. 
            Create your first loop to get started.
          </p>
          
          <Button
            onClick={onNew}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Your First Loop
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  onRetry, 
  error = "Failed to load loops" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <Card className="glass-secondary max-w-md mx-auto text-center">
        <CardContent className="pt-8 pb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Something went wrong
          </h3>
          
          <p className="text-muted-foreground mb-6">
            {error}. Please try again or contact support if the problem persists.
          </p>
          
          <Button
            onClick={onRetry}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};