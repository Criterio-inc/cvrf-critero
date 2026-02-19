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
            Nyttotrad (Value Map)
          </CardTitle>
          <CardDescription className="mt-1">
            Kartlagg projektets forandringskedja: fran aktiviteter via effekter till nyttor och mal.
            Dra kopplingar mellan noder for att visa samband.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Network className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nyttotrad -- Value Map kommer implementeras
            </h3>
            <p className="text-muted-foreground max-w-md">
              Har kommer du kunna bygga ett visuellt nyttotrad som kopplar aktiviteter,
              effekter och nyttor till varandra. Denna funktion ar under utveckling.
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
            Nasta steg →
          </Button>
        </div>
      )}
    </div>
  );
}
