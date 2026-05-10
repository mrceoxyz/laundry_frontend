/* eslint-disable react/jsx-no-undef */
'use client';

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/Button';
import logo from '../img/logo.png';
import {
  Package,
  LayoutDashboard,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  HomeIcon,
  InfoIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Navigation() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  // Hide on auth pages
  if (pathname === '/login' || pathname === '/register') return null;

  // Scroll detection

  const navLinks = [
    { href: '/', label: 'Home', icon: HomeIcon, show: true },
    { href: '/about', label: 'About', icon: InfoIcon, show: true },
    { href: '/order', label: 'Create Order', icon: Package, show: isAuthenticated },
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, show: isAdmin },
    { href: '/feedback', label: 'Feedback', icon: MessageSquare, show: isAuthenticated },
    { href: '/profile', label: 'Profile', icon: User, show: isAuthenticated },
  ].filter((l) => l.show);

  const roleBadge = isAdmin ? (
    <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-500">
      Admin
    </span>
  ) : (
    <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-500">
      Customer
    </span>
  );

  return (
    <motion.nav
      initial={false}
      animate={{
        backgroundColor: scrolled ? 'rgba(var(--background), 0.8)' : 'rgba(0,0,0,0)',
        backdropFilter: scrolled ? 'blur(10px)' : 'blur(0px)',
        borderBottomWidth: scrolled ? 1 : 0,
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed top-0 z-50 w-full border-border"
    >
      <div className="container mx-auto px-4 bg-linear-to-br from-green-500/70 via-blue-500/70 to-green-500/10 dark:from-green-500/70 dark:via-blue-500/70 dark:to-green-500/70">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            {/* <Package className="h-7 w-7 text-green-500" /> */}
            <Image src={logo} alt="Logo" width={50} height={50} />
            <span className="text-xl font-bold tracking-tight">
              ELiteLaundry Solutions
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-green-500/30 text-gray-100'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}

            {/* THEME TOGGLE */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* USER */}
            {isAuthenticated && (
              <div className="ml-3 flex items-center gap-3 border-l border-border pl-4">
                <div className="text-right leading-tight">
                  <div className="flex items-center justify-end gap-2">
                    <p className="text-sm font-semibold">
                      {user?.first_name} {user?.last_name}
                    </p>
                    {roleBadge}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden rounded-md p-2 hover:bg-muted"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <div className="space-y-2 py-4">
                {isAuthenticated && (
                  <div className="mx-4 rounded-md bg-muted px-4 py-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">
                        {user?.first_name} {user?.last_name}
                      </p>
                      {roleBadge}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                )}

                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`mx-4 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${
                        pathname === link.href
                          ? 'bg-green-500/30 text-green-500'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}

                <div className="mx-4 flex items-center justify-between pt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    {theme === 'dark' ? <Sun /> : <Moon />}
                  </Button>

                  {isAuthenticated && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
