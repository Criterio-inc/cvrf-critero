'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { CvrfAnalysis } from '@/hooks/cvrf/useCvrfAnalysis';
import { Ban } from 'lucide-react';

interface CvrfStep4Props {
  analysis: CvrfAnalysis;
  onUpdate: (updates: Partial<CvrfAnalysis>) => Promise<any>;
  readOnly?: boolean;
}

export function CvrfStep4({ analysis, onUpdate, readOnly }: CvrfStep4Props) {
  const [nullAlt, setNullAlt] = useState(analysis.null_alternative ?? '');
  const [isSaving, setIsSaving] = useState(false);

  // Sync from server when analysis changes
  useEffect(() => {
    setNullAlt(analysis.null_alternative ?? '');
  }, [analysis.null_alternative]);

  const handleSave = async () => {
    if (nullAlt.trim() === (analysis.null_alternative ?? '').trim()) return;
    setIsSaving(true);
    try {
      await onUpdate({ null_alternative: nullAlt.trim() || null });
      toast.success('Nollalternativ sparat');
    } catch {
      toast.error('Kunde inte spara');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrev = () => onUpdate({ current_step: 3, current_phase: 2 });
  const handleNext = async () => {
    // Save before navigating
    if (nullAlt.trim() !== (analysis.null_alternative ?? '').trim()) {
      await onUpdate({ null_alternative: nullAlt.trim() || null });
    }
    onUpdate({ current_step: 5, current_phase: 2 });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Ban className="h-4 w-4 text-muted-foreground" />
            Nollalternativ
          </CardTitle>
          <CardDescription>
            Beskriv vad som händer om projektet inte genomförs. Nollalternativet är
            referenspunkten som projektets nyttor och kostnader jämförs mot.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <span className="font-medium">Tips:</span> Ett bra nollalternativ beskriver nulagen och hur det förväntas utvecklas utan
              förändring -- inklusive risker, ökande kostnader och missade möjligheter.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Vad händer om vi inte genomför projektet?
            </label>
            <Textarea
              value={nullAlt}
              onChange={(e) => setNullAlt(e.target.value)}
              onBlur={handleSave}
              disabled={readOnly}
              placeholder={'Beskriv nuläget och den förväntade utvecklingen utan projektet. Tänk på:\n• Vilka problem kvarstår eller förvärras?\n• Vilka kostnader uppstår av att inte agera?\n• Finns det regulatoriska krav som inte uppfylls?\n• Hur påverkas medarbetare, brukare och verksamheten?'}
              className="min-h-[200px]"
            />
            <p className="text-xs text-muted-foreground">
              {nullAlt.length > 0 ? `${nullAlt.length} tecken` : 'Inga tecken ännu'}
              {isSaving && ' · Sparar...'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Guiding questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reflektionsfrågor</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="shrink-0">1.</span>
              <span>Vilka risker och kostnader uppstår om inget förändras?</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0">2.</span>
              <span>Finns det lagar, regler eller avtal som driver behovet av förändring?</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0">3.</span>
              <span>Hur påverkas intressenterna om nuläget kvarstår?</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0">4.</span>
              <span>Kommer befintliga system eller processer att bli dyrare att underhålla?</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0">5.</span>
              <span>Finns det alternativa lösningar som inte kräver ett helt projekt?</span>
            </li>
          </ul>
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
