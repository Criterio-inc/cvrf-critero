'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useValueMapNodes, type CvrfNode } from '@/hooks/cvrf/useValueMapNodes';
import { useStakeholders } from '@/hooks/cvrf/useStakeholders';
import { CvrfAnalysis } from '@/hooks/cvrf/useCvrfAnalysis';
import { cn } from '@/lib/utils';

const BENEFIT_CATEGORIES = [
  { value: 'financial', label: 'Finansiell' },
  { value: 'redistribution', label: 'Omfördelning' },
  { value: 'quality', label: 'Kvalitet' },
  { value: 'environmental', label: 'Miljö' },
  { value: 'societal', label: 'Samhällsnytta' },
] as const;

const TIME_PERSPECTIVES = [
  { value: 'short', label: 'Kort (0-2 år)' },
  { value: 'medium', label: 'Medium (2-5 år)' },
  { value: 'long', label: 'Lång (5+ år)' },
] as const;

const CONFIDENCE_LEVELS = [
  { value: 'high', label: 'Hög', color: 'text-emerald-600 dark:text-emerald-400' },
  { value: 'medium', label: 'Medel', color: 'text-amber-600 dark:text-amber-400' },
  { value: 'low', label: 'Låg', color: 'text-red-600 dark:text-red-400' },
] as const;

const COST_TYPES = [
  { value: 'investment', label: 'Investering' },
  { value: 'operational', label: 'Drift' },
  { value: 'change', label: 'Förändring' },
  { value: 'opportunity', label: 'Alternativkostnad' },
  { value: 'decommission', label: 'Avveckling' },
] as const;

interface CvrfStep6Props {
  analysis: CvrfAnalysis;
  onUpdate: (updates: Partial<CvrfAnalysis>) => Promise<any>;
  readOnly?: boolean;
}

