import { useQuery } from '@tanstack/react-query';
import { prayerTimesApi } from '@/services/api/prayerTimesApi';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import type { HijriDate } from '@/types';

// Important Islamic dates (Hijri month-day)
const importantDates: { month: number; day: number; name: string; nameAr: string }[] = [
  { month: 1, day: 1, name: 'Islamic New Year', nameAr: 'رأس السنة الهجرية' },
  { month: 3, day: 12, name: 'Mawlid al-Nabi (PBUH)', nameAr: 'المولد النبوي' },
  { month: 7, day: 27, name: 'Isra and Miraj', nameAr: 'الإسراء والمعراج' },
  { month: 8, day: 15, name: 'Shab-e-Barat', nameAr: 'ليلة البراءة' },
  { month: 9, day: 1, name: 'Ramadan Begins', nameAr: 'بداية رمضان' },
  { month: 9, day: 27, name: 'Laylat al-Qadr', nameAr: 'ليلة القدر' },
  { month: 10, day: 1, name: 'Eid al-Fitr', nameAr: 'عيد الفطر' },
  { month: 12, day: 9, name: 'Day of Arafah', nameAr: 'يوم عرفة' },
  { month: 12, day: 10, name: 'Eid al-Adha', nameAr: 'عيد الأضحى' },
];

const hijriMonths = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', 'Shaban',
  'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah'
];

const hijriMonthsAr = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

export default function CalendarPage() {
  const { data: hijriDate, isLoading } = useQuery<HijriDate>({
    queryKey: ['hijriDate'],
    queryFn: () => prayerTimesApi.getHijriDate(),
  });

  const today = new Date();
  const currentMonth = hijriDate ? parseInt(hijriDate.month.number.toString()) : 1;
  const currentDay = hijriDate ? parseInt(hijriDate.day) : 1;

  // Find upcoming events (filter by both month and day)
  const upcomingEvents = importantDates
    .filter((d) => {
      if (d.month > currentMonth) return true;
      if (d.month === currentMonth && d.day >= currentDay) return true;
      return false;
    })
    .sort((a, b) => a.month - b.month || a.day - b.day)
    .slice(0, 6);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full h-full overflow-y-auto">
      <h2 className="text-3xl font-heading font-bold text-gold-400 mb-2">Islamic Calendar</h2>
      <p className="text-slate-400 mb-8">Hijri calendar with important Islamic dates.</p>

      {/* Current Hijri Date Card */}
      <div className="bg-gradient-to-br from-lapis-800 to-lapis-900 p-6 md:p-8 rounded-2xl border border-gold-500/30 mb-8">
        <h3 className="text-gold-500 font-heading text-lg uppercase tracking-widest mb-4">Today's Date</h3>
        {isLoading ? (
          <LoadingSkeleton count={2} />
        ) : hijriDate ? (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="font-arabic text-3xl md:text-4xl text-parchment-100 dir-rtl">
                {hijriDate.day} {hijriDate.month.ar} {hijriDate.year} {hijriDate.designation.expanded}
              </p>
              <p className="text-xl text-gold-200 mt-2">
                {hijriDate.day} {hijriDate.month.en} {hijriDate.year} AH
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">Unable to load Hijri date.</p>
        )}
      </div>

      {/* Upcoming Events */}
      <div className="bg-lapis-800/50 rounded-xl p-6 border border-gold-500/20">
        <h3 className="text-lg font-heading text-gold-400 mb-4">Upcoming Important Dates</h3>
        <div className="space-y-3">
          {upcomingEvents.map((event, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-lg bg-lapis-900/50 border border-gold-500/10 hover:border-gold-500/30 transition-colors"
            >
              <div>
                <p className="font-bold text-parchment-100">{event.name}</p>
                <p className="font-arabic text-sm text-gold-400 dir-rtl">{event.nameAr}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">
                  {hijriMonths[event.month - 1]} {event.day}
                </p>
                <p className="font-arabic text-xs text-slate-500 dir-rtl">
                  {hijriMonthsAr[event.month - 1]} {event.day}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4 italic">
          Note: Dates are approximate and may vary by 1-2 days based on moon sighting.
        </p>
      </div>
    </div>
  );
}
