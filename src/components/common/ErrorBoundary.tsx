import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Bug, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Placeholder for error reporting service integration
    // Example: Sentry, LogRocket, etc.
    console.log('Reporting error to monitoring service:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: '',
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-background">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-2xl"
          >
            <Card className="glass border-destructive/20">
              <CardHeader className="text-center pb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4"
                >
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </motion.div>
                
                <CardTitle className="text-2xl text-foreground mb-2">
                  Something went wrong
                </CardTitle>
                
                <p className="text-foreground-subtle">
                  We encountered an unexpected error in the workspace. Our team has been notified.
                </p>

                <div className="flex justify-center mt-4">
                  <Badge variant="outline" className="text-xs font-mono">
                    Error ID: {this.state.errorId}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Error Details (Development only or if showDetails is true) */}
                {(process.env.NODE_ENV === 'development' || this.props.showDetails) && this.state.error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="border border-border-subtle rounded-lg p-4 bg-glass-primary/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Bug className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-medium text-foreground">
                          Error Details
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm font-mono">
                        <div>
                          <span className="text-foreground-subtle">Message:</span>
                          <div className="text-destructive mt-1">
                            {this.state.error.message}
                          </div>
                        </div>
                        
                        {this.state.error.stack && (
                          <div>
                            <span className="text-foreground-subtle">Stack:</span>
                            <pre className="text-xs text-foreground-subtle mt-1 overflow-auto max-h-32 p-2 bg-background/50 rounded border">
                              {this.state.error.stack}
                            </pre>
                          </div>
                        )}
                        
                        {this.state.errorInfo?.componentStack && (
                          <div>
                            <span className="text-foreground-subtle">Component Stack:</span>
                            <pre className="text-xs text-foreground-subtle mt-1 overflow-auto max-h-32 p-2 bg-background/50 rounded border">
                              {this.state.errorInfo.componentStack}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                  <Button
                    onClick={this.handleRetry}
                    variant="default"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                  
                  <Button
                    onClick={this.handleReload}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reload Page
                  </Button>
                  
                  <Button
                    onClick={this.handleGoHome}
                    variant="ghost"
                    className="flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Go Home
                  </Button>
                </motion.div>

                {/* Help Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center text-sm text-foreground-subtle border-t border-border-subtle pt-4"
                >
                  <p>
                    If this problem persists, please contact support with Error ID: 
                    <span className="font-mono text-foreground ml-1">
                      {this.state.errorId}
                    </span>
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Hook for manual error reporting
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, context?: any) => {
    console.error('Manual error report:', error, context);
    
    // In production, report to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Report error logic here
    }
  }, []);

  return { handleError };
};