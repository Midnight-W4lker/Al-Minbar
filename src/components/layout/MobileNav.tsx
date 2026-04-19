import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { Home, BookOpen, Bot, MapPin, Compass, CircleDot, ScrollText } from 'lucide-react';
import { betaFeatures, isRouteEnabled } from '@/config/env';

const mobileNavItems = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/quran', label: 'Quran', icon: BookOpen },
  { to: '/ai', label: 'Noor AI', icon: Bot },
  { to: '/masjids', label: 'Masjids', icon: MapPin },
];

const moreItems = [
  { to: '/qibla', label: 'Qibla', icon: Compass },
  { to: '/tasbih', label: 'Tasbih', icon: CircleDot },
];

export const MobileNav: React.FC = () => {
  const [showMore, setShowMore] = React.useState(false);

  return (
    <>
      {/* Main Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-lapis-900 via-lapis-800/95 to-lapis-800/90 border-t border-gold-500/20 backdrop-blur-xl">
        <div className="flex justify-around items-center px-2 py-3 pb-safe">
          {mobileNavItems.filter(({ to }) => isRouteEnabled(to)).map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-300 min-w-[60px]',
                  isActive
                    ? 'text-gold-400 transform -translate-y-1'
                    : 'text-slate-500'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    'p-2 rounded-full transition-all duration-300',
                    isActive 
                      ? 'bg-gold-500/20 shadow-[0_0_15px_rgba(201,168,76,0.3)]' 
                      : 'bg-transparent'
                  )}>
                    <Icon className={cn(
                      'w-5 h-5 transition-transform duration-300',
                      isActive ? 'scale-110' : ''
                    )} />
                  </div>
                  <span className={cn(
                    'text-[10px] font-heading tracking-wide transition-colors',
                    isActive ? 'text-gold-400' : 'text-slate-500'
                  )}>
                    {label}{betaFeatures[to] ? ' *' : ''}
                  </span>
                </>
              )}
            </NavLink>
          ))}
          
          {/* More Button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-300 min-w-[60px] text-slate-500"
          >
            <div className="p-2 rounded-full bg-transparent">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <span className="text-[10px] font-heading tracking-wide text-slate-500">More</span>
          </button>
        </div>
      </nav>

      {/* More Menu Overlay */}
      {showMore && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-20 left-4 right-4 bg-lapis-800/95 backdrop-blur-xl rounded-2xl border border-gold-500/20 p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-2 gap-3">
              {moreItems.filter(({ to }) => isRouteEnabled(to)).map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setShowMore(false)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-lapis-900/50 border border-gold-500/10 text-slate-300 hover:text-gold-400 hover:border-gold-500/30 transition-all"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-heading text-sm">{label}{betaFeatures[to] ? ' (Beta)' : ''}</span>
                </NavLink>
              ))}
              {isRouteEnabled('/calendar') && (
                <NavLink
                  to="/calendar"
                  onClick={() => setShowMore(false)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-lapis-900/50 border border-gold-500/10 text-slate-300 hover:text-gold-400 hover:border-gold-500/30 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-heading text-sm">Calendar (Beta)</span>
                </NavLink>
              )}
              {isRouteEnabled('/hadith') && (
                <NavLink
                  to="/hadith"
                  onClick={() => setShowMore(false)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-lapis-900/50 border border-gold-500/10 text-slate-300 hover:text-gold-400 hover:border-gold-500/30 transition-all"
                >
                  <ScrollText className="w-5 h-5" />
                  <span className="font-heading text-sm">Hadith (Beta)</span>
                </NavLink>
              )}
              <NavLink
                to="/settings"
                onClick={() => setShowMore(false)}
                className="flex items-center gap-3 p-4 rounded-xl bg-lapis-900/50 border border-gold-500/10 text-slate-300 hover:text-gold-400 hover:border-gold-500/30 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-heading text-sm">Settings</span>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
};