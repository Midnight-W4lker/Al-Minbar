import { useState, useEffect, useCallback } from 'react';

// Calculate Qibla direction (in degrees from North) given lat/lng
function calculateQibla(latitude: number, longitude: number): number {
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;

  const lat1 = (latitude * Math.PI) / 180;
  const lng1 = (longitude * Math.PI) / 180;
  const lat2 = (kaabaLat * Math.PI) / 180;
  const lng2 = (kaabaLng * Math.PI) / 180;

  const deltaLng = lng2 - lng1;

  const x = Math.sin(deltaLng);
  const y = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(deltaLng);

  let qibla = (Math.atan2(x, y) * 180) / Math.PI;
  if (qibla < 0) qibla += 360;

  return qibla;
}

export default function QiblaPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [hasOrientation, setHasOrientation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user location and calculate Qibla
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });
          setQiblaAngle(calculateQibla(latitude, longitude));
        },
        () => {
          setError('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  // Request device orientation permission (iOS 13+)
  const requestOrientationPermission = useCallback(async () => {
    const DeviceOrientationEvent = (window as any).DeviceOrientationEvent;
    if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          return true;
        }
      } catch {
        // Permission denied or error
      }
    }
    return false;
  }, []);

  // Listen to device orientation
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        // alpha is the compass direction (0 = North, 0-360)
        const compassHeading = 360 - e.alpha;
        setHeading(compassHeading < 0 ? compassHeading + 360 : compassHeading);
        setHasOrientation(true);
      }
    };

    const setupOrientation = async () => {
      const granted = await requestOrientationPermission();
      if (granted || typeof (window as any).DeviceOrientationEvent?.requestPermission !== 'function') {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    setupOrientation();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [requestOrientationPermission]);

  // Calculate the relative angle between heading and Qibla
  const relativeAngle = heading !== null && qiblaAngle !== null
    ? qiblaAngle - heading
    : null;

  const normalizedAngle = relativeAngle !== null
    ? ((relativeAngle % 360) + 360) % 360
    : null;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <h2 className="text-3xl font-heading font-bold text-gold-400 mb-8">Qibla Compass</h2>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error/30 text-error max-w-md">
          <p>{error}</p>
        </div>
      )}

      {/* Compass Display */}
      <div className="w-64 h-64 rounded-full border-4 border-gold-500/30 flex items-center justify-center bg-lapis-800/50 relative mb-6">
        {/* Cardinal directions */}
        <span className="absolute top-2 text-gold-500 font-bold text-sm">N</span>
        <span className="absolute bottom-2 text-slate-400 font-bold text-sm">S</span>
        <span className="absolute left-2 text-slate-400 font-bold text-sm">W</span>
        <span className="absolute right-2 text-slate-400 font-bold text-sm">E</span>

        {/* Qibla direction arrow - rotates based on device heading */}
        {(qiblaAngle !== null || normalizedAngle !== null) && (
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
            style={{ transform: `rotate(${normalizedAngle ?? qiblaAngle}deg)` }}
          >
            <div className="absolute top-4 flex flex-col items-center">
              <span className="text-2xl">🕋</span>
              <span className="text-xs text-gold-400 font-bold mt-1">
                {Math.round(qiblaAngle ?? 0)}°
              </span>
            </div>
          </div>
        )}

        {/* Device heading indicator */}
        {hasOrientation && heading !== null && (
          <div
            className="absolute inset-0 transition-transform duration-150"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent border-b-gold-500" />
          </div>
        )}

        {/* Center text */}
        <div className="text-center z-10">
          {qiblaAngle !== null ? (
            <>
              <p className="text-gold-400 font-heading text-lg">Qibla Direction</p>
              <p className="text-slate-400 text-sm mt-1">
                {Math.round(qiblaAngle)}° from North
              </p>
            </>
          ) : (
            <>
              <span className="text-4xl">🕋</span>
              <p className="text-gold-400 font-heading mt-2">Calculating...</p>
            </>
          )}
        </div>
      </div>

      {/* Status info */}
      <div className="space-y-2 text-sm">
        {location && (
          <p className="text-slate-400">
            Location: {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
          </p>
        )}
        {hasOrientation ? (
          <p className="text-success">
            Compass active: {heading !== null ? `${Math.round(heading)}°` : '...'}
          </p>
        ) : (
          <p className="text-slate-500">
            Device orientation not available. Qibla angle shown is relative to North.
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-lapis-800/50 rounded-xl border border-gold-500/20 max-w-md">
        <p className="text-slate-300 text-sm">
          <strong className="text-gold-400">How to use:</strong> Point your device in the direction of the Kaaba.
          The arrow shows the Qibla direction relative to North.
          {hasOrientation ? ' Rotate your device to align with the arrow.' : ' Enable device orientation for compass guidance.'}
        </p>
      </div>
    </div>
  );
}
