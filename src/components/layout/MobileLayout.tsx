import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Map, Settings, Building2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/map', icon: Map, label: 'Map' },
  { path: '/favorites', icon: Heart, label: 'Favorites' },
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
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 safe-bottom z-50 shadow-lg">
          <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 1.5}
                    className={cn(
                      "transition-transform duration-200",
                      isActive && "scale-105"
                    )}
                  />
                  <span className={cn(
                    "text-[10px]",
                    isActive ? "font-semibold" : "font-medium"
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