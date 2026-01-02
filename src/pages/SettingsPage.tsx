import React from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Heart, Bell, Info, HelpCircle, 
  LogIn, ChevronRight, Shield, Moon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const settingsGroups = [
  {
    title: 'Account',
    items: [
      { 
        icon: LogIn, 
        label: 'Admin Login', 
        description: 'For mosque admins only',
        path: '/admin/login',
        chevron: true
      },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { 
        icon: Heart, 
        label: 'Favorite Mosques', 
        description: 'Manage your favorite mosques',
        path: '/favorites',
        chevron: true
      },
      { 
        icon: Bell, 
        label: 'Notifications', 
        description: 'You control which updates you receive from Bangalore mosques.',
        toggle: true,
        enabled: true
      },
      { 
        icon: Moon, 
        label: 'Dark Mode', 
        description: 'Coming soon',
        toggle: true,
        enabled: false,
        disabled: true
      },
    ],
  },
  {
    title: 'About',
    items: [
      { 
        icon: Info, 
        label: 'About Bilal', 
        description: 'Learn more about this app',
        path: '/about',
        chevron: true
      },
      { 
        icon: HelpCircle, 
        label: 'Help & Support', 
        description: 'Get help or report bugs',
        path: '/support',
        chevron: true
      },
      { 
        icon: Shield, 
        label: 'Privacy Policy', 
        description: 'How we handle your data',
        path: '/privacy',
        chevron: true
      },
    ],
  },
];

const SettingsPage: React.FC = () => {
  return (
    <MobileLayout>
      <div className="safe-top pb-8 bg-surface min-h-screen">
        {/* Header */}
        <header className="px-4 pt-5 pb-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customize your Bilal experience
          </p>
        </header>

        <div className="px-4 space-y-6">
          {settingsGroups.map((group) => (
            <section key={group.title}>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                {group.title}
              </h2>
              <Card className="bg-card border border-border rounded-3xl shadow-soft overflow-hidden">
                <CardContent className="p-0 divide-y divide-border">
                  {group.items.map((item, index) => {
                    const Icon = item.icon;
                    const content = (
                      <div className={cn(
                        "flex items-center gap-4 p-4 transition-colors",
                        item.path && "hover:bg-muted/50 active:bg-muted cursor-pointer"
                      )}>
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon size={20} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.description}
                          </p>
                        </div>
                        {item.toggle && (
                          <Switch 
                            checked={item.enabled} 
                            disabled={item.disabled}
                          />
                        )}
                        {item.chevron && (
                          <ChevronRight size={18} className="text-muted-foreground" />
                        )}
                      </div>
                    );

                    return item.path ? (
                      <Link key={index} to={item.path}>
                        {content}
                      </Link>
                    ) : (
                      <div key={index}>{content}</div>
                    );
                  })}
                </CardContent>
              </Card>
            </section>
          ))}

          {/* Support Section */}
          <section className="pt-4">
            <Card className="bg-gradient-to-br from-primary/5 to-cyan/5 border border-primary/10 rounded-3xl shadow-soft text-center p-6">
              <p className="font-arabic text-2xl text-primary mb-2">بِلَال</p>
              <p className="text-sm text-muted-foreground mb-4">
                Helping Muslims find their next jama'ah
              </p>
              <Button variant="outline" className="rounded-full border-primary/30 text-primary hover:bg-primary/5">
                Support Bilal
              </Button>
              <p className="text-[10px] text-muted-foreground/70 mt-3">
                Bilal is free to use. Donations help cover basic operational costs.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Version 1.0.0 · Preview
              </p>
            </Card>
          </section>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SettingsPage;