export function CvrfStep6({ analysis, onUpdate, readOnly }: CvrfStep6Props) {
  const { benefitNodes, costNodes, isLoading, updateNode } = useValueMapNodes(analysis.id);
  const { stakeholders } = useStakeholders(analysis.id);

  const handleNodeUpdate = async (id: string, field: string, value: string | null) => {
    try {
      await updateNode.mutateAsync({ id, [field]: value || null });
    } catch {
      toast.error('Kunde inte uppdatera');
    }
  };

  const handlePrev = () => onUpdate({ current_step: 5, current_phase: 2 });
  const handleNext = () => onUpdate({ current_step: 7, current_phase: 3 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 rounded-lg bg-muted animate-pulse" />
        <div className="h-64 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  const hasNodes = benefitNodes.length > 0 || costNodes.length > 0;

  if (!hasNodes) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription>
            Du behöver först skapa nyttor och kostnader i Value Map (Steg 5) innan du kan klassificera dem.
          </AlertDescription>
        </Alert>
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

  // Summary counts
  const benefitCounts = BENEFIT_CATEGORIES.map((c) => ({
    ...c,
    count: benefitNodes.filter((n) => n.benefit_category === c.value).length,
  })).filter((c) => c.count > 0);

  const costCounts = COST_TYPES.map((c) => ({
    ...c,
    count: costNodes.filter((n) => n.benefit_category === c.value).length,
  })).filter((c) => c.count > 0);

  return (
    <div className="space-y-6">
      {/* Benefits */}
      {benefitNodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-primary">↑</span>
              Nyttor
              <Badge variant="secondary" className="text-xs">{benefitNodes.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {benefitNodes.map((node) => (
              <BenefitNodeCard
                key={node.id}
                node={node}
                stakeholders={stakeholders.map((s) => ({ id: s.id, name: s.name }))}
                onUpdate={handleNodeUpdate}
                readOnly={readOnly}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Costs */}
      {costNodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-destructive">↓</span>
              Kostnader
              <Badge variant="secondary" className="text-xs">{costNodes.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {costNodes.map((node) => (
              <CostNodeCard
                key={node.id}
                node={node}
                onUpdate={handleNodeUpdate}
                readOnly={readOnly}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sammanfattning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {benefitCounts.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Nyttor per kategori</p>
                <div className="flex flex-wrap gap-2">
                  {benefitCounts.map((c) => (
                    <Badge key={c.value} variant="outline" className="text-xs gap-1">
                      {c.label} <span className="font-bold">{c.count}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {costCounts.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Kostnader per typ</p>
                <div className="flex flex-wrap gap-2">
                  {costCounts.map((c) => (
                    <Badge key={c.value} variant="outline" className="text-xs gap-1">
                      {c.label} <span className="font-bold">{c.count}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {benefitCounts.length === 0 && costCounts.length === 0 && (
              <p className="text-sm text-muted-foreground">Inga klassificeringar gjorda ännu.</p>
            )}
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

/* -- Benefit node card -- */

interface BenefitNodeCardProps {
  node: CvrfNode;
  stakeholders: { id: string; name: string }[];
  onUpdate: (id: string, field: string, value: string | null) => void;
  readOnly?: boolean;
}

function BenefitNodeCard({ node, stakeholders, onUpdate, readOnly }: BenefitNodeCardProps) {
  const confidenceItem = CONFIDENCE_LEVELS.find((c) => c.value === node.confidence);

  return (
    <Card className="border-dashed">
      <CardContent className="pt-4 space-y-3">
        <p className="font-medium text-sm">{node.title}</p>
        {node.description && (
          <p className="text-xs text-muted-foreground">{node.description}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <SelectField
            label="Kategori"
            value={node.benefit_category}
            options={BENEFIT_CATEGORIES}
            onChange={(v) => onUpdate(node.id, 'benefit_category', v)}
            disabled={readOnly}
          />
          <SelectField
            label="Tidshorisont"
            value={node.time_perspective}
            options={TIME_PERSPECTIVES}
            onChange={(v) => onUpdate(node.id, 'time_perspective', v)}
            disabled={readOnly}
          />
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Konfidensgrad</p>
            <Select
              value={node.confidence ?? ''}
              onValueChange={(v) => onUpdate(node.id, 'confidence', v)}
              disabled={readOnly}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Välj...">
                  {confidenceItem && (
                    <span className={confidenceItem.color}>{confidenceItem.label}</span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CONFIDENCE_LEVELS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <span className={c.color}>{c.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Intressent</p>
            <Select
              value={node.stakeholder_id ?? ''}
              onValueChange={(v) => onUpdate(node.id, 'stakeholder_id', v)}
              disabled={readOnly}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Välj..." />
              </SelectTrigger>
              <SelectContent>
                {stakeholders.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* -- Cost node card (no budget linking) -- */

interface CostNodeCardProps {
  node: CvrfNode;
  onUpdate: (id: string, field: string, value: string | null) => void;
  readOnly?: boolean;
}

function CostNodeCard({ node, onUpdate, readOnly }: CostNodeCardProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-4 space-y-3">
        <p className="font-medium text-sm">{node.title}</p>
        {node.description && (
          <p className="text-xs text-muted-foreground">{node.description}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectField
            label="Kostnadstyp"
            value={node.benefit_category}
            options={COST_TYPES}
            onChange={(v) => onUpdate(node.id, 'benefit_category', v)}
            disabled={readOnly}
          />
          <SelectField
            label="Tidshorisont"
            value={node.time_perspective}
            options={TIME_PERSPECTIVES}
            onChange={(v) => onUpdate(node.id, 'time_perspective', v)}
            disabled={readOnly}
          />
        </div>
      </CardContent>
    </Card>
  );
}

/* -- Shared select field -- */

interface SelectFieldProps {
  label: string;
  value: string | null;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

function SelectField({ label, value, options, onChange, disabled }: SelectFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <Select value={value ?? ''} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Välj..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
