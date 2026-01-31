import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Camera,
  Save } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Tabs } from '../../components/ui/Tabs';
import { useToast } from '../../components/ui/Toast';
export function ProfilePage() {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  // Mock User Data
  const [user, setUser] = useState({
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Product Designer passionate about community building and sustainable tech.',
    role: 'Member'
  });
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast('Profile updated successfully', 'success');
    }, 1000);
  };
  const GeneralTab = () =>
  <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <Avatar size="lg" alt={`${user.firstName} ${user.lastName}`} />
          <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 text-gray-600">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
          <p className="text-sm text-gray-500">
            JPG, GIF or PNG. Max size of 800K
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
        label="First Name"
        value={user.firstName}
        onChange={(e) =>
        setUser({
          ...user,
          firstName: e.target.value
        })
        } />

        <Input
        label="Last Name"
        value={user.lastName}
        onChange={(e) =>
        setUser({
          ...user,
          lastName: e.target.value
        })
        } />

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
        label="Email"
        type="email"
        value={user.email}
        onChange={(e) =>
        setUser({
          ...user,
          email: e.target.value
        })
        }
        icon={<Mail className="w-4 h-4 text-gray-400" />} />

        <Input
        label="Phone"
        value={user.phone}
        onChange={(e) =>
        setUser({
          ...user,
          phone: e.target.value
        })
        }
        icon={<Phone className="w-4 h-4 text-gray-400" />} />

      </div>

      <Input
      label="Location"
      value={user.location}
      onChange={(e) =>
      setUser({
        ...user,
        location: e.target.value
      })
      }
      icon={<MapPin className="w-4 h-4 text-gray-400" />} />


      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
        rows={4}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        value={user.bio}
        onChange={(e) =>
        setUser({
          ...user,
          bio: e.target.value
        })
        } />

        <p className="mt-1 text-xs text-gray-500">
          Brief description for your profile.
        </p>
      </div>

      <div className="pt-4">
        <Button
        onClick={handleSave}
        isLoading={isSaving}
        leftIcon={<Save className="w-4 h-4" />}>

          Save Changes
        </Button>
      </div>
    </div>;

  const SecurityTab = () =>
  <div className="space-y-6 max-w-2xl">
      <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
      <div className="space-y-4">
        <Input
        label="Current Password"
        type="password"
        placeholder="••••••••" />

        <Input label="New Password" type="password" placeholder="••••••••" />
        <Input
        label="Confirm New Password"
        type="password"
        placeholder="••••••••" />

      </div>
      <div className="pt-2">
        <Button variant="outline">Update Password</Button>
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
        <p className="text-sm text-gray-500 mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <Button variant="danger">Delete Account</Button>
      </div>
    </div>;

  const NotificationsTab = () =>
  <div className="space-y-6 max-w-2xl">
      <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
      <div className="space-y-4">
        {[
      'New announcements',
      'Event reminders',
      'Direct messages',
      'Group updates',
      'Weekly newsletter'].
      map((item, i) =>
      <div
        key={i}
        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">

            <span className="text-gray-700">{item}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
            </label>
          </div>
      )}
      </div>
    </div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Tabs
          tabs={[
          {
            id: 'general',
            label: 'General',
            content: <GeneralTab />
          },
          {
            id: 'security',
            label: 'Security',
            content: <SecurityTab />
          },
          {
            id: 'notifications',
            label: 'Notifications',
            content: <NotificationsTab />
          }]
          } />

      </div>
    </div>);

}