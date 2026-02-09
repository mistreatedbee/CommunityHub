import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
type LayoutProps = {
  variant: 'tenant-admin' | 'tenant-member' | 'super-admin';
  tenantSlug?: string;
  tenantName?: string;
  tenantId?: string | null;
};
export function AuthenticatedLayout({ variant, tenantSlug, tenantName, tenantId }: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        variant={variant}
        tenantSlug={tenantSlug}
        tenantName={tenantName} />


      <TopBar isSidebarCollapsed={isSidebarCollapsed} variant={variant} tenantId={tenantId} tenantSlug={tenantSlug} />

      <main
        className={`
          pt-24 pb-12 px-8 transition-all duration-300 min-h-screen
          ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}
        `}>

        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>);

}