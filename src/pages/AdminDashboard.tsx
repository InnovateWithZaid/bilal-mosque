import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Bell, Flag, Save, Plus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMosqueData } from '@/contexts/MosqueDataContext';
import { useToast } from '@/hooks/use-toast';
import { PrayerName, AnnouncementType } from '@/types';

const prayers: { key: PrayerName; label: string }[] = [
  { key: 'fajr', label: 'Fajr' },
  { key: 'dhuhr', label: 'Dhuhr' },
  { key: 'asr', label: 'Asr' },
  { key: 'maghrib', label: 'Maghrib' },
  { key: 'isha', label: 'Isha' },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mosques } = useMosqueData();
  const mosque = mosques[0]; // Demo mosque

  const [iqamahTimes, setIqamahTimes] = useState(mosque.iqamahTimes);
  const [jummahTimes, setJummahTimes] = useState(mosque.jummahTimes);
  const [newAnnouncement, setNewAnnouncement] = useState({
    type: 'notice' as AnnouncementType,
    title: '',
    description: '',
  });

  const handleSaveTimes = () => {
    toast({
      title: "Times Saved",
      description: "Iqamah times have been updated successfully",
    });
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
        <p className="text-muted-foreground">No mosques found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-top pb-8">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-xl z-10 border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">{mosque.name}</p>
          </div>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            Admin
          </Badge>
        </div>
      </header>

      <div className="p-4">
        {/* Quick Actions */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={() => navigate('/admin/mosques')}
            >
              <Building2 size={18} />
              Manage All Mosques
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="times" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="times" className="gap-1.5 text-xs">
              <Clock size={14} />
              Times
            </TabsTrigger>
            <TabsTrigger value="announce" className="gap-1.5 text-xs">
              <Bell size={14} />
              Post
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-1.5 text-xs">
              <Flag size={14} />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Iqamah Times Tab */}
          <TabsContent value="times" className="space-y-4">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock size={18} className="text-primary" />
                  Iqamah Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {prayers.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-4">
                    <label className="w-24 text-sm font-medium text-foreground">
                      {label}
                    </label>
                    <Input
                      type="time"
                      value={iqamahTimes[key].replace(' AM', '').replace(' PM', '')}
                      onChange={(e) => setIqamahTimes({
                        ...iqamahTimes,
                        [key]: e.target.value,
                      })}
                      className="flex-1 bg-muted border-0"
                    />
                  </div>
                ))}
                <Button 
                  variant="gold" 
                  className="w-full mt-4"
                  onClick={handleSaveTimes}
                >
                  <Save size={18} />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  Jummah Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {jummahTimes.map((time, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <label className="w-24 text-sm font-medium text-foreground">
                      Khutbah {index + 1}
                    </label>
                    <Input
                      type="time"
                      value={time.replace(' PM', '').replace(' AM', '')}
                      onChange={(e) => {
                        const newTimes = [...jummahTimes];
                        newTimes[index] = e.target.value;
                        setJummahTimes(newTimes);
                      }}
                      className="flex-1 bg-muted border-0"
                    />
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setJummahTimes([...jummahTimes, '13:00'])}
                >
                  <Plus size={18} />
                  Add Jummah Time
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announce" className="space-y-4">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell size={18} className="text-primary" />
                  Post Announcement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Type</label>
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
                      <SelectItem value="talk">Islamic Talk / Program</SelectItem>
                      <SelectItem value="salah_update">Salah Update</SelectItem>
                      <SelectItem value="janazah">Janazah Announcement</SelectItem>
                      <SelectItem value="notice">General Notice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <Input
                    placeholder="Announcement title..."
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({
                      ...newAnnouncement,
                      title: e.target.value,
                    })}
                    className="bg-muted border-0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <Textarea
                    placeholder="Write your announcement..."
                    value={newAnnouncement.description}
                    onChange={(e) => setNewAnnouncement({
                      ...newAnnouncement,
                      description: e.target.value,
                    })}
                    rows={4}
                    className="bg-muted border-0 resize-none"
                  />
                </div>

                <Button 
                  variant="gold" 
                  className="w-full"
                  onClick={handlePostAnnouncement}
                >
                  <Bell size={18} />
                  Post Announcement
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card variant="elevated">
              <CardContent className="p-6 text-center">
                <Flag size={40} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  No pending reports for your mosque
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
