import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate } from
'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AuthenticatedLayout } from './components/layout/AuthenticatedLayout';
// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AnnouncementsPage } from './pages/public/AnnouncementsPage';
import { AnnouncementDetailPage } from './pages/public/AnnouncementDetailPage';
import { NewsPage } from './pages/public/NewsPage';
import { NewsDetailPage } from './pages/public/NewsDetailPage';
import { EventsPage } from './pages/public/EventsPage';
import { EventDetailPage } from './pages/public/EventDetailPage';
import { CalendarPage } from './pages/public/CalendarPage';
import { ContactPage } from './pages/public/ContactPage';
import { ApplyPage } from './pages/public/ApplyPage';
// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
// Member Pages
import { DashboardPage } from './pages/member/DashboardPage';
import { ProfilePage } from './pages/member/ProfilePage';
import { MessagesPage } from './pages/member/MessagesPage';
import { DiscussionsPage } from './pages/member/DiscussionsPage';
import { DiscussionThreadPage } from './pages/member/DiscussionThreadPage';
import { GroupsPage } from './pages/member/GroupsPage';
import { GroupDetailPage } from './pages/member/GroupDetailPage';
// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { MembersPage } from './pages/admin/MembersPage';
import { ApplicationsPage } from './pages/admin/ApplicationsPage';
import { ApplicationReviewPage } from './pages/admin/ApplicationReviewPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';
import { AdminNewsPage } from './pages/admin/AdminNewsPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminSessionsPage } from './pages/admin/AdminSessionsPage';
import { AdminGroupsPage } from './pages/admin/AdminGroupsPage';
import { AdminDiscussionsPage } from './pages/admin/AdminDiscussionsPage';
import { NotificationsPage } from './pages/admin/NotificationsPage';
import { FormsPage } from './pages/admin/FormsPage';
import { FormBuilderPage } from './pages/admin/FormBuilderPage';
import { FormResponsesPage } from './pages/admin/FormResponsesPage';
import { BrandingPage } from './pages/admin/settings/BrandingPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
// Super Admin Pages
import { SuperAdminDashboardPage } from './pages/super-admin/SuperAdminDashboardPage';
import { OrganizationsPage } from './pages/super-admin/OrganizationsPage';
import { PlatformUsersPage } from './pages/super-admin/PlatformUsersPage';
import { PlansPage } from './pages/super-admin/PlansPage';
import { SystemAnalyticsPage } from './pages/super-admin/SystemAnalyticsPage';
// Placeholder Pages
const PlaceholderPage = ({ title }: {title: string;}) =>
<div className="p-8 text-center">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
    <p className="text-gray-500">This page is under construction.</p>
  </div>;

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/about"
                element={<PlaceholderPage title="About Us" />} />


              {/* Announcements */}
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route
                path="/announcements/:id"
                element={<AnnouncementDetailPage />} />


              {/* News */}
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />

              {/* Events */}
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/calendar" element={<CalendarPage />} />

              <Route path="/contact" element={<ContactPage />} />
              <Route path="/apply" element={<ApplyPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Member Routes */}
            <Route path="/dashboard" element={<AuthenticatedLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="groups" element={<GroupsPage />} />
              <Route path="groups/:id" element={<GroupDetailPage />} />
              <Route path="discussions" element={<DiscussionsPage />} />
              <Route
                path="discussions/:id"
                element={<DiscussionThreadPage />} />

              <Route path="messages" element={<MessagesPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route
                path="settings"
                element={<PlaceholderPage title="Settings" />} />

              <Route
                path="resources"
                element={<PlaceholderPage title="Resources" />} />

            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AuthenticatedLayout />}>
              <Route index element={<AdminDashboardPage />} />

              {/* People */}
              <Route path="members" element={<MembersPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route
                path="applications/:id"
                element={<ApplicationReviewPage />} />


              {/* Content */}
              <Route
                path="announcements"
                element={<AdminAnnouncementsPage />} />

              <Route path="news" element={<AdminNewsPage />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="sessions" element={<AdminSessionsPage />} />

              {/* Community */}
              <Route path="groups" element={<AdminGroupsPage />} />
              <Route path="discussions" element={<AdminDiscussionsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />

              {/* Forms */}
              <Route path="forms" element={<FormsPage />} />
              <Route path="forms/new" element={<FormBuilderPage />} />
              <Route
                path="forms/:id/responses"
                element={<FormResponsesPage />} />


              {/* Settings & Analytics */}
              <Route path="settings" element={<BrandingPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>

            {/* Super Admin Routes */}
            <Route path="/super-admin" element={<AuthenticatedLayout />}>
              <Route index element={<SuperAdminDashboardPage />} />
              <Route path="organizations" element={<OrganizationsPage />} />
              <Route path="users" element={<PlatformUsersPage />} />
              <Route path="plans" element={<PlansPage />} />
              <Route path="analytics" element={<SystemAnalyticsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>);

}