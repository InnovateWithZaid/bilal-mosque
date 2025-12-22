import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnnouncementCard } from '@/components/AnnouncementCard';
import { mockAnnouncements, mockMosques } from '@/data/mockData';
import { AnnouncementType } from '@/types';

const filterTypes: { key: AnnouncementType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'talk', label: 'Talks' },
  { key: 'salah_update', label: 'Salah Updates' },
  { key: 'janazah', label: 'Janazah' },
  { key: 'notice', label: 'Notices' },
];

const CommunityPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<AnnouncementType | 'all'>('all');

  const mosque = mockMosques.find((m) => m.id === id);
  const announcements = mockAnnouncements
    .filter((a) => a.mosqueId === id)
    .filter((a) => activeFilter === 'all' || a.type === activeFilter);

  return (
    <div className="min-h-screen bg-background safe-top pb-8">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-xl z-10 border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Bell size={18} className="text-primary" />
              Community
            </h1>
            {mosque && (
              <p className="text-xs text-muted-foreground">{mosque.name}</p>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-4 overflow-x-auto">
          <div className="flex gap-2">
            {filterTypes.map(({ key, label }) => (
              <Badge
                key={key}
                variant={activeFilter === key ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap px-3 py-1.5"
                onClick={() => setActiveFilter(key)}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      {/* Announcements */}
      <div className="p-4 space-y-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))
        ) : (
          <div className="text-center py-12">
            <Filter size={40} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No announcements found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
