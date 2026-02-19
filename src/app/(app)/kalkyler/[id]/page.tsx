'use client';

import { use } from 'react';
import Link from 'next/link';
import { useCvrfAnalysis } from '@/hooks/cvrf/useCvrfAnalysis';
import { Button } from '@/components/ui/button';
import { CvrfPanel } from '@/components/cvrf/CvrfPanel';

export default function KalkylDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { analysis, isLoading } = useCvrfAnalysis(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Laddar kalkyl...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <p className="text-muted-foreground">Kalkylen hittades inte.</p>
        <Link href="/kalkyler">
          <Button variant="outline">Tillbaka till kalkyler</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/kalkyler">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            ← Alla kalkyler
          </Button>
        </Link>
      </div>

      <CvrfPanel analysisId={id} />
    </div>
  );
}
