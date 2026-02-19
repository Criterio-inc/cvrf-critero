'use client';

import { useMemo } from 'react';
import {
  ArrowLeft, ArrowRight, Info, TrendingUp, BarChart3, Activity, Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useValueMapNodes } from '@/hooks/cvrf/useValueMapNodes';
import { useBenefitOwners } from '@/hooks/cvrf/useBenefitOwners';
import { useBenefitValues } from '@/hooks/cvrf/useBenefitValues';
import { useCheckpoints } from '@/hooks/cvrf/useCheckpoints';
import { CvrfAnalysis } from '@/hooks/cvrf/useCvrfAnalysis';
import { cn } from '@/lib/utils';

interface CvrfStep11Props {
  analysis: CvrfAnalysis;
  onUpdate: (updates: Partial<CvrfAnalysis>) => Promise<any>;
  readOnly?: boolean;
}

function formatSEK(n: number): string {
  return new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 }).format(n);
}

const FREQUENCY_LABELS: Record<string, string> = {
  monthly: 'M\u00e5natlig',
  quarterly: 'Kvartalsvis',
  biannual: 'Halv\u00e5rsvis',
  annual: '\u00c5rlig',
};

export function CvrfStep11({ analysis, onUpdate, readOnly }: CvrfStep11Props) {
  const timeHorizon = analysis.time_horizon ?? 6;
  const years = Array.from({ length: timeHorizon }, (_, i) => i + 1);

  const { benefitNodes, isLoading: nodesLoading } = useValueMapNodes(analysis.id);
  const benefitNodeIds = useMemo(() => benefitNodes.map((n) => n.id), [benefitNodes]);
  const { owners, getOwnerForNode, isLoading: ownersLoading } = useBenefitOwners(benefitNodeIds);
  const { benefitValues } = useBenefitValues(analysis.id);
  const { checkpoints, isLoading: cpLoading } = useCheckpoints(analysis.id);

  // Calculations
  const completedCheckpoints = checkpoints.filter((cp) => cp.status === 'completed');

  const totalPlannedBenefit = useMemo(() => {
    return benefitNodes.reduce((total, node) => {
      return total + years.reduce((yearSum, y) => {
        const v = benefitValues.find((bv) => bv.node_id === node.id && bv.year === y);
        return yearSum + Number(v?.likely ?? 0);
      }, 0);
    }, 0);
  }, [benefitNodes, benefitValues, years]);

  const avgRealization = useMemo(() => {
    if (completedCheckpoints.length === 0) return 0;
    const total = completedCheckpoints.reduce(
      (sum, cp) => sum + (cp.overall_realization_percent ?? 0),
      0
    );
    return Math.round(total / completedCheckpoints.length);
  }, [completedCheckpoints]);

  const benefitsWithOwners = useMemo(
    () =>
      benefitNodes
        .map((n) => ({ node: n, owner: getOwnerForNode(n.id) }))
        .filter((b) => b.owner != null),
    [benefitNodes, getOwnerForNode]
  );

  // Chart data: realization % per checkpoint
  const chartData = useMemo(() => {
    return checkpoints
      .filter((cp) => cp.overall_realization_percent != null)
      .map((cp) => ({
        name: new Date(cp.checkpoint_date).toLocaleDateString('sv-SE', {
          month: 'short',
          year: '2-digit',
        }),
        realisering: cp.overall_realization_percent ?? 0,
      }));
  }, [checkpoints]);

  const handlePrev = () => onUpdate({ current_step: 10, current_phase: 4 });
  const handleNext = () => onUpdate({ current_step: 12, current_phase: 5 });

  if (nodesLoading || ownersLoading || cpLoading) {
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
            Du beh\u00f6ver skapa nyttor i Value Map (Steg 5) och tilldela ansvariga (Steg 9) innan du
            kan m\u00e4ta effekter.
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              Total planerad nytta
            </div>
            <p className="text-2xl font-bold">{formatSEK(totalPlannedBenefit)} kr</p>
            <p className="text-xs text-muted-foreground mt-1">
              Summa likely-v\u00e4rden, {timeHorizon} \u00e5r
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <BarChart3 className="h-4 w-4" />
              Genomsnittlig realisering
            </div>
            <div className="flex items-center gap-2">
              <p className={cn(
                'text-2xl font-bold',
                avgRealization >= 80 ? 'text-emerald-600' : avgRealization >= 50 ? 'text-amber-600' : 'text-red-600'
              )}>
                {avgRealization}%
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedCheckpoints.length > 0
                ? `Baserat p\u00e5 ${completedCheckpoints.length} m\u00e4tning(ar)`
                : 'Ingen m\u00e4tning genomf\u00f6rd'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Activity className="h-4 w-4" />
              Antal m\u00e4tningar
            </div>
            <p className="text-2xl font-bold">{completedCheckpoints.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              av {checkpoints.length} schemalagda
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              Nyttor med \u00e4gare
            </div>
            <p className="text-2xl font-bold">
              {benefitsWithOwners.length}/{benefitNodes.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {benefitsWithOwners.length === benefitNodes.length
                ? 'Alla nyttor har \u00e4gare'
                : `${benefitNodes.length - benefitsWithOwners.length} saknar \u00e4gare`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Realization chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Realiserings\u00f6versikt</CardTitle>
            <CardDescription>
              Nyttorealisering (%) per kontrollpunkt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis domain={[0, 100]} className="text-xs" tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  formatter={(value) => `${value ?? 0}%`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <ReferenceLine y={100} stroke="hsl(var(--status-green))" strokeDasharray="3 3" label="M\u00e5l" />
                <Bar
                  dataKey="realisering"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  name="Realisering"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Per-benefit realization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Realisering per nytta
          </CardTitle>
          <CardDescription>
            Uppf\u00f6ljning av varje nyttas progression mot sitt m\u00e5lv\u00e4rde.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {benefitNodes.map((node) => {
            const owner = getOwnerForNode(node.id);
            const baseline = owner?.baseline_value ?? 0;
            const target = owner?.target_value ?? 0;
            const range = target - baseline;

            // Sum planned likely values for this node across all years
            const plannedTotal = years.reduce((sum, y) => {
              const v = benefitValues.find((bv) => bv.node_id === node.id && bv.year === y);
              return sum + Number(v?.likely ?? 0);
            }, 0);

            // Use latest checkpoint as proxy for realization
            const latestCp = [...completedCheckpoints].sort(
              (a, b) => b.checkpoint_date.localeCompare(a.checkpoint_date)
            )[0];
            const realizedPct = latestCp?.overall_realization_percent ?? null;

            return (
              <Card key={node.id} className="border-dashed">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{node.title}</p>
                    {owner && (
                      <Badge variant="secondary" className="text-xs">
                        {owner.owner_name}
                      </Badge>
                    )}
                    {node.benefit_category && (
                      <Badge variant="outline" className="text-xs">
                        {node.benefit_category}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Basv\u00e4rde</p>
                      <p className="text-sm font-medium">
                        {baseline ? `${formatSEK(baseline)} kr` : '\u2014'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">M\u00e5lv\u00e4rde</p>
                      <p className="text-sm font-medium">
                        {target ? `${formatSEK(target)} kr` : '\u2014'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Planerad nytta</p>
                      <p className="text-sm font-medium">{formatSEK(plannedTotal)} kr</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Realiserad</p>
                      <p className={cn(
                        'text-sm font-medium',
                        realizedPct != null && realizedPct >= 80 ? 'text-emerald-600' :
                        realizedPct != null && realizedPct >= 50 ? 'text-amber-600' :
                        realizedPct != null ? 'text-red-600' : ''
                      )}>
                        {realizedPct != null ? `${realizedPct}%` : '\u2014'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">M\u00e4tfrekvens</p>
                      <p className="text-sm">
                        {owner?.measurement_frequency
                          ? FREQUENCY_LABELS[owner.measurement_frequency] ?? owner.measurement_frequency
                          : '\u2014'}
                      </p>
                    </div>
                  </div>

                  {range > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progression mot m\u00e5l</span>
                        <span>{realizedPct != null ? `${realizedPct}%` : 'Ej m\u00e4tt'}</span>
                      </div>
                      <Progress value={realizedPct ?? 0} className="h-2" />
                    </div>
                  )}

                  {owner?.kpi_description && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">KPI:</span> {owner.kpi_description}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
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
