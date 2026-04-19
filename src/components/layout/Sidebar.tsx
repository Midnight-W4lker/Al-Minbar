import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { betaFeatures, isRouteEnabled } from '@/config/env';
import { 
  Home, 
  BookOpen, 
  Bot, 
  MapPin, 
  Compass, 
  CircleDot, 
  Calendar, 
  Bookmark, 
  Settings,
  Star,
  ScrollText
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/quran', label: 'Al-Quran', icon: BookOpen },
  { to: '/hadith', label: 'Hadith', icon: ScrollText },
  { to: '/ai', label: 'Noor AI', icon: Bot },
  { to: '/masjids', label: 'Masjids', icon: MapPin },
  { to: '/qibla', label: 'Qibla', icon: Compass },
  { to: '/tasbih', label: 'Tasbih', icon: CircleDot },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const decorationItems = [
  { icon: Star, delay: '0s' },
  { icon: Star, delay: '0.5s' },
  { icon: Star, delay: '1s' },
];

export const Sidebar: React.FC = () => {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'SubhanAllah';
    if (currentHour < 17) return 'Alhamdulillah';
    return 'MashAllah';
  };

  return (
    <aside className="
      hidden md:flex 
      w-72 xl:w-80 
      flex-col 
      bg-gradient-to-b from-lapis-900 via-lapis-800 to-lapis-900 
      border-r border-gold-500/20 
      z-20 
      relative
      overflow-hidden
    ">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,168,76,0.3),transparent_50%)]" />
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="geometric" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10 0L20 10L10 20L0 10Z" fill="none" stroke="#C9A84C" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#geometric)" />
        </svg>
      </div>

      {/* Logo Section */}
      <div className="p-8 flex flex-col items-center border-b border-gold-500/10 relative z-10">
        <div className="relative mb-4">
          {/* Animated Glow */}
          <div className="absolute inset-0 bg-gold-500/20 blur-xl rounded-full animate-pulse" />
          <div className="w-20 h-20 rounded-full border-2 border-gold-500/60 flex items-center justify-center bg-lapis-900/80 backdrop-blur shadow-[0_0_30px_rgba(201,160,89,0.3)] relative">
            <svg className="w-12 h-12 text-gold-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" />
            </svg>
          </div>
          {/* Decorative Stars */}
          {decorationItems.map((item, idx) => (
            <Star 
              key={idx}
              className="absolute w-2 h-2 text-gold-500 animate-pulse"
              style={{ 
                top: idx === 0 ? '-5px' : idx === 1 ? '50%' : '110%',
                left: idx === 0 ? '100%' : idx === 1 ? '-5px' : '-5px',
                animationDelay: item.delay
              }} 
            />
          ))}
        </div>
        <h1 className="text-3xl font-heading font-bold text-gold-400 tracking-wider">
          Al-Minbar
        </h1>
        <p className="text-xs text-gold-600/70 mt-2 font-body tracking-[0.3em] uppercase">
          {getGreeting()}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto relative z-10">
        {navItems.filter(({ to }) => isRouteEnabled(to)).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden',
                isActive
                  ? 'bg-gradient-to-r from-gold-500/20 to-gold-600/10 text-gold-400 border border-gold-500/30 shadow-[0_0_20px_rgba(197,160,89,0.15)]'
                  : 'text-slate-400 hover:text-gold-300 hover:bg-lapis-800/50 border border-transparent'
              )
            }
          >
            {/* Active Indicator */}
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gold-500 rounded-r-full" />
                )}
                <Icon className={cn(
                  'w-5 h-5 transition-transform duration-300',
                  isActive ? 'text-gold-400' : 'group-hover:scale-110'
                )} />
                <span className="font-heading text-sm tracking-wide">{label}</span>
                {betaFeatures[to] && (
                  <span className="ml-auto text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Beta
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gold-500/10 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 text-gold-600/50">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-xs font-body tracking-wider">v2.0.0 • Professional</p>
        </div>
      </div>
    </aside>
  );
};