import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Megaphone,
  Users,
  MessageSquare,
  Settings,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileCheck,
  Building2,
  CreditCard,
  BarChart2,
  Globe } from
'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { NavItem } from '../../types';
interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}
export function Sidebar({ isCollapsed, toggleCollapse }: SidebarProps) {
  const { organization } = useTheme();
  const location = useLocation();
  // In a real app, this would come from auth context
  // For demo purposes, we'll determine the "view mode" based on the URL
  const isSuperAdminRoute = location.pathname.startsWith('/super-admin');
  const isAdminRoute = location.pathname.startsWith('/admin');
  // Default to 'super_admin' role for demo so all options are visible in switcher
  const userRole = 'super_admin';
  const memberItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    label: 'Events',
    href: '/dashboard/events',
    icon: Calendar
  },
  {
    label: 'Announcements',
    href: '/dashboard/announcements',
    icon: Megaphone
  },
  {
    label: 'Groups',
    href: '/dashboard/groups',
    icon: Users
  },
  {
    label: 'Discussions',
    href: '/dashboard/discussions',
    icon: MessageSquare
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: Settings
  }];

  const adminItems: NavItem[] = [
  {
    label: 'Admin Dashboard',
    href: '/admin',
    icon: Shield
  },
  {
    label: 'Members',
    href: '/admin/members',
    icon: Users
  },
  {
    label: 'Applications',
    href: '/admin/applications',
    icon: FileCheck
  },
  {
    label: 'Content',
    href: '/admin/announcements',
    icon: Megaphone
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }];

  const superAdminItems: NavItem[] = [
  {
    label: 'Platform Overview',
    href: '/super-admin',
    icon: Globe
  },
  {
    label: 'Organizations',
    href: '/super-admin/organizations',
    icon: Building2
  },
  {
    label: 'Platform Users',
    href: '/super-admin/users',
    icon: Users
  },
  {
    label: 'Plans & Billing',
    href: '/super-admin/plans',
    icon: CreditCard
  },
  {
    label: 'Analytics',
    href: '/super-admin/analytics',
    icon: BarChart2
  }];

  let items = memberItems;
  if (isSuperAdminRoute) items = superAdminItems;else
  if (isAdminRoute) items = adminItems;
  return (
    <aside
      className={`
        fixed left-0 top-0 z-30 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>

      {/* Sidebar Header */}
      <div
        className={`h-16 flex items-center justify-center border-b border-gray-100 px-4 shrink-0 ${isSuperAdminRoute ? 'bg-gray-900' : ''}`}>

        <Link
          to="/dashboard"
          className="flex items-center gap-2 overflow-hidden">

          <div
            className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-lg ${isSuperAdminRoute ? 'bg-blue-600' : 'bg-[var(--color-primary)]'}`}>

            {isSuperAdminRoute ? 'S' : organization.name.charAt(0)}
          </div>
          {!isCollapsed &&
          <span
            className={`font-bold text-lg truncate ${isSuperAdminRoute ? 'text-white' : 'text-gray-900'}`}>

              {isSuperAdminRoute ? 'Super Admin' : organization.name}
            </span>
          }
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
          location.pathname === item.href ||
          item.href !== '/dashboard' &&
          item.href !== '/admin' &&
          item.href !== '/super-admin' &&
          location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200
                ${isActive ? isSuperAdminRoute ? 'bg-gray-900 text-white shadow-sm' : 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? item.label : undefined}>

              <Icon
                className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />

              {!isCollapsed &&
              <span className="font-medium text-sm">{item.label}</span>
              }
            </Link>);

        })}
      </nav>

      {/* Role Switcher (Demo only) */}
      {!isCollapsed &&
      <div className="px-4 py-2">
          <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2 text-center">
              Demo View Switcher
            </p>
            <div className="flex flex-col gap-1">
              <Link
              to="/dashboard"
              className={`text-xs text-center py-1.5 rounded ${!isAdminRoute && !isSuperAdminRoute ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}>

                Member View
              </Link>
              <Link
              to="/admin"
              className={`text-xs text-center py-1.5 rounded ${isAdminRoute ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}>

                Admin View
              </Link>
              <Link
              to="/super-admin"
              className={`text-xs text-center py-1.5 rounded ${isSuperAdminRoute ? 'bg-gray-800 shadow-sm text-white font-medium' : 'text-gray-500 hover:text-gray-900'}`}>

                Super Admin View
              </Link>
            </div>
          </div>
        </div>
      }

      {/* Footer / Collapse Toggle */}
      <div className="p-4 shrink-0">
        <button
          onClick={toggleCollapse}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">

          {isCollapsed ?
          <ChevronRight className="w-5 h-5" /> :

          <ChevronLeft className="w-5 h-5" />
          }
          {!isCollapsed &&
          <span className="font-medium text-sm">Collapse</span>
          }
        </button>

        <div className="mt-2 pt-2 border-t border-gray-100">
          <button
            className={`
            w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors
            ${isCollapsed ? 'justify-center' : ''}
          `}>

            <LogOut className="w-5 h-5" />
            {!isCollapsed &&
            <span className="font-medium text-sm">Sign Out</span>
            }
          </button>
        </div>
      </div>
    </aside>);

}