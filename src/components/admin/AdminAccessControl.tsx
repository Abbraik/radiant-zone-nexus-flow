import React from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';

interface AdminAccessControlProps {
  children: React.ReactNode;
}

export const AdminAccessControl: React.FC<AdminAccessControlProps> = ({ children }) => {
  const { loading } = useAuthGuard(true); // Require admin access

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-secondary rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-foreground-muted mt-4 text-center">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};