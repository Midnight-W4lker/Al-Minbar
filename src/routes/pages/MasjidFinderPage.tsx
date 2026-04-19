import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { masjidApi } from '@/services/api/masjidApi';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import type { Masjid } from '@/types';

export default function MasjidFinderPage() {
  const [location, setLocation] = React.useState<{ lat: number; lng: number } | null>(null);

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation({ lat: 24.8607, lng: 67.0011 })
      );
    }
  }, []);

  const { data: masjids, isLoading } = useQuery({
    queryKey: ['masjids', location?.lat, location?.lng],
    queryFn: () => location ? masjidApi.searchNearby(location.lat, location.lng) : null,
    enabled: !!location,
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gold-500/30 pb-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-gold-400">Masjid Finder</h2>
          <p className="text-slate-400">Find sanctuaries near you.</p>
        </div>
        <button className="mt-4 md:mt-0 px-4 py-2 bg-lapis-800 border border-gold-500 text-gold-500 rounded-lg hover:bg-gold-500 hover:text-lapis-900 transition-colors flex items-center gap-2">
          <span>📍</span> Use My Location
        </button>
      </div>

      {/* Map Placeholder */}
      <div className="w-full h-48 md:h-64 bg-lapis-800/50 rounded-xl border border-gold-500/20 mb-8 flex items-center justify-center relative overflow-hidden">
        <div className="text-center z-10">
          <p className="text-gold-500 font-bold text-lg">Map View</p>
          <p className="text-sm text-slate-500">Integrates with Google Maps / OpenStreetMap</p>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <LoadingSkeleton key={i} className="h-48" />)
          : (masjids as Masjid[] | undefined)?.map((masjid) => (
              <div key={masjid.id} className="bg-lapis-800/40 rounded-xl p-6 border border-gold-500/20 hover:border-gold-500/60 transition-all hover:-translate-y-1 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-lapis-900 border border-gold-500/30 flex items-center justify-center text-2xl">🕌</div>
                  <span className="bg-gold-500/10 text-gold-400 text-xs px-2 py-1 rounded border border-gold-500/20">{masjid.distance}</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-parchment-100 mb-1">{masjid.name}</h3>
                <p className="text-sm text-slate-400 mb-4 truncate">{masjid.address}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {masjid.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-lapis-900 text-slate-300 px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="pt-4 border-t border-gold-500/10 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-gold-600 uppercase font-bold">Next Jummah</p>
                    <p className="font-mono text-lg">{masjid.nextJummah || 'TBD'}</p>
                  </div>
                  <button className="text-gold-500 hover:underline text-sm">Directions →</button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}