import React from 'react';
import { Bell, Heart } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AnnouncementCard } from '@/components/AnnouncementCard';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/contexts/FavoritesContext';
import { mockAnnouncements, mockMosques } from '@/data/mockData';
import { Link } from 'react-router-dom';

export const NotificationsSheet: React.FC = () => {
  const { favorites } = useFavorites();

  // Get announcements from favorited mosques only
  const favoriteAnnouncements = mockAnnouncements
    .filter(a => favorites.includes(a.mosqueId))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Get mosque name for each announcement
  const getMosqueName = (mosqueId: string) => {
    const mosque = mockMosques.find(m => m.id === mosqueId);
    return mosque?.name || 'Unknown Mosque';
  };

  const unreadCount = mockAnnouncements.filter(a => favorites.includes(a.mosqueId)).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <Bell size={18} className="text-primary" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85%] max-w-md p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4 pb-3 border-b border-border">
          <SheetTitle className="text-lg font-semibold text-foreground">Notifications</SheetTitle>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Heart size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">No favorites yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-[200px]">
                Follow mosques to see their updates here
              </p>
              <Link to="/mosques">
                <Button variant="default" size="sm">
                  Browse Mosques
                </Button>
              </Link>
            </div>
          ) : favoriteAnnouncements.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bell size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">No updates</h3>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                Your favorite mosques haven't posted any updates yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteAnnouncements.map((announcement) => (
                <div key={announcement.id} className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium px-1">
                    {getMosqueName(announcement.mosqueId)}
                  </p>
                  <AnnouncementCard announcement={announcement} />
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
