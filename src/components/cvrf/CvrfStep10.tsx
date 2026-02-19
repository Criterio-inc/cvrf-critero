'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, ArrowRight, ShieldCheck, CalendarPlus, Trash2,
  ClipboardCheck, BarChart3, CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useValueMapNodes } from '@/hooks/cvrf/useValueMapNodes';
import { useBenefitOwners } from '@/hooks/cvrf/useBenefitOwners';
import { useCheckpoints, type CheckpointUpdate } from '@/hooks/cvrf/useCheckpoints';
import { CvrfAnalysis } from '@/hooks/cvrf/useCvrfAnalysis';
import { cn } from '@/lib/utils';

interface CvrfStep10Props {
  analysis: CvrfAnalysis;
  onUpdate: (updates: Partial<CvrfAnalysis>) => Promise<any>;
  readOnly?: boolean;
}

const CHECKPOINT_TYPES = [
  { value: 'quarterly', label: 'Kvartalsvis' },
  { value: 'biannual', label: 'Halv\u00e5rskontroll' },
  { value: 'annual', label: '\u00c5rskontroll' },
] as const;

const CHECKPOINT_STATUSES = [
  { value: 'planned', label: 'Planerad', color: 'text-muted-foreground' },
  { value: 'in_progress', label: 'P\u00e5g\u00e5r', color: 'text-amber-600 dark:text-amber-400' },
  { value: 'completed', label: 'Genomf\u00f6rd', color: 'text-emerald-600 dark:text-emerald-400' },
  { value: 'overdue', label: 'F\u00f6rsenad', color: 'text-red-600 dark:text-red-400' },
] as const;

const FREQUENCY_LABELS: Record<string, string> = {
  monthly: 'M\u00e5natlig',
  quarterly: 'Kvartalsvis',
  biannual: 'Halv\u00e5rsvis',
  annual: '\u00c5rlig',
};

function typeLabel(v: string | null): string {
  return CHECKPOINT_TYPES.find((t) => t.value === v)?.label ?? v ?? '\u2014';
}

function statusItem(v: string | null) {
  return CHECKPOINT_STATUSES.find((s) => s.value === v) ?? CHECKPOINT_STATUSES[0];
}

