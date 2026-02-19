'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, ArrowRight, ShieldCheck, Info, Users, Target, TrendingUp, UserPlus, Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useValueMapNodes } from '@/hooks/cvrf/useValueMapNodes';
import { useBenefitOwners, type BenefitOwnerUpdate } from '@/hooks/cvrf/useBenefitOwners';
import { CvrfAnalysis } from '@/hooks/cvrf/useCvrfAnalysis';
import { cn } from '@/lib/utils';

interface CvrfStep9Props {
  analysis: CvrfAnalysis;
  onUpdate: (updates: Partial<CvrfAnalysis>) => Promise<any>;
  readOnly?: boolean;
}

const MEASUREMENT_FREQUENCIES = [
  { value: 'monthly', label: 'M\u00e5natlig' },
  { value: 'quarterly', label: 'Kvartalsvis' },
  { value: 'biannual', label: 'Halv\u00e5rsvis' },
  { value: 'annual', label: '\u00c5rlig' },
] as const;

function formatSEK(n: number): string {
  return new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 }).format(n);
}

export function CvrfStep9({ analysis, onUpdate, readOnly }: CvrfStep9Props) {
  const { benefitNodes, isLoading: nodesLoading } = useValueMapNodes(analysis.id);
  const benefitNodeIds = useMemo(() => benefitNodes.map((n) => n.id), [benefitNodes]);
  const { owners, createOwner, updateOwner, deleteOwner, getOwnerForNode, isLoading: ownersLoading } =
    useBenefitOwners(benefitNodeIds);

  // Local edits for debounced auto-save (keyed by owner.id + field)
  const [localEdits, setLocalEdits] = useState<Record<string, Record<string, string>>>({});

  // Debounced save for owner fields
  useEffect(() => {
    const editsToSave = Object.entries(localEdits);
    if (editsToSave.length === 0) return;

    const timer = setTimeout(() => {
      editsToSave.forEach(([ownerId, fields]) => {
        const updates: BenefitOwnerUpdate & { id: string } = { id: ownerId };
        for (const [field, value] of Object.entries(fields)) {
          if (field === 'baseline_value' || field === 'target_value') {
            (updates as any)[field] = value === '' ? null : parseFloat(value) || 0;
          } else {
            (updates as any)[field] = value || null;
          }
        }
        updateOwner.mutate(updates);
      });
      setLocalEdits({});
    }, 800);
    return () => clearTimeout(timer);
  }, [localEdits, updateOwner]);

  const handleFieldChange = (ownerId: string, field: string, value: string) => {
    setLocalEdits((prev) => ({
      ...prev,
      [ownerId]: { ...(prev[ownerId] ?? {}), [field]: value },
    }));
  };

  const getFieldValue = (ownerId: string, field: string, serverValue: string | number | null): string => {
    const localVal = localEdits[ownerId]?.[field];
    if (localVal !== undefined) return localVal;
    if (serverValue == null) return '';
    return String(serverValue);
  };

  // Summary calculations
  const ownedCount = benefitNodes.filter((n) => getOwnerForNode(n.id)).length;
  const coveragePct = benefitNodes.length > 0 ? Math.round((ownedCount / benefitNodes.length) * 100) : 0;
  const totalTargetValue = owners.reduce((sum, o) => sum + (o.target_value ?? 0), 0);

  const handleGate4 = async (checked: boolean) => {
    await onUpdate({
      gate4_passed: checked,
      gate4_date: checked ? new Date().toISOString() : null,
    });
    if (checked) {
      toast.success('Gate 4 godk\u00e4nd');
    } else {
      toast.error('Gate 4 upph\u00e4vd');
    }
  };

  const handlePrev = () => onUpdate({ current_step: 8, current_phase: 3 });
  const handleNext = () => onUpdate({ current_step: 10, current_phase: 4 });

  if (nodesLoading || ownersLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 rounded-lg bg-muted animate-pulse" />
        <div className="h-64 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  if (benefitNodes.length === 0) {
    return (
      <div className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Du beh\u00f6ver f\u00f6rst skapa nyttor i Value Map (Steg 5) innan du kan tilldela nyttoansvariga.
          </AlertDescription>
        </Alert>
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

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              Nyttor totalt
            </div>
            <p className="text-2xl font-bold">{benefitNodes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              Med ansvarig
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{ownedCount}</p>
              <Badge
                variant="outline"
                className={cn(
                  'text-xs',
                  coveragePct >= 80 && 'border-emerald-500 text-emerald-600',
                  coveragePct >= 50 && coveragePct < 80 && 'border-amber-500 text-amber-600',
                  coveragePct < 50 && 'border-red-500 text-red-600'
                )}
              >
                {coveragePct}%
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Target className="h-4 w-4" />
              Totalt m\u00e5lv\u00e4rde
            </div>
            <p className="text-2xl font-bold">{formatSEK(totalTargetValue)} kr</p>
          </CardContent>
        </Card>
      </div>

      {/* Benefit owner cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Nyttoansvariga
            <Badge variant="secondary" className="text-xs">
              {ownedCount}/{benefitNodes.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Tilldela en ansvarig f\u00f6r varje nytta med basv\u00e4rde, m\u00e5lv\u00e4rde och KPI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {benefitNodes.map((node) => {
            const owner = getOwnerForNode(node.id);
            return (
              <BenefitOwnerCard
                key={node.id}
                nodeTitle={node.title}
                benefitCategory={node.benefit_category}
                owner={owner ?? null}
                onCreateOwner={(name, role) =>
                  createOwner.mutate(
                    { node_id: node.id, owner_name: name, owner_role: role || null },
                    {
                      onSuccess: () => toast.success('Ansvarig tilldelad'),
                      onError: () => toast.error('Kunde inte tilldela'),
                    }
                  )
                }
                onDeleteOwner={() => {
                  if (!owner) return;
                  deleteOwner.mutate(owner.id, {
                    onSuccess: () => toast.success('Ansvarig borttagen'),
                    onError: () => toast.error('Kunde inte ta bort'),
                  });
                }}
                onFieldChange={(field, value) => owner && handleFieldChange(owner.id, field, value)}
                getFieldValue={(field, serverValue) =>
                  owner ? getFieldValue(owner.id, field, serverValue) : ''
                }
                readOnly={readOnly}
              />
            );
          })}
        </CardContent>
      </Card>

      {/* Gate 4 */}
      <Card
        className={cn(
          'border-2 transition-colors',
          analysis.gate4_passed ? 'border-status-green/50 bg-status-green/5' : 'border-dashed'
        )}
      >
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Gate 4 \u2013 Realiseringsplan godk\u00e4nd
          </CardTitle>
          <CardDescription>
            Bekr\u00e4fta att realiseringsplanen \u00e4r komplett och att alla nyttor har tilldelats ansvariga.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <Checkbox
              id="gate4"
              checked={analysis.gate4_passed ?? false}
              onCheckedChange={(checked) => handleGate4(!!checked)}
              disabled={readOnly}
            />
            <label htmlFor="gate4" className="text-sm leading-relaxed cursor-pointer">
              Realiseringsplanen \u00e4r granskad och godk\u00e4nd. Nyttoansvariga \u00e4r tilldelade
              och m\u00e4tbara KPI:er \u00e4r definierade.
            </label>
          </div>
          {analysis.gate4_passed && analysis.gate4_date && (
            <p className="text-xs text-muted-foreground mt-3">
              Godk\u00e4nd: {new Date(analysis.gate4_date).toLocaleDateString('sv-SE')}
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

/* -- Benefit Owner Card -- */

interface BenefitOwnerCardProps {
  nodeTitle: string;
  benefitCategory: string | null;
  owner: {
    id: string;
    owner_name: string;
    owner_role: string | null;
    baseline_value: number | null;
    target_value: number | null;
    kpi_description: string | null;
    measurement_frequency: string | null;
    first_measurement_date: string | null;
  } | null;
  onCreateOwner: (name: string, role: string) => void;
  onDeleteOwner: () => void;
  onFieldChange: (field: string, value: string) => void;
  getFieldValue: (field: string, serverValue: string | number | null) => string;
  readOnly?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  financial: 'Finansiell',
  redistribution: 'Omf\u00f6rdelning',
  quality: 'Kvalitet',
  environmental: 'Milj\u00f6',
  societal: 'Samh\u00e4llsnytta',
};

function BenefitOwnerCard({
  nodeTitle,
  benefitCategory,
  owner,
  onCreateOwner,
  onDeleteOwner,
  onFieldChange,
  getFieldValue,
  readOnly,
}: BenefitOwnerCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreateOwner(newName.trim(), newRole.trim());
    setNewName('');
    setNewRole('');
    setDialogOpen(false);
  };

  return (
    <Card className="border-dashed">
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">{nodeTitle}</p>
            {benefitCategory && (
              <Badge variant="outline" className="text-xs">
                {CATEGORY_LABELS[benefitCategory] ?? benefitCategory}
              </Badge>
            )}
          </div>
          {owner && !readOnly && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive h-7 px-2"
              onClick={onDeleteOwner}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {!owner ? (
          <div>
            {!readOnly ? (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserPlus className="h-3.5 w-3.5" />
                    Tilldela ansvarig
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Tilldela nyttoansvarig</DialogTitle>
                    <DialogDescription>
                      Ange namn och roll f\u00f6r den som ansvarar f\u00f6r att nyttan &quot;{nodeTitle}&quot; realiseras.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-2">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Namn *</label>
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Anna Svensson"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Roll</label>
                      <Input
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        placeholder="Verksamhetschef"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Avbryt
                    </Button>
                    <Button onClick={handleCreate} disabled={!newName.trim()}>
                      Tilldela
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <p className="text-xs text-muted-foreground italic">Ingen ansvarig tilldelad</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Ansvarig</label>
              <Input
                className="h-8 text-xs"
                value={getFieldValue('owner_name', owner.owner_name)}
                onChange={(e) => onFieldChange('owner_name', e.target.value)}
                disabled={readOnly}
                placeholder="Namn"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Roll</label>
              <Input
                className="h-8 text-xs"
                value={getFieldValue('owner_role', owner.owner_role)}
                onChange={(e) => onFieldChange('owner_role', e.target.value)}
                disabled={readOnly}
                placeholder="Roll"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Basv\u00e4rde (kr)</label>
              <Input
                type="number"
                className="h-8 text-xs"
                value={getFieldValue('baseline_value', owner.baseline_value)}
                onChange={(e) => onFieldChange('baseline_value', e.target.value)}
                disabled={readOnly}
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">M\u00e5lv\u00e4rde (kr)</label>
              <Input
                type="number"
                className="h-8 text-xs"
                value={getFieldValue('target_value', owner.target_value)}
                onChange={(e) => onFieldChange('target_value', e.target.value)}
                disabled={readOnly}
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">M\u00e4tfrekvens</label>
              <Select
                value={getFieldValue('measurement_frequency', owner.measurement_frequency)}
                onValueChange={(v) => onFieldChange('measurement_frequency', v)}
                disabled={readOnly}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="V\u00e4lj..." />
                </SelectTrigger>
                <SelectContent>
                  {MEASUREMENT_FREQUENCIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">F\u00f6rsta m\u00e4tdatum</label>
              <Input
                type="date"
                className="h-8 text-xs"
                value={getFieldValue('first_measurement_date', owner.first_measurement_date)}
                onChange={(e) => onFieldChange('first_measurement_date', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 space-y-1">
              <label className="text-xs text-muted-foreground">KPI-beskrivning</label>
              <Textarea
                className="text-xs min-h-[60px]"
                value={getFieldValue('kpi_description', owner.kpi_description)}
                onChange={(e) => onFieldChange('kpi_description', e.target.value)}
                disabled={readOnly}
                placeholder="Beskriv hur nyttan ska m\u00e4tas..."
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
