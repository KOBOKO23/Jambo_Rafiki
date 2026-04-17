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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(236,72,153,0.10),_transparent_28%),linear-gradient(180deg,_#fffdf9_0%,_#f8fafc_30%,_#f1f5f9_100%)] text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 flex-col border-r border-white/60 bg-slate-950/95 text-white shadow-2xl shadow-slate-900/20 sticky top-0 h-screen backdrop-blur-xl">
          <div className="px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-white">Jambo Rafiki CMS</h1>
                <p className="text-xs text-slate-300">Staff workspace</p>
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
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/20'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="px-6 py-5 border-t border-white/10 text-xs text-slate-300 leading-relaxed">
            Session auth and CSRF are enforced by the shared API client.
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-20 border-b border-orange-100/80 bg-white/85 backdrop-blur-2xl shadow-sm shadow-orange-100/40">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-orange-500">Admin Dashboard</p>
                <h2 className="text-2xl font-semibold text-slate-900">{pageTitle}</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-3 rounded-full border border-orange-100 bg-gradient-to-r from-orange-50 to-pink-50 px-4 py-2 text-sm text-slate-700 shadow-sm">
                  <UserCog className="h-4 w-4 text-orange-500" />
                  <span>{user?.email || 'Staff'}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut || isLoading}
                  className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-orange-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
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