export function CvrfStep10({ analysis, onUpdate, readOnly }: CvrfStep10Props) {
  const { benefitNodes, isLoading: nodesLoading } = useValueMapNodes(analysis.id);
  const benefitNodeIds = useMemo(() => benefitNodes.map((n) => n.id), [benefitNodes]);
  const { owners, getOwnerForNode } = useBenefitOwners(benefitNodeIds);
  const { checkpoints, createCheckpoint, updateCheckpoint, deleteCheckpoint, isLoading: cpLoading } =
    useCheckpoints(analysis.id);
  const { user } = useAuth();

  // Dialog state for new checkpoint
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState('quarterly');

  // Local edits for debounced auto-save on checkpoint text fields
  const [localEdits, setLocalEdits] = useState<Record<string, Record<string, string>>>({});

  // Debounced save for checkpoint fields
  useEffect(() => {
    const editsToSave = Object.entries(localEdits);
    if (editsToSave.length === 0) return;

    const timer = setTimeout(() => {
      editsToSave.forEach(([cpId, fields]) => {
        const updates: CheckpointUpdate & { id: string } = { id: cpId };
        for (const [field, value] of Object.entries(fields)) {
          if (field === 'overall_realization_percent') {
            (updates as any)[field] = value === '' ? null : Math.min(100, Math.max(0, parseInt(value) || 0));
          } else {
            (updates as any)[field] = value || null;
          }
        }
        updateCheckpoint.mutate(updates);
      });
      setLocalEdits({});
    }, 800);
    return () => clearTimeout(timer);
  }, [localEdits, updateCheckpoint]);

  const handleCpFieldChange = (cpId: string, field: string, value: string) => {
    setLocalEdits((prev) => ({
      ...prev,
      [cpId]: { ...(prev[cpId] ?? {}), [field]: value },
    }));
  };

  const getCpFieldValue = (cpId: string, field: string, serverValue: string | number | null): string => {
    const localVal = localEdits[cpId]?.[field];
    if (localVal !== undefined) return localVal;
    if (serverValue == null) return '';
    return String(serverValue);
  };

  const handleCreateCheckpoint = () => {
    if (!newDate) return;
    createCheckpoint.mutate(
      { analysis_id: analysis.id, checkpoint_date: newDate, checkpoint_type: newType, status: 'planned' },
      {
        onSuccess: () => {
          toast.success('Kontrollpunkt skapad');
          setNewDate('');
          setNewType('quarterly');
          setDialogOpen(false);
        },
        onError: () => toast.error('Kunde inte skapa'),
      }
    );
  };

  const handleStatusChange = (cpId: string, status: string) => {
    updateCheckpoint.mutate({ id: cpId, status });
  };

  const handleMarkCompleted = (cpId: string) => {
    updateCheckpoint.mutate(
      {
        id: cpId,
        status: 'completed',
        completed_at: new Date().toISOString(),
        completed_by: user?.id ?? null,
      },
      {
        onSuccess: () => toast.success('Kontrollpunkt genomf\u00f6rd'),
      }
    );
  };

  const handleDeleteCheckpoint = (cpId: string) => {
    deleteCheckpoint.mutate(cpId, {
      onSuccess: () => toast.success('Kontrollpunkt borttagen'),
      onError: () => toast.error('Kunde inte ta bort'),
    });
  };

  const handleGate5 = async (checked: boolean) => {
    await onUpdate({
      gate5_passed: checked,
      gate5_date: checked ? new Date().toISOString() : null,
    });
    if (checked) {
      toast.success('Gate 5 godk\u00e4nd');
    } else {
      toast.error('Gate 5 upph\u00e4vd');
    }
  };

  const handlePrev = () => onUpdate({ current_step: 9, current_phase: 4 });
  const handleNext = () => onUpdate({ current_step: 11, current_phase: 5 });

  // Benefits with owners
  const benefitsWithOwners = useMemo(
    () =>
      benefitNodes
        .map((n) => ({ node: n, owner: getOwnerForNode(n.id) }))
        .filter((b) => b.owner != null),
    [benefitNodes, getOwnerForNode]
  );

  // Active checkpoints for deviation analysis
  const activeCheckpoints = checkpoints.filter(
    (cp) => cp.status === 'completed' || cp.status === 'in_progress'
  );

  if (nodesLoading || cpLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 rounded-lg bg-muted animate-pulse" />
        <div className="h-64 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section 1: Schedule checkpoints */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarPlus className="h-4 w-4 text-primary" />
                Kontrollpunkter
                <Badge variant="secondary" className="text-xs">{checkpoints.length}</Badge>
              </CardTitle>
              <CardDescription>
                Schemal\u00e4gg kontrollpunkter f\u00f6r uppf\u00f6ljning av nyttorealisering.
              </CardDescription>
            </div>
            {!readOnly && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <CalendarPlus className="h-3.5 w-3.5" />
                    L\u00e4gg till
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ny kontrollpunkt</DialogTitle>
                    <DialogDescription>
                      Ange datum och typ f\u00f6r uppf\u00f6ljningspunkten.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-2">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Datum *</label>
                      <Input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Typ</label>
                      <Select value={newType} onValueChange={setNewType}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CHECKPOINT_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Avbryt
                    </Button>
                    <Button onClick={handleCreateCheckpoint} disabled={!newDate}>
                      Skapa
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {checkpoints.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Inga kontrollpunkter schemalagda \u00e4nnu.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Datum</TableHead>
                    <TableHead className="min-w-[120px]">Typ</TableHead>
                    <TableHead className="min-w-[130px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Realisering</TableHead>
                    <TableHead className="w-[80px]">\u00c5tg\u00e4rder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkpoints.map((cp) => {
                    const si = statusItem(cp.status);
                    return (
                      <TableRow key={cp.id}>
                        <TableCell className="text-sm">
                          {new Date(cp.checkpoint_date).toLocaleDateString('sv-SE')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {typeLabel(cp.checkpoint_type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {readOnly ? (
                            <span className={cn('text-sm font-medium', si.color)}>{si.label}</span>
                          ) : (
                            <Select
                              value={cp.status ?? 'planned'}
                              onValueChange={(v) => handleStatusChange(cp.id, v)}
                            >
                              <SelectTrigger className="h-8 text-xs w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CHECKPOINT_STATUSES.map((s) => (
                                  <SelectItem key={s.value} value={s.value}>
                                    <span className={s.color}>{s.label}</span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                        <TableCell>
                          {cp.status === 'completed' ? (
                            <div className="flex items-center gap-2">
                              <Progress
                                value={cp.overall_realization_percent ?? 0}
                                className="h-2 w-16"
                              />
                              <span className="text-xs font-medium">
                                {cp.overall_realization_percent ?? 0}%
                              </span>
                            </div>
                          ) : (
                            <Input
                              type="number"
                              className="h-8 text-xs w-20"
                              value={getCpFieldValue(cp.id, 'overall_realization_percent', cp.overall_realization_percent)}
                              onChange={(e) =>
                                handleCpFieldChange(cp.id, 'overall_realization_percent', e.target.value)
                              }
                              disabled={readOnly}
                              placeholder="0"
                              min={0}
                              max={100}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {!readOnly && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive h-7 w-7 p-0"
                              onClick={() => handleDeleteCheckpoint(cp.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Measurement points per benefit */}
      {benefitsWithOwners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              M\u00e4tpunkter per nytta
              <Badge variant="secondary" className="text-xs">{benefitsWithOwners.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {benefitsWithOwners.map(({ node, owner }) => {
              if (!owner) return null;
              const baseline = owner.baseline_value ?? 0;
              const target = owner.target_value ?? 0;
              const range = target - baseline;
              // Use latest completed checkpoint's percent as proxy
              const latestCompleted = [...checkpoints]
                .filter((cp) => cp.status === 'completed')
                .sort((a, b) => b.checkpoint_date.localeCompare(a.checkpoint_date))[0];
              const realizedPct = latestCompleted?.overall_realization_percent ?? null;

              return (
                <Card key={node.id} className="border-dashed">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{node.title}</p>
                      <Badge variant="secondary" className="text-xs">
                        {owner.owner_name}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Basv\u00e4rde</p>
                        <p className="text-sm font-medium">
                          {baseline !== 0 ? `${new Intl.NumberFormat('sv-SE').format(baseline)} kr` : '\u2014'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">M\u00e5lv\u00e4rde</p>
                        <p className="text-sm font-medium">
                          {target !== 0 ? `${new Intl.NumberFormat('sv-SE').format(target)} kr` : '\u2014'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">KPI</p>
                        <p className="text-sm truncate">{owner.kpi_description ?? '\u2014'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">M\u00e4tfrekvens</p>
                        <p className="text-sm">
                          {owner.measurement_frequency
                            ? FREQUENCY_LABELS[owner.measurement_frequency] ?? owner.measurement_frequency
                            : '\u2014'}
                        </p>
                      </div>
                    </div>
                    {range > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Realisering</span>
                          <span>
                            {realizedPct != null ? `${realizedPct}%` : 'Ingen m\u00e4tning \u00e4nnu'}
                          </span>
                        </div>
                        <Progress value={realizedPct ?? 0} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Section 3: Deviation analysis */}
      {activeCheckpoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              Avvikelseanalys
            </CardTitle>
            <CardDescription>
              Dokumentera iakttagelser och korrigerande \u00e5tg\u00e4rder f\u00f6r genomf\u00f6rda kontrollpunkter.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeCheckpoints.map((cp) => (
              <Card key={cp.id} className="border-dashed">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {new Date(cp.checkpoint_date).toLocaleDateString('sv-SE')}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {typeLabel(cp.checkpoint_type)}
                      </Badge>
                      <Badge
                        variant={cp.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {statusItem(cp.status).label}
                      </Badge>
                    </div>
                    {cp.status !== 'completed' && !readOnly && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleMarkCompleted(cp.id)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Markera genomf\u00f6rd
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Iakttagelser</label>
                      <Textarea
                        className="text-xs min-h-[80px]"
                        value={getCpFieldValue(cp.id, 'findings', cp.findings)}
                        onChange={(e) => handleCpFieldChange(cp.id, 'findings', e.target.value)}
                        disabled={readOnly}
                        placeholder="Vad har observerats vid denna kontrollpunkt?"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Korrigerande \u00e5tg\u00e4rder</label>
                      <Textarea
                        className="text-xs min-h-[80px]"
                        value={getCpFieldValue(cp.id, 'corrective_actions', cp.corrective_actions)}
                        onChange={(e) => handleCpFieldChange(cp.id, 'corrective_actions', e.target.value)}
                        disabled={readOnly}
                        placeholder="Vilka \u00e5tg\u00e4rder beh\u00f6ver vidtas?"
                      />
                    </div>
                  </div>
                  {cp.completed_at && (
                    <p className="text-xs text-muted-foreground">
                      Genomf\u00f6rd: {new Date(cp.completed_at).toLocaleDateString('sv-SE')}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Section 4: Gate 5 */}
      <Card
        className={cn(
          'border-2 transition-colors',
          analysis.gate5_passed ? 'border-status-green/50 bg-status-green/5' : 'border-dashed'
        )}
      >
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Gate 5 \u2013 Uppf\u00f6ljningsplan godk\u00e4nd
          </CardTitle>
          <CardDescription>
            Bekr\u00e4fta att uppf\u00f6ljningsplanen \u00e4r komplett och kontrollpunkter \u00e4r schemalagda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <Checkbox
              id="gate5"
              checked={analysis.gate5_passed ?? false}
              onCheckedChange={(checked) => handleGate5(!!checked)}
              disabled={readOnly}
            />
            <label htmlFor="gate5" className="text-sm leading-relaxed cursor-pointer">
              Uppf\u00f6ljningsplanen \u00e4r komplett. Kontrollpunkter \u00e4r schemalagda och
              m\u00e4tpunkter \u00e4r definierade f\u00f6r alla nyttor med ansvariga.
            </label>
          </div>
          {analysis.gate5_passed && analysis.gate5_date && (
            <p className="text-xs text-muted-foreground mt-3">
              Godk\u00e4nd: {new Date(analysis.gate5_date).toLocaleDateString('sv-SE')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      {!readOnly && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrev} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Tillbaka
          </Button>
          <Button onClick={handleNext} className="gap-2">
            N\u00e4sta steg <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
