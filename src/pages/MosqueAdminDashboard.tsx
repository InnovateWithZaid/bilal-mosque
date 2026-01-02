import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Bell, Save, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMosqueData } from '@/contexts/MosqueDataContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useToast } from '@/hooks/use-toast';
import { PrayerName, AnnouncementType, PrayerTimes } from '@/types';

const prayers: { key: PrayerName; label: string }[] = [
  { key: 'fajr', label: 'Fajr' },
  { key: 'dhuhr', label: 'Dhuhr' },
  { key: 'asr', label: 'Asr' },
  { key: 'maghrib', label: 'Maghrib' },
  { key: 'isha', label: 'Isha' },
];

const MosqueAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, assignedMosqueId } = useAdminAuth();
  const { mosques, updateMosque } = useMosqueData();
  
  const mosque = mosques.find(m => m.id === assignedMosqueId);

  const defaultPrayerTimes: PrayerTimes = {
    fajr: '',
    dhuhr: '',
    asr: '',
    maghrib: '',
    isha: '',
  };

  const [athanTimes, setAthanTimes] = useState<PrayerTimes>(mosque?.athanTimes || defaultPrayerTimes);
  const [iqamahTimes, setIqamahTimes] = useState<PrayerTimes>(mosque?.iqamahTimes || defaultPrayerTimes);
  const [jummahTimes, setJummahTimes] = useState(mosque?.jummahTimes || []);
  const [newAnnouncement, setNewAnnouncement] = useState({
    type: 'notice' as AnnouncementType,
    title: '',
    description: '',
  });

  const handleLogout = () => {
    logout();
    navigate('/mosque-admin/login');
  };

  const handleSaveTimes = () => {
    if (mosque) {
      updateMosque(mosque.id, { athanTimes, iqamahTimes, jummahTimes });
      toast({
        title: "Times Saved",
        description: "Prayer times have been updated successfully",
      });
    }
  };

  const handlePostAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Announcement Posted",
      description: "Your announcement is now visible to followers",
    });
    setNewAnnouncement({ type: 'notice', title: '', description: '' });
  };

  if (!mosque) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Mosque not found</p>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-top pb-8">
      <header className="sticky top-0 bg-background/95 backdrop-blur-xl z-10 border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft size={22} />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Mosque Dashboard</h1>
            <p className="text-xs text-muted-foreground">{mosque.name}</p>
          </div>
          <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
            Mosque Admin
          </Badge>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
            <LogOut size={20} className="text-muted-foreground" />
          </Button>
        </div>
      </header>

      <div className="p-4">
        <Tabs defaultValue="times" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="times" className="gap-2">
              <Clock size={16} />
              Times
            </TabsTrigger>
            <TabsTrigger value="post" className="gap-2">
              <Bell size={16} />
              Post
            </TabsTrigger>
          </TabsList>

          <TabsContent value="times" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock size={18} />
                  Athan Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {prayers.map((prayer) => (
                  <div key={prayer.key} className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium w-20">{prayer.label}</span>
                    <Input
                      type="time"
                      value={athanTimes[prayer.key] || ''}
                      onChange={(e) => setAthanTimes({ ...athanTimes, [prayer.key]: e.target.value })}
                      className="w-32 bg-muted border-0 text-center"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock size={18} />
                  Iqamah Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {prayers.map((prayer) => (
                  <div key={prayer.key} className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium w-20">{prayer.label}</span>
                    <Input
                      type="time"
                      value={iqamahTimes[prayer.key] || ''}
                      onChange={(e) => setIqamahTimes({ ...iqamahTimes, [prayer.key]: e.target.value })}
                      className="w-32 bg-muted border-0 text-center"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {mosque.features.jummah && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar size={18} />
                    Jummah Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {jummahTimes.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-16">Slot {index + 1}</span>
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => {
                          const newTimes = [...jummahTimes];
                          newTimes[index] = e.target.value;
                          setJummahTimes(newTimes);
                        }}
                        className="flex-1 bg-muted border-0 text-center"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Button variant="gold" size="lg" className="w-full gap-2" onClick={handleSaveTimes}>
              <Save size={18} />
              Save Times
            </Button>
          </TabsContent>

          <TabsContent value="post" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">New Announcement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={newAnnouncement.type}
                    onValueChange={(value: AnnouncementType) =>
                      setNewAnnouncement({ ...newAnnouncement, type: value })
                    }
                  >
                    <SelectTrigger className="bg-muted border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notice">Notice</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="janazah">Janazah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Announcement title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    className="bg-muted border-0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Announcement details..."
                    value={newAnnouncement.description}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                    className="bg-muted border-0 min-h-[100px]"
                  />
                </div>

                <Button variant="gold" size="lg" className="w-full" onClick={handlePostAnnouncement}>
                  Post Announcement
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MosqueAdminDashboard;
