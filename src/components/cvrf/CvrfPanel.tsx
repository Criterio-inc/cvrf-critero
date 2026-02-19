'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCvrfAnalysis, type CvrfAnalysis } from '@/hooks/cvrf/useCvrfAnalysis';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { CvrfStep1 } from './CvrfStep1';
import { CvrfStep2 } from './CvrfStep2';
import { CvrfStep3 } from './CvrfStep3';
import { CvrfStep4 } from './CvrfStep4';
import { CvrfStep5 } from './CvrfStep5';
import { CvrfStep6 } from './CvrfStep6';
import { CvrfStep7 } from './CvrfStep7';
import { CvrfStep8 } from './CvrfStep8';
import { CvrfStep9 } from './CvrfStep9';
import { CvrfStep10 } from './CvrfStep10';
import { CvrfStep11 } from './CvrfStep11';
import { CvrfStep12 } from './CvrfStep12';
import { OnboardingGuide } from './OnboardingGuide';
import { PhaseTooltip } from './PhaseTooltip';

interface CvrfPanelProps {
  analysisId: string;
  readOnly?: boolean;
}

const PHASES = [
  { id: 1, name: 'FÖRSTÅ', steps: [1, 2] },
  { id: 2, name: 'KARTLÄGGA', steps: [3, 4, 5] },
  { id: 3, name: 'BERÄKNA', steps: [6, 7, 8] },
  { id: 4, name: 'REALISERA', steps: [9, 10] },
  { id: 5, name: 'LÄRA', steps: [11, 12] },
];

const STEP_LABELS: Record<number, string> = {
  1: 'Behovsanalys & Mål',
  2: 'Strategisk koppling',
  3: 'Intressentanalys',
  4: 'Nollalternativ',
  5: 'Nyttoträd',
  6: 'Kostnader',
  7: 'Nyttor & värden',
  8: 'Kalkyl & känslighet',
  9: 'Realiseringsplan',
  10: 'Uppföljningspunkter',
  11: 'Effektmätning',
  12: 'Lärdomar & rapport',
};

export function CvrfPanel({ analysisId, readOnly }: CvrfPanelProps) {
  const { analysis, isLoading, updateAnalysis } = useCvrfAnalysis(analysisId);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const handleUpdate = async (updates: Partial<CvrfAnalysis>) => {
    const result = await updateAnalysis.mutateAsync(updates);
    if (updates.current_step != null) {
      setSelectedStep(updates.current_step);
    }
    return result;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 rounded-lg bg-muted animate-pulse" />
        <div className="h-64 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <h3 className="text-lg font-semibold mb-2">Kalkylen hittades inte</h3>
          <p className="text-muted-foreground">
            Kontrollera att du har åtkomst till denna nyttokalkyl.
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentStep = analysis.current_step ?? 1;
  const currentPhase = analysis.current_phase ?? 1;
  const activeView = selectedStep ?? currentStep;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {analysis.title}
              </CardTitle>
              <CardDescription className="mt-1">
                Steg {currentStep} av 12 &middot;{' '}
                <Badge variant="outline" className="ml-1">
                  {analysis.status === 'draft' ? 'Utkast' : analysis.status === 'active' ? 'Aktiv' : analysis.status === 'completed' ? 'Klar' : analysis.status}
                </Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Stepper sidebar */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Framsteg</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {PHASES.map((phase) => {
              const isActivePhase = phase.id === currentPhase;
              const isCompletedPhase = phase.id < currentPhase;

              return (
                <div key={phase.id}>
                  <PhaseTooltip phaseId={phase.id}>
                    <div className="flex items-center gap-2 mb-3 cursor-help">
                      <Badge
                        variant={isCompletedPhase ? 'default' : isActivePhase ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        Fas {phase.id}
                      </Badge>
                      <span className={cn(
                        'text-sm font-semibold tracking-wide',
                        isCompletedPhase && 'text-primary',
                        isActivePhase && 'text-foreground',
                        !isCompletedPhase && !isActivePhase && 'text-muted-foreground'
                      )}>
                        {phase.name}
                      </span>
                    </div>
                  </PhaseTooltip>

                  <div className="ml-4 space-y-1">
                    {phase.steps.map((step) => {
                      const isCompleted = step < currentStep;
                      const isCurrent = step === currentStep;
                      const isSelected = step === activeView;
                      const isClickable = step <= currentStep;

                      return (
                        <button
                          key={step}
                          type="button"
                          disabled={!isClickable}
                          onClick={() => setSelectedStep(step)}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors w-full text-left',
                            isSelected && 'bg-primary/10 border border-primary/20',
                            !isSelected && isCurrent && 'bg-muted/50',
                            isCompleted && !isSelected && 'text-muted-foreground hover:bg-muted/50',
                            !isCurrent && !isCompleted && 'text-muted-foreground/60 cursor-not-allowed',
                            isClickable && !isSelected && 'cursor-pointer'
                          )}
                        >
                          {isCompleted ? (
                            <Check className="h-4 w-4 shrink-0 text-primary" />
                          ) : isCurrent ? (
                            <span className="h-4 w-4 shrink-0 rounded-full bg-primary block" />
                          ) : (
                            <span className="h-4 w-4 shrink-0 rounded-full border-2 border-muted-foreground/30 block" />
                          )}
                          <span className={cn(
                            (isCurrent || isSelected) && 'font-medium text-foreground'
                          )}>
                            {step}. {STEP_LABELS[step]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Step content */}
        <div>
          <OnboardingGuide step={activeView} />
          <StepContent
            step={activeView}
            analysis={analysis}
            onUpdate={handleUpdate}
            readOnly={readOnly}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Step content router ── */

function StepContent({
  step,
  analysis,
  onUpdate,
  readOnly,
}: {
  step: number;
  analysis: CvrfAnalysis;
  onUpdate: (updates: Partial<CvrfAnalysis>) => Promise<any>;
  readOnly?: boolean;
}) {
  const props = { analysis, onUpdate, readOnly };

  switch (step) {
    case 1:  return <CvrfStep1  {...props} />;
    case 2:  return <CvrfStep2  {...props} />;
    case 3:  return <CvrfStep3  {...props} />;
    case 4:  return <CvrfStep4  {...props} />;
    case 5:  return <CvrfStep5  {...props} />;
    case 6:  return <CvrfStep6  {...props} />;
    case 7:  return <CvrfStep7  {...props} />;
    case 8:  return <CvrfStep8  {...props} />;
    case 9:  return <CvrfStep9  {...props} />;
    case 10: return <CvrfStep10 {...props} />;
    case 11: return <CvrfStep11 {...props} />;
    case 12: return <CvrfStep12 {...props} />;
    default:
      return (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Ok\u00e4nt steg: {step}
          </CardContent>
        </Card>
      );
  }
}
