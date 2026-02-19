'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CvrfAnalysis } from '@/hooks/cvrf/useCvrfAnalysis';
import { Network } from 'lucide-react';

interface CvrfStep3Props {
  analysis: CvrfAnalysis;
  onUpdate: (updates: Partial<CvrfAnalysis>) => Promise<any>;
  readOnly?: boolean;
}

export function CvrfStep3({ analysis, onUpdate, readOnly }: CvrfStep3Props) {
  const handlePrev = () => onUpdate({ current_step: 4, current_phase: 2 });
  const handleNext = () => onUpdate({ current_step: 6, current_phase: 3 });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Nyttoträd (Value Map)
          </CardTitle>
          <CardDescription className="mt-1">
            Kartlägg projektets förändringskedja: från aktiviteter via effekter till nyttor och mål.
            Dra kopplingar mellan noder för att visa samband.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Network className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nyttoträd — Value Map kommer implementeras
            </h3>
            <p className="text-muted-foreground max-w-md">
              Här kommer du kunna bygga ett visuellt nyttoträd som kopplar aktiviteter,
              effekter och nyttor till varandra. Denna funktion är under utveckling.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      {!readOnly && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrev}>
            ← Tillbaka
          </Button>
          <Button onClick={handleNext}>
            Nästa steg →
          </Button>
        </div>
      )}
    </div>
  );
}
