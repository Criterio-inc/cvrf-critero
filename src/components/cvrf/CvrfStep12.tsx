'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  ArrowLeft, FileDown, Loader2, BookOpen, Plus, Trash2,
  ShieldCheck, CheckCircle2, XCircle, TrendingUp, TrendingDown,
  Users as UsersIcon, ClipboardCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useValueMapNodes } from '@/hooks/cvrf/useValueMapNodes';
import { useBenefitOwners } from '@/hooks/cvrf/useBenefitOwners';
import { useBenefitValues } from '@/hooks/cvrf/useBenefitValues';
import { useCostValues } from '@/hooks/cvrf/useCostValues';
import { useCheckpoints } from '@/hooks/cvrf/useCheckpoints';
import { useStakeholders } from '@/hooks/cvrf/useStakeholders';
import { useLessons } from '@/hooks/cvrf/useLessons';
import { CvrfAnalysis } from '@/hooks/cvrf/useCvrfAnalysis';
import { exportCvrfToPdf } from '@/lib/cvrf/cvrfPdfExport';
import { exportCvrfToExcel } from '@/lib/cvrf/cvrfExcelExport';
import { cn } from '@/lib/utils';

interface CvrfStep12Props {
  analysis: CvrfAnalysis;
  onUpdate: (updates: Partial<CvrfAnalysis>) => Promise<any>;
  readOnly?: boolean;
}

function formatSEK(n: number | null): string {
  if (n == null) return '\u2014';
  return new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 }).format(n) + ' kr';
}

function formatDate(d: string | null): string {
  if (!d) return '\u2014';
  return new Date(d).toLocaleDateString('sv-SE');
}

const LESSON_CATEGORIES = [
  { value: 'process', label: 'Process' },
  { value: 'technical', label: 'Teknisk' },
  { value: 'organizational', label: 'Organisatorisk' },
  { value: 'financial', label: 'Finansiell' },
] as const;

const IMPACT_OPTIONS = [
  { value: 'positive', label: 'Positiv' },
  { value: 'negative', label: 'Negativ' },
] as const;

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  LESSON_CATEGORIES.map((c) => [c.value, c.label])
);

const IMPACT_LABELS: Record<string, string> = Object.fromEntries(
  IMPACT_OPTIONS.map((i) => [i.value, i.label])
);

