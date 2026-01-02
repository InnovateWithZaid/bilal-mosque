import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Lock, LogIn, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useMosqueData } from '@/contexts/MosqueDataContext';

const MosqueAdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { loginMosqueAdmin, isAuthenticated, role } = useAdminAuth();
  const { mosques } = useMosqueData();
  const [selectedMosqueId, setSelectedMosqueId] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/mosque-admin/dashboard';

  useEffect(() => {
    if (isAuthenticated && role === 'mosque_admin') {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, role, navigate, from]);

  const handleLogin = async () => {
    if (!selectedMosqueId) {
      toast({
        title: "Mosque required",
        description: "Please select your mosque",
        variant: "destructive",
      });
      return;
    }

    if (!pin.trim()) {
      toast({
        title: "PIN required",
        description: "Please enter your admin PIN",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const success = loginMosqueAdmin(selectedMosqueId, pin);
    
    if (success) {
      toast({
        title: "Welcome back",
        description: "You are now logged in as mosque admin",
      });
      navigate(from, { replace: true });
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please check your mosque selection and PIN",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-background safe-top">
      <header className="p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft size={22} />
        </Button>
      </header>

      <div className="px-6 pt-8 pb-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
            <Building2 size={36} className="text-secondary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Mosque Admin</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your mosque's prayer times and announcements.
          </p>
        </div>

        <Card variant="elevated">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Select Your Mosque
              </label>
              <Select value={selectedMosqueId} onValueChange={setSelectedMosqueId}>
                <SelectTrigger className="bg-muted border-0">
                  <SelectValue placeholder="Choose your mosque" />
                </SelectTrigger>
                <SelectContent>
                  {mosques.filter(m => m.type === 'mosque').map((mosque) => (
                    <SelectItem key={mosque.id} value={mosque.id}>
                      {mosque.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Admin PIN
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 bg-muted border-0 text-center tracking-widest"
                  maxLength={10}
                />
              </div>
            </div>

            <Button 
              variant="gold" 
              size="lg" 
              className="w-full"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : (
                <>
                  <LogIn size={18} />
                  Login
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
          Only verified mosque administrators can access this area.
        </p>

        <p className="text-xs text-amber-500 text-center mt-4 leading-relaxed">
          Demo PIN: 1234
        </p>
      </div>
    </div>
  );
};

export default MosqueAdminLoginPage;
