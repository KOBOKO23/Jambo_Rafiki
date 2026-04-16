import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpenText,
  BellRing,
  Compass,
  DollarSign,
  FileText,
  GalleryHorizontalEnd,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquareText,
  Settings,
  Shield,
  SquareStack,
  Users,
  UserCog,
  UserRound,
  ClipboardList,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/content', label: 'Content Studio', icon: SquareStack },
  { to: '/dashboard/content/pages', label: 'Pages', icon: BookOpenText },
  { to: '/dashboard/navigation', label: 'Navigation', icon: Compass },
  { to: '/dashboard/media', label: 'Media Library', icon: GalleryHorizontalEnd },
  { to: '/dashboard/donations', label: 'Donations', icon: DollarSign },
  { to: '/dashboard/testimonials', label: 'Testimonials', icon: MessageSquareText },
  { to: '/dashboard/contacts', label: 'Contacts', icon: FileText },
  { to: '/dashboard/volunteers', label: 'Volunteers', icon: Users },
  { to: '/dashboard/newsletter', label: 'Newsletter', icon: BellRing },
  { to: '/dashboard/sponsorships', label: 'Sponsorships', icon: HeartHandshake },
  { to: '/dashboard/gallery', label: 'Gallery', icon: GalleryHorizontalEnd },
  { to: '/dashboard/marketing', label: 'Marketing', icon: Megaphone },
  { to: '/dashboard/audit-log', label: 'Audit Log', icon: ClipboardList },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/dashboard/profile', label: 'Profile', icon: UserRound },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pageTitle = navItems.find((item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`))?.label ?? 'Overview';

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/admin/login', { replace: true });
    } catch {
      // Error is already in auth context
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200 bg-white sticky top-0 h-screen">
          <div className="px-6 py-5 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-slate-900">Jambo Rafiki CMS</h1>
                <p className="text-xs text-slate-500">Staff workspace</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors ${
                    active
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="px-6 py-5 border-t border-slate-200 text-xs text-slate-500 leading-relaxed">
            Session auth and CSRF are enforced by the shared API client.
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Admin Dashboard</p>
                <h2 className="text-2xl font-semibold text-slate-900">{pageTitle}</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                  <UserCog className="h-4 w-4 text-slate-500" />
                  <span>{user?.email || 'Staff'}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut || isLoading}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
