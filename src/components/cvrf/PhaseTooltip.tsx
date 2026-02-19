'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PHASE_GUIDANCE } from '@/lib/onboarding-content';

interface PhaseTooltipProps {
  phaseId: number;
  children: React.ReactNode;
}

export function PhaseTooltip({ phaseId, children }: PhaseTooltipProps) {
  const guidance = PHASE_GUIDANCE[phaseId];
  if (!guidance) return <>{children}</>;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs p-3">
          <p className="font-semibold text-xs mb-1">{guidance.title}</p>
          <p className="text-xs text-muted-foreground">
            {guidance.description}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
