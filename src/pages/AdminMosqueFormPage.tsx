import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMosqueData } from '@/contexts/MosqueDataContext';
import { useToast } from '@/hooks/use-toast';
import { PlaceType, PlaceFeatures, PlaceFacilities, PrayerTimes } from '@/types';

const defaultFeatures: PlaceFeatures = {
  adhan: false,
  dailyCongregation: false,
  jummah: false,
  taraweeh: false,
  eidPrayer: false,
  eidAdhanOnly: false,
  janazah: false,
  khutbah: false,
};

const defaultFacilities: PlaceFacilities = {
  ablution: true,
  carParking: 'none',
  womensArea: false,
  accessibility: false,
  toilets: true,
  iftaar: false,
};

const defaultPrayerTimes: PrayerTimes = {
  fajr: '',
  dhuhr: '',
  asr: '',
  maghrib: '',
  isha: '',
};

const AdminMosqueFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addMosque, updateMosque, getMosqueById } = useMosqueData();
  const { toast } = useToast();
  const isEditing = !!id;

  // Form state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [type, setType] = useState<PlaceType>('mosque');
  const [features, setFeatures] = useState<PlaceFeatures>(defaultFeatures);
  const [facilities, setFacilities] = useState<PlaceFacilities>(defaultFacilities);
  const [athanTimes, setAthanTimes] = useState<PrayerTimes>(defaultPrayerTimes);
  const [iqamahTimes, setIqamahTimes] = useState<PrayerTimes>(defaultPrayerTimes);
  const [jummahTimes, setJummahTimes] = useState<string[]>(['']);
  const [eidTimes, setEidTimes] = useState<string[]>(['']);

  // Load existing mosque data for editing
  useEffect(() => {
    if (isEditing && id) {
      const mosque = getMosqueById(id);
      if (mosque) {
        setName(mosque.name);
        setAddress(mosque.address);
        setLat(mosque.lat.toString());
        setLng(mosque.lng.toString());
        setType(mosque.type);
        setFeatures(mosque.features);
        setFacilities(mosque.facilities || defaultFacilities);
        setAthanTimes(mosque.athanTimes);
        setIqamahTimes(mosque.iqamahTimes);
        setJummahTimes(mosque.jummahTimes.length > 0 ? mosque.jummahTimes : ['']);
        setEidTimes(mosque.eidTimes?.length ? mosque.eidTimes : ['']);
      } else {
        toast({ title: 'Mosque not found', variant: 'destructive' });
        navigate('/admin/mosques');
      }
    }
  }, [id, isEditing, getMosqueById, navigate, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !address.trim()) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    const mosqueData = {
      name: name.trim(),
      address: address.trim(),
      lat: parseFloat(lat) || 12.9716,
      lng: parseFloat(lng) || 77.5946,
      type,
      features,
      facilities: type === 'mosque' ? facilities : undefined,
      athanTimes,
      iqamahTimes,
      jummahTimes: jummahTimes.filter(t => t.trim()),
      eidTimes: eidTimes.filter(t => t.trim()),
      adminUids: ['admin1'],
    };

    if (isEditing && id) {
      updateMosque(id, mosqueData);
      toast({ title: 'Mosque updated successfully' });
    } else {
      addMosque(mosqueData);
      toast({ title: 'Mosque added successfully' });
    }

    navigate('/admin/mosques');
  };

  const updateFeature = (key: keyof PlaceFeatures, value: boolean) => {
    setFeatures(prev => ({ ...prev, [key]: value }));
  };

  const updateFacility = (key: keyof PlaceFacilities, value: boolean | string) => {
    setFacilities(prev => ({ ...prev, [key]: value }));
  };

  const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/mosques')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">
              {isEditing ? 'Edit Mosque' : 'Add New Mosque'}
            </h1>
          </div>
          <Button onClick={handleSubmit} className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="times">Times</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
            </TabsList>

            {/* Basic Info */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Jamia Masjid Shivajinagar"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g., Shivajinagar, Bangalore, Karnataka"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={type} onValueChange={(v) => setType(v as PlaceType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mosque">Mosque</SelectItem>
                        <SelectItem value="musallah">Musallah</SelectItem>
                        <SelectItem value="eidgah">Eidgah</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lat">Latitude</Label>
                      <Input
                        id="lat"
                        type="number"
                        step="any"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        placeholder="12.9716"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lng">Longitude</Label>
                      <Input
                        id="lng"
                        type="number"
                        step="any"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        placeholder="77.5946"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Prayer Times */}
            <TabsContent value="times" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Athan Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {prayers.map(prayer => (
                    <div key={`athan-${prayer}`} className="flex items-center gap-4">
                      <Label className="w-20 capitalize">{prayer}</Label>
                      <Input
                        value={athanTimes[prayer]}
                        onChange={(e) => setAthanTimes(prev => ({ ...prev, [prayer]: e.target.value }))}
                        placeholder="e.g., 5:15 AM"
                        className="flex-1"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Iqamah Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {prayers.map(prayer => (
                    <div key={`iqamah-${prayer}`} className="flex items-center gap-4">
                      <Label className="w-20 capitalize">{prayer}</Label>
                      <Input
                        value={iqamahTimes[prayer]}
                        onChange={(e) => setIqamahTimes(prev => ({ ...prev, [prayer]: e.target.value }))}
                        placeholder="e.g., 5:30 AM"
                        className="flex-1"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Special Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Jummah Times</Label>
                    {jummahTimes.map((time, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={time}
                          onChange={(e) => {
                            const newTimes = [...jummahTimes];
                            newTimes[index] = e.target.value;
                            setJummahTimes(newTimes);
                          }}
                          placeholder="e.g., 1:00 PM"
                        />
                        {index === jummahTimes.length - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setJummahTimes([...jummahTimes, ''])}
                          >
                            +
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Eid Times</Label>
                    {eidTimes.map((time, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={time}
                          onChange={(e) => {
                            const newTimes = [...eidTimes];
                            newTimes[index] = e.target.value;
                            setEidTimes(newTimes);
                          }}
                          placeholder="e.g., 7:30 AM"
                        />
                        {index === eidTimes.length - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEidTimes([...eidTimes, ''])}
                          >
                            +
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features */}
            <TabsContent value="features" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Available Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'adhan', label: 'Adhan (Call to Prayer)' },
                    { key: 'dailyCongregation', label: 'Daily Congregation' },
                    { key: 'jummah', label: 'Jummah Prayer' },
                    { key: 'taraweeh', label: 'Taraweeh (Ramadan)' },
                    { key: 'eidPrayer', label: 'Eid Prayer' },
                    { key: 'eidAdhanOnly', label: 'Eid Adhan Only' },
                    { key: 'janazah', label: 'Janazah Prayer' },
                    { key: 'khutbah', label: 'Khutbah' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={key}>{label}</Label>
                      <Switch
                        id={key}
                        checked={features[key as keyof PlaceFeatures]}
                        onCheckedChange={(v) => updateFeature(key as keyof PlaceFeatures, v)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Facilities (Mosques only) */}
            <TabsContent value="facilities" className="space-y-4 mt-4">
              {type !== 'mosque' ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    Facilities are only applicable for Mosques
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Facilities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { key: 'ablution', label: 'Ablution Area' },
                      { key: 'womensArea', label: "Women's Area" },
                      { key: 'accessibility', label: 'Wheelchair Accessible' },
                      { key: 'toilets', label: 'Toilets' },
                      { key: 'iftaar', label: 'Iftaar (Ramadan)' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={key}>{label}</Label>
                        <Switch
                          id={key}
                          checked={facilities[key as keyof PlaceFacilities] as boolean}
                          onCheckedChange={(v) => updateFacility(key as keyof PlaceFacilities, v)}
                        />
                      </div>
                    ))}

                    <div className="space-y-2">
                      <Label>Car Parking</Label>
                      <Select
                        value={facilities.carParking}
                        onValueChange={(v) => updateFacility('carParking', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="limited">Limited</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </form>
      </main>
    </div>
  );
};

export default AdminMosqueFormPage;
