import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
export function AuthenticatedLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />


      <TopBar isSidebarCollapsed={isSidebarCollapsed} />

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