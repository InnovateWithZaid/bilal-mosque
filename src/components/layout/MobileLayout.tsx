import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Map, Settings, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/map', icon: Map, label: 'Map' },
  { path: '/mosques', icon: Building2, label: 'Mosques' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children, hideNav }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 overflow-auto pb-20">
        {children}
      </main>

      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border safe-bottom z-50">
          <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 2}
                    className={cn(
                      "transition-transform duration-200",
                      isActive && "scale-110"
                    )}
                  />
                  <span className={cn(
                    "text-[10px] font-medium",
                    isActive && "font-semibold"
                  )}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};
