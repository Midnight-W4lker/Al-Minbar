import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

export const AppLayout: React.FC = () => {
  
  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-lapis-900 text-parchment-100 relative overflow-hidden">
      {/* Multi-layered Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layer 1: Radial Gradient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.08),transparent_50%)]" />
        
        {/* Layer 2: Animated Mesh Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="mesh" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <circle cx="10" cy="10" r="1" fill="#C9A84C" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#mesh)" />
          </svg>
        </div>
        
        {/* Layer 3: Subtle Flowing Lines */}
        <div className="absolute inset-0 opacity-[0.015]">
          <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none">
            <path 
              d="M0 200 Q100 100 200 200 T400 200" 
              fill="none" 
              stroke="#C9A84C" 
              strokeWidth="0.5"
              className="animate-[dash_20s_linear_infinite]"
            />
            <path 
              d="M0 250 Q100 150 200 250 T400 250" 
              fill="none" 
              stroke="#C9A84C" 
              strokeWidth="0.5"
              className="animate-[dash_25s_linear_infinite]"
              style={{ animationDirection: 'reverse' }}
            />
            <path 
              d="M0 300 Q100 200 200 300 T400 300" 
              fill="none" 
              stroke="#C9A84C" 
              strokeWidth="0.5"
              className="animate-[dash_30s_linear_infinite]"
            />
          </svg>
        </div>
        
        {/* Layer 4: Geometric Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Layer 5: Floating Particles (Gold) */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gold-500/30 rounded-full animate-[float_8s_ease-in-out_infinite]"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 1.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto relative">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
      
      {/* Bottom Padding for Mobile */}
      <div className="md:hidden h-16" />
    </div>
  );
};