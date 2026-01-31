import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
interface TopBarProps {
  isSidebarCollapsed: boolean;
}
export function TopBar({ isSidebarCollapsed }: TopBarProps) {
  return (
    <header
      className={`
        fixed top-0 right-0 z-20 h-16 bg-white border-b border-gray-200 transition-all duration-300
        ${isSidebarCollapsed ? 'left-20' : 'left-64'}
      `}>

      <div className="h-full px-8 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, members, or discussions..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-sm" />

          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          {/* User Menu */}
          <Dropdown
            align="right"
            trigger={
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    Alex Johnson
                  </p>
                  <p className="text-xs text-gray-500">Member</p>
                </div>
                <Avatar alt="Alex Johnson" size="sm" />
              </div>
            }
            items={[
            {
              label: 'My Profile',
              href: '/dashboard/profile',
              icon: <User className="w-4 h-4" />
            },
            {
              label: 'Settings',
              href: '/dashboard/settings'
            },
            {
              label: 'Sign Out',
              danger: true
            }]
            } />

        </div>
      </div>
    </header>);

}