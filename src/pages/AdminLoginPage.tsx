import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAdminAuth();
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async () => {
    if (!pin.trim()) {
      toast({
        title: "PIN required",
        description: "Please enter the admin PIN",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const success = login(pin);
    
    if (success) {
      toast({
        title: "Welcome back",
        description: "You are now logged in as admin",
      });
      navigate(from, { replace: true });
    } else {
      toast({
        title: "Invalid PIN",
        description: "Please check your PIN and try again",
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
      {/* Header */}
      <header className="p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft size={22} />
        </Button>
      </header>

      <div className="px-6 pt-8 pb-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-arabic text-primary">ب</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-2">
            For verified Bangalore mosque administrators only.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Access requires approval.
          </p>
        </div>

        {/* Login Form */}
        <Card variant="elevated">
          <CardContent className="p-6 space-y-4">
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
          If you're a mosque representative and need access, 
          please contact support.
        </p>

        <p className="text-xs text-amber-500 text-center mt-4 leading-relaxed">
          Demo PIN: 1234
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
