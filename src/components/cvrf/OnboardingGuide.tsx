'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { STEP_GUIDANCE } from '@/lib/onboarding-content';

interface OnboardingGuideProps {
  step: number;
}

export function OnboardingGuide({ step }: OnboardingGuideProps) {
  const [visible, setVisible] = useState(false);
  const storageKey = `cvrf-onboarding-seen-step-${step}`;

  useEffect(() => {
    const seen = localStorage.getItem(storageKey);
    if (!seen) {
      setVisible(true);
    }
  }, [storageKey]);

  const handleDismiss = () => {
    setVisible(false);
  };

  const handleDismissForever = () => {
    localStorage.setItem(storageKey, 'true');
    setVisible(false);
  };

  const guidance = STEP_GUIDANCE[step];
  if (!guidance || !visible) return null;

  return (
    <Card className="border-primary/20 bg-primary/5 animate-in fade-in duration-300 mb-4">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5 rounded-full bg-primary/10 p-2">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-sm">{guidance.title}</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 text-muted-foreground"
                onClick={handleDismiss}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {guidance.description}
            </p>
            <ul className="space-y-1">
              {guidance.tips.map((tip, i) => (
                <li
                  key={i}
                  className="text-xs text-muted-foreground flex items-start gap-2"
                >
                  <span className="shrink-0 mt-1 h-1 w-1 rounded-full bg-primary" />
                  {tip}
                </li>
              ))}
            </ul>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground h-7 px-2"
              onClick={handleDismissForever}
            >
              Visa inte igen
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
