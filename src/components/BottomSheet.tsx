import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-card rounded-t-3xl border-t border-border",
        "shadow-2xl animate-slide-up",
        "max-h-[85vh] overflow-hidden flex flex-col"
      )}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <Button variant="ghost" size="icon-sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto px-5 py-4 safe-bottom">
          {children}
        </div>
      </div>
    </>
  );
};
