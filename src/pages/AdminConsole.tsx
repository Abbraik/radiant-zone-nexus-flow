import React from 'react';
import { AdminAccessControl } from '@/components/admin/AdminAccessControl';
import { AdminLayout } from '@/components/admin/AdminLayout';

const AdminConsole: React.FC = () => {
  return (
    <AdminAccessControl>
      <AdminLayout />
    </AdminAccessControl>
  );
};

export default AdminConsole;