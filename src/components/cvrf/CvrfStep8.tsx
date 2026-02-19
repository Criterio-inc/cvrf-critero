'use client';

import { useMemo, useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import { useValueMapNodes } from '@/hooks/cvrf/useValueMapNodes';
import { useBenefitValues } from '@/hooks/cvrf/useBenefitValues';
import { useCostValues } from '@/hooks/cvrf/useCostValues';
import { toast } from 'sonner';
import { CvrfAnalysis } from '@/hooks/cvrf/useCvrfAnalysis';
import { cn } from '@/lib/utils';
import {
  calculate,
  sensitivityAnalysis,
  type YearlyFlows,
} from '@/lib/cvrf/CalculationEngine';

interface CvrfStep8Props {
  analysis: CvrfAnalysis;
  onUpdate: (updates: Partial<CvrfAnalysis>) => Promise<any>;
  readOnly?: boolean;
}

function formatSEK(n: number): string {
  return new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 0 }).format(n);
}

export function CvrfStep8({ analysis, onUpdate, readOnly }: CvrfStep8Props) {
  const timeHorizon = analysis.time_horizon ?? 6;
  const discountRate = Number(analysis.discount_rate ?? 0.03);
  const years = Array.from({ length: timeHorizon }, (_, i) => i + 1);

  const { benefitNodes, costNodes } = useValueMapNodes(analysis.id);
  const { benefitValues } = useBenefitValues(analysis.id);
  const { costValues } = useCostValues(analysis.id);

  const [sensitivityPct, setSensitivityPct] = useState(20);

  const getBenefitValue = useCallback((nodeId: string, year: number): number => {
    const v = benefitValues.find((bv) => bv.node_id === nodeId && bv.year === year);
    return Number(v?.likely ?? 0);
  }, [benefitValues]);

  const getCostValue = useCallback((nodeId: string, year: number): number => {
    const v = costValues.find((cv) => cv.node_id === nodeId && cv.year === year);
    return Number(v?.amount ?? 0);
  }, [costValues]);

  // Build base flows
  const baseFlows: YearlyFlows[] = useMemo(() =>
    years.map((y) => ({
      year: y,
      benefits: benefitNodes.reduce((s, n) => s + getBenefitValue(n.id, y), 0),
      costs: costNodes.reduce((s, n) => s + getCostValue(n.id, y), 0),
    })),
    [years, benefitNodes, costNodes, getBenefitValue, getCostValue]
  );

  // Overall scenario NPVs (quick summary)
  const scenarioData = useMemo(() => {
    const factor = sensitivityPct / 100;
    const lowFlows = baseFlows.map((f) => ({ ...f, benefits: f.benefits * (1 - factor) }));
    const highFlows = baseFlows.map((f) => ({ ...f, benefits: f.benefits * (1 + factor) }));
    return {
      npvLow: calculate({ flows: lowFlows, discountRate }).npv,
      npvBase: calculate({ flows: baseFlows, discountRate }).npv,
      npvHigh: calculate({ flows: highFlows, discountRate }).npv,
    };
  }, [baseFlows, discountRate, sensitivityPct]);

  // Per-node tornado data
  const tornadoItems = useMemo(() => {
    const contributions = [
      ...benefitNodes.map((n) => ({
        nodeId: n.id,
        label: n.title,
        yearlyValues: years.map((y) => getBenefitValue(n.id, y)),
        type: 'benefit' as const,
      })),
      ...costNodes.map((n) => ({
        nodeId: n.id,
        label: n.title,
        yearlyValues: years.map((y) => getCostValue(n.id, y)),
        type: 'cost' as const,
      })),
    ];

    return sensitivityAnalysis(baseFlows, discountRate, contributions, sensitivityPct / 100);
  }, [baseFlows, discountRate, benefitNodes, costNodes, years, getBenefitValue, getCostValue, sensitivityPct]);

  // Tornado chart data (horizontal bars showing low-to-high range)
  const tornadoChartData = tornadoItems.slice(0, 10).map((item) => ({
    name: item.label.length > 20 ? item.label.slice(0, 18) + '...' : item.label,
    low: item.npvLow - item.npvBase,
    high: item.npvHigh - item.npvBase,
    npvLow: item.npvLow,
    npvHigh: item.npvHigh,
    npvBase: item.npvBase,
  }));

  const handleGate3 = async (checked: boolean) => {
    try {
      await onUpdate({
        gate3_passed: checked,
        gate3_date: checked ? new Date().toISOString() : null,
      });
      toast.success(checked ? 'Gate 3 godkänd' : 'Gate 3 upphävd');
    } catch {
      toast.error('Kunde inte uppdatera');
    }
  };

  const handlePrev = () => onUpdate({ current_step: 7, current_phase: 3 });
  const handleNext = () => onUpdate({ current_step: 9, current_phase: 4 });

  return (
    <div className="space-y-6">
      {/* Scenario analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Scenarioanalys</CardTitle>
          <CardDescription>
            Testa hur NPV påverkas om nyttorna varierar \u00b1{sensitivityPct}%.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Variation</span>
              <Badge variant="outline">\u00b1{sensitivityPct}%</Badge>
            </div>
            <Slider
              value={[sensitivityPct]}
              onValueChange={(v) => setSensitivityPct(v[0])}
              min={5}
              max={50}
              step={5}
              disabled={readOnly}
            />
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Pessimistisk</p>
              <p className={cn(
                'text-lg font-bold',
                scenarioData.npvLow >= 0 ? 'text-status-green' : 'text-destructive'
              )}>
                {formatSEK(scenarioData.npvLow)} kr
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Trolig</p>
              <p className={cn(
                'text-lg font-bold',
                scenarioData.npvBase >= 0 ? 'text-status-green' : 'text-destructive'
              )}>
                {formatSEK(scenarioData.npvBase)} kr
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Optimistisk</p>
              <p className={cn(
                'text-lg font-bold',
                scenarioData.npvHigh >= 0 ? 'text-status-green' : 'text-destructive'
              )}>
                {formatSEK(scenarioData.npvHigh)} kr
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tornado diagram */}
      {tornadoChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tornadodiagram \u2014 NPV-påverkan per post</CardTitle>
            <CardDescription>
              Sorterat efter störst påverkan. Varje post varieras \u00b1{sensitivityPct}% individuellt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={Math.max(200, tornadoChartData.length * 40 + 40)}>
              <BarChart
                data={tornadoChartData}
                layout="vertical"
                margin={{ left: 10, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  type="number"
                  className="text-xs"
                  tickFormatter={(v: number) => formatSEK(v)}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  className="text-xs"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const label = name === 'low' ? `NPV \u2212${sensitivityPct}%` : `NPV +${sensitivityPct}%`;
                    return [formatSEK(Number(value ?? 0)) + ' kr (avvikelse fr\u00e5n bas)', label];
                  }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} />
                <Bar dataKey="low" stackId="tornado" radius={[4, 0, 0, 4]}>
                  {tornadoChartData.map((_, index) => (
                    <Cell key={index} fill="hsl(var(--destructive))" fillOpacity={0.7} />
                  ))}
                </Bar>
                <Bar dataKey="high" stackId="tornado" radius={[0, 4, 4, 0]}>
                  {tornadoChartData.map((_, index) => (
                    <Cell key={index} fill="hsl(var(--status-green))" fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Gate 3 */}
      <Card className={cn(
        'border-2 transition-colors',
        analysis.gate3_passed ? 'border-status-green/50 bg-status-green/5' : 'border-dashed'
      )}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Gate 3 \u2013 Kalkylgranskning
          </CardTitle>
          <CardDescription>
            Bekräfta att nyttokalkylen har granskats och att beräkningarna är korrekta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <Checkbox
              id="gate3"
              checked={analysis.gate3_passed ?? false}
              onCheckedChange={(checked) => handleGate3(!!checked)}
              disabled={readOnly}
            />
            <label htmlFor="gate3" className="text-sm leading-relaxed cursor-pointer">
              Nyttokalkylen är granskad och godkänd. Beräkningarna bedöms vara rimliga
              och tillräckligt underbyggda för att gå vidare.
            </label>
          </div>
          {analysis.gate3_passed && analysis.gate3_date && (
            <p className="text-xs text-muted-foreground mt-3">
              Godkänd: {new Date(analysis.gate3_date).toLocaleDateString('sv-SE')}
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
            Nästa steg <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
