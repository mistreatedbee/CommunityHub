import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { NavItem } from '../../types';
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { organization } = useTheme();
  const location = useLocation();
  const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'Announcements',
    href: '/announcements'
  },
  {
    label: 'News',
    href: '/news'
  },
  {
    label: 'Events',
    href: '/events'
  },
  {
    label: 'Contact',
    href: '/contact'
  }];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {organization.logo ?
            <img
              src={organization.logo}
              alt={organization.name}
              className="h-8 w-auto" /> :


            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-lg">
                {organization.name.charAt(0)}
              </div>
            }
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              {organization.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) =>
            <Link
              key={item.href}
              to={item.href}
              className={`text-sm font-medium transition-colors duration-200 ${isActive(item.href) ? 'text-[var(--color-primary)]' : 'text-gray-600 hover:text-gray-900'}`}>

                {item.label}
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/apply">
              <Button size="sm">Join Us</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>

            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen &&
      <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) =>
          <Link
            key={item.href}
            to={item.href}
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(item.href) ? 'bg-gray-50 text-[var(--color-primary)]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            onClick={() => setIsMenuOpen(false)}>

                {item.label}
              </Link>
          )}
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Log in
                </Button>
              </Link>
              <Link to="/apply" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full justify-start">Join Us</Button>
              </Link>
            </div>
          </div>
        </div>
      }
    </header>);

}