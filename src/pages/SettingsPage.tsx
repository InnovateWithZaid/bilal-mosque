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
        label: 'Followed Mosques', 
        description: 'Manage your followed mosques',
        path: '/settings/followed',
        chevron: true
      },
      { 
        icon: Bell, 
        label: 'Notifications', 
        description: 'Iqamah reminders, announcements',
        toggle: true,
        enabled: true
      },
      { 
        icon: Moon, 
        label: 'Dark Mode', 
        description: 'Always enabled',
        toggle: true,
        enabled: true,
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
      <div className="safe-top pb-8">
        {/* Header */}
        <header className="px-4 pt-4 pb-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customize your Bilal experience
          </p>
        </header>

        <div className="px-4 space-y-6">
          {settingsGroups.map((group) => (
            <section key={group.title}>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {group.title}
              </h2>
              <Card variant="elevated">
                <CardContent className="p-0 divide-y divide-border">
                  {group.items.map((item, index) => {
                    const Icon = item.icon;
                    const content = (
                      <div className={cn(
                        "flex items-center gap-4 p-4 transition-colors",
                        item.path && "hover:bg-muted/50 active:bg-muted cursor-pointer"
                      )}>
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon size={20} className="text-muted-foreground" />
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
            <Card variant="glass" className="text-center p-6">
              <p className="font-arabic text-2xl text-primary mb-2">بِلَال</p>
              <p className="text-sm text-muted-foreground mb-4">
                Helping Muslims find their next jama'ah
              </p>
              <Button variant="outline" className="rounded-full">
                ❤️ Support Bilal
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Version 1.0.0
              </p>
            </Card>
          </section>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SettingsPage;
