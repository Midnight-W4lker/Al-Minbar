import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { prayerTimesApi } from '@/services/api/prayerTimesApi';
import { quranApi } from '@/services/api/quranApi';
import { useSettingsStore } from '@/store/useSettingsStore';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { cn } from '@/utils/cn';
import type { HijriDate } from '@/types';
import { Sparkles, Compass, BookOpen, Clock, MapPin, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const calculationMethod = useSettingsStore((s) => s.calculationMethod);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get user location
  const [hasLocationError, setHasLocationError] = useState(false);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {
          setLocation({ lat: 24.8607, lng: 67.0011 }); // Default: Karachi
          setHasLocationError(true);
        }
      );
    } else {
      setLocation({ lat: 24.8607, lng: 67.0011 });
      setHasLocationError(true);
    }
  }, []);

  // Fetch prayer times
  const { data: prayerData, isLoading: prayerLoading, error: prayerError, refetch: refetchPrayerTimes } = useQuery({
    queryKey: ['prayerTimes', location?.lat, location?.lng, calculationMethod],
    queryFn: () => location ? prayerTimesApi.getPrayerTimes(new Date(), location.lat, location.lng, calculationMethod) : null,
    enabled: !!location,
    retry: 2,
  });

  // Fetch Hijri date
  const { data: hijriDate } = useQuery<HijriDate>({
    queryKey: ['hijriDate'],
    queryFn: () => prayerTimesApi.getHijriDate(),
  });

  // Calculate next prayer
  const getNextPrayer = () => {
    if (!prayerData?.timings) return null;
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeMinutes = currentHours * 60 + currentMinutes;

    const timings = [
      { name: 'Fajr', time: prayerData.timings.Fajr },
      { name: 'Dhuhr', time: prayerData.timings.Dhuhr },
      { name: 'Asr', time: prayerData.timings.Asr },
      { name: 'Maghrib', time: prayerData.timings.Maghrib },
      { name: 'Isha', time: prayerData.timings.Isha },
    ];

    for (const prayer of timings) {
      const [time, period] = prayer.time.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let prayerHours = hours;
      if (period === 'PM' && hours !== 12) prayerHours += 12;
      if (period === 'AM' && hours === 12) prayerHours = 0;
      const prayerTime = prayerHours * 60 + minutes;

      if (prayerTime > currentTimeMinutes) {
        return prayer;
      }
    }
    return { name: 'Fajr', time: 'Tomorrow' };
  };

  const nextPrayer = getNextPrayer();

  const prayerTimes = prayerData?.timings
    ? [
        { name: 'Fajr', time: prayerData.timings.Fajr, icon: '🌅', color: 'from-amber-500/20 to-orange-500/20' },
        { name: 'Dhuhr', time: prayerData.timings.Dhuhr, icon: '☀️', color: 'from-yellow-500/20 to-amber-500/20' },
        { name: 'Asr', time: prayerData.timings.Asr, icon: '🌤️', color: 'from-orange-500/20 to-rose-500/20' },
        { name: 'Maghrib', time: prayerData.timings.Maghrib, icon: '🌇', color: 'from-rose-500/20 to-purple-500/20' },
        { name: 'Isha', time: prayerData.timings.Isha, icon: '🌙', color: 'from-indigo-500/20 to-blue-500/20' },
      ]
    : null;

  // Daily Ayah (Ayat al-Kursi - Surah Al-Baqarah 255)
  const dailyAyah = {
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    urdu: 'اللہ کے سوا کوئی معبود نہیں، وہ زندہ ہے سب کا نگہبان ہے',
    english: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.',
    reference: 'Surah Al-Baqarah 2:255',
  };

  // Greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'As-salamu alaykum', sub: 'Have a blessed morning' };
    if (hour < 17) return { text: 'As-salamu alaykum', sub: 'Have a blessed afternoon' };
    return { text: 'As-salamu alaykum', sub: 'Have a blessed evening' };
  };

  const greeting = getGreeting();

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 md:space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lapis-800 via-lapis-700 to-lapis-900 p-6 md:p-8 border border-gold-500/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500 rounded-full blur-3xl" />
        </div>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gold-400 mb-2">
              {greeting.text}
            </h2>
            <p className="text-slate-300 font-body text-lg">{greeting.sub}</p>
            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {hasLocationError ? 'Karachi (Est.)' : 'Current Location'}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {hijriDate ? `${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year}` : 'Loading...'}
              </span>
            </div>
          </div>
          
          {/* Digital Clock */}
          <div className="text-right">
            <div className="text-5xl md:text-6xl font-mono font-light text-parchment-100 tracking-tight">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            {nextPrayer && (
              <p className="text-sm text-gold-500 font-medium mt-2 flex items-center justify-end gap-2">
                <Clock className="w-4 h-4" />
                Next: {nextPrayer.name} at {nextPrayer.time}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Prayer Times Grid */}
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {prayerLoading
          ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
          : prayerError
            ? (
              <div className="col-span-5 flex flex-col items-center justify-center p-8 bg-lapis-800/40 rounded-2xl border border-red-500/20">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <p className="text-red-400 text-lg font-heading mb-2">Unable to load prayer times</p>
                <p className="text-slate-400 text-sm mb-4">Please check your connection or location</p>
                <button
                  onClick={() => refetchPrayerTimes()}
                  className="px-6 py-3 bg-gold-500 text-lapis-900 rounded-xl font-bold hover:bg-gold-400 transition-all hover:scale-105"
                >
                  Retry
                </button>
              </div>
            )
            : prayerTimes?.map((pt) => {
              const isNext = nextPrayer?.name === pt.name;
              return (
                <div 
                  key={pt.name} 
                  className={cn(
                    'flex flex-col items-center p-3 md:p-5 rounded-2xl border backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg',
                    isNext
                      ? 'bg-gradient-to-br from-gold-500/30 to-gold-600/20 border-gold-400/50 shadow-[0_0_25px_rgba(201,160,89,0.3)]'
                      : 'bg-lapis-800/40 border-gold-500/10 hover:border-gold-500/30 hover:bg-lapis-700/40'
                  )}
                >
                  <span className="text-2xl md:text-3xl mb-2">{pt.icon}</span>
                  <span className={cn(
                    'text-xs md:text-sm font-bold uppercase tracking-wider mb-1',
                    isNext ? 'text-gold-400' : 'text-slate-400'
                  )}>
                    {pt.name}
                  </span>
                  <span className={cn(
                    'text-sm md:text-lg font-mono',
                    isNext ? 'text-gold-300' : 'text-slate-300'
                  )}>
                    {pt.time}
                  </span>
                  {isNext && (
                    <div className="mt-2 px-2 py-0.5 bg-gold-500/20 rounded-full">
                      <span className="text-[10px] text-gold-400 font-bold">NEXT</span>
                    </div>
                  )}
                </div>
              );
            })}
      </div>

      {/* Quick Location Warning */}
      {hasLocationError && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <MapPin className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Using estimated location (Karachi). Enable device location for accurate prayer times.</p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Ayah - Featured */}
        <div
          className="lg:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-lapis-800/80 to-lapis-900/80 p-6 md:p-8 border border-gold-500/20 hover:border-gold-500/40 transition-all cursor-pointer"
          onClick={() => navigate('/quran')}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-40 h-40 text-gold-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" />
            </svg>
          </div>
          
          {/* Badge */}
          <div className="relative flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/30">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">Ayah of the Day</span>
            </div>
          </div>

          <div className="relative space-y-6">
            {/* Arabic */}
            <p className="font-arabic text-2xl md:text-4xl lg:text-5xl leading-relaxed text-parchment-100 text-center dir-rtl drop-shadow-md">
              {dailyAyah.arabic}
            </p>
            
            {/* Divider */}
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-px bg-gold-500/50" />
              <div className="w-2 h-2 rotate-45 bg-gold-500" />
              <div className="w-16 h-px bg-gold-500/50" />
            </div>
            
            {/* Translations */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-right">
                <p className="font-urdu text-xl text-gold-200/90 dir-rtl leading-loose">
                  {dailyAyah.urdu}
                </p>
              </div>
              <div>
                <p className="font-body text-lg text-slate-300 leading-relaxed">
                  "{dailyAyah.english}"
                </p>
              </div>
            </div>

            {/* Reference & Action */}
            <div className="flex items-center justify-between pt-4 border-t border-gold-500/20">
              <p className="text-sm text-gold-600 font-bold">
                {dailyAyah.reference}
              </p>
              <div className="flex items-center gap-2 text-gold-400 group-hover:translate-x-2 transition-transform">
                <span className="text-sm font-heading">Read in Quran</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-4">
          {/* Noor AI Card */}
          <div
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 p-6 shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all"
            onClick={() => navigate('/ai')}
          >
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.5" className="animate-pulse" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.5" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
              </svg>
            </div>
            
            <div className="relative flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🤖</span>
                  <h3 className="font-heading font-bold text-xl text-lapis-900">Noor AI</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-lapis-900/20 text-lapis-900 font-bold uppercase tracking-wider">Beta</span>
                </div>
                <p className="text-sm text-lapis-800/80 leading-snug">
                  Ask about Fiqh, Seerah, or get instant references from Quran & Hadith
                </p>
              </div>
            </div>
            
            <div className="relative mt-4 flex items-center justify-between">
              <span className="text-xs font-bold text-lapis-900/70 bg-lapis-900/10 px-3 py-1 rounded-full">
                Free • 24/7
              </span>
              <span className="text-lapis-900 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          {/* Qibla Compass Card */}
          <div
            className="group relative overflow-hidden rounded-2xl bg-lapis-800/60 p-5 border border-gold-500/10 hover:border-gold-500/30 transition-all cursor-pointer"
            onClick={() => navigate('/qibla')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Compass className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-parchment-100">Qibla Direction</h3>
                <p className="text-sm text-slate-400">Find the direction of Mecca</p>
              </div>
            </div>
          </div>

          {/* Tasbih Card */}
          <div
            className="group relative overflow-hidden rounded-2xl bg-lapis-800/60 p-5 border border-gold-500/10 hover:border-gold-500/30 transition-all cursor-pointer"
            onClick={() => navigate('/tasbih')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <span className="text-2xl">🧵</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-parchment-100">Tasbih Counter</h3>
                <p className="text-sm text-slate-400">Track your dhikr</p>
              </div>
            </div>
          </div>

          {/* Calendar Card */}
          <div
            className="group relative overflow-hidden rounded-2xl bg-lapis-800/60 p-5 border border-gold-500/10 hover:border-gold-500/30 transition-all cursor-pointer"
            onClick={() => navigate('/calendar')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading font-bold text-parchment-100">Islamic Calendar</h3>
                <p className="text-sm text-slate-400">Upcoming events & dates (Beta)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}