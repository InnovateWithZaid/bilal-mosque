import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Edit, Trash2, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useMosqueData } from '@/contexts/MosqueDataContext';
import { useToast } from '@/hooks/use-toast';

const AdminMosquesPage: React.FC = () => {
  const navigate = useNavigate();
  const { mosques, deleteMosque } = useMosqueData();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMosques = mosques.filter(mosque =>
    mosque.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mosque.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    deleteMosque(id);
    toast({
      title: 'Mosque deleted',
      description: `${name} has been removed from the system.`,
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mosque':
        return 'bg-primary/10 text-primary';
      case 'musallah':
        return 'bg-secondary/50 text-secondary-foreground';
      case 'eidgah':
        return 'bg-accent/50 text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Manage Mosques</h1>
          </div>
          <Button onClick={() => navigate('/admin/mosques/add')} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Mosque
          </Button>
        </div>
      </header>

      <main className="p-4 space-y-4 max-w-4xl mx-auto">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mosques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-primary">{mosques.filter(m => m.type === 'mosque').length}</p>
              <p className="text-xs text-muted-foreground">Mosques</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{mosques.filter(m => m.type === 'musallah').length}</p>
              <p className="text-xs text-muted-foreground">Musallahs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">{mosques.filter(m => m.type === 'eidgah').length}</p>
              <p className="text-xs text-muted-foreground">Eidgahs</p>
            </CardContent>
          </Card>
        </div>

        {/* Mosque List */}
        <div className="space-y-3">
          {filteredMosques.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No mosques found</p>
              </CardContent>
            </Card>
          ) : (
            filteredMosques.map(mosque => (
              <Card key={mosque.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{mosque.name}</h3>
                        <Badge variant="secondary" className={getTypeColor(mosque.type)}>
                          {mosque.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{mosque.address}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Updated: {new Date(mosque.lastUpdatedAt).toLocaleDateString()}
                        </span>
                        {mosque.features.jummah && (
                          <Badge variant="outline" className="text-xs">Jummah</Badge>
                        )}
                        {mosque.features.eidPrayer && (
                          <Badge variant="outline" className="text-xs">Eid</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/mosques/edit/${mosque.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Mosque</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{mosque.name}"? This action cannot be undone and will also delete all associated announcements.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(mosque.id, mosque.name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminMosquesPage;