export function CvrfStep12({ analysis, onUpdate, readOnly }: CvrfStep12Props) {
  const timeHorizon = analysis.time_horizon ?? 6;
  const years = Array.from({ length: timeHorizon }, (_, i) => i + 1);

  const { benefitNodes, costNodes, isLoading: nodesLoading } = useValueMapNodes(analysis.id);
  const benefitNodeIds = useMemo(() => benefitNodes.map((n) => n.id), [benefitNodes]);
  const { owners } = useBenefitOwners(benefitNodeIds);
  const { benefitValues } = useBenefitValues(analysis.id);
  const { costValues } = useCostValues(analysis.id);
  const { checkpoints } = useCheckpoints(analysis.id);
  const { stakeholders } = useStakeholders(analysis.id);
  const { lessons, tableExists, createLesson, deleteLesson, isLoading: lessonsLoading } =
    useLessons(analysis.id);

  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: '',
    category: 'process',
    impact: 'positive',
    description: '',
    recommendation: '',
  });

  // Build yearly flows for exports
  const yearlyFlows = useMemo(() => {
    return years.map((y) => {
      const benefits = benefitNodes.reduce((sum, n) => {
        const v = benefitValues.find((bv) => bv.node_id === n.id && bv.year === y);
        return sum + Number(v?.likely ?? 0);
      }, 0);
      const costs = costNodes.reduce((sum, n) => {
        const v = costValues.find((cv) => cv.node_id === n.id && cv.year === y);
        return sum + Number(v?.amount ?? 0);
      }, 0);
      return { year: y, benefits, costs, net: benefits - costs };
    });
  }, [years, benefitNodes, costNodes, benefitValues, costValues]);

  const yearlyFlowsWithCumulative = useMemo(() => {
    let cum = 0;
    return yearlyFlows.map((f) => {
      cum += f.net;
      return { ...f, cumulative: cum };
    });
  }, [yearlyFlows]);

  const handleCreateLesson = () => {
    if (!newLesson.title.trim()) return;
    createLesson.mutate(
      {
        analysis_id: analysis.id,
        title: newLesson.title.trim(),
        category: newLesson.category,
        impact: newLesson.impact,
        description: newLesson.description.trim() || null,
        recommendation: newLesson.recommendation.trim() || null,
      },
      {
        onSuccess: () => {
          toast.success('L\u00e4rdom tillagd');
          setNewLesson({ title: '', category: 'process', impact: 'positive', description: '', recommendation: '' });
          setDialogOpen(false);
        },
        onError: () => toast.error('Kunde inte l\u00e4gga till'),
      }
    );
  };

  const handleDeleteLesson = (id: string) => {
    deleteLesson.mutate(id, {
      onSuccess: () => toast.success('L\u00e4rdom borttagen'),
      onError: () => toast.error('Kunde inte ta bort'),
    });
  };

  const getExportData = useCallback(() => ({
    analysis,
    benefitNodes,
    costNodes,
    owners,
    stakeholders,
    checkpoints,
    lessons,
    yearlyFlows: yearlyFlowsWithCumulative,
  }), [analysis, benefitNodes, costNodes, owners, stakeholders, checkpoints, lessons, yearlyFlowsWithCumulative]);

  const handleExportPdf = async () => {
    setExporting('pdf');
    try {
      await exportCvrfToPdf(getExportData());
      toast.success('PDF exporterad');
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('Kunde inte exportera PDF');
    } finally {
      setExporting(null);
    }
  };

  const handleExportExcel = async () => {
    setExporting('excel');
    try {
      await exportCvrfToExcel(getExportData());
      toast.success('Excel exporterad');
    } catch (err) {
      console.error('Excel export error:', err);
      toast.error('Kunde inte exportera Excel');
    } finally {
      setExporting(null);
    }
  };

  const handlePrev = () => onUpdate({ current_step: 11, current_phase: 5 });

  // Gate status summary
  const gates = [
    { label: 'Gate 1 \u2013 Behovsanalys', passed: analysis.gate1_passed, date: analysis.gate1_date },
    { label: 'Gate 2 \u2013 Alternativ', passed: analysis.gate2_passed, date: analysis.gate2_date },
    { label: 'Gate 3 \u2013 Kalkylgranskning', passed: analysis.gate3_passed, date: analysis.gate3_date },
    { label: 'Gate 4 \u2013 Realiseringsplan', passed: analysis.gate4_passed, date: analysis.gate4_date },
    { label: 'Gate 5 \u2013 Uppf\u00f6ljningsplan', passed: analysis.gate5_passed, date: analysis.gate5_date },
  ];

  if (nodesLoading || lessonsLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 rounded-lg bg-muted animate-pulse" />
        <div className="h-64 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lessons section */}
      {tableExists && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  L\u00e4rdomar
                  <Badge variant="secondary" className="text-xs">{lessons.length}</Badge>
                </CardTitle>
                <CardDescription>
                  Dokumentera insikter och l\u00e4rdomar fr\u00e5n nyttokalkylen.
                </CardDescription>
              </div>
              {!readOnly && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-3.5 w-3.5" />
                      L\u00e4gg till
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Ny l\u00e4rdom</DialogTitle>
                      <DialogDescription>
                        Dokumentera en insikt eller l\u00e4rdom fr\u00e5n projektet.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Titel *</label>
                        <Input
                          value={newLesson.title}
                          onChange={(e) => setNewLesson((p) => ({ ...p, title: e.target.value }))}
                          placeholder="Kort sammanfattning"
                          autoFocus
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Kategori</label>
                          <Select
                            value={newLesson.category}
                            onValueChange={(v) => setNewLesson((p) => ({ ...p, category: v }))}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {LESSON_CATEGORIES.map((c) => (
                                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">P\u00e5verkan</label>
                          <Select
                            value={newLesson.impact}
                            onValueChange={(v) => setNewLesson((p) => ({ ...p, impact: v }))}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {IMPACT_OPTIONS.map((i) => (
                                <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Beskrivning</label>
                        <Textarea
                          className="text-xs min-h-[60px]"
                          value={newLesson.description}
                          onChange={(e) => setNewLesson((p) => ({ ...p, description: e.target.value }))}
                          placeholder="Beskriv l\u00e4rdomen..."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">Rekommendation</label>
                        <Textarea
                          className="text-xs min-h-[60px]"
                          value={newLesson.recommendation}
                          onChange={(e) => setNewLesson((p) => ({ ...p, recommendation: e.target.value }))}
                          placeholder="Vad rekommenderas f\u00f6r framtiden?"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Avbryt
                      </Button>
                      <Button onClick={handleCreateLesson} disabled={!newLesson.title.trim()}>
                        L\u00e4gg till
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {lessons.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Inga l\u00e4rdomar dokumenterade \u00e4nnu.
              </p>
            ) : (
              lessons.map((l) => (
                <Card key={l.id} className="border-dashed">
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{l.title}</p>
                        {l.category && (
                          <Badge variant="outline" className="text-xs">
                            {CATEGORY_LABELS[l.category] ?? l.category}
                          </Badge>
                        )}
                        {l.impact && (
                          <Badge
                            variant={l.impact === 'positive' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {IMPACT_LABELS[l.impact] ?? l.impact}
                          </Badge>
                        )}
                      </div>
                      {!readOnly && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive h-7 w-7 p-0"
                          onClick={() => handleDeleteLesson(l.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    {l.description && (
                      <p className="text-xs text-muted-foreground">{l.description}</p>
                    )}
                    {l.recommendation && (
                      <p className="text-xs">
                        <span className="font-medium">Rekommendation:</span> {l.recommendation}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary report */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-primary" />
            Sammanfattning
          </CardTitle>
          <CardDescription>
            \u00d6versikt av nyttokalkylen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Problem & strategy */}
          {analysis.problem_description && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Problemformulering</p>
              <p className="text-sm">{analysis.problem_description}</p>
            </div>
          )}
          {analysis.strategic_alignment && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Strategisk koppling</p>
              <p className="text-sm">{analysis.strategic_alignment}</p>
            </div>
          )}

          {/* KPIs */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Nyckeltal</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">NPV</p>
                <p className={cn('text-sm font-bold', (analysis.npv ?? 0) >= 0 ? 'text-emerald-600' : 'text-destructive')}>
                  {formatSEK(analysis.npv)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">BCR</p>
                <p className="text-sm font-bold">{analysis.bcr?.toFixed(2) ?? '\u2014'}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">IRR</p>
                <p className="text-sm font-bold">
                  {analysis.irr != null ? `${(analysis.irr * 100).toFixed(1)}%` : '\u2014'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">SROI</p>
                <p className="text-sm font-bold">{analysis.sroi?.toFixed(2) ?? '\u2014'}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Payback</p>
                <p className="text-sm font-bold">
                  {analysis.payback_years != null ? `${analysis.payback_years} \u00e5r` : '\u2014'}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Statistik</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium">{benefitNodes.length}</p>
                  <p className="text-xs text-muted-foreground">Nyttor</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                <div>
                  <p className="text-sm font-medium">{costNodes.length}</p>
                  <p className="text-xs text-muted-foreground">Kostnader</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">{stakeholders.length}</p>
                  <p className="text-xs text-muted-foreground">Intressenter</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">{checkpoints.length}</p>
                  <p className="text-xs text-muted-foreground">Kontrollpunkter</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gate status */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Gate-status</p>
            <div className="space-y-2">
              {gates.map((g) => (
                <div key={g.label} className="flex items-center gap-2">
                  {g.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                  )}
                  <span className={cn(
                    'text-sm',
                    g.passed ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {g.label}
                  </span>
                  {g.passed && g.date && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatDate(g.date)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileDown className="h-4 w-4 text-primary" />
            Exportera
          </CardTitle>
          <CardDescription>
            Ladda ner hela nyttokalkylen som PDF eller Excel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleExportPdf} disabled={exporting != null} className="gap-2">
              {exporting === 'pdf' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4" />
              )}
              Exportera som PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleExportExcel}
              disabled={exporting != null}
              className="gap-2"
            >
              {exporting === 'excel' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4" />
              )}
              Exportera som Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      {!readOnly && (
        <div className="flex justify-start">
          <Button variant="outline" onClick={handlePrev} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Tillbaka
          </Button>
        </div>
      )}
    </div>
  );
}
