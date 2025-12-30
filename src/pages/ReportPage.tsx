import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Flag, Clock, MapPin, XCircle, HelpCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { mockMosques } from '@/data/mockData';
import { IssueType } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const issueTypes: { key: IssueType; label: string; icon: React.ElementType; description: string }[] = [
  { 
    key: 'wrong_times', 
    label: 'Wrong Iqamah Times', 
    icon: Clock,
    description: 'Prayer times are incorrect or outdated'
  },
  { 
    key: 'wrong_location', 
    label: 'Wrong Location', 
    icon: MapPin,
    description: 'Address or map location is incorrect'
  },
  { 
    key: 'closed', 
    label: 'Mosque Closed', 
    icon: XCircle,
    description: 'Mosque is temporarily or permanently closed'
  },
  { 
    key: 'other', 
    label: 'Other Issue', 
    icon: HelpCircle,
    description: 'Any other issue not listed above'
  },
];

const ReportPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<IssueType | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mosque = mockMosques.find((m) => m.id === id);

  const handleSubmit = async () => {
    if (!selectedType) {
      toast({
        title: "Select an issue type",
        description: "Please select what kind of issue you want to report",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Report Submitted",
      description: "Thank you for helping improve Bilal. We'll review your report.",
    });
    
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-surface safe-top pb-8">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-xl z-10 border-b border-border shadow-soft">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Flag size={16} className="text-destructive" />
              </div>
              Report Issue
            </h1>
            {mosque && (
              <p className="text-xs text-muted-foreground ml-10">{mosque.name}</p>
            )}
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Issue Type Selection */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            What's wrong?
          </h2>
          <div className="space-y-3">
            {issueTypes.map(({ key, label, icon: Icon, description }) => (
              <Card 
                key={key}
                className={cn(
                  "cursor-pointer transition-all rounded-2xl border",
                  selectedType === key 
                    ? "border-primary bg-primary/5 shadow-md" 
                    : "border-border bg-card shadow-soft hover:border-primary/30"
                )}
                onClick={() => setSelectedType(key)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      selectedType === key ? "bg-primary/20" : "bg-muted"
                    )}>
                      <Icon 
                        size={20} 
                        className={selectedType === key ? "text-primary" : "text-muted-foreground"} 
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {description}
                      </p>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      selectedType === key 
                        ? "border-primary bg-primary" 
                        : "border-muted-foreground/30"
                    )}>
                      {selectedType === key && (
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Description */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Additional Details (Optional)
          </h2>
          <Textarea
            placeholder="Please provide any additional information that might help us..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="bg-card border border-border rounded-2xl resize-none shadow-soft focus:ring-2 focus:ring-primary/20"
          />
        </section>

        {/* Submit Button */}
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-md h-12 text-base font-semibold"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>Submitting...</>
          ) : (
            <>
              <Send size={18} />
              Submit Report
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Reports are reviewed by our team. Only verified mosque admins can make changes.
        </p>
      </div>
    </div>
  );
};

export default ReportPage